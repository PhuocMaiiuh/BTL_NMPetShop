import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiMapPin, FiMail, FiPhone, FiX, FiArrowRight, FiLoader, FiLock, FiUnlock, FiCalendar, FiClock, FiEye } from 'react-icons/fi';
import { fetchUsers, toggleUserStatus } from '../../services/userApi';
import { fetchUserOrders } from '../../services/orderApi';
import Pagination from '../../components/admin/Pagination';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const roleRef = useRef(null);

  const loadUsers = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 20
      };
      if (roleFilter !== 'All') params.role = roleFilter;
      if (search) params.search = search;
      
      const data = await fetchUsers(params);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
    setPage(1);
  }, [roleFilter, search]);

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) setShowRoleDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoadingOrders(true);
      fetchUserOrders(selectedUser._id)
        .then(data => {
          setUserOrders(data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error('Failed to fetch user orders:', err);
          setLoadingOrders(false);
        });
    } else {
      setUserOrders([]);
    }
  }, [selectedUser]);

  const handleToggleStatus = async (userId) => {
    try {
      const result = await toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u._id === userId ? result : u));
      if (selectedUser && selectedUser._id === userId) setSelectedUser(result);
      alert('Cập nhật trạng thái người dùng thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { updateOrderStatus } = await import('../../services/orderApi');
      await updateOrderStatus(orderId, newStatus);
      setUserOrders(prev => prev.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedSubOrder && selectedSubOrder.orderId === orderId) {
        setSelectedSubOrder({ ...selectedSubOrder, status: newStatus });
      }
      alert('Cập nhật trạng thái đơn hàng thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  return (
    <div className="pb-10">
      <div className="sticky top-[-2rem] z-20 bg-admin-bg -mx-8 px-8 pt-8 pb-6 mb-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Quản lý khách hàng</h1>
            <p className="text-sm text-text-gray mt-1">Xem thông tin chi tiết, hạng thành viên và lịch sử mua hàng của khách hàng.</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 h-12">
          <div className="flex-1 relative h-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full pl-10 pr-4 border border-border rounded-xl text-sm focus:outline-none focus:border-primary bg-white shadow-sm"
              placeholder="Tìm theo số điện thoại hoặc tên khách hàng..."
            />
          </div>

          <div className="relative h-full" ref={roleRef}>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center justify-between gap-2 px-4 h-full min-w-[180px] border rounded-xl text-sm font-medium transition-all ${roleFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FiFilter size={16} className="flex-shrink-0" />
                <span className="truncate">{roleFilter === 'All' ? 'Tất cả vai trò' : roleFilter === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
              </div>
              <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
                <div 
                  onClick={() => { setRoleFilter('All'); setShowRoleDropdown(false); }} 
                  className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-medium"
                >
                  Tất cả vai trò
                </div>
                <div onClick={() => { setRoleFilter('customer'); setShowRoleDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border ${roleFilter === 'customer' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Khách hàng</div>
                <div onClick={() => { setRoleFilter('admin'); setShowRoleDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${roleFilter === 'admin' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Quản trị viên</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-text-gray uppercase bg-bg-gray/50 border-b border-border">
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4 text-center">Đơn hàng</th>
              <th className="px-6 py-4 text-right">Tổng chi</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <FiLoader size={32} className="animate-spin text-primary inline-block mb-2" />
                  <p className="text-sm text-text-gray font-medium">Đang tải danh sách người dùng...</p>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr 
                  key={u._id} 
                  className="hover:bg-bg-gray/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {u.fullName.split(' ').pop().charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-dark">{u.fullName}</span>
                        <span className="text-xs text-text-gray">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-text-dark">{u.orderCount || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-primary">{formatPrice(u.totalSpent || 0)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${u.role === 'admin' ? 'text-danger bg-danger/10 border-danger/20' : 'text-primary bg-primary/10 border-primary/20'}`}>
                      {u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${u.status === 'active' ? 'text-success bg-success/10 border-success/20' : 'text-danger bg-danger/10 border-danger/20'}`}>
                      {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(u._id); }}
                        className={`p-2 rounded-lg transition-all ${u.status === 'active' ? 'text-danger hover:bg-danger/10' : 'text-success hover:bg-success/10'}`}
                        title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.status === 'active' ? <FiLock size={18} /> : <FiUnlock size={18} />}
                      </button>
                      <div className="p-2 text-text-light group-hover:text-primary group-hover:bg-primary/10 rounded-lg transition-all">
                        <FiArrowRight size={18} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-text-gray italic">Không tìm thấy người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(p) => setPage(p)} 
      />

      {/* Customer Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-text-dark">Hồ sơ người dùng</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-bg-gray rounded-full">
                <FiX size={24} className="text-text-gray" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-2 border-primary/20 shrink-0">
                  {selectedUser.fullName.split(' ').pop().charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black text-text-dark">{selectedUser.fullName}</h3>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${selectedUser.role === 'admin' ? 'text-danger bg-danger/10 border-danger/20' : 'text-primary bg-primary/10 border-primary/20'}`}>
                      {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${selectedUser.status === 'active' ? 'text-success bg-success/10 border-success/20' : 'text-danger bg-danger/10 border-danger/20'}`}>
                      {selectedUser.status === 'active' ? 'Đang hoạt động' : 'Tài khoản bị khóa'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiPhone size={16} /> {selectedUser.phone || 'Chưa cập nhật'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiMail size={16} /> {selectedUser.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray col-span-full">
                      <FiMapPin size={16} className="shrink-0" /> {selectedUser.address || 'Chưa cập nhật địa chỉ'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiCalendar size={16} /> Ngày tham gia: {formatDate(selectedUser.createdAt)}
                    </div>
                  </div>

                  {/* Order Stats */}
                  <div className="flex gap-6 pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-primary">{selectedUser.orderCount || 0}</span>
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Đơn hàng</span>
                    </div>
                    <div className="flex flex-col border-l border-border pl-6">
                      <span className="text-2xl font-black text-secondary">{formatPrice(selectedUser.totalSpent || 0)}</span>
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Tổng chi tiêu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    Lịch sử đơn hàng
                  </h3>
                  <span className="text-xs font-bold text-text-gray bg-bg-gray px-3 py-1 rounded-full uppercase tracking-wider">
                    {userOrders.length} đơn hàng
                  </span>
                </div>

                <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-black text-text-light uppercase tracking-widest bg-bg-gray/50 border-b border-border">
                        <th className="px-6 py-4">Mã đơn</th>
                        <th className="px-6 py-4 text-center">Ngày</th>
                        <th className="px-6 py-4 text-right">Tổng tiền</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loadingOrders ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center">
                            <FiLoader size={24} className="animate-spin text-primary inline-block mb-2" />
                            <p className="text-xs text-text-gray font-medium">Đang tải đơn hàng...</p>
                          </td>
                        </tr>
                      ) : userOrders.length > 0 ? (
                        userOrders.map((order) => (
                          <tr 
                            key={order._id} 
                            className="hover:bg-bg-gray/40 transition-all cursor-pointer group/row"
                            onClick={() => setSelectedSubOrder(order)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-primary group-hover/row:underline">{order.orderId}</span>
                                <FiEye size={12} className="text-primary opacity-0 group-hover/row:opacity-100 transition-opacity" />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-xs text-text-gray">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-black text-secondary">{formatPrice(order.totalAmount)}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                order.status === 'Delivered' ? 'text-success bg-success/5 border-success/10' :
                                order.status === 'Cancelled' ? 'text-danger bg-danger/5 border-danger/10' :
                                'text-warning bg-warning/5 border-warning/10'
                              }`}>
                                {order.status === 'Delivered' ? 'Hoàn thành' : 
                                 order.status === 'Cancelled' ? 'Đã hủy' : 
                                 order.status === 'Shipping' ? 'Đang giao' : 
                                 order.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-sm text-text-gray italic">Người dùng này chưa có đơn hàng nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleToggleStatus(selectedUser._id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${selectedUser.status === 'active' ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'}`}
                >
                  {selectedUser.status === 'active' ? <><FiLock /> Khóa tài khoản</> : <><FiUnlock /> Mở khóa tài khoản</>}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-bg-gray text-text-dark font-bold hover:bg-bg-gray/80 transition-all"
                  onClick={() => setSelectedUser(null)}
                >
                  Đóng hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Order Details */}
      {selectedSubOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-text-dark">Chi tiết đơn hàng {selectedSubOrder.orderId}</h3>
                <p className="text-xs text-text-gray mt-1">Đặt lúc: {new Date(selectedSubOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedSubOrder(null)} className="p-2 hover:bg-bg-gray rounded-full">
                <FiX size={24} className="text-text-gray" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-bg-gray/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Người nhận</p>
                  <p className="text-sm font-bold text-text-dark">{selectedSubOrder.customerName}</p>
                  <p className="text-sm text-text-gray">{selectedSubOrder.phone}</p>
                </div>
                <div className="p-4 bg-bg-gray/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedSubOrder.status === 'Delivered' ? 'text-success bg-success/10' :
                    selectedSubOrder.status === 'Cancelled' ? 'text-danger bg-danger/10' :
                    'text-warning bg-warning/10'
                  }`}>
                    {selectedSubOrder.status === 'Pending' ? 'Chờ xử lý' :
                     selectedSubOrder.status === 'Confirmed' ? 'Đã xác nhận' :
                     selectedSubOrder.status === 'Shipping' ? 'Đang giao' :
                     selectedSubOrder.status === 'Delivered' ? 'Hoàn thành' :
                     selectedSubOrder.status === 'Cancelled' ? 'Đã hủy' : selectedSubOrder.status}
                  </span>
                </div>
                <div className="sm:col-span-2 p-4 bg-bg-gray/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Địa chỉ giao hàng</p>
                  <p className="text-sm text-text-gray leading-relaxed">{selectedSubOrder.shippingAddress}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text-dark border-l-4 border-primary pl-3">Sản phẩm đã mua</h4>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-bg-gray/50 text-[10px] font-bold text-text-gray uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Sản phẩm</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedSubOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
                              <span className="text-xs font-medium text-text-dark line-clamp-1">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-bold text-text-gray">x{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-primary">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-4">
                  <div className="text-right">
                    <p className="text-xs text-text-light font-bold uppercase tracking-widest mb-1">Tổng thanh toán</p>
                    <p className="text-2xl font-black text-primary">{formatPrice(selectedSubOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-border bg-bg-gray/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-text-dark">Đổi trạng thái:</p>
                <select 
                  value={selectedSubOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedSubOrder.orderId, e.target.value)}
                  className="text-xs font-bold border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                >
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Confirmed">Xác nhận</option>
                  <option value="Shipping">Đang giao</option>
                  <option value="Delivered">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              <button onClick={() => setSelectedSubOrder(null)} className="px-8 py-2 bg-text-dark text-white text-sm font-bold rounded-xl">Đóng chi tiết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
