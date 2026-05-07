const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config({ path: './.env' });

const services = [
  {
    title: 'Cắt Tỉa Lông Chuyên Nghiệp',
    description: 'Dịch vụ cắt tỉa lông tạo kiểu theo yêu cầu, vệ sinh tai móng trọn gói cho bé yêu.',
    price: '250.000đ',
    image: '/services/grooming.png',
    icon: 'MdPets',
    category: 'grooming'
  },
  {
    title: 'Tắm Sấy & Spa Thư Giãn',
    description: 'Sử dụng các dòng sữa tắm cao cấp, massage thư giãn giúp thú cưng luôn thơm tho và sạch sẽ.',
    price: '150.000đ',
    image: '/services/spa.png',
    icon: 'MdSpa',
    category: 'spa'
  },
  {
    title: 'Khách Sạn Thú Cưng 5 Sao',
    description: 'Không gian lưu trú sạch sẽ, hiện đại với chế độ dinh dưỡng và chăm sóc đặc biệt 24/7.',
    price: '200.000đ/ngày',
    image: '/services/hotel.png',
    icon: 'MdHotel',
    category: 'hotel'
  },
  {
    title: 'Thăm Khám Sức Khỏe',
    description: 'Kiểm tra sức khỏe định kỳ, tư vấn dinh dưỡng và tiêm phòng bởi các bác sĩ thú y giàu kinh nghiệm.',
    price: '300.000đ',
    image: '/services/vet.png',
    icon: 'MdMedicalServices',
    category: 'medical'
  }
];

const seedServices = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://admin:admin123@127.0.0.1:27017/nmpetshop?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding services...');
    
    await Service.deleteMany({});
    console.log('Cleared existing services.');
    
    await Service.insertMany(services);
    console.log('Successfully seeded 4 services.');
    
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedServices();
