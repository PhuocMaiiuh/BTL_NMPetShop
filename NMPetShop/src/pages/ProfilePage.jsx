import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiExternalLink } from 'react-icons/fi';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    birthday: '15/08/1995',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    memberLevel: 'Thành viên Bạc',
  };

  const orders = [
    { id: '#NM-9876', date: '24/10/2023', total: 1250000, status: 'Đang giao', statusColor: 'bg-warning/10 text-warning' },
    { id: '#NM-9842', date: '15/10/2023', total: 850000, status: 'Hoàn thành', statusColor: 'bg-success/10 text-success' },
    { id: '#NM-9710', date: '02/10/2023', total: 2100000, status: 'Hoàn thành', statusColor: 'bg-success/10 text-success' },
  ];

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text-dark mb-8">Hồ sơ của bạn</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-start gap-6">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
          <div>
            <h2 className="text-xl font-bold text-text-dark">{user.name}</h2>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mt-1">{user.memberLevel}</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">Thông tin cá nhân</h3>
          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-medium">
            <FiEdit2 size={14} /> Chỉnh sửa
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div><p className="text-xs text-text-light mb-1">Họ và tên</p><p className="text-sm font-medium">{user.name}</p></div>
          <div><p className="text-xs text-text-light mb-1">Email</p><p className="text-sm font-medium">{user.email}</p></div>
          <div><p className="text-xs text-text-light mb-1">Số điện thoại</p><p className="text-sm font-medium">{user.phone}</p></div>
          <div><p className="text-xs text-text-light mb-1">Ngày sinh</p><p className="text-sm font-medium">{user.birthday}</p></div>
          <div className="md:col-span-2"><p className="text-xs text-text-light mb-1">Địa chỉ mặc định</p><p className="text-sm font-medium">{user.address}</p></div>
        </div>
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
                      <FiExternalLink size={12} /> Xem chi tiết
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
