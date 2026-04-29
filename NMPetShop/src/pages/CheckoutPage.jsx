import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const steps = [
  { id: 1, label: 'Thông tin giao hàng' },
  { id: 2, label: 'Phương thức thanh toán' },
  { id: 3, label: 'Xác nhận đơn hàng' },
];

const orderItems = [
  { name: 'Hạt Khô Cao Cấp Royal Canin', qty: 2, price: 850000 },
  { name: 'Vòng cổ da cao cấp cho chó', qty: 1, price: 250000 },
];

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', note: '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 30000;
  const discount = 0;
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link to="/gio-hang" className="hover:text-primary">Giỏ hàng</Link>
        <span>/</span>
        <Link to="/thanh-toan" className="text-text-dark font-medium hover:text-primary">Thanh toán</Link>
      </nav>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              currentStep >= step.id ? 'bg-primary text-white' : 'bg-bg-gray text-text-gray'
            }`}>
              {currentStep > step.id ? <FiCheck size={16} /> : step.id}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${currentStep >= step.id ? 'text-primary' : 'text-text-gray'}`}>{step.label}</span>
            {i < steps.length - 1 && <div className={`w-16 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`}></div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Thông tin giao hàng</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Họ và tên *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Số điện thoại *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="0901234567" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="email@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Địa chỉ *</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="123 Đường Lê Lợi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Thành phố</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="TP. Hồ Chí Minh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Ghi chú</label>
                  <input name="note" value={formData.note} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Ghi chú thêm..." />
                </div>
              </div>
              <button onClick={() => setCurrentStep(2)} className="mt-6 px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">Tiếp tục</button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {[{ value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng' },
                  { value: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua tài khoản ngân hàng' },
                  { value: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử MoMo' },
                ].map((m) => (
                  <label key={m.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    <input type="radio" name="paymentMethod" value={m.value} checked={formData.paymentMethod === m.value} onChange={handleChange} className="mt-1 accent-primary" />
                    <div>
                      <p className="font-medium text-sm text-text-dark">{m.label}</p>
                      <p className="text-xs text-text-gray mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep(1)} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors">Quay lại</button>
                <button onClick={() => setCurrentStep(3)} className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">Tiếp tục</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Xác nhận đơn hàng</h2>
              <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2">Đặt hàng thành công!</h3>
                <p className="text-sm text-text-gray mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng #NM-9876 đang được xử lý.</p>
                <div className="flex items-center justify-center gap-3">
                  <Link to="/don-hang/NM-9876" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-light text-white rounded-lg font-medium transition-colors">
                    Xem đơn hàng
                  </Link>
                  <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors">Về trang chủ</Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-4">Đơn hàng</h3>
            <div className="space-y-3 mb-4">
              {orderItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-gray">{item.name} x{item.qty}</span>
                  <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-gray">Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-gray">Vận chuyển</span><span>{formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-sm text-text-gray"><span className="text-text-gray">Giảm giá</span><span>{discount > 0 ? `-${formatPrice(discount)}` : '0đ'}</span></div>
              <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold">Tổng</span><span className="text-lg font-bold text-primary">{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
