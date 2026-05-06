import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiExternalLink, FiCamera, FiSave, FiX, FiAlertCircle, FiLoader, FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchUserOrders } from '../services/orderApi';

const EditField = ({ name, label, placeholder, value, onChange, error }) => (
  <div>
    <p className="text-xs text-text-light mb-1">{label}</p>
    <input
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-border focus:border-primary'}`}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <FiAlertCircle size={11}/>{error}
      </p>
    )}
  </div>
);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    if (user?._id) {
      setLoadingOrders(true);
      fetchUserOrders(user._id)
        .then(data => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingOrders(false);
        });
    }
  }, [user?._id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Pending':   return { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700' };
      case 'Confirmed': return { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' };
      case 'Shipping':  return { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-700' };
      case 'Delivered': return { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700' };
      case 'Cancelled': return { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700' };
      default:          return { label: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Chỉ chấp nhận file ảnh (JPG, PNG, GIF...)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Kích thước ảnh không được vượt quá 5MB', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    updateUser({ avatar: url });
    addToast('Cập nhật ảnh đại diện thành công!', 'success');
  };

  const startEditing = () => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthday: user.birthday || '',
      address: user.address || '',
    });
    setFieldErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
    setFieldErrors({});
  };

  const validateEdit = (data) => {
    const e = {};
    if (!data.name.trim() || data.name.trim().length < 2) e.name = 'Họ tên phải có ít nhất 2 ký tự';
    else if (/\d/.test(data.name)) e.name = 'Họ tên không được chứa số';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Email không đúng định dạng';
    if (data.phone && !/^0\d{9}$/.test(data.phone.trim())) e.phone = 'SĐT phải có 10 chữ số và bắt đầu bằng 0';
    if (data.birthday && !/^\d{2}\/\d{2}\/\d{4}$/.test(data.birthday.trim())) e.birthday = 'Định dạng: dd/mm/yyyy';
    if (data.address && data.address.trim().length > 0 && data.address.trim().length < 5) e.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    return e;
  };

  const handleSave = () => {
    const errs = validateEdit(editData);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    updateUser(editData);
    setIsEditing(false);
    setEditData({});
    setFieldErrors({});
    addToast('Cập nhật thông tin thành công!', 'success');
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: '' });
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text-dark mb-8">Hồ sơ của bạn</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="relative group shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 bg-white"/>
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold border-4 border-primary/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity overflow-hidden">
              <FiCamera size={20}/>
              <span className="text-[10px] mt-1 font-medium">Thay ảnh</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange}/>
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-dark">{user?.name}</h2>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mt-1">{user?.memberLevel || 'Thành viên'}</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">Thông tin cá nhân</h3>
          {!isEditing ? (
            <button onClick={startEditing} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-medium transition-colors">
              <FiEdit2 size={14}/> Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1.5 text-sm text-white bg-primary hover:bg-primary-light px-3 py-1.5 rounded-lg font-medium transition-colors">
                <FiSave size={14}/> Lưu
              </button>
              <button onClick={cancelEditing} className="flex items-center gap-1.5 text-sm text-text-gray hover:text-text-dark border border-border px-3 py-1.5 rounded-lg font-medium transition-colors">
                <FiX size={14}/> Hủy
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div><p className="text-xs text-text-light mb-1">Họ và tên</p><p className="text-sm font-medium">{user?.name}</p></div>
            <div><p className="text-xs text-text-light mb-1">Email</p><p className="text-sm font-medium">{user?.email}</p></div>
            <div><p className="text-xs text-text-light mb-1">Số điện thoại</p><p className="text-sm font-medium">{user?.phone || '—'}</p></div>
            <div><p className="text-xs text-text-light mb-1">Ngày sinh</p><p className="text-sm font-medium">{user?.birthday || '—'}</p></div>
            <div className="md:col-span-2"><p className="text-xs text-text-light mb-1">Địa chỉ mặc định</p><p className="text-sm font-medium">{user?.address || '—'}</p></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            <EditField name="name" label="Họ và tên *" placeholder="Nguyễn Văn A" value={editData.name} onChange={handleFieldChange} error={fieldErrors.name}/>
            <EditField name="email" label="Email *" placeholder="email@example.com" value={editData.email} onChange={handleFieldChange} error={fieldErrors.email}/>
            <EditField name="phone" label="Số điện thoại" placeholder="0901234567" value={editData.phone} onChange={handleFieldChange} error={fieldErrors.phone}/>
            <EditField name="birthday" label="Ngày sinh" placeholder="dd/mm/yyyy" value={editData.birthday} onChange={handleFieldChange} error={fieldErrors.birthday}/>
            <div className="md:col-span-2">
              <p className="text-xs text-text-light mb-1">Địa chỉ mặc định</p>
              <input
                name="address"
                value={editData.address || ''}
                onChange={handleFieldChange}
                placeholder="123 Đường Lê Lợi, Quận 1..."
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${fieldErrors.address ? 'border-red-400 bg-red-50' : 'border-border focus:border-primary'}`}
              />
              {fieldErrors.address && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle size={11}/>{fieldErrors.address}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-text-dark">Đơn hàng gần đây</h3>
          
          <div className="flex items-center gap-1.5 p-1 bg-bg-gray rounded-lg w-fit">
            <button
              onClick={() => { setSortOrder('newest'); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortOrder === 'newest' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            >
              <FiArrowDown size={12} /> Gần nhất
            </button>
            <button
              onClick={() => { setSortOrder('oldest'); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortOrder === 'oldest' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            >
              <FiArrowUp size={12} /> Xa nhất
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          {loadingOrders ? (
            <div className="py-16 text-center">
              <FiLoader size={28} className="animate-spin text-primary mx-auto mb-3" />
              <p className="text-xs text-text-gray font-bold uppercase tracking-widest">Đang tải lịch sử đơn hàng...</p>
            </div>
          ) : orders.length > 0 ? (
            (() => {
              const sorted = [...orders].sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
              });
              const totalPages = Math.ceil(sorted.length / ORDERS_PER_PAGE);
              const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
              const visibleOrders = sorted.slice(startIndex, startIndex + ORDERS_PER_PAGE);

              return (
                <>
                  <div className="min-h-[360px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[11px] font-black text-text-gray uppercase tracking-widest border-b border-border">
                          <th className="pb-3 pr-4">Mã đơn</th>
                          <th className="pb-3 pr-4">Ngày</th>
                          <th className="pb-3 pr-4">Tổng tiền</th>
                          <th className="pb-3 pr-4 text-center">Trạng thái</th>
                          <th className="pb-3 text-right">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleOrders.map((order) => {
                          const status = getStatusInfo(order.status);
                          return (
                            <tr key={order._id} className="group border-b border-border last:border-0 hover:bg-primary/[0.02] transition-colors h-[64px]">
                              <td className="py-4 pr-4 text-sm font-black text-primary uppercase tracking-tighter">{order.orderId}</td>
                              <td className="py-4 pr-4 text-sm text-text-gray font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                              <td className="py-4 pr-4 text-sm font-black text-secondary">{formatPrice(order.totalAmount)}</td>
                              <td className="py-4 pr-4 text-center">
                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <Link to={`/don-hang/${order.orderId}`} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-xl transition-all duration-300">
                                  <FiExternalLink size={12}/> Xem chi tiết
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Fill empty space to prevent layout jump */}
                        {visibleOrders.length < ORDERS_PER_PAGE && [...Array(ORDERS_PER_PAGE - visibleOrders.length)].map((_, i) => (
                          <tr key={`empty-${i}`} className="h-[64px] border-b border-border/30 last:border-0 opacity-0 pointer-events-none">
                            <td colSpan="5">&nbsp;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8 pt-8 border-t border-border/50">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-text-gray font-medium">
                          Hiển thị <span className="font-bold text-text-dark">{startIndex + 1}-{Math.min(startIndex + ORDERS_PER_PAGE, sorted.length)}</span> trên <span className="font-bold text-text-dark">{sorted.length}</span> đơn hàng
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text-gray transition-all"
                          >
                            <FiChevronLeft size={16} />
                          </button>
                          <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'hover:bg-primary/5 text-text-gray hover:text-primary'}`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text-gray transition-all"
                          >
                            <FiChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-bg-gray rounded-full flex items-center justify-center mx-auto mb-5">
                <FiExternalLink size={28} className="text-text-light opacity-40" />
              </div>
              <p className="text-sm text-text-gray font-bold italic">Bạn chưa có đơn hàng nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
