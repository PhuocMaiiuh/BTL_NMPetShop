import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiExternalLink, FiCamera, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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

  const orders = [
    { id: '#NM-9876', date: '24/10/2023', total: 1250000, status: 'Đang giao', statusColor: 'bg-warning/10 text-warning' },
    { id: '#NM-9842', date: '15/10/2023', total: 850000, status: 'Hoàn thành', statusColor: 'bg-success/10 text-success' },
    { id: '#NM-9710', date: '02/10/2023', total: 2100000, status: 'Hoàn thành', statusColor: 'bg-success/10 text-success' },
  ];

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
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-text-dark mb-6">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-text-gray uppercase border-b border-border">
                <th className="pb-3 pr-4">Mã đơn</th>
                <th className="pb-3 pr-4">Ngày</th>
                <th className="pb-3 pr-4">Tổng tiền</th>
                <th className="pb-3 pr-4">Trạng thái</th>
                <th className="pb-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-bg-gray/50 transition-colors">
                  <td className="py-4 pr-4 text-sm font-medium text-primary">{order.id}</td>
                  <td className="py-4 pr-4 text-sm text-text-gray">{order.date}</td>
                  <td className="py-4 pr-4 text-sm font-semibold text-secondary">{formatPrice(order.total)}</td>
                  <td className="py-4 pr-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>{order.status}</span></td>
                  <td className="py-4">
                    <Link to={`/don-hang/${order.id.replace('#', '')}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                      <FiExternalLink size={12}/> Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
