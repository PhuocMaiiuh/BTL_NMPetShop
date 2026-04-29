import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiTag } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/dang-nhap');
  };

  const menuItems = [
    { label: 'Tổng quan', icon: <FiGrid size={18} />, path: '/admin' },
    { label: 'Sản phẩm', icon: <FiPackage size={18} />, path: '/admin/san-pham' },
    { label: 'Đơn hàng', icon: <FiShoppingBag size={18} />, path: '/admin/don-hang' },
    { label: 'Khách hàng', icon: <FiUsers size={18} />, path: '/admin/khach-hang' },
    { label: 'Khuyến mãi', icon: <FiTag size={18} />, path: '/admin/khuyen-mai' },
    { label: 'Cài đặt', icon: <FiSettings size={18} />, path: '/admin/cai-dat' },
  ];

  return (
    <aside className="w-64 bg-admin-sidebar min-h-screen text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="bg-white p-1.5 rounded-lg shrink-0">
          <img src="/Logo.png" alt="NM Logo" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight">Quản trị NM</h2>
          <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">Hệ thống</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-all duration-200"
        >
          <FiLogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
