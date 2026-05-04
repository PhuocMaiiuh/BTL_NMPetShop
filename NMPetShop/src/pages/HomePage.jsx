import { GiDogBowl, GiBalloonDog } from 'react-icons/gi';
import { MdPets, MdHealthAndSafety } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import PromoBanner from '../components/PromoBanner';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const defaultProducts = [
  { id: 1, name: 'Hạt khô Royal Canin cho chó', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', price: 110000, originalPrice: 150000, rating: 4, reviews: 12, category: 'Thức ăn cho chó', badge: 'Hot', active: true },
  { id: 2, name: 'Thức ăn ướt cho mèo cá ngừ', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', price: 320000, originalPrice: 380000, rating: 5, reviews: 18, category: 'Thức ăn cho mèo', badge: 'Sale', active: true },
  { id: 3, name: 'Pate tươi cho chó con vị gà', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', price: 382500, originalPrice: 450000, rating: 4, reviews: 15, category: 'Thức ăn cho chó', badge: 'Sale', active: true },
  { id: 4, name: 'Vòng cổ da cao cấp thú cưng', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop', price: 180000, originalPrice: 220000, rating: 5, reviews: 10, category: 'Phụ kiện', badge: 'Hot', active: true },
  { id: 5, name: 'Đồ chơi xương gặm cao su', image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop', price: 85000, rating: 4, reviews: 20, category: 'Đồ chơi', active: true },
  { id: 6, name: 'Bát ăn inox chống trượt', image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=400&fit=crop', price: 120000, rating: 5, reviews: 7, category: 'Phụ kiện', active: true },
  { id: 7, name: 'Sữa tắm thảo dược cho mèo', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', price: 195000, rating: 4, reviews: 11, category: 'Chăm sóc sức khỏe', active: true },
  { id: 8, name: 'Cần câu mèo gắn lông vũ', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', price: 45000, rating: 5, reviews: 25, category: 'Đồ chơi', active: true },
  { id: 9, name: 'Ổ nằm bông êm ái cho thú cưng', image: 'https://images.unsplash.com/photo-1591946614421-1d977ff89c46?w=400&h=400&fit=crop', price: 450000, originalPrice: 550000, rating: 5, reviews: 14, category: 'Phụ kiện', badge: 'Hot', active: true },
  { id: 10, name: 'Xịt khử mùi vệ sinh chó mèo', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop', price: 135000, rating: 4, reviews: 9, category: 'Chăm sóc sức khỏe', active: true },
];

const categories = [
  {
    icon: <MdHealthAndSafety size={24} className="text-white" />,
    title: 'Chăm sóc sức khỏe',
    description: 'Sản phẩm vệ sinh, thực phẩm chức năng và chăm sóc y tế.',
    link: '/san-pham?category=suc-khoe',
    color: 'bg-red-500',
  },
  {
    icon: <GiBalloonDog size={24} className="text-white" />,
    title: 'Đồ chơi',
    description: 'Bộ sưu tập đồ chơi vui nhộn và an toàn.',
    link: '/san-pham?category=do-choi',
    color: 'bg-orange-500',
  },
  {
    icon: <MdPets size={24} className="text-white" />,
    title: 'Phụ kiện',
    description: 'Vòng cổ, dây dẫn và quần áo dễ thương cho bé.',
    link: '/san-pham?category=phu-kien',
    color: 'bg-emerald-500',
  },
];

const HomePage = () => {
  const products = (() => {
    const saved = localStorage.getItem('nm_petshop_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  })();

  const activeBestSellers = products
    .filter(p => p.active !== false)
    .slice(0, 10);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-center text-text-dark mb-10">Danh mục nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            Top 10 sản phẩm bán chạy
            <HiFire className="text-orange-500 animate-flame" size={28} />
          </h2>
          <Link
            to="/san-pham?filter=top-selling"
            className="text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>
        
        <div className="product-carousel-wrapper relative px-4 sm:px-12">
          <div className="product-carousel">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {activeBestSellers.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-0 top-[40%] -translate-y-1/2 w-11 h-11 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm z-30 transition-all cursor-pointer">
              <FiChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-[40%] -translate-y-1/2 w-11 h-11 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm z-30 transition-all cursor-pointer">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />
    </div>
  );
};

export default HomePage;
