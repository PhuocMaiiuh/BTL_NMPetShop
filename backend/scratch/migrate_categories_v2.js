const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

const SUFFIX = {
  cho: '(Sản phẩm cho Chó)',
  meo: '(Sản phẩm cho Mèo)',
  phukien: '(Phụ kiện)',
  dochoi: '(Đồ chơi)',
  suckhoe: '(Chăm sóc sức khỏe)'
};

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Re-analyzing ${products.length} products to strictly match User-side SUFFIX_MAP...`);

    let updatedCount = 0;

    for (const p of products) {
      const name = p.name.toLowerCase();
      let newCat = p.category;

      if (name.includes('chó') || name.includes('dog')) {
        if (name.includes('hạt') || name.includes('thức ăn')) newCat = `Thức ăn hạt ${SUFFIX.cho}`;
        else if (name.includes('pate') || name.includes('lon') || name.includes('gói')) newCat = `Pate & Đồ hộp ${SUFFIX.cho}`;
        else if (name.includes('sữa tắm') || name.includes('shampoo') || name.includes('tắm khô')) newCat = `Sữa tắm & Vệ sinh ${SUFFIX.cho}`;
        else if (name.includes('đồ chơi') || name.includes('xương gặm')) newCat = `Đồ chơi ${SUFFIX.cho}`;
        else if (name.includes('phụ kiện') || name.includes('dây dắt') || name.includes('vòng cổ') || name.includes('chuồng') || name.includes('lồng')) newCat = `Phụ kiện ${SUFFIX.cho}`;
        else newCat = `Chăm sóc khác ${SUFFIX.cho}`;
      }
      else if (name.includes('mèo') || name.includes('cat')) {
        if (name.includes('hạt') || name.includes('thức ăn')) newCat = `Thức ăn hạt ${SUFFIX.meo}`;
        else if (name.includes('pate') || name.includes('lon') || name.includes('gói')) newCat = `Pate & Đồ hộp ${SUFFIX.meo}`;
        else if (name.includes('sữa tắm') || name.includes('shampoo') || name.includes('tắm khô')) newCat = `Sữa tắm & Vệ sinh ${SUFFIX.meo}`;
        else if (name.includes('đồ chơi') || name.includes('cần câu') || name.includes('bàn cào')) newCat = `Đồ chơi ${SUFFIX.meo}`;
        else if (name.includes('phụ kiện') || name.includes('chuồng') || name.includes('lồng') || name.includes('bát ăn')) newCat = `Phụ kiện ${SUFFIX.meo}`;
        else newCat = `Chăm sóc khác ${SUFFIX.meo}`;
      }
      else if (name.includes('phụ kiện') || name.includes('dây dắt') || name.includes('vòng cổ') || name.includes('bát ăn') || name.includes('chuồng') || name.includes('lồng') || name.includes('túi vận chuyển')) {
        newCat = `Phụ kiện chung ${SUFFIX.phukien}`;
      }
      else if (name.includes('đồ chơi') || name.includes('xương gặm') || name.includes('bóng')) {
        newCat = `Đồ chơi chung ${SUFFIX.dochoi}`;
      }
      else if (name.includes('thuốc') || name.includes('vitamin') || name.includes('dung dịch') || name.includes('lược') || name.includes('cắt tỉa') || name.includes('vệ sinh')) {
        newCat = `Chăm sóc & Y tế ${SUFFIX.suckhoe}`;
      }

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

migrate();
