import { Link } from 'react-router-dom';
import { FiSend, FiTwitter, FiInstagram } from 'react-icons/fi';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-3">NM PET SHOP</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Cửa hàng NM Pet Shop. Đồng hành cùng thú cưng của bạn.
            </p>
          </div>

          {/* Cửa hàng */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Cửa hàng</h4>
            <ul className="space-y-2">
              <li><Link to="/san-pham?category=cho" className="text-sm text-gray-300 hover:text-white transition-colors">Cho Chó</Link></li>
              <li><Link to="/san-pham?category=meo" className="text-sm text-gray-300 hover:text-white transition-colors">Cho Mèo</Link></li>
              <li><Link to="/san-pham?category=phu-kien" className="text-sm text-gray-300 hover:text-white transition-colors">Phụ kiện</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><Link to="/ve-chung-toi" className="text-sm text-gray-300 hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/lien-he" className="text-sm text-gray-300 hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/chinh-sach" className="text-sm text-gray-300 hover:text-white transition-colors">Chính sách</Link></li>
              <li><Link to="/huong-dan-thanh-toan" className="text-sm text-gray-300 hover:text-white transition-colors">Thanh toán</Link></li>
            </ul>
          </div>

          {/* Đăng ký nhận tin */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Đăng ký nhận tin</h4>
            <p className="text-sm text-gray-300 mb-4">Nhận thông tin ưu đãi mới nhất.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-l-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
              />
              <button className="px-4 py-2.5 bg-secondary hover:bg-secondary-light rounded-r-lg transition-colors duration-200">
                <FiSend className="text-white" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2024 NM Pet Shop. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FiInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
