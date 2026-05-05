import { useState, useMemo, useEffect, useRef } from 'react';
import { FiSearch, FiEye, FiFilter, FiChevronDown, FiPackage, FiTruck, FiCheck, FiX, FiClock, FiPrinter, FiDownload, FiLoader } from 'react-icons/fi';
import { fetchOrders, updateOrderStatus } from '../../services/orderApi';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusConfig = {
  'Pending': { label: 'Chờ xác nhận', color: 'text-warning bg-warning/10', icon: <FiClock size={14} /> },
  'Confirmed': { label: 'Đang xử lý', color: 'text-info bg-info/10', icon: <FiPackage size={14} /> },
  'Shipping': { label: 'Đang giao', color: 'text-secondary bg-secondary/10', icon: <FiTruck size={14} /> },
  'Delivered': { label: 'Hoàn thành', color: 'text-success bg-success/10', icon: <FiCheck size={14} /> },
  'Cancelled': { label: 'Đã hủy', color: 'text-danger bg-danger/10', icon: <FiX size={14} /> },
};

import Pagination from '../../components/admin/Pagination';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highest, lowest
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusRef = useRef(null);
  const sortRef = useRef(null);

  const loadOrders = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 20
      };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;
      
      const data = await fetchOrders(params);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
    setPage(1);
  }, [statusFilter, search]);

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) setShowStatusDropdown(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Sort (client-side for now for responsiveness)
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'highest') return b.totalAmount - a.totalAmount;
      if (sortOrder === 'lowest') return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, sortOrder]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      alert('Cập nhật trạng thái thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái đơn hàng!');
    }
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Quản lý đơn hàng</h1>
          <p className="text-sm text-text-gray mt-1">Theo dõi, cập nhật trạng thái và chi tiết đơn hàng của khách hàng.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors text-text-dark">
            <FiPrinter size={16} /> In báo cáo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors text-text-dark">
            <FiDownload size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6 h-12">
        <div className="flex-1 max-w-2xl relative h-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-10 pr-4 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
            placeholder="Tìm theo mã đơn hàng hoặc số điện thoại..."
          />
        </div>

        <div className="relative h-full" ref={statusRef}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[210px] border rounded-xl text-sm font-medium transition-all ${statusFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-[#e2e8f0] text-[#64748b] hover:border-primary bg-white'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiFilter size={16} className="flex-shrink-0" />
              <span className="truncate">{statusFilter === 'All' ? 'Tất cả trạng thái' : statusFilter}</span>
            </div>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showStatusDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div 
                onClick={() => { setStatusFilter('All'); setShowStatusDropdown(false); }} 
                className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-medium"
              >
                Tất cả trạng thái
              </div>
              {Object.keys(statusConfig).map(status => (
                <div 
                  key={status} 
                  onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }} 
                  className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${statusFilter === status ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative h-full" ref={sortRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[180px] border rounded-xl text-sm font-medium transition-all ${sortOrder !== 'newest' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-[#e2e8f0] text-[#64748b] hover:border-primary bg-white'}`}
          >
            <span className="truncate">
              {sortOrder === 'newest' ? 'Mới nhất' : 
               sortOrder === 'oldest' ? 'Cũ nhất' : 
               sortOrder === 'highest' ? 'Giá trị cao nhất' : 'Giá trị thấp nhất'}
            </span>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div onClick={() => { setSortOrder('newest'); setShowSortDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border ${sortOrder === 'newest' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Mới nhất</div>
              <div onClick={() => { setSortOrder('oldest'); setShowSortDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${sortOrder === 'oldest' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Cũ nhất</div>
              <div onClick={() => { setSortOrder('highest'); setShowSortDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${sortOrder === 'highest' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Giá trị cao nhất</div>
              <div onClick={() => { setSortOrder('lowest'); setShowSortDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${sortOrder === 'lowest' ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>Giá trị thấp nhất</div>
            </div>
          )}
        </div>

        {/* Clear Filters Button - Fixed width container to prevent layout shift */}
        <div className="w-24 flex-shrink-0 flex items-center h-full">
          {(search || statusFilter !== 'All' || sortOrder !== 'newest') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setSortOrder('newest');
              }}
              className="text-xs font-bold text-accent hover:text-accent-dark transition-colors px-2 whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-text-gray uppercase bg-bg-gray/50 border-b border-border">
              <th className="px-6 py-4">Mã đơn hàng</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FiLoader size={32} className="animate-spin text-primary" />
                    <span className="text-sm text-text-gray font-medium">Đang tải đơn hàng...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-bg-gray/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-text-dark">#{order.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-dark">{order.customerName}</span>
                      <span className="text-xs text-text-gray">{order.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-gray">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status]?.color}`}>
                      {statusConfig[order.status]?.icon}
                      {statusConfig[order.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <FiEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <FiPackage size={48} className="text-border mb-3" />
                    <p className="text-text-gray italic">Không tìm thấy đơn hàng nào phù hợp.</p>
                  </div>
                </td>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-text-dark">Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
                <p className="text-sm text-text-gray mt-0.5">Đặt ngày {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-bg-gray rounded-full transition-colors"
              >
                <FiX size={24} className="text-text-gray" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Customer Info */}
                <div className="bg-bg-gray/50 rounded-2xl p-5 border border-border">
                  <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Tên khách hàng</p>
                      <p className="text-sm font-medium text-text-dark">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Số điện thoại</p>
                      <p className="text-sm font-medium text-text-dark">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Email</p>
                      <p className="text-sm font-medium text-text-dark">{selectedOrder.email}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-bg-gray/50 rounded-2xl p-5 border border-border">
                  <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-secondary rounded-full"></div>
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Địa chỉ nhận hàng</p>
                      <p className="text-sm font-medium text-text-dark leading-relaxed">{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Phương thức</p>
                      <p className="text-sm font-medium text-text-dark">Giao hàng tiêu chuẩn</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-bg-gray/50 rounded-2xl p-5 border border-border">
                  <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-accent-green rounded-full"></div>
                    Thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Phương thức thanh toán</p>
                      <p className="text-sm font-medium text-text-dark">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-gray uppercase font-semibold">Trạng thái hiện tại</p>
                      <span className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[selectedOrder.status]?.color}`}>
                        {statusConfig[selectedOrder.status]?.icon}
                        {statusConfig[selectedOrder.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-warning rounded-full"></div>
                  Danh sách sản phẩm ({selectedOrder.items.length})
                </h3>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-bg-gray/50 text-[11px] font-bold text-text-gray uppercase border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left">Sản phẩm</th>
                        <th className="px-6 py-3 text-center">Đơn giá</th>
                        <th className="px-6 py-3 text-center">Số lượng</th>
                        <th className="px-6 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm" />
                              <span className="text-sm font-medium text-text-dark">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-text-gray">{formatPrice(item.price)}</td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-text-dark">x{item.quantity}</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3 bg-bg-gray/30 p-6 rounded-2xl border border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Tạm tính:</span>
                    <span className="font-medium text-text-dark">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Phí vận chuyển:</span>
                    <span className="font-medium text-text-dark">+{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Giảm giá:</span>
                    <span className="font-medium text-accent">-{formatPrice(0)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-text-dark">Tổng cộng:</span>
                    <span className="text-xl font-black text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Status Actions */}
            <div className="px-8 py-6 border-t border-border bg-bg-gray/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-dark">Cập nhật trạng thái:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([statusKey, config]) => (
                    <button
                      key={statusKey}
                      onClick={() => handleUpdateStatus(selectedOrder.orderId, statusKey)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedOrder.status === statusKey
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105'
                        : 'bg-white border-border text-text-gray hover:border-primary hover:text-primary'
                        }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-text-dark text-white text-sm font-bold rounded-xl hover:bg-black transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
