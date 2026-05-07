const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nm_petshop';
const PRODUCTS_DATA_PATH = path.join(__dirname, '../../NMPetShop/src/data/petmall_products.json');

const reasonableClassify = (p) => {
  const combinedText = `${p.name} ${p.category || ''}`.toLowerCase();

  // 1. TÌM GIỐNG THÚ CƯNG (Đuôi bộ lọc)
  const isDog = combinedText.match(/chó|dog|puppy|corgi|poodle|husky|shiba|pedigree|ganador|smartheart|bowwow|pug/g);
  const isCat = combinedText.match(/mèo|cat|kitten|me-o|whiskas|ciao|kitcat|minino|felix|sheba|churu|nekko|snappy tom/g);

  let speciesSuffix = '';
  if (isDog && !isCat) {
    speciesSuffix = ' (Sản phẩm cho Chó)';
  } else if (isCat && !isDog) {
    speciesSuffix = ' (Sản phẩm cho Mèo)';
  } else {
    // TRIỆT ĐỂ: Các món dùng chung (như bát ăn, kìm cắt móng) sẽ được gắn CẢ 2 HẬU TỐ.
    // Điều này giúp sản phẩm hiển thị hoàn hảo ở cả 2 tab "Cho Chó" và "Cho Mèo" trên UI.
    speciesSuffix = ' (Sản phẩm cho Chó) (Sản phẩm cho Mèo)';
  }

  // 2. LỚP CHẶN 1: DỤNG CỤ & PHỤ KIỆN (Bắt buộc chứa chữ "(Phụ kiện)")
  // Phải đặt trên cùng để chặn các từ khóa gây nhiễu phía sau (VD: "Muỗng xúc thức ăn/hộp")
  if (combinedText.match(/vòng cổ|dây dắt|rọ mõm|yếm|xích/g)) return `Vòng cổ & Dây dắt (Phụ kiện)${speciesSuffix}`;
  if (combinedText.match(/bát|chén|bình|máy lọc|muỗng|thìa|xẻng|khui|nắp đậy|cốc đong|kẹp|núm ti/g)) return `Dụng cụ ăn uống & Vệ sinh (Phụ kiện)${speciesSuffix}`;
  if (combinedText.match(/nệm|giường|chuồng|nhà cho|thảm|ổ nằm|lồng|võng/g)) return `Giường nệm & Chuồng (Phụ kiện)${speciesSuffix}`;
  if (combinedText.match(/túi|balo|địu|vận chuyển|túi xách/g)) return `Túi vận chuyển & Lồng (Phụ kiện)${speciesSuffix}`;
  if (combinedText.match(/áo|quần|nơ|kẹp tóc|mắt kính|mũ|nón/g)) return `Quần áo & Thời trang (Phụ kiện)${speciesSuffix}`;

  // 3. LỚP CHẶN 2: ĐỒ CHƠI (Bắt buộc chứa chữ "(Đồ chơi)")
  if (combinedText.match(/bàn cào|cào móng|trụ cào|cat tree|nhà cây/g)) return `Bàn cào móng (Đồ chơi)${speciesSuffix}`;
  if (combinedText.match(/cần câu|chuông|bóng|lật đật|đèn laser|catnip|bạc hà|đồ chơi/g)) return `Đồ chơi chung (Đồ chơi)${speciesSuffix}`;

  // 4. LỚP CHẶN 3: SỨC KHỎE & Y TẾ (Tiền tố bắt buộc khớp 100% với Controller)
  if (combinedText.match(/tông đơ|kềm|kéo|lược|bàn chải lông|kìm|gỡ rối|máy sấy|găng tay/g)) return `Dụng cụ cắt tỉa${speciesSuffix}`;
  if (combinedText.match(/cát vệ sinh|litter|catsbest|đậu nành|xịt|khử mùi|bỉm|tã|khay|chậu|tấm lót|pads|khăn ướt|túi đựng phân|lăn lông/g)) return `Vệ sinh & Khử mùi${speciesSuffix}`;
  if (combinedText.match(/thuốc|vitamin|canxi|men tiêu hóa|biotin|gel|bổ sung|tẩy giun|ve|rận|nhỏ gáy|nấm|viêm|nhỏ mắt|nhỏ tai/g)) return `Thuốc & Vitamin${speciesSuffix}`;
  if (combinedText.match(/sữa tắm|shampoo|xà bông|vòng loa|bông tai|kem đánh răng|bàn chải đánh|nước súc miệng/g)) return `Chăm sóc & Y tế${speciesSuffix}`;

  // 5. LỚP CHẶN 4: THỨC ĂN & SNACK (Sau khi đã loại hết bát đĩa, muỗng xẻng, thuốc men)
  if (combinedText.match(/thưởng|snack|treat|ciao|xương|gặm|nhai|tendon|stick|slice|jerky|đùi gà|ức gà|cá viên|bánh|phô mai|súp thưởng/g)) return `Snack & Bánh thưởng${speciesSuffix}`;
  if (combinedText.match(/pate|súp|ướt|gravy|hộp|lon|pouch|thịt xiên/g)) return `Pate & Thức ăn ướt${speciesSuffix}`;
  if (combinedText.match(/sữa bột|sữa cho|sữa dê/g)) return `Sữa bột & Thay thế${speciesSuffix}`;
  if (combinedText.match(/hạt|kibble|thức ăn khô|royal canin|nutrience|thức ăn/g)) return `Thức ăn hạt${speciesSuffix}`;

  // 6. GOM RÁC CÒN LẠI
  return `Sản phẩm khác (Phụ kiện)${speciesSuffix}`;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB. Đang tiến hành phân loại CHẶN NHIỀU LỚP...');

    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8'));

    const classified = productsData.map((p, i) => {
      const baseProduct = { ...p, category: reasonableClassify(p) };
      baseProduct.active = true;
      return baseProduct;
    });

    // Sắp xếp logic hiển thị: Category -> Brand -> Name
    classified.sort((a, b) => {
      const catA = a.category || "";
      const catB = b.category || "";
      if (catA !== catB) return catA.localeCompare(catB);
      const brandA = a.brand || '';
      const brandB = b.brand || '';
      if (brandA !== brandB) return brandA.localeCompare(brandB);
      return (a.name || "").localeCompare(b.name || "");
    });

    // Reset lại ID cho gọn gàng
    classified.forEach((p, i) => {
      p.id = i + 1;
    });

    await Product.deleteMany({});
    console.log('🗑️ Đã dọn dẹp các sản phẩm lộn xộn cũ.');

    await Product.insertMany(classified);
    console.log('✅ Đã phân loại triệt để và lưu thành công!');

    // Tạo Admin nếu chưa có
    const adminEmail = 'admin@nmpetshop.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        id: 1,
        fullName: 'Admin User',
        email: adminEmail,
        password: 'admin', 
        role: 'admin',
        active: true
      });
      console.log('👤 Đã tạo tài khoản Admin.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi trong quá trình phân loại:', error);
    process.exit(1);
  }
};

seed();