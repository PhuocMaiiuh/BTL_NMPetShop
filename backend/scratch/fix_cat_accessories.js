const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

const S = {
  CHO: '(Sản phẩm cho Chó)',
  MEO: '(Sản phẩm cho Mèo)',
  PK: '(Phụ kiện)',
  DC: '(Đồ chơi)',
  SK: '(Chăm sóc sức khỏe)'
};

async function fixCatAccessories() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({ name: { $regex: /mèo|cat/i } });
    console.log(`Analyzing ${products.length} cat products for missing Accessories category...`);

    let updatedCount = 0;

    for (const p of products) {
      const name = p.name.toLowerCase();
      let newCat = p.category;

      // Identify accessories for cats
      if (name.includes('chuồng') || name.includes('lồng') || name.includes('bát ăn') || name.includes('bình nước') || name.includes('cát vệ sinh') || name.includes('nhà vệ sinh') || name.includes('thẻ tên') || name.includes('vòng cổ') || name.includes('dây dắt')) {
          newCat = `Phụ kiện ${S.MEO}`;
      }

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
      }
    }

    console.log(`Fix complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

fixCatAccessories();
