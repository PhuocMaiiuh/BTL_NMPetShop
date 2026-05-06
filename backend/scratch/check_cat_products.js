const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    // Find products for cats that ARE NOT in (Sản phẩm cho Mèo)
    const products = await Product.find({
      $and: [
        { name: { $regex: /mèo|cat/i } },
        { category: { $not: { $regex: /\(Sản phẩm cho Mèo\)/i } } }
      ]
    }).limit(50).lean();
    console.log(JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

check();
