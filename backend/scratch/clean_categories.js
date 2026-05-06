const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function cleanAndUnique() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Renaming categories for ${products.length} products to be clean but unique...`);

    let updatedCount = 0;

    for (const p of products) {
      if (!p.category) continue;
      let newCat = p.category;

      // Handle the technical suffixes I added earlier
      if (p.category.includes('(Sản phẩm cho Chó)')) {
        newCat = p.category.replace('(Sản phẩm cho Chó)', 'cho chó').trim();
      } else if (p.category.includes('(Sản phẩm cho Mèo)')) {
        newCat = p.category.replace('(Sản phẩm cho Mèo)', 'cho mèo').trim();
      } else if (p.category.includes(' (')) {
        newCat = p.category.split(' (')[0].trim();
      }

      // Special case for duplicates if they still exist
      if (newCat === 'Thức ăn hạt') {
         if (p.name.toLowerCase().includes('chó')) newCat = 'Thức ăn hạt cho chó';
         else if (p.name.toLowerCase().includes('mèo')) newCat = 'Thức ăn hạt cho mèo';
      }
      if (newCat === 'Pate & Đồ hộp') {
         if (p.name.toLowerCase().includes('chó')) newCat = 'Pate & Đồ hộp cho chó';
         else if (p.name.toLowerCase().includes('mèo')) newCat = 'Pate & Đồ hộp cho mèo';
      }
      if (newCat === 'Sữa tắm & Vệ sinh') {
         if (p.name.toLowerCase().includes('chó')) newCat = 'Sữa tắm & Vệ sinh cho chó';
         else if (p.name.toLowerCase().includes('mèo')) newCat = 'Sữa tắm & Vệ sinh cho mèo';
      }

      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { category: newCat });
        updatedCount++;
      }
    }

    console.log(`Clean-up complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

cleanAndUnique();
