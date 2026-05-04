import { useState, useMemo, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiUser, FiShoppingBag, FiCalendar, FiMapPin, FiMail, FiPhone, FiX, FiCheck, FiClock, FiTruck, FiArrowRight } from 'react-icons/fi';

const membershipTiers = {
  'Đồng': { color: 'text-amber-700 bg-amber-500/10 border-amber-500/20' },
  'Bạc': { color: 'text-slate-500 bg-slate-400/10 border-slate-400/20' },
  'Vàng': { color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' },
  'Bạch kim': { color: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20' },
  'Kim cương': { color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
};

const defaultCustomers = [
  {
    id: 'KH-001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'vanya@example.com',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    tier: 'Kim cương',
    joinDate: '2023-01-15',
    totalSpent: 15450000,
    orderCount: 12,
    orders: [
      { id: 'NM-9876', date: '2023-10-24', total: 1930000, status: 'Hoàn thành' },
      { id: 'NM-9800', date: '2023-09-12', total: 2500000, status: 'Hoàn thành' },
      { id: 'NM-9750', date: '2023-08-05', total: 1200000, status: 'Hoàn thành' },
    ]
  },
  {
    id: 'KH-002',
    name: 'Trần Thị B',
    phone: '0912345678',
    email: 'thib@example.com',
    address: '456 Đường CMT8, Quận 3, TP. Hồ Chí Minh',
    tier: 'Vàng',
    joinDate: '2023-03-20',
    totalSpent: 4200000,
    orderCount: 5,
    orders: [
      { id: 'NM-9877', date: '2023-10-25', total: 380000, status: 'Đang giao' },
      { id: 'NM-9810', date: '2023-09-15', total: 1200000, status: 'Hoàn thành' },
    ]
  },
  {
    id: 'KH-003',
    name: 'Lê Văn C',
    phone: '0987654321',
    email: 'vanc@example.com',
    address: '789 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    tier: 'Bạc',
    joinDate: '2023-05-10',
    totalSpent: 1250000,
    orderCount: 3,
    orders: [
      { id: 'NM-9878', date: '2023-10-26', total: 330000, status: 'Đang xử lý' },
    ]
  },
  {
    id: 'KH-004',
    name: 'Phạm Văn D',
    phone: '0905556667',
    email: 'vand@example.com',
    address: '101 Đường Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh',
    tier: 'Đồng',
    joinDate: '2023-08-01',
    totalSpent: 880000,
    orderCount: 1,
    orders: [
      { id: 'NM-9879', date: '2023-10-26', total: 880000, status: 'Chờ xác nhận' },
    ]
  },
  {
    id: 'KH-005',
    name: 'Hoàng Thị E',
    phone: '0933445566',
    email: 'thie@example.com',
    address: '202 Đường Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
    tier: 'Vàng',
    joinDate: '2023-02-14',
    totalSpent: 3500000,
    orderCount: 4,
    orders: [
      { id: 'NM-9880', date: '2023-10-27', total: 480000, status: 'Đã hủy' },
    ]
  },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const statusConfig = {
  'Chờ xác nhận': { color: 'text-warning bg-warning/10', icon: <FiClock size={12} /> },
  'Đang xử lý': { color: 'text-info bg-info/10', icon: <FiShoppingBag size={12} /> },
  'Đang giao': { color: 'text-secondary bg-secondary/10', icon: <FiTruck size={12} /> },
  'Hoàn thành': { color: 'text-success bg-success/10', icon: <FiCheck size={12} /> },
  'Đã hủy': { color: 'text-danger bg-danger/10', icon: <FiX size={12} /> },
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState(defaultCustomers);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTierDropdown, setShowTierDropdown] = useState(false);

  const tierRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tierRef.current && !tierRef.current.contains(event.target)) setShowTierDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.phone.includes(search) || c.name.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [customers, search, tierFilter]);

  const handleShowOrder = (orderId) => {
    // In a real app, you would fetch order details from an API or shared state
    // For now, we'll just show a simplified order detail
    const orderDetails = {
        id: orderId,
        date: '24/10/2023',
        status: 'Hoàn thành',
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        address: '123 Đường Lê Lợi, TP. HCM',
        items: [
            { id: 1, name: 'Hạt Khô Cao Cấp Royal Canin', qty: 2, price: 850000, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=80&h=80&fit=crop' },
        ],
        subtotal: 1700000,
        shipping: 30000,
        discount: 0,
        total: 1730000
    };
    setSelectedOrder(orderDetails);
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Quản lý khách hàng</h1>
          <p className="text-sm text-text-gray mt-1">Xem thông tin chi tiết, hạng thành viên và lịch sử mua hàng của khách hàng.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary bg-white shadow-sm"
            placeholder="Tìm theo số điện thoại hoặc tên khách hàng..."
          />
        </div>

        <div className="relative h-full" ref={tierRef}>
          <button
            onClick={() => setShowTierDropdown(!showTierDropdown)}
            className={`flex items-center justify-between gap-2 px-4 py-2.5 h-full min-w-[180px] border rounded-xl text-sm font-medium transition-all ${tierFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiFilter size={16} className="flex-shrink-0" />
              <span className="truncate">{tierFilter === 'All' ? 'Tất cả hạng' : tierFilter}</span>
            </div>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showTierDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTierDropdown && (
            <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div 
                onClick={() => { setTierFilter('All'); setShowTierDropdown(false); }} 
                className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-medium"
              >
                Tất cả hạng
              </div>
              {Object.keys(membershipTiers).map(tier => (
                <div 
                  key={tier} 
                  onClick={() => { setTierFilter(tier); setShowTierDropdown(false); }} 
                  className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${tierFilter === tier ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}
                >
                  {tier}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-text-gray uppercase bg-bg-gray/50 border-b border-border">
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Hạng thành viên</th>
              <th className="px-6 py-4">Tổng chi tiêu</th>
              <th className="px-6 py-4 text-center">Đơn hàng</th>
              <th className="px-6 py-4">Ngày tham gia</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCustomers.map((c) => (
              <tr 
                key={c.id} 
                className="hover:bg-bg-gray/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedCustomer(c)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {c.name.split(' ').pop().charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-dark">{c.name}</span>
                      <span className="text-xs text-text-gray">{c.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${membershipTiers[c.tier]?.color}`}>
                    {c.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-primary">{formatPrice(c.totalSpent)}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium bg-bg-gray px-2.5 py-1 rounded-lg border border-border">{c.orderCount}</span>
                </td>
                <td className="px-6 py-4 text-sm text-text-gray">
                  {formatDate(c.joinDate)}
                </td>
                <td className="px-6 py-4">
                   <div className="flex justify-center">
                      <div className="p-2 text-text-light group-hover:text-primary group-hover:bg-primary/10 rounded-lg transition-all">
                        <FiArrowRight size={18} />
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-text-dark">Hồ sơ khách hàng</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-bg-gray rounded-full">
                <FiX size={24} className="text-text-gray" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-2 border-primary/20 shrink-0">
                  {selectedCustomer.name.split(' ').pop().charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black text-text-dark">{selectedCustomer.name}</h3>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${membershipTiers[selectedCustomer.tier]?.color}`}>
                      Hạng {selectedCustomer.tier}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiPhone size={16} /> {selectedCustomer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiMail size={16} /> {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray col-span-full">
                      <FiMapPin size={16} className="shrink-0" /> {selectedCustomer.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-gray">
                      <FiCalendar size={16} /> Tham gia: {formatDate(selectedCustomer.joinDate)}
                    </div>
                  </div>
                </div>
                <div className="bg-bg-gray/50 p-6 rounded-2xl border border-border min-w-[200px]">
                   <p className="text-[11px] text-text-gray uppercase font-bold tracking-widest mb-1">Tổng chi tiêu</p>
                   <p className="text-2xl font-black text-primary">{formatPrice(selectedCustomer.totalSpent)}</p>
                   <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-xs text-text-gray">Tổng đơn hàng:</span>
                      <span className="text-sm font-bold text-text-dark">{selectedCustomer.orderCount}</span>
                   </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-sm font-bold text-text-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiShoppingBag className="text-primary" /> Lịch sử mua hàng
                </h4>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-bg-gray/30 text-[11px] font-bold text-text-gray uppercase border-b border-border text-left">
                      <tr>
                        <th className="px-6 py-3">Mã đơn hàng</th>
                        <th className="px-6 py-3">Ngày đặt</th>
                        <th className="px-6 py-3">Tổng tiền</th>
                        <th className="px-6 py-3">Trạng thái</th>
                        <th className="px-6 py-3 text-right">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedCustomer.orders.map((o) => (
                        <tr 
                          key={o.id} 
                          className="hover:bg-bg-gray/50 transition-colors cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowOrder(o.id);
                          }}
                        >
                          <td className="px-6 py-4 font-bold text-sm text-text-dark">#{o.id}</td>
                          <td className="px-6 py-4 text-sm text-text-gray">{formatDate(o.date)}</td>
                          <td className="px-6 py-4 font-bold text-sm text-primary">{formatPrice(o.total)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConfig[o.status]?.color}`}>
                              {statusConfig[o.status]?.icon}
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <FiArrowRight className="inline-block text-text-light group-hover:text-primary transition-all" size={16} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal (Nested) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-text-dark">Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-bg-gray rounded-full">
                <FiX size={24} className="text-text-gray" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8">
               <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-text-gray uppercase font-bold tracking-widest mb-1">Ngày đặt</p>
                    <p className="text-sm font-medium text-text-dark">{selectedOrder.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-gray uppercase font-bold tracking-widest mb-1">Trạng thái</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[selectedOrder.status]?.color}`}>
                        {statusConfig[selectedOrder.status]?.icon}
                        {selectedOrder.status}
                    </span>
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-gray/50 border border-border">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-border" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-text-dark">{item.name}</p>
                            <p className="text-xs text-text-gray">x{item.qty}</p>
                        </div>
                        <p className="text-sm font-black text-primary">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  ))}
               </div>

               <div className="bg-bg-gray/30 p-6 rounded-2xl border border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Phí vận chuyển:</span>
                    <span className="font-medium">+{formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-text-dark">Tổng cộng:</span>
                    <span className="text-xl font-black text-primary">{formatPrice(selectedOrder.total)}</span>
                  </div>
               </div>
            </div>
            <div className="px-8 py-6 border-t border-border bg-bg-gray/20 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-8 py-2 bg-text-dark text-white text-sm font-bold rounded-xl hover:bg-black transition-all">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
