const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function renameGenerics() {
  try {
    await mongoose.connect(MONGO_URI);
    
    // 1. Phụ kiện (Phụ kiện) -> Phụ kiện chung (Phụ kiện)
    const res1 = await Product.updateMany(
      { category: 'Phụ kiện (Phụ kiện)' },
      { category: 'Phụ kiện chung (Phụ kiện)' }
    );
    console.log(`Renamed Phụ kiện: ${res1.modifiedCount}`);

    // 2. Đồ chơi (Đồ chơi) -> Đồ chơi chung (Đồ chơi)
    const res2 = await Product.updateMany(
      { category: 'Đồ chơi (Đồ chơi)' },
      { category: 'Đồ chơi chung (Đồ chơi)' }
    );
    console.log(`Renamed Đồ chơi: ${res2.modifiedCount}`);

    // 3. Chăm sóc & Y tế (Chăm sóc sức khỏe) -> Vệ sinh & Khử mùi (Chăm sóc sức khỏe)? 
    // Or just leave it as Chăm sóc & Y tế if it's in my list.
    // My list in ProductListPage has 'Chăm sóc & Y tế'.
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

renameGenerics();
