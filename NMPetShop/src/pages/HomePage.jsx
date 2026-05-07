import { useState, useEffect, useRef } from 'react';
import { GiDogBowl, GiBalloonDog } from 'react-icons/gi';
import { MdPets, MdHealthAndSafety, MdLocalShipping, MdVerified } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight, FiLoader, FiShield, FiHeadphones, FiPackage } from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { FaPaw, FaStar } from 'react-icons/fa';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import PromoBanner from '../components/PromoBanner';
import ServiceCard from '../components/ServiceCard';
import { fetchServices } from '../services/serviceApi';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchProducts } from '../services/productApi';

const categories = [
  {
    icon: <MdHealthAndSafety size={26} className="text-white" />,
    title: 'Chăm sóc sức khỏe',
    description: 'Sản phẩm vệ sinh, thực phẩm chức năng và chăm sóc y tế cho bé.',
    link: '/san-pham?category=suc-khoe',
    color: 'bg-red-500',
  },
  {
    icon: <GiBalloonDog size={26} className="text-white" />,
    title: 'Đồ chơi',
    description: 'Bộ sưu tập đồ chơi vui nhộn và an toàn, giúp bé luôn hạnh phúc.',
    link: '/san-pham?category=do-choi',
    color: 'bg-orange-500',
  },
  {
    icon: <MdPets size={26} className="text-white" />,
    title: 'Phụ kiện',
    description: 'Vòng cổ, dây dẫn và quần áo dễ thương cho bé yêu của bạn.',
    link: '/san-pham?category=phu-kien',
    color: 'bg-emerald-500',
  },
];

const whyUs = [
  {
    icon: <MdLocalShipping size={28} className="text-blue-400" />,
    title: 'Giao Hàng Siêu Tốc',
    desc: 'Giao hàng trong ngày nội thành, toàn quốc trong 24-48h. Miễn phí đơn từ 300k.',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'rgba(59,130,246,0.2)',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: <FiShield size={28} className="text-emerald-400" />,
    title: 'Hàng Chính Hãng 100%',
    desc: 'Cam kết chỉ bán sản phẩm chính hãng, có nguồn gốc rõ ràng và an toàn cho thú cưng.',
    gradient: 'from-emerald-500/10 to-green-500/10',
    border: 'rgba(16,185,129,0.2)',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: <FiHeadphones size={28} className="text-purple-400" />,
    title: 'Tư Vấn 24/7',
    desc: 'Đội ngũ chuyên gia thú cưng luôn sẵn sàng tư vấn miễn phí mọi lúc mọi nơi.',
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'rgba(168,85,247,0.2)',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: <FiPackage size={28} className="text-orange-400" />,
    title: 'Đổi Trả Dễ Dàng',
    desc: 'Chính sách đổi trả trong vòng 30 ngày. Hoàn tiền 100% nếu không hài lòng.',
    gradient: 'from-orange-500/10 to-amber-500/10',
    border: 'rgba(249,115,22,0.2)',
    glow: 'rgba(249,115,22,0.15)',
  },
];

const reviews = [
  { name: 'Nguyễn Lan Anh', avatar: '🐶', text: 'Shop rất chuyên nghiệp! Thức ăn cho chó của tôi chất lượng cực kỳ tốt, bé nhà mình ăn rất ngon miệng.', rating: 5, pet: 'Chủ của Golden Retriever' },
  { name: 'Trần Minh Khôi', avatar: '🐱', text: 'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm spa tắm cho mèo thơm không kích ứng da rất tốt.', rating: 5, pet: 'Chủ của 2 bé Mèo Anh' },
  { name: 'Phạm Thu Hà', avatar: '🐰', text: 'Mua đồ chơi cho thỏ cưng, shop tư vấn nhiệt tình. Giá hợp lý, freeship nhanh. Sẽ mua lại!', rating: 5, pet: 'Chủ của Thỏ Tai Dài' },
];

