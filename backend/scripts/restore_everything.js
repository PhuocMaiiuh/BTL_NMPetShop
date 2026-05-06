const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Promotion = require('../models/Promotion');

const MONGO_URI = 'mongodb://localhost:27017/nmpetshop';
const PRODUCTS_DATA_PATH = path.join(__dirname, '../../NMPetShop/src/data/petmall_products.json');

const restore = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for TOTAL RESTORATION...');

    // 1. Wipe everything
    console.log('Wiping collections...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Promotion.deleteMany({});

    // 2. Restore Products exactly from JSON
    console.log('Restoring products from original JSON...');
    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8'));
    await Product.insertMany(productsData);
    console.log(`✅ ${productsData.length} products restored with original categories.`);

    // 3. Restore Default Users
    console.log('Restoring default users...');
    await User.insertMany([
      {
        id: 1,
        fullName: 'Admin NM',
        email: 'admin@nmpetshop.com',
        password: 'admin123',
        role: 'admin',
        phone: '0901234567'
      },
      {
        id: 2,
        fullName: 'User NM',
        email: 'user@nmpetshop.com',
        password: 'user123',
        role: 'user',
        phone: '0987654321',
        address: '123 Đường Lê Lợi, TP. HCM'
      }
    ]);
    console.log('✅ Default users restored.');

    console.log('\n🌟 TOTAL RESTORATION COMPLETE! 🌟');
    console.log('The database is now back to its original state.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Restoration failed:', err.message);
    process.exit(1);
  }
};

restore();
