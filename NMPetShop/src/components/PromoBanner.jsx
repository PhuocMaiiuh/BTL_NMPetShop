import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts } from '../services/productApi';

const combos = [
  {
    id: 1,
    title: 'Combo Răng Miệng',
    desc: 'Bàn chải & kem đánh răng chuyên dụng giúp hơi thở thơm mát.',
    image: '/combos/dental.png',
    gradient: 'from-emerald-600 to-teal-400',
    glow: 'rgba(16,185,129,0.35)',
    badge: 'SALE 20%',
    badgeColor: 'bg-emerald-400',
    path: '/san-pham?search=thuốc',
  },
  {
    id: 2,
    title: 'Combo Ăn Ngon',
    desc: 'Tặng ngay bát ăn cao cấp khi mua túi hạt dinh dưỡng.',
    image: '/combos/food.png',
    gradient: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.35)',
    badge: 'HOT DEAL',
    badgeColor: 'bg-orange-400',
    path: '/san-pham?category=cho',
  },
  {
    id: 3,
    title: 'Combo Spa Tẩy Tế',
    desc: 'Sữa tắm thảo dược & lược chải lông giúp da lông mượt mà.',
    image: '/combos/spa.png',
    gradient: 'from-blue-600 to-cyan-400',
    glow: 'rgba(59,130,246,0.35)',
    badge: 'MỚI',
    badgeColor: 'bg-blue-400',
    path: '/san-pham?search=tắm',
  },
  {
    id: 4,
    title: 'Combo Vui Chơi',
    desc: 'Mua 3 tặng 1 các loại đồ chơi dây thừng & bóng bền bỉ.',
    image: '/combos/toys.png',
    gradient: 'from-purple-600 to-pink-400',
    glow: 'rgba(168,85,247,0.35)',
    badge: 'TẶNG 1',
    badgeColor: 'bg-purple-400',
    path: '/san-pham?search=đồ chơi',
  },
];

const PromoBanner = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loadingCombo, setLoadingCombo] = useState(null);

  const handleBuyCombo = async (e, combo) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }
    
    setLoadingCombo(combo.id);
    try {
      let itemsToAdd = [];
      if (combo.id === 1) {
        const res = await fetchProducts({ search: 'răng', limit: 2 });
        itemsToAdd = res.products;
      } else if (combo.id === 2) {
        const res1 = await fetchProducts({ search: 'hạt', limit: 1 });
        const res2 = await fetchProducts({ search: 'bát', limit: 1 });
        itemsToAdd = [...res1.products, ...res2.products];
      } else if (combo.id === 3) {
        const res1 = await fetchProducts({ search: 'tắm', limit: 1 });
        const res2 = await fetchProducts({ search: 'lược', limit: 1 });
        itemsToAdd = [...res1.products, ...res2.products];
      } else if (combo.id === 4) {
        const res = await fetchProducts({ category: 'do-choi', limit: 4 });
        itemsToAdd = res.products;
      }

      itemsToAdd.forEach(item => {
        if (item) addToCart(item, 1);
      });
      navigate('/gio-hang');
    } catch (err) {
      console.error('Failed to create combo', err);
    } finally {
      setLoadingCombo(null);
    }
  };

  return (
    <section className="py-16 relative" style={{ background: 'transparent' }}>
      <FaPaw className="absolute top-[30%] left-[6%] text-[#a8c5ff]/10 animate-float pointer-events-none" size={24} style={{ animationDelay: '0.8s', animationDuration: '4.8s' }} />
      <FaPaw className="absolute bottom-[25%] right-[5%] text-[#e85a2b]/10 animate-float pointer-events-none" size={28} style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            🔥 ƯU ĐÃI ĐẶC BIỆT
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Top 4 Combo{' '}
            <span className="hero-gradient-text-orange">
              Siêu Hời
            </span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Tiết kiệm hơn khi mua theo combo — chỉ có tại NM Pet Shop!
          </p>
        </div>

        {/* Combo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${combo.gradient} shimmer-card promo-card-glow transition-all duration-400 cursor-pointer`}
              style={{ boxShadow: `0 8px 32px ${combo.glow}` }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 24px 60px ${combo.glow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${combo.glow}`;
              }}
            >
              {/* Badge */}
              <div className={`absolute top-4 right-4 z-10 ${combo.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full shadow-lg`}>
                {combo.badge}
              </div>

              {/* Content */}
              <div className="p-6 pb-4">
                <h3 className="text-lg font-black text-white mb-2 leading-tight drop-shadow">{combo.title}</h3>
                <p className="text-white/75 text-xs leading-relaxed mb-5">{combo.desc}</p>
                <button
                  onClick={(e) => handleBuyCombo(e, combo)}
                  disabled={loadingCombo === combo.id}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white group/btn disabled:opacity-50"
                >
                  {loadingCombo === combo.id ? (
                    <>
                      Đang tạo...
                      <FiLoader size={12} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Mua ngay
                      <FiArrowRight
                        size={12}
                        className="transition-transform duration-200 group-hover/btn:translate-x-1.5"
                      />
                    </>
                  )}
                </button>
              </div>

              {/* Image */}
              <div className="h-32 relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                />
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-contain p-3 group-hover:scale-115 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Bottom shine effect */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
