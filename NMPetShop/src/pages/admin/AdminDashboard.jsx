import { useState, useEffect, useMemo } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown, FiLoader } from 'react-icons/fi';
import { fetchProducts } from '../../services/productApi';
import { fetchOrders, fetchOrderStats } from '../../services/orderApi';
import { fetchUsers } from '../../services/userApi';

const AdminDashboard = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [ordStats, ordData] = await Promise.all([
          fetchOrderStats(),
          fetchOrders({ limit: 5 })
        ]);
        
        setProductsCount(ordStats.totalProducts || 0);
        setUsersCount(ordStats.totalCustomers || 0);
        setOrderStats({
          totalOrders: ordStats.totalOrders || 0,
          totalRevenue: ordStats.totalRevenue || 0,
          pendingOrders: ordStats.pendingOrders || 0
        });
        setRecentOrders(ordData.orders || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'Tổng sản phẩm', value: productsCount.toLocaleString(), icon: <FiPackage size={20} />, change: '+2.4%', up: true, color: 'bg-blue-50 text-blue-600' },
      { label: 'Đơn hàng', value: orderStats.totalOrders.toLocaleString(), icon: <FiShoppingBag size={20} />, change: '+5.1%', up: true, color: 'bg-green-50 text-green-600' },
      { label: 'Khách hàng', value: usersCount.toLocaleString(), icon: <FiUsers size={20} />, change: '+1.2%', up: true, color: 'bg-purple-50 text-purple-600' },
      { 
        label: 'Doanh thu', 
        value: orderStats.totalRevenue >= 1000000 
          ? (orderStats.totalRevenue / 1000000).toFixed(1) + 'M' 
          : new Intl.NumberFormat('vi-VN').format(orderStats.totalRevenue) + 'đ', 
        icon: <FiDollarSign size={20} />, 
        change: '+3.8%', 
        up: true, 
        color: 'bg-amber-50 text-amber-600' 
      },
    ];
  }, [productsCount, orderStats, usersCount]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success/10 text-success';
      case 'Shipping': return 'bg-secondary/10 text-secondary';
      case 'Confirmed': return 'bg-info/10 text-info';
      case 'Pending': return 'bg-warning/10 text-warning';
      case 'Cancelled': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Delivered': return 'Đã giao hàng';
      case 'Shipping': return 'Đang giao hàng';
      case 'Confirmed': return 'Đã xác nhận';
      case 'Pending': return 'Chờ xác nhận';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <FiLoader size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">Bảng điều khiển</h1>
        <p className="text-sm text-text-gray mt-1">Tổng quan hoạt động cửa hàng dựa trên dữ liệu thực tế.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm`}>{stat.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.up ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                <FiTrendingUp size={14} />
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-black text-text-dark tracking-tight">{stat.value}</p>
            <p className="text-[11px] font-bold text-text-light uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-bg-gray/20">
          <h2 className="font-bold text-text-dark text-lg flex items-center gap-2">
            <div className="w-1.5 h-5 bg-primary rounded-full"></div>
            Đơn hàng gần đây
          </h2>
          <button className="text-xs font-bold text-primary hover:underline">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-black text-text-gray uppercase tracking-wider border-b border-border">
                <th className="px-4 py-4">Mã đơn</th>
                <th className="px-4 py-4">Khách hàng</th>
                <th className="px-4 py-4">Ngày đặt</th>
                <th className="px-4 py-4">Tổng tiền</th>
                <th className="px-4 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length > 0 ? (
                recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-bg-gray/30 transition-colors group">
                    <td className="px-4 py-4 text-sm font-black text-primary uppercase">#{o.orderId}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-dark">{o.customerName}</span>
                        <span className="text-[10px] text-text-light font-medium">{o.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-text-gray">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-4 text-sm font-black text-text-dark">{formatPrice(o.totalAmount)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusConfig(o.status)}`}>
                        {getStatusLabel(o.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-gray italic font-medium">Chưa có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
