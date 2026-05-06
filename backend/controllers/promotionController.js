const Promotion = require('../models/Promotion');

const getPromotions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, discountType, filterStatus } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (discountType && discountType !== 'All') {
      query.discountType = discountType;
    }

    if (filterStatus && filterStatus !== 'All') {
      const now = new Date();
      if (filterStatus === 'active') {
        query.startDate = { $lte: now };
        query.endDate = { $gte: now };
      } else if (filterStatus === 'upcoming') {
        query.startDate = { $gt: now };
      } else if (filterStatus === 'expired') {
        query.endDate = { $lt: now };
      }
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [promotions, total] = await Promise.all([
      Promotion.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Promotion.countDocuments(query)
    ]);

    res.json({
      promotions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

const createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Mã giảm giá đã tồn tại' });
    }
    next(err);
  }
};

const updatePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
    res.json(promotion);
  } catch (err) {
    next(err);
  }
};

const deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
    res.json({ message: 'Xóa mã giảm giá thành công' });
  } catch (err) {
    next(err);
  }
};

const validatePromotion = async (req, res, next) => {
  try {
    const { code, totalAmount } = req.body;
    const now = new Date();

    const promotion = await Promotion.findOne({ 
      code: { $regex: new RegExp(`^${code}$`, 'i') } 
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
    }

    if (promotion.status === 'disabled') {
      return res.status(400).json({ error: 'Mã giảm giá đã bị tạm dừng' });
    }

    if (now < promotion.startDate) {
      return res.status(400).json({ error: 'Chương trình khuyến mãi chưa bắt đầu' });
    }

    if (now > promotion.endDate) {
      return res.status(400).json({ error: 'Mã giảm giá đã hết hạn' });
    }

    if (totalAmount < promotion.minOrderValue) {
      return res.status(400).json({ 
        error: `Đơn hàng tối thiểu phải từ ${new Intl.NumberFormat('vi-VN').format(promotion.minOrderValue)}đ để áp dụng mã này` 
      });
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({ error: 'Mã giảm giá này đã hết lượt sử dụng' });
    }

    res.json(promotion);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion
};
