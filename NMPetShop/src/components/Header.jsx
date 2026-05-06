import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiSearch, FiLogOut, FiSettings, FiChevronDown, FiX, FiMenu } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Hạt khô cao cấp cho chó trưởng thành', price: 110000, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop' },
  { id: 2, name: 'Thức ăn ướt cho mèo vị cá ngừ', price: 320000, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop' },
  { id: 3, name: 'Pate cho chó con vị gà', price: 382500, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop' },
  { id: 4, name: 'Thức ăn hạt tự nhiên', price: 180000, image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop' },
  { id: 5, name: 'Vòng cổ da cao cấp cho chó', price: 250000, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop' },
  { id: 6, name: 'Đồ chơi bóng cao su', price: 85000, image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop' },
  { id: 7, name: 'Bát ăn inox chống lật', price: 120000, image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=400&fit=crop' },
  { id: 8, name: 'Sữa tắm thảo dược cho mèo', price: 195000, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop' },
];

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Detect scroll for header style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { label: 'Cho Chó', path: '/san-pham?category=cho', emoji: '🐕' },
    { label: 'Cho Mèo', path: '/san-pham?category=meo', emoji: '🐱' },
    {
      label: 'Phụ kiện',
      path: '/san-pham?category=phu-kien',
      emoji: '🎀',
      submenu: [
        { label: 'Phụ kiện', path: '/san-pham?category=phu-kien' },
        { label: 'Đồ chơi', path: '/san-pham?category=do-choi' },
      ],
    },
    { label: 'Sức khoẻ', path: '/san-pham?category=suc-khoe', emoji: '💊' },
  ];

  const handleLogout = () => { logout(); setShowDropdown(false); navigate('/'); };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    if (e.key === 'Escape') { setShowSearchResults(false); setSearchQuery(''); }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || !isHomePage
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(7,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled || !isHomePage
          ? '1px solid rgba(229,231,235,0.8)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/Logo.png"
                alt="NM Pet Shop"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-base font-black tracking-tight transition-colors duration-300"
                style={{ color: scrolled || !isHomePage ? '#1a3c5e' : '#ffffff' }}
              >
                NM Pet Shop
              </span>
              <span
                className="text-[10px] font-medium transition-colors duration-300"
                style={{ color: scrolled || !isHomePage ? '#e85a2b' : 'rgba(232,90,43,0.9)' }}
              >
                Đồng hành cùng thú cưng 🐾
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isDropdown = !!link.submenu;
              const isActive = !isDropdown &&
                location.pathname === link.path.split('?')[0] &&
                (location.search === '' || location.search === '?' + link.path.split('?')[1]);

              const textColor = scrolled || !isHomePage ? '#374151' : 'rgba(255,255,255,0.8)';
              const activeColor = scrolled || !isHomePage ? '#1a3c5e' : '#ffffff';
              const hoverBg = scrolled || !isHomePage ? 'rgba(26,60,94,0.06)' : 'rgba(255,255,255,0.1)';

              return (
                <div key={link.label} className="relative group">
                  {link.submenu ? (
                    <span
                      className="cursor-pointer text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200"
                      style={{ color: textColor }}
                      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = activeColor; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textColor; }}
                    >
                      <span>{link.emoji}</span>
                      {link.label}
                      <FiChevronDown size={13} className="transition-transform group-hover:rotate-180 opacity-60" />
                    </span>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200"
                      style={{
                        color: isActive ? activeColor : textColor,
                        background: isActive ? hoverBg : 'transparent',
                        fontWeight: isActive ? '700' : '600',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = activeColor; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textColor; } }}
                    >
                      <span>{link.emoji}</span>
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.submenu && (
                    <div
                      className="absolute top-full left-0 mt-2 min-w-[160px] rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50"
                      style={{
                        background: 'rgba(255,255,255,0.98)',
                        border: '1px solid rgba(229,231,235,0.8)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-[#1a3c5e] hover:bg-[rgba(26,60,94,0.05)] transition-colors font-medium rounded-lg mx-1"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300"
                style={{
                  background: scrolled || !isHomePage ? 'rgba(243,244,246,1)' : 'rgba(255,255,255,0.1)',
                  border: scrolled || !isHomePage ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <FiSearch
                  size={15}
                  style={{ color: scrolled || !isHomePage ? '#6b7280' : 'rgba(255,255,255,0.6)' }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-transparent text-sm w-36 outline-none placeholder:text-current transition-all focus:w-48"
                  style={{ color: scrolled || !isHomePage ? '#374151' : 'rgba(255,255,255,0.9)' }}
                  id="header-search-input"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}>
                    <FiX size={13} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search dropdown */}
              {showSearchResults && debouncedSearch.trim() !== '' && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 rounded-2xl py-2 z-50 max-h-80 overflow-y-auto"
                  style={{
                    background: 'rgba(255,255,255,0.98)',
                    border: '1px solid rgba(229,231,235,0.8)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {filteredProducts.length > 0 ? (
                    <>
                      <p className="text-xs text-gray-400 px-4 py-1 font-medium uppercase tracking-wide">Kết quả</p>
                      {filteredProducts.map(product => (
                        <Link
                          key={product.id}
                          to={`/san-pham/${product.id}`}
                          onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-[#e85a2b] font-bold">{product.price.toLocaleString('vi-VN')}đ</p>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={() => { navigate(`/san-pham?search=${encodeURIComponent(debouncedSearch)}`); setShowSearchResults(false); setSearchQuery(''); }}
                        className="w-full text-center text-xs text-[#1a3c5e] hover:bg-gray-50 py-2.5 font-semibold transition-colors border-t border-gray-100 mt-1"
                      >
                        Xem tất cả kết quả →
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 px-4 py-4 text-center">Không tìm thấy sản phẩm</p>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/gio-hang"
              className="relative p-2.5 rounded-xl transition-all duration-200"
              style={{
                color: scrolled || !isHomePage ? '#374151' : 'rgba(255,255,255,0.85)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = scrolled || !isHomePage ? 'rgba(26,60,94,0.06)' : 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = scrolled || !isHomePage ? '#1a3c5e' : '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = scrolled || !isHomePage ? '#374151' : 'rgba(255,255,255,0.85)';
              }}
            >
              <FiShoppingCart size={20} />
              {isAuthenticated && cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #e85a2b, #f59e0b)', fontSize: '10px' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-full transition-all duration-200"
                  style={{
                    border: scrolled || !isHomePage ? '2px solid rgba(26,60,94,0.15)' : '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, #1a3c5e, #e85a2b)' }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <FiChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    style={{ color: scrolled || !isHomePage ? '#6b7280' : 'rgba(255,255,255,0.6)' }}
                  />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 top-full mt-2 w-60 rounded-2xl py-2 z-50"
                    style={{
                      background: 'rgba(255,255,255,0.98)',
                      border: '1px solid rgba(229,231,235,0.8)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base text-white"
                          style={{ background: 'linear-gradient(135deg, #1a3c5e, #e85a2b)' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(26,60,94,0.08)',
                              color: isAdmin ? '#dc2626' : '#1a3c5e',
                            }}
                          >
                            {isAdmin ? '⚡ Admin' : `🐾 ${user.customerCode || 'Thành viên'}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/ho-so"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                    >
                      <FiUser size={15} /> Hồ sơ của tôi
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        <FiSettings size={15} /> Quản trị Admin
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={15} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #e85a2b, #f59e0b)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(232,90,43,0.35)',
                }}
              >
                <FiUser size={14} />
                Đăng nhập
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl transition-all"
              style={{ color: scrolled || !isHomePage ? '#374151' : 'rgba(255,255,255,0.9)' }}
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderColor: 'rgba(229,231,235,0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#1a3c5e] transition-colors"
              >
                <span className="text-lg">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/dang-nhap"
                className="flex items-center justify-center gap-2 mt-3 w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #e85a2b, #f59e0b)' }}
              >
                <FiUser size={15} /> Đăng nhập / Đăng ký
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
