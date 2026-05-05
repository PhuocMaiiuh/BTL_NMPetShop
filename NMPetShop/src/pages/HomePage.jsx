import { useState, useEffect } from 'react';
import { GiDogBowl, GiBalloonDog } from 'react-icons/gi';
import { MdPets, MdHealthAndSafety } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
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
import { fetchProducts } from '../services/productApi';

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
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts({ limit: 10, filter: 'top-selling' });
        // If no top-selling products found, just get the first 10 active ones
        if (data.products.length === 0) {
          const fallback = await fetchProducts({ limit: 10 });
          setBestSellers(fallback.products);
        } else {
          setBestSellers(data.products);
        }
      } catch (err) {
        console.error('Home Page Load Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeBestSellers = bestSellers;

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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FiLoader size={40} className="animate-spin text-primary" />
            </div>
          ) : (
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
                  <SwiperSlide key={product._id || product.id}>
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
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />
    </div>
  );
};

export default HomePage;
