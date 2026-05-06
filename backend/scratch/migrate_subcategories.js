const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

const SUFFIX = {
  phukien: '(Phụ kiện)',
  dochoi: '(Đồ chơi)',
  suckhoe: '(Chăm sóc sức khỏe)'
};

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Re-categorizing Phụ kiện, Đồ chơi, Sức khỏe for ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      const name = p.name.toLowerCase();
      let newCat = p.category;

      // Only re-categorize if it's already in one of these main groups (or "Chăm sóc khác")
      if (p.category.includes(SUFFIX.phukien) || p.category.includes(SUFFIX.dochoi) || p.category.includes(SUFFIX.suckhoe)) {
        
        // 1. Phụ kiện
        if (name.includes('dây dắt') || name.includes('vòng cổ')) {
          newCat = `Vòng cổ & Dây dắt ${SUFFIX.phukien}`;
        } else if (name.includes('bát ăn') || name.includes('bình nước')) {
          newCat = `Bát ăn & Bình nước ${SUFFIX.phukien}`;
        } else if (name.includes('chuồng') || name.includes('lồng') || name.includes('giường') || name.includes('nệm')) {
          newCat = `Giường nệm & Chuồng ${SUFFIX.phukien}`;
        } else if (name.includes('túi vận chuyển') || name.includes('lồng vận chuyển')) {
          newCat = `Túi vận chuyển & Lồng ${SUFFIX.phukien}`;
        }
        // 2. Đồ chơi
        else if (name.includes('đồ chơi') || name.includes('xương gặm')) {
          newCat = `Đồ chơi nhai gặm ${SUFFIX.dochoi}`;
        } else if (name.includes('cần câu') || name.includes('bóng')) {
          newCat = `Cần câu & Bóng ${SUFFIX.dochoi}`;
        } else if (name.includes('bàn cào') || name.includes('trụ cào')) {
          newCat = `Bàn cào móng ${SUFFIX.dochoi}`;
        }
        // 3. Chăm sóc sức khỏe
        else if (name.includes('thuốc') || name.includes('vitamin') || name.includes('thực phẩm chức năng') || name.includes('dung dịch')) {
          newCat = `Thuốc & Vitamin ${SUFFIX.suckhoe}`;
        } else if (name.includes('lược') || name.includes('cắt tỉa') || name.includes('kìm')) {
          newCat = `Dụng cụ cắt tỉa ${SUFFIX.suckhoe}`;
        } else if (name.includes('tấm lót') || name.includes('vệ sinh') || name.includes('khử mùi') || name.includes('khăn giấy')) {
          newCat = `Vệ sinh & Khử mùi ${SUFFIX.suckhoe}`;
        }
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
