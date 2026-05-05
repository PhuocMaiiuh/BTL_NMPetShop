const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id:             { type: Number, unique: true },
    name:           { type: String, required: true, trim: true },
    image:          { type: String, default: '' },
    images:         [String],
    price:          { type: Number, required: true, min: 0 },
    originalPrice:  { type: Number, default: null },
    rating:         { type: Number, default: 4, min: 0, max: 5 },
    reviews:        { type: Number, default: 0, min: 0 },
    category:       { type: String, default: '' },
    brand:          { type: String, default: '' },
    description:    { type: String, default: '' },
    specifications: [{ label: String, value: String }],
    inStock:        { type: Boolean, default: true },
    stockCount:     { type: Number, default: 10, min: 0 },
    isBestSelling:  { type: Boolean, default: false },
    active:         { type: Boolean, default: true },
    stock:          { type: Number, default: 10, min: 0 },
    badge:          { type: String, default: null },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ active: 1 });
productSchema.index({ isBestSelling: 1 });

module.exports = mongoose.model('Product', productSchema, 'products');
