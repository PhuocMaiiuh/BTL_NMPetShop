const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function fillYTe() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const res = await Product.updateMany(
      { name: { $regex: /y tế|sơ cứu|băng bó|ký sinh|giun|sán|vết thương|ngoại ký sinh/i } },
      { category: 'Chăm sóc & Y tế (Chăm sóc sức khỏe)' }
    );
    console.log(`Populated Y tế: ${res.modifiedCount}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

fillYTe();
