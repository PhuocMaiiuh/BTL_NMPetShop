const https = require('https');
const fs = require('fs');

const categoryMap = {
  'Thức Ăn Hạt Cho Chó': 'Thức ăn hạt (Sản phẩm cho Chó)',
  'Thức Ăn Hạt Cho Chó Con': 'Thức ăn hạt (Sản phẩm cho Chó)',
  'Thức Ăn Ướt Cho Chó': 'Pate & Đồ hộp (Sản phẩm cho Chó)',
  'Thức Ăn Hạt Cho Mèo': 'Thức ăn hạt (Sản phẩm cho Mèo)',
  'Thức Ăn Hạt Cho Mèo Con': 'Thức ăn hạt (Sản phẩm cho Mèo)',
  'Thức Ăn Ướt Cho Mèo': 'Pate & Đồ hộp (Sản phẩm cho Mèo)',
  'Chén Ăn Uống Lưu Trữ': 'Bát ăn & Bình nước (Phụ kiện)',
  'Rọ Mõm': 'Vòng cổ & Dây dắt (Phụ kiện)',
  'Dây Dắt Chó Mèo': 'Vòng cổ & Dây dắt (Phụ kiện)',
  'Vòng Cổ': 'Vòng cổ & Dây dắt (Phụ kiện)',
  'Nệm': 'Giường nệm & Chuồng (Phụ kiện)',
  'Giường Nệm': 'Giường nệm & Chuồng (Phụ kiện)',
  'Đồ Chơi': 'Đồ chơi nhai gặm (Đồ chơi)',
  'Đồ Chơi Cho Chó': 'Đồ chơi nhai gặm (Đồ chơi)',
  'Đồ Chơi Cho Mèo': 'Cần câu & Bóng (Đồ chơi)',
  'Sữa Tắm': 'Sữa tắm & Vệ sinh (Sản phẩm cho Chó)',
  'Sữa Tắm Chó': 'Sữa tắm & Vệ sinh (Sản phẩm cho Chó)',
  'Sữa Tắm Mèo': 'Sữa tắm & Vệ sinh (Sản phẩm cho Mèo)',
  'Ăn Vặt Liếm': 'Pate & Đồ hộp (Sản phẩm cho Chó)',
  'Ăn Vặt Liếm Cho Mèo': 'Pate & Đồ hộp (Sản phẩm cho Mèo)',
  'Cát Đậu Nành': 'Sữa tắm & Vệ sinh (Sản phẩm cho Mèo)',
  'Chăm Sóc Tai Mắt': 'Sữa tắm & Vệ sinh (Sản phẩm cho Chó)',
  'Khác': 'Bát ăn & Bình nước (Phụ kiện)',
};

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.petmall.vn/collections/all/products.json?limit=50&page=' + page;
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .substring(0, 800);
}

function extractWeight(title) {
  const m = title.match(/^([\d.,]+\s*(?:KG|G|kg|g|ml|ML|L|l))/i);
  return m ? m[1] : null;
}

function buildSpecs(item) {
  const specs = [];
  specs.push({ label: 'Thương hiệu', value: item.vendor });
  const weight = extractWeight(item.title);
  if (weight) specs.push({ label: 'Khối lượng', value: weight });
  if (item.variants && item.variants.length > 1) {
    const optName = item.options && item.options[0] && item.options[0].name;
    const vals = item.variants.map(v => v.option1).filter(Boolean).join(', ');
    if (optName && vals) specs.push({ label: optName, value: vals });
  }
  specs.push({ label: 'Danh mục', value: item.product_type });
  const tagArr = (item.tags || '').split(',').map(t => t.trim());
  const meaningfulTags = tagArr.filter(t =>
    t && t.length > 2 &&
    !t.startsWith('danhcho') &&
    !t.startsWith('thucan') &&
    !t.toLowerCase().startsWith('google') &&
    !t.startsWith('cho') &&
    !t.startsWith('meo') &&
    !/^\d/.test(t)
  );
  if (meaningfulTags.length > 0) {
    specs.push({ label: 'Tags', value: meaningfulTags.slice(0, 3).join(', ') });
  }
  return specs;
}

async function fetchAll() {
  let allProducts = [];
  let page = 1;
  while (true) {
    console.log('Fetching page', page, '...');
    const data = await fetchPage(page);
    if (!data.products || data.products.length === 0) break;
    allProducts = allProducts.concat(data.products);
    console.log('  Got', data.products.length, 'products (total:', allProducts.length, ')');
    if (data.products.length < 50) break;
    page++;
    await new Promise(r => setTimeout(r, 600));
  }
  return allProducts;
}

fetchAll().then(rawProducts => {
  let idCounter = 1;
  const converted = rawProducts.map((item) => {
    const variant = item.variants && item.variants[0];
    const price = variant ? parseInt(variant.price) : 0;
    const comparePrice = variant ? parseInt(variant.compare_at_price) : 0;
    if (!price || !item.image) return null;

    const mappedCategory = categoryMap[item.product_type] || 'Phụ kiện';
    const allImages = (item.images || []).map(img => img.src).filter(Boolean);
    const mainImage = item.image ? item.image.src : (allImages[0] || '');
    const stockQty = variant ? (variant.inventory_quantity || 10) : 10;

    const obj = {
      id: idCounter++,
      name: item.title,
      image: mainImage,
      images: allImages,
      price: price,
      rating: 4,
      reviews: Math.floor(Math.random() * 30) + 5,
      category: mappedCategory,
      brand: item.vendor,
      description: stripHtml(item.body_html),
      specifications: buildSpecs(item),
      inStock: item.available !== false && stockQty > 0,
      stockCount: Math.max(stockQty, 10),
      isBestSelling: false,
      active: item.available !== false,
      stock: Math.max(stockQty, 10),
    };

    if (comparePrice > price && comparePrice > 0) {
      obj.originalPrice = comparePrice;
      obj.badge = 'Sale';
    }
    return obj;
  }).filter(Boolean);

  fs.writeFileSync('./src/data/petmall_products.json', JSON.stringify(converted, null, 2), 'utf8');
  console.log('\nDone! Total:', converted.length, 'products saved.');
  const cats = [...new Set(converted.map(p => p.category))];
  cats.forEach(c => console.log(' -', c, ':', converted.filter(p => p.category === c).length, 'sản phẩm'));
  // Show sample product with images
  const sample = converted[0];
  console.log('\nSample product images count:', sample.images.length);
  console.log('Sample description length:', sample.description.length);
  console.log('Sample specs:', JSON.stringify(sample.specifications));
}).catch(e => console.error('Error:', e));