// Animated counter hook
const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, setStarted };
};

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const whyRef = useRef(null);
  const [whyVisible, setWhyVisible] = useState(false);
  const reviewRef = useRef(null);
  const [reviewVisible, setReviewVisible] = useState(false);

  const { count: customers, setStarted: setStartCustomers } = useCountUp(5000);
  const { count: products, setStarted: setStartProducts } = useCountUp(1200);
  const { count: orders, setStarted: setStartOrders } = useCountUp(15000);
  
  useEffect(() => {
    if (statsVisible) {
      setStartCustomers(true);
      setStartProducts(true);
      setStartOrders(true);
    }
  }, [statsVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === statsRef.current && entry.isIntersecting) setStatsVisible(true);
          if (entry.target === whyRef.current && entry.isIntersecting) setWhyVisible(true);
          if (entry.target === reviewRef.current && entry.isIntersecting) setReviewVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    if (whyRef.current) observer.observe(whyRef.current);
    if (reviewRef.current) observer.observe(reviewRef.current);
    return () => observer.disconnect();
  }, []);

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

        setServicesLoading(true);
        const servData = await fetchServices();
        setServices(servData.length ? servData : []);
      } catch (err) {
        console.error('Home Page Load Error:', err);
      } finally {
        setLoading(false);
        setServicesLoading(false);
      }
    };
    loadData();
  }, []);

  const activeBestSellers = bestSellers;

  return (
    <div className="overflow-x-hidden" style={{ background: '#070e1a' }}>
      {/* ══════════ Hero Banner ══════════ */}
      <HeroBanner />

      {/* ══════════ Stats Section ══════════ */}
      <section 
        ref={statsRef}
        className="py-12 relative z-20 -mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 group">
            {[
              { value: customers, label: 'Khách hàng', suffix: '+', icon: '🐾' },
              { value: products, label: 'Sản phẩm', suffix: '+', icon: '📦' },
              { value: orders, label: 'Đơn hàng', suffix: '+', icon: '🚚' },
              { value: 4.9, label: 'Đánh giá', suffix: '★', icon: '⭐', isFloat: true },
              { value: '24/7', label: 'Hỗ trợ', suffix: '', icon: '💬', isString: true }
            ].map((stat, i) => (
              <div 
                key={i}
                className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-white/5 hover:-translate-y-2"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  transitionDelay: `${i * 0.05}s`
                }}
              >
                <span className="text-2xl mb-2">{stat.icon}</span>
                <div className="text-3xl font-black text-white flex items-baseline gap-0.5">
                  {stat.isFloat ? stat.value.toFixed(1) : stat.isString ? stat.value : stat.value.toLocaleString()}
                  <span className="text-[#e85a2b] text-xl">{stat.suffix}</span>
                </div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ Categories ══════════ */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10"
        style={{ background: 'transparent' }}
      >
        <FaPaw className="absolute top-[15%] left-[8%] text-[#a8c5ff]/10 animate-float pointer-events-none" size={28} style={{ animationDelay: '0s', animationDuration: '4.5s' }} />
        <FaPaw className="absolute bottom-[20%] right-[10%] text-[#e85a2b]/10 animate-float pointer-events-none" size={22} style={{ animationDelay: '1.2s', animationDuration: '3.8s' }} />
        
        {/* Section heading */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <MdPets size={12} className="text-[#e85a2b]" />
            DANH MỤC SẢN PHẨM
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Danh Mục{' '}
            <span className="hero-gradient-text-orange">
              Nổi Bật
            </span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Tất cả những gì thú cưng của bạn cần, từ dinh dưỡng đến vui chơi và chăm sóc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* ══════════ Our Services ══════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              💎 DỊCH VỤ CAO CẤP
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Chăm Sóc{' '}
              <span className="hero-gradient-text-orange">Toàn Diện</span>
              <br />
              Cho Thú Cưng
            </h2>
            <p className="text-white/50 max-w-md mx-auto text-sm">
              Đội ngũ chuyên nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc thú cưng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-[2.5rem] bg-white/5 animate-pulse" />
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service._id} {...service} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-card rounded-[2.5rem]">
                <p className="text-white/30 italic text-sm">Đang cập nhật danh sách dịch vụ...</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/lien-he"
              className="inline-flex items-center gap-2 text-[#e85a2b] font-bold text-sm hover:underline"
            >
              Xem chi tiết bảng giá dịch vụ
              <FiChevronRight size={16} />
            </Link>
          </div>
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

      {/* ══════════ Promo Combos ══════════ */}
      <PromoBanner />

      {/* ══════════ Why Choose Us ══════════ */}
      <section
        ref={whyRef}
        className="section-dark py-20 relative overflow-hidden"
      >
        {/* Background radial accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(26,60,94,0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <MdVerified size={12} className="text-emerald-400" />
              TẠI SAO CHỌN CHÚNG TÔI
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Trải Nghiệm{' '}
              <span className="hero-gradient-text-orange">Mua Sắm</span>
              <br />
              Tuyệt Vời Nhất
            </h2>
            <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed">
              Chúng tôi không chỉ bán sản phẩm — chúng tôi chăm sóc thú cưng của bạn như của chính mình.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className={`glass-card glass-card-hover rounded-3xl p-6 transition-all duration-500 ${
                  whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${item.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  borderColor: item.border,
                  animationDelay: `${i * 0.1}s`,
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2 leading-snug">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ Customer Reviews ══════════ */}
      <section
        ref={reviewRef}
        className="py-20 relative"
      >
        <FaPaw className="absolute top-[25%] left-[10%] text-[#e85a2b]/10 animate-float pointer-events-none" size={26} style={{ animationDelay: '1s', animationDuration: '4.2s' }} />
        <FaPaw className="absolute bottom-[30%] right-[12%] text-[#a8c5ff]/10 animate-float pointer-events-none" size={30} style={{ animationDelay: '0.3s', animationDuration: '5.5s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'rgba(245,158,11,0.1)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              ⭐ ĐÁNH GIÁ KHÁCH HÀNG
            </div>
            <h2 className="text-3xl font-black text-white mb-3">
              Khách Hàng{' '}
              <span className="hero-gradient-text-orange">
                Nói Gì Về Chúng Tôi?
              </span>
            </h2>
            <p className="text-white/50 text-sm max-w-sm mx-auto">
              Hơn 5,000 pet parent tin tưởng NM Pet Shop mỗi ngày.
            </p>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div
                key={i}
                className={`rounded-3xl p-7 transition-all duration-500 ${
                  reviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transitionDelay: `${i * 0.15}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <FaStar key={j} size={14} className="text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{review.name}</p>
                    <p className="text-xs text-white/50">{review.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA Banner ══════════ */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: '#070e1a' }}
      >
        {/* Decorative radial glows */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(26,60,94,0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,90,43,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Floating paws */}
        {[...Array(6)].map((_, i) => (
          <FaPaw
            key={i}
            size={16 + i * 4}
            className="absolute pointer-events-none animate-float"
            style={{
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              opacity: 0.1,
              color: i % 2 === 0 ? '#a8c5ff' : '#e85a2b',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <FaPaw size={10} className="text-[#e85a2b]" />
            BẮT ĐẦU NGAY HÔM NAY
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Thú Cưng Xứng Đáng
            <br />
            <span className="hero-gradient-text-orange">Điều Tốt Nhất</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Hàng ngàn sản phẩm cao cấp đang chờ đón thú cưng của bạn. Đặt hàng ngay và nhận ưu đãi đặc biệt!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-white text-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #e85a2b, #f59e0b)',
                boxShadow: '0 12px 40px rgba(232,90,43,0.4)',
              }}
            >
              Mua Sắm Ngay
              <FiChevronRight size={16} />
            </Link>
            <Link
              to="/lien-he"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
