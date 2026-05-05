const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getOrders = async (req, res, next) => {
  try {
    const { status, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).lean();
    if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    res.json({ message: 'Xóa đơn hàng thành công' });
  } catch (err) {
    next(err);
  }
};

// For Dashboard Stats
const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, totalProducts, totalCustomers] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: 'Pending' }),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' })
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      totalProducts,
      totalCustomers
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getStats
};
