const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Analyzing ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      const name = p.name.toLowerCase();
      let newCat = p.category;

      // Logic for "Phụ kiện" or empty categories
      if (p.category === 'Phụ kiện' || !p.category || p.category === '') {
        if (name.includes('dây dắt') || name.includes('vòng cổ')) {
          newCat = 'Vòng cổ & Dây dắt (Phụ kiện)';
        } else if (name.includes('bát ăn') || name.includes('bình nước')) {
          newCat = 'Bát ăn & Bình nước (Phụ kiện)';
        } else if (name.includes('chuồng') || name.includes('lồng') || name.includes('túi vận chuyển')) {
          newCat = 'Túi vận chuyển & Lồng (Phụ kiện)';
        } else if (name.includes('sữa tắm') || name.includes('shampoo') || name.includes('tắm khô')) {
          if (name.includes('chó') || name.includes('dog')) {
            newCat = 'Sữa tắm & Vệ sinh (Sản phẩm cho Chó)';
          } else if (name.includes('mèo') || name.includes('cat')) {
            newCat = 'Sữa tắm & Vệ sinh (Sản phẩm cho Mèo)';
          } else {
            newCat = 'Sữa tắm & Vệ sinh (Sản phẩm cho Chó)'; // Default to Dog
          }
        } else if (name.includes('lược') || name.includes('cắt tỉa')) {
          newCat = 'Dụng cụ cắt tỉa (Chăm sóc sức khỏe)';
        } else if (name.includes('thuốc') || name.includes('vitamin') || name.includes('dung dịch')) {
          newCat = 'Thuốc & Vitamin (Chăm sóc sức khỏe)';
        } else if (name.includes('tấm lót') || name.includes('vệ sinh')) {
          newCat = 'Vệ sinh & Khử mùi (Chăm sóc sức khỏe)';
        } else if (name.includes('đồ chơi') || name.includes('xương gặm')) {
           if (name.includes('chó') || name.includes('dog')) {
              newCat = 'Đồ chơi cho chó';
           } else if (name.includes('mèo') || name.includes('cat')) {
              newCat = 'Đồ chơi cho mèo';
           } else {
              newCat = 'Đồ chơi nhai gặm (Đồ chơi)';
           }
        } else if (name.includes('thức ăn') || name.includes('hạt')) {
           if (name.includes('chó') || name.includes('dog')) {
              newCat = 'Thức ăn hạt (Sản phẩm cho Chó)';
           } else {
              newCat = 'Thức ăn hạt (Sản phẩm cho Mèo)';
           }
        } else if (name.includes('pate') || name.includes('lon')) {
           if (name.includes('chó') || name.includes('dog')) {
              newCat = 'Pate & Đồ hộp (Sản phẩm cho Chó)';
           } else {
              newCat = 'Pate & Đồ hộp (Sản phẩm cho Mèo)';
           }
        }
      }

      // Refining existing ones if they are just "Đồ chơi" or "Chăm sóc sức khỏe"
      if (p.category === 'Đồ chơi') {
        newCat = 'Đồ chơi nhai gặm (Đồ chơi)';
      }
      if (p.category === 'Chăm sóc sức khỏe') {
        newCat = 'Thuốc & Vitamin (Chăm sóc sức khỏe)';
      }

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
        console.log(`Updated: ${p.name} -> ${newCat}`);
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
