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

async function forceSuffixes() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Forcing suffixes for ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      let newCat = p.category;
      if (!p.category || p.category.includes('(')) continue;

      // Force mapping for common names found in previous audit
      if (p.category === 'Bát ăn & Bình nước') newCat = `Bát ăn & Bình nước ${S.PK}`;
      else if (p.category === 'Giường nệm & Chuồng') newCat = `Giường nệm & Chuồng ${S.PK}`;
      else if (p.category === 'Vòng cổ & Dây dắt') newCat = `Vòng cổ & Dây dắt ${S.PK}`;
      else if (p.category === 'Pate & Đồ hộp') {
          if (p.name.toLowerCase().includes('chó')) newCat = `Pate & Đồ hộp ${S.CHO}`;
          else newCat = `Pate & Đồ hộp ${S.MEO}`;
      }
      else if (p.category === 'Thức ăn hạt') {
          if (p.name.toLowerCase().includes('chó')) newCat = `Thức ăn hạt ${S.CHO}`;
          else newCat = `Thức ăn hạt ${S.MEO}`;
      }
      else if (p.category === 'Sữa tắm & Vệ sinh') {
          if (p.name.toLowerCase().includes('chó')) newCat = `Sữa tắm & Vệ sinh ${S.CHO}`;
          else newCat = `Sữa tắm & Vệ sinh ${S.MEO}`;
      }
      else if (p.category === 'Đồ chơi nhai gặm') newCat = `Đồ chơi nhai gặm ${S.DC}`;
      else if (p.category === 'Cần câu & Bóng') newCat = `Cần câu & Bóng ${S.DC}`;

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
      }
    }

    console.log(`Force complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

forceSuffixes();
