import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const OrderDetailPage = () => {
  const order = {
    id: '#NM-9876',
    date: '24/10/2023',
    status: 'Đang giao',
    statusColor: 'text-warning',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    customer: 'Nguyễn Văn A',
    phone: '0901234567',
    items: [
      { name: 'Hạt Khô Cao Cấp Royal Canin', qty: 2, price: 850000, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=80&h=80&fit=crop' },
      { name: 'Vòng cổ da cao cấp cho chó', qty: 1, price: 250000, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=80&h=80&fit=crop' },
    ],
    subtotal: 1950000,
    shipping: 30000,
    total: 1980000,
  };

  const trackingSteps = [
    { label: 'Đặt hàng', date: '24/10/2023', done: true, icon: <FiPackage /> },
    { label: 'Đang xử lý', date: '24/10/2023', done: true, icon: <FiPackage /> },
    { label: 'Đang giao', date: '25/10/2023', done: true, icon: <FiTruck /> },
    { label: 'Hoàn thành', date: '', done: false, icon: <FiCheck /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/ho-so" className="flex items-center gap-2 text-sm text-text-gray hover:text-primary mb-6">
        <FiArrowLeft size={16} /> Quay lại
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Chi tiết đơn hàng {order.id}</h1>
          <p className="text-sm text-text-gray mt-1">Ngày đặt: {order.date}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-warning/10 ${order.statusColor}`}>{order.status}</span>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <h3 className="font-semibold text-text-dark mb-6">Theo dõi đơn hàng</h3>
        <div className="flex items-start justify-between">
          {trackingSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              {i < trackingSteps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${step.done && trackingSteps[i+1].done ? 'bg-primary' : 'bg-border'}`}></div>
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 relative z-10 ring-[6px] ring-white ${step.done ? 'bg-primary text-white' : 'bg-border text-text-light'}`}>
                {step.icon}
              </div>
              <p className={`text-xs font-medium text-center ${step.done ? 'text-primary' : 'text-text-light'}`}>{step.label}</p>
              {step.date && <p className="text-xs text-text-light mt-0.5 text-center">{step.date}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-dark mb-4">Sản phẩm</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-gray/50">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-text-gray">x{item.qty}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-gray">Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-gray">Vận chuyển</span><span>{formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-semibold border-t border-border pt-2"><span>Tổng</span><span className="text-lg text-primary">{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-3">Thông tin giao hàng</h3>
            <p className="text-sm font-medium">{order.customer}</p>
            <p className="text-sm text-text-gray">{order.phone}</p>
            <p className="text-sm text-text-gray mt-2">{order.shippingAddress}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-3">Thanh toán</h3>
            <p className="text-sm text-text-gray">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
