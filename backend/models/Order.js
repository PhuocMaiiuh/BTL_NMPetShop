const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true }, // e.g. ORD-123456
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [{
    productId: { type: Number },
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    quantity: { type: Number },
  }],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  promoCode: { type: String },
  paymentMethod: { type: String, default: 'COD' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
