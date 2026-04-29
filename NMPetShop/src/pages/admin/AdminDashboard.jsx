import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const stats = [
  { label: 'Tổng sản phẩm', value: '1,245', icon: <FiPackage size={20} />, change: '+12%', up: true, color: 'bg-blue-50 text-blue-600' },
  { label: 'Đơn hàng', value: '356', icon: <FiShoppingBag size={20} />, change: '+8%', up: true, color: 'bg-green-50 text-green-600' },
  { label: 'Khách hàng', value: '2,150', icon: <FiUsers size={20} />, change: '+5%', up: true, color: 'bg-purple-50 text-purple-600' },
  { label: 'Doanh thu', value: '45.2M', icon: <FiDollarSign size={20} />, change: '-2%', up: false, color: 'bg-amber-50 text-amber-600' },
];

const recentOrders = [
  { id: '#NM-9876', customer: 'Nguyễn Văn A', date: '24/10/2023', total: '1,250,000đ', status: 'Đang giao', statusColor: 'bg-warning/10 text-warning' },
  { id: '#NM-9875', customer: 'Trần Thị B', date: '24/10/2023', total: '850,000đ', status: 'Hoàn thành', statusColor: 'bg-success/10 text-success' },
  { id: '#NM-9874', customer: 'Lê Văn C', date: '23/10/2023', total: '2,100,000đ', status: 'Chờ xử lý', statusColor: 'bg-info/10 text-info' },
  { id: '#NM-9873', customer: 'Phạm Thị D', date: '23/10/2023', total: '450,000đ', status: 'Đã hủy', statusColor: 'bg-danger/10 text-danger' },
];

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">Bảng điều khiển</h1>
        <p className="text-sm text-text-gray mt-1">Tổng quan hoạt động cửa hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-success' : 'text-danger'}`}>
                {stat.up ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
            <p className="text-xs text-text-gray mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text-dark mb-4">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-text-gray uppercase border-b border-border">
                <th className="pb-3 pr-4">Mã đơn</th>
                <th className="pb-3 pr-4">Khách hàng</th>
                <th className="pb-3 pr-4">Ngày</th>
                <th className="pb-3 pr-4">Tổng</th>
                <th className="pb-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-bg-gray/50">
                  <td className="py-3 pr-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="py-3 pr-4 text-sm">{o.customer}</td>
                  <td className="py-3 pr-4 text-sm text-text-gray">{o.date}</td>
                  <td className="py-3 pr-4 text-sm font-semibold">{o.total}</td>
                  <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${o.statusColor}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
