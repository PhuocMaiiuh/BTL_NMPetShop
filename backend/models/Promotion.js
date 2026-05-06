const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  title: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },
  category: { type: String, default: 'Toàn sàn' },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
