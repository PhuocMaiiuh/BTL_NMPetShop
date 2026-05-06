const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

async function stripSuffixes() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({});
    console.log(`Stripping technical suffixes from ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      if (p.category && p.category.includes(' (')) {
        const cleanCat = p.category.split(' (')[0];
        await Product.updateOne({ _id: p._id }, { category: cleanCat });
        updatedCount++;
      }
    }

    console.log(`Strip complete. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

stripSuffixes();
