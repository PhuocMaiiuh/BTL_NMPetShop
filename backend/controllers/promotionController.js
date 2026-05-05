const Promotion = require('../models/Promotion');

const getPromotions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const [promotions, total] = await Promise.all([
      Promotion.find().sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Promotion.countDocuments()
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

module.exports = {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
};
