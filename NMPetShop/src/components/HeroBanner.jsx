import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdPets } from 'react-icons/md';
import { GiBalloonDog, GiDogBowl } from 'react-icons/gi';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';

// Floating particles configuration
const PARTICLES = [
  { top: '12%', left: '8%', size: 28, delay: '0s', duration: '4s', opacity: 0.25 },
  { top: '70%', left: '5%', size: 18, delay: '1s', duration: '5s', opacity: 0.2 },
  { top: '30%', left: '90%', size: 22, delay: '0.5s', duration: '4.5s', opacity: 0.2 },
  { top: '80%', left: '85%', size: 32, delay: '2s', duration: '6s', opacity: 0.15 },
  { top: '55%', left: '15%', size: 14, delay: '1.5s', duration: '3.5s', opacity: 0.3 },
  { top: '18%', left: '75%', size: 20, delay: '0.8s', duration: '5.5s', opacity: 0.18 },
  { top: '90%', left: '45%', size: 16, delay: '3s', duration: '4s', opacity: 0.15 },
  { top: '6%', left: '55%', size: 12, delay: '2.5s', duration: '3s', opacity: 0.25 },
];

const HeroBanner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to trigger entrance animations
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero-dark-section min-h-[92vh] flex flex-col justify-center relative">
      {/* ──── Floating paw particles ──── */}
      {PARTICLES.map((p, i) => (
        <FaPaw
          key={i}
          size={p.size}
          className="absolute pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            color: i % 2 === 0 ? '#1a3c5e' : '#e85a2b',
            animation: `float ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            zIndex: 0,
          }}
        />
      ))}

      {/* ──── Glowing orbs ──── */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,60,94,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,90,43,0.18) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* ──── Main Content ──── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text Content ── */}
          <div>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                background: 'rgba(26,60,94,0.2)',
                borderColor: 'rgba(26,60,94,0.4)',
                color: '#a8c5ff',
                backdropFilter: 'blur(8px)',
              }}
            >
              <FaPaw size={12} className="text-[#e85a2b]" />
              <span>Cửa hàng thú cưng uy tín #1 Việt Nam</span>
              <FiStar size={12} />
            </div>

            {/* Headline */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] mb-6 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="block text-white">Thiên Đường</span>
              <span className="block hero-gradient-text-orange">Thú Cưng</span>
              <span className="block text-white text-4xl sm:text-5xl lg:text-6xl font-bold mt-1 opacity-80">
                Của Bé Yêu
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/60 leading-relaxed mb-10 max-w-lg transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Hàng nghìn sản phẩm chất lượng cao cho chó, mèo và các bạn thú cưng của bạn.
              Giao hàng nhanh — chăm sóc tận tâm.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                to="/san-pham"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #e85a2b, #f59e0b)',
                  boxShadow: '0 8px 32px rgba(232,90,43,0.4)',
                }}
              >
                Khám phá ngay
                <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/san-pham?filter=top-selling"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <MdPets size={16} />
                Sản phẩm hot 🔥
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className={`flex items-center gap-6 transition-all duration-700 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {['Freeship đơn 300k', 'Đổi trả 30 ngày', 'Hàng chính hãng'].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-white/50">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#e85a2b' }}
                  />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual Display ── */}
          <div
            className={`relative flex items-center justify-center transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            {/* Central glow ring */}
            <div
              className="absolute w-80 h-80 rounded-full animate-glow-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(26,60,94,0.3) 0%, transparent 70%)',
                border: '1px solid rgba(26,60,94,0.25)',
              }}
            />

            {/* Main showcase image */}
            <div
              className="relative w-full max-w-lg lg:max-w-2xl aspect-[4/3] lg:aspect-[16/10] rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 60px rgba(26,60,94,0.2)',
              }}
            >
              <img
                src="/Banner1.png"
                alt="NM Pet Shop"
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 50%, rgba(7,14,26,0.6) 100%)',
                }}
              />
            </div>

            {/* Floating product mini-cards */}
            <div
              className="absolute -top-4 -right-4 lg:-right-10 glass-card rounded-2xl px-4 py-3 animate-float hover:scale-110 hover:-translate-y-1 transition-transform cursor-pointer"
              style={{ animationDelay: '0.5s', zIndex: 2 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{ background: 'rgba(232,90,43,0.2)' }}
                >
                  🐕
                </div>
                <div>
                  <p className="text-xs text-white/80 font-semibold">Thức ăn cao cấp</p>
                  <p className="text-xs text-white/40">-20% hôm nay</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 lg:-left-10 glass-card rounded-2xl px-4 py-3 animate-float hover:scale-110 hover:-translate-y-1 transition-transform cursor-pointer"
              style={{ animationDelay: '1.2s', zIndex: 2 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{ background: 'rgba(26,60,94,0.3)' }}
                >
                  🐱
                </div>
                <div>
                  <p className="text-xs text-white/80 font-semibold">Phụ kiện cat</p>
                  <p className="text-xs" style={{ color: '#f59e0b' }}>Mới về hôm nay</p>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -right-6 lg:-right-12 glass-card rounded-2xl px-4 py-3 animate-float-slow hover:scale-110 transition-transform cursor-pointer"
              style={{ animationDelay: '0.8s', zIndex: 2 }}
            >
              <p className="text-xs text-white/50 mb-1">Đánh giá</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm font-bold text-white mt-0.5">4.9 / 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to dark */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, #070e1a)',
        }}
      />
    </section>
  );
};

export default HeroBanner;
