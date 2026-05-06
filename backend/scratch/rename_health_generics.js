const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function renameHealthGenerics() {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Rename any products that might have ended up with generic health categories
    const res = await Product.updateMany(
      { category: { $in: ['Chăm sóc sức khỏe (Chăm sóc sức khỏe)', 'Chăm sóc sức khỏe', 'Sức khỏe (Chăm sóc sức khỏe)'] } },
      { category: 'Chăm sóc & Y tế (Chăm sóc sức khỏe)' }
    );
    console.log(`Renamed Health: ${res.modifiedCount}`);

    // If still 0, maybe look for keywords
    if (res.modifiedCount === 0) {
        const res2 = await Product.updateMany(
            { category: 'Chăm sóc khác (Sản phẩm cho Chó)', name: { $regex: /y tế|bệnh|thuốc/i } },
            { category: 'Chăm sóc & Y tế (Chăm sóc sức khỏe)' }
        );
        console.log(`Moved from Chó to Y tế: ${res2.modifiedCount}`);
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

renameHealthGenerics();
