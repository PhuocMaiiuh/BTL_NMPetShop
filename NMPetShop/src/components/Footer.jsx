import { Link } from 'react-router-dom';
import { FiSend, FiInstagram, FiPhone, FiMail, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaPaw } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070e1a 0%, #040a12 100%)' }}
    >
      {/* Top glow accents */}
      <div
        className="absolute top-0 left-1/4 w-96 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(26,60,94,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute top-0 right-1/4 w-64 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(232,90,43,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />

      {/* Floating paws */}
      {[
        { top: '15%', left: '3%', size: 18, op: 0.06 },
        { top: '60%', left: '8%', size: 12, op: 0.05 },
        { top: '25%', right: '4%', size: 20, op: 0.06 },
        { top: '75%', right: '6%', size: 14, op: 0.05 },
      ].map((p, i) => (
        <FaPaw
          key={i}
          size={p.size}
          className="absolute pointer-events-none animate-float"
          style={{ top: p.top, left: p.left, right: p.right, opacity: p.op, color: '#ffffff', animationDelay: `${i * 0.8}s` }}
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img src="/Logo.png" alt="NM Pet Shop" className="h-10 w-auto object-contain" />
              <div>
                <p className="text-lg font-black text-white leading-none">NM Pet Shop</p>
                <p className="text-xs text-white/40 mt-0.5">Thiên đường thú cưng</p>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Cửa hàng thú cưng uy tín hàng đầu Việt Nam. Chúng tôi cung cấp hàng nghìn sản phẩm
              chất lượng cao cho chó, mèo và các bạn thú cưng yêu quý của bạn.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: <FiPhone size={14} />, text: '0123 456 789', href: 'tel:0123456789' },
                { icon: <FiMail size={14} />, text: 'hello@nmpetshop.vn', href: 'mailto:hello@nmpetshop.vn' },
                { icon: <FiMapPin size={14} />, text: '123 Đường Thú Cưng, TP.HCM', href: '#' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-2.5 text-xs text-white/40 hover:text-white/70 transition-colors group"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-[#e85a2b]">{item.icon}</span>
                  </div>
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(#e85a2b, #f59e0b)' }} />
              Cửa hàng
            </h4>
            <ul className="space-y-3">
              {[
                { label: '🐕 Cho Chó', path: '/san-pham?category=cho' },
                { label: '🐱 Cho Mèo', path: '/san-pham?category=meo' },
                { label: '🎀 Phụ kiện', path: '/san-pham?category=phu-kien' },
                { label: '🎮 Đồ chơi', path: '/san-pham?category=do-choi' },
                { label: '💊 Sức khoẻ', path: '/san-pham?category=suc-khoe' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-white/45 hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(#3b82f6, #8b5cf6)' }} />
              Hỗ trợ
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Về chúng tôi', path: '/ve-chung-toi' },
                { label: 'Liên hệ', path: '/lien-he' },
                { label: 'Chính sách', path: '/chinh-sach' },
                { label: 'Hướng dẫn thanh toán', path: '/huong-dan-thanh-toan' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-white/45 hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(#22c55e, #16a34a)' }} />
              Nhận ưu đãi mỗi tuần
            </h4>
            <p className="text-sm text-white/45 mb-5 leading-relaxed">
              Đăng ký để nhận thông tin khuyến mãi, sản phẩm mới và mẹo chăm sóc thú cưng!
            </p>

            {subscribed ? (
              <div
                className="rounded-2xl px-5 py-4 text-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <p className="text-emerald-400 font-semibold text-sm">🎉 Cảm ơn bạn đã đăng ký!</p>
                <p className="text-white/40 text-xs mt-1">Kiểm tra email để nhận ưu đãi.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div
                  className="flex gap-2 p-1.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #e85a2b, #f59e0b)',
                      boxShadow: '0 4px 15px rgba(232,90,43,0.3)',
                    }}
                  >
                    <FiSend size={14} />
                    Đăng ký
                  </button>
                </div>
              </form>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <p className="text-xs text-white/30 font-medium">Theo dõi:</p>
              {[
                { Icon: FaFacebook, href: '#', color: '#1877f2', label: 'Facebook' },
                { Icon: FaTiktok, href: '#', color: '#ffffff', label: 'TikTok' },
                { Icon: FaYoutube, href: '#', color: '#ff0000', label: 'YouTube' },
                { Icon: FiInstagram, href: '#', color: '#e1306c', label: 'Instagram' },
              ].map(({ Icon, href, color, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = `${color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-6"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © 2025 NM Pet Shop. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-white/25 flex items-center gap-1.5">
            Làm với <FiHeart size={11} className="text-[#e85a2b]" /> bởi đội ngũ NM Pet Shop
          </p>
          <div className="flex items-center gap-4">
            {['Chính sách bảo mật', 'Điều khoản', 'Cookie'].map((text) => (
              <Link
                key={text}
                to="/chinh-sach"
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
