const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function dump() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({}, 'name category').lean();
    console.log(JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

dump();
