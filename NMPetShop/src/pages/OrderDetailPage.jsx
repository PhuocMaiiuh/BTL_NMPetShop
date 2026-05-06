import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { fetchOrderById } from '../services/orderApi';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { label: 'Đặt hàng', key: 'Pending', icon: <FiPackage /> },
      { label: 'Xác nhận', key: 'Confirmed', icon: <FiPackage /> },
      { label: 'Đang giao', key: 'Shipping', icon: <FiTruck /> },
      { label: 'Hoàn thành', key: 'Delivered', icon: <FiCheck /> },
    ];
    
    const statusOrder = ['Pending', 'Confirmed', 'Shipping', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return steps.map((step, idx) => ({
      ...step,
      done: idx <= currentIndex,
      date: idx <= currentIndex ? (idx === currentIndex ? 'Hôm nay' : 'Đã xong') : null
    }));
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Pending': 'Chờ xử lý',
      'Confirmed': 'Đã xác nhận',
      'Shipping': 'Đang giao hàng',
      'Delivered': 'Hoàn thành',
      'Cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'text-amber-500',
      'Confirmed': 'text-blue-500',
      'Shipping': 'text-indigo-500',
      'Delivered': 'text-emerald-500',
      'Cancelled': 'text-rose-500'
    };
    return colors[status] || 'text-text-gray';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader size={48} className="animate-spin text-primary mb-4" />
        <p className="text-text-gray font-medium">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiAlertCircle size={64} className="text-danger mx-auto mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-text-dark">Lỗi tải dữ liệu</h2>
        <p className="text-text-gray mt-2 mb-8">{error || 'Không tìm thấy thông tin đơn hàng'}</p>
        <Link to="/ho-so" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Quay lại hồ sơ</Link>
      </div>
    );
  }

  const trackingSteps = getStatusSteps(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/ho-so" className="flex items-center gap-2 text-sm text-text-gray hover:text-primary mb-6 transition-colors group">
        <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại hồ sơ
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-dark">Chi tiết đơn hàng {order.orderId}</h1>
          <p className="text-sm text-text-gray mt-1">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-bg-gray ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Tracking */}
      {order.status !== 'Cancelled' && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-text-dark mb-8">Trạng thái đơn hàng</h3>
          <div className="flex items-start justify-between">
            {trackingSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative">
                {i < trackingSteps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${step.done && trackingSteps[i+1].done ? 'bg-primary' : 'bg-border'}`}></div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 relative z-10 ring-[6px] ring-white transition-all duration-500 ${step.done ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-bg-gray text-text-light'}`}>
                  {step.icon}
                </div>
                <p className={`text-xs font-bold text-center ${step.done ? 'text-primary' : 'text-text-light'}`}>{step.label}</p>
                {step.date && <p className="text-[10px] text-text-gray mt-0.5 text-center font-medium">{step.date}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-text-dark mb-4">Danh sách sản phẩm</h3>
            <div className="divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-dark truncate">{item.name}</p>
                      <p className="text-xs text-text-gray mt-0.5">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-text-dark">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-text-dark mb-4">Thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-text-gray">
                <span>Tạm tính ({order.items.length} sản phẩm)</span>
                <span className="font-medium text-text-dark">{formatPrice(order.totalAmount + (order.discountAmount || 0) - (order.shippingFee || 0))}</span>
              </div>
              <div className="flex justify-between text-sm text-text-gray">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-text-dark">{order.shippingFee > 0 ? `+${formatPrice(order.shippingFee)}` : 'Miễn phí'}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá {order.promoCode ? `(${order.promoCode})` : ''}</span>
                  <span className="font-medium">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                <span className="font-bold text-text-dark">Tổng tiền thanh toán</span>
                <span className="text-2xl font-black text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              Thông tin nhận hàng
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Người nhận</p>
                <p className="text-sm font-bold text-text-dark">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Số điện thoại</p>
                <p className="text-sm font-bold text-text-dark">{order.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
                <p className="text-sm font-medium text-text-gray leading-relaxed">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
              Phương thức thanh toán
            </h3>
            <div className="flex items-center gap-3 p-3 bg-bg-gray/50 rounded-xl border border-border/50">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="font-black text-xs text-primary">{order.paymentMethod === 'COD' ? 'COD' : 'CARD'}</span>
              </div>
              <p className="text-xs font-bold text-text-dark">
                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua thẻ'}
              </p>
            </div>
          </div>

          {order.note && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h3 className="font-bold text-amber-800 mb-2">Ghi chú</h3>
              <p className="text-sm text-amber-700 italic">"{order.note}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
