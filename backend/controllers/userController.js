const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');

const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role && role !== 'All') query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(query)
    ]);

    // Enhance users with order statistics
    const enhancedUsers = await Promise.all(users.map(async (u) => {
      const stats = await Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(u._id), status: 'Delivered' } },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
      ]);
      return {
        ...u,
        orderCount: stats[0]?.count || 0,
        totalSpent: stats[0]?.total || 0
      };
    }));

    res.json({
      users: enhancedUsers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });
    user.status = user.status === 'active' ? 'locked' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    // Check password (simple comparison for now as per DB state)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    if (user.status === 'locked') {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa' });
    }

    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const lastUser = await User.findOne().sort('-id');
    const newId = lastUser ? (lastUser.id || 0) + 1 : 1;

    const newUser = new User({
      id: newId,
      fullName,
      email,
      password,
      phone,
      role: 'user',
      status: 'active'
    });

    await newUser.save();

    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json(userData);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Numeric ID
    const { fullName, email, phone, birthday, address, avatar } = req.body;

    // Check email uniqueness (excluding current user)
    if (email) {
      const existingEmail = await User.findOne({ email, id: { $ne: Number(id) } });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email này đã được sử dụng bởi người dùng khác' });
      }
    }

    // Check phone uniqueness (excluding current user)
    if (phone) {
      const existingPhone = await User.findOne({ phone, id: { $ne: Number(id) } });
      if (existingPhone) {
        return res.status(400).json({ error: 'Số điện thoại này đã được sử dụng bởi người dùng khác' });
      }
    }

    const user = await User.findOneAndUpdate(
      { id: Number(id) },
      { fullName, email, phone, birthday, address, avatar },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  toggleUserStatus,
  deleteUser,
  loginUser,
  registerUser,
  updateProfile
};
