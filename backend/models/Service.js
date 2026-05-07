const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // String representation of the icon name (e.g., 'MdPets')
    required: true,
  },
  category: {
    type: String,
    enum: ['spa', 'grooming', 'hotel', 'medical'],
    default: 'spa',
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
