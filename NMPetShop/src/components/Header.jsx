import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiSearch, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
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

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Sản phẩm cho Chó', path: '/san-pham?category=cho' },
    { label: 'Sản phẩm cho Mèo', path: '/san-pham?category=meo' },
    {
      label: 'Phụ kiện',
      path: '/san-pham?category=phu-kien',
      submenu: [
        { label: 'Phụ kiện', path: '/san-pham?category=phu-kien' },
        { label: 'Đồ chơi', path: '/san-pham?category=do-choi' }
      ]
    },
    { label: 'Chăm sóc sức khỏe', path: '/san-pham?category=suc-khoe' },
  ];

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Pet Shop Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-primary">Pet Shop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path.split('?')[0] &&
                (location.search === '' || location.search === '?' + link.path.split('?')[1]);

              return (
                <div key={link.label} className="relative group py-5 -my-5">
                  {link.submenu ? (
                    <span
                      className={`relative cursor-pointer text-sm font-medium transition-colors duration-200 py-1 flex items-center gap-1 ${isActive ? 'text-primary' : 'text-text-gray hover:text-primary'
                        }`}
                    >
                      {link.label}
                      <FiChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                    </span>
                  ) : (
                    <Link
                      to={link.path}
                      className={`relative text-sm font-medium transition-colors duration-200 py-1 flex items-center gap-1 ${isActive ? 'text-primary' : 'text-text-gray hover:text-primary'
                        }`}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {link.submenu && (
                    <div className="absolute top-full left-0 mt-0 w-28 bg-white rounded-xl shadow-lg border border-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 translate-y-2 group-hover:translate-y-0">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-text-gray hover:bg-bg-gray hover:text-primary transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block" ref={searchRef}>
              <div className="flex items-center bg-bg-gray rounded-full px-4 py-2">
                <FiSearch className="text-text-gray mr-2" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="bg-transparent text-sm w-48 outline-none"
                />
              </div>

              {/* Live Search Dropdown */}
              {showSearchResults && searchQuery.trim() !== '' && (
                <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-border py-2 z-50 max-h-[400px] overflow-y-auto right-0">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <Link
                        key={product.id}
                        to={`/san-pham/${product.id}`}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-bg-gray transition-colors border-b border-border last:border-0"
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-dark truncate">{product.name}</p>
                          <p className="text-xs text-primary font-semibold">{product.price.toLocaleString('vi-VN')}đ</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-text-gray px-4 py-3 text-center">Không tìm thấy sản phẩm</p>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/gio-hang"
              className="p-2 text-text-gray hover:text-primary transition-colors duration-200 relative hover:bg-bg-gray rounded-full"
            >
              <FiShoppingCart size={20} />
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-bg-gray transition-colors ml-2"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-primary/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <FiChevronDown size={14} className={`text-text-gray transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-text-dark truncate">{user.name}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${isAdmin ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                        }`}>
                        {isAdmin ? 'Admin' : (user.customerCode || 'KH26001')}
                      </span>
                    </div>

                    <Link
                      to="/ho-so"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-gray hover:bg-bg-gray hover:text-text-dark transition-colors"
                    >
                      <FiUser size={16} /> Hồ sơ của tôi
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-gray hover:bg-bg-gray hover:text-text-dark transition-colors"
                      >
                        <FiSettings size={16} /> Quản trị Admin
                      </Link>
                    )}

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                      >
                        <FiLogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="p-2 text-text-gray hover:text-primary transition-colors duration-200 hover:bg-bg-gray rounded-full ml-2"
              >
                <FiUser size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
