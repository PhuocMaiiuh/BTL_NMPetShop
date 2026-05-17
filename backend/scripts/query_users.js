const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI_AUTH || 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const queryUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({}, '-password').lean();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error querying users:', error);
    process.exit(1);
  }
};

queryUsers();
