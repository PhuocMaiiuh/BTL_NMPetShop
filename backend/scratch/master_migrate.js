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

async function masterMigrate() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Starting MASTER MIGRATION for ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      const name = p.name.toLowerCase();
      let newCat = p.category;

      // 1. Dog products
      if (name.includes('chó') || name.includes('dog')) {
        if (name.includes('hạt') || name.includes('thức ăn')) newCat = `Thức ăn hạt ${S.CHO}`;
        else if (name.includes('pate') || name.includes('lon') || name.includes('gói')) newCat = `Pate & Đồ hộp ${S.CHO}`;
        else if (name.includes('sữa tắm') || name.includes('shampoo') || name.includes('tắm khô')) newCat = `Sữa tắm & Vệ sinh ${S.CHO}`;
        else if (name.includes('đồ chơi') || name.includes('xương gặm')) newCat = `Đồ chơi ${S.CHO}`;
        else if (name.includes('phụ kiện') || name.includes('dây dắt') || name.includes('vòng cổ') || name.includes('chuồng') || name.includes('lồng')) newCat = `Phụ kiện ${S.CHO}`;
        else newCat = `Chăm sóc khác ${S.CHO}`;
      }
      // 2. Cat products
      else if (name.includes('mèo') || name.includes('cat')) {
        if (name.includes('hạt') || name.includes('thức ăn')) newCat = `Thức ăn hạt ${S.MEO}`;
        else if (name.includes('pate') || name.includes('lon') || name.includes('gói')) newCat = `Pate & Đồ hộp ${S.MEO}`;
        else if (name.includes('sữa tắm') || name.includes('shampoo') || name.includes('tắm khô')) newCat = `Sữa tắm & Vệ sinh ${S.MEO}`;
        else if (name.includes('đồ chơi') || name.includes('cần câu') || name.includes('bàn cào') || name.includes('trụ cào')) newCat = `Đồ chơi ${S.MEO}`;
        else if (name.includes('phụ kiện') || name.includes('chuồng') || name.includes('lồng') || name.includes('bát ăn')) newCat = `Phụ kiện ${S.MEO}`;
        else newCat = `Chăm sóc khác ${S.MEO}`;
      }
      // 3. Accessory (Phụ kiện)
      else if (name.includes('dây dắt') || name.includes('vòng cổ')) {
        newCat = `Vòng cổ & Dây dắt ${S.PK}`;
      } else if (name.includes('bát ăn') || name.includes('bình nước')) {
        newCat = `Bát ăn & Bình nước ${S.PK}`;
      } else if (name.includes('chuồng') || name.includes('lồng') || name.includes('giường') || name.includes('nệm')) {
        newCat = `Giường nệm & Chuồng ${S.PK}`;
      } else if (name.includes('túi vận chuyển') || name.includes('lồng vận chuyển')) {
        newCat = `Túi vận chuyển & Lồng ${S.PK}`;
      } else if (name.includes('phụ kiện')) {
        newCat = `Phụ kiện chung ${S.PK}`;
      }
      // 4. Toys (Đồ chơi)
      else if (name.includes('nhai gặm') || name.includes('xương gặm')) {
        newCat = `Đồ chơi nhai gặm ${S.DC}`;
      } else if (name.includes('cần câu') || name.includes('bóng')) {
        newCat = `Cần câu & Bóng ${S.DC}`;
      } else if (name.includes('bàn cào') || name.includes('trụ cào')) {
        newCat = `Bàn cào móng ${S.DC}`;
      } else if (name.includes('đồ chơi')) {
        newCat = `Đồ chơi chung ${S.DC}`;
      }
      // 5. Health (Chăm sóc sức khỏe)
      else if (name.includes('thuốc') || name.includes('vitamin') || name.includes('thực phẩm chức năng') || name.includes('dung dịch')) {
        newCat = `Thuốc & Vitamin ${S.SK}`;
      } else if (name.includes('lược') || name.includes('cắt tỉa') || name.includes('kìm')) {
        newCat = `Dụng cụ cắt tỉa ${S.SK}`;
      } else if (name.includes('tấm lót') || name.includes('vệ sinh') || name.includes('khử mùi') || name.includes('khăn giấy')) {
        newCat = `Vệ sinh & Khử mùi ${S.SK}`;
      } else if (name.includes('sức khỏe') || name.includes('chăm sóc')) {
        newCat = `Chăm sóc & Y tế ${S.SK}`;
      }

      // Final check: if it has no suffix but belongs to a group, force it
      if (!newCat.includes('(')) {
          if (newCat.includes('Chó')) newCat += ` ${S.CHO}`;
          else if (newCat.includes('Mèo')) newCat += ` ${S.MEO}`;
          else if (p.category.includes('Phụ kiện')) newCat += ` ${S.PK}`;
          else if (p.category.includes('Đồ chơi')) newCat += ` ${S.DC}`;
          else if (p.category.includes('sức khỏe')) newCat += ` ${S.SK}`;
      }

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
      }
    }

    console.log(`Master Migration complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

masterMigrate();
