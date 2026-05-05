import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
const steps = [
  { id: 1, label: 'Thông tin giao hàng' },
  { id: 2, label: 'Phương thức thanh toán' },
  { id: 3, label: 'Xác nhận đơn hàng' },
];
const CITIES = ['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Biên Hòa','Nha Trang','Huế','Đà Lạt','Vũng Tàu'];

const validateStep1 = (f) => {
  const e = {};
  if (!f.fullName.trim() || f.fullName.trim().length < 2) e.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
  if (!f.phone.trim()) e.phone = 'Số điện thoại là bắt buộc';
  else if (!/^0\d{9}$/.test(f.phone.trim())) e.phone = 'SĐT phải có 10 chữ số và bắt đầu bằng 0';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Email không đúng định dạng';
  if (!f.address.trim() || f.address.trim().length < 5) e.address = 'Địa chỉ phải có ít nhất 5 ký tự';
  if (!f.city.trim()) e.city = 'Vui lòng chọn thành phố';
  return e;
};

const Field = ({ name, label, placeholder, required, type='text', value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-text-dark mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-border focus:border-primary'}`}
    />
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle size={12}/>{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, removeFromCart } = useCart();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() => 'NM-' + Math.floor(Math.random() * 90000 + 10000));
  const [formData, setFormData] = useState({ fullName:'', phone:'', email:'', address:'', city:'', note:'', paymentMethod:'cod' });
  const [errors, setErrors] = useState({});
  const [discountValue, setDiscountValue] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const shipping = 30000;
  const discountAmount = discountValue <= 1 ? cartSubtotal * discountValue : discountValue;
  const total = Math.max(0, cartSubtotal + shipping - discountAmount);

  const handleStep1Continue = () => {
    const errs = validateStep1(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    const ids = cartItems.map(i => i.id);
    ids.forEach(id => removeFromCart(id));
    setOrderPlaced(true);
    addToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success', 4000);
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link><span>/</span>
        <Link to="/gio-hang" className="hover:text-primary">Giỏ hàng</Link><span>/</span>
        <span className="text-text-dark font-medium">Thanh toán</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-primary text-white' : 'bg-bg-gray text-text-gray'}`}>
              {currentStep > step.id ? <FiCheck size={16}/> : step.id}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${currentStep >= step.id ? 'text-primary' : 'text-text-gray'}`}>{step.label}</span>
            {i < steps.length - 1 && <div className={`w-16 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`}/>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Thông tin giao hàng</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field name="fullName" label="Họ và tên" placeholder="Nguyễn Văn A" required value={formData.fullName} onChange={handleChange} error={errors.fullName}/>
                <Field name="phone" label="Số điện thoại" placeholder="0901234567" required value={formData.phone} onChange={handleChange} error={errors.phone}/>
                <div className="md:col-span-2"><Field name="email" label="Email" placeholder="email@example.com" type="email" value={formData.email} onChange={handleChange} error={errors.email}/></div>
                <div className="md:col-span-2"><Field name="address" label="Địa chỉ" placeholder="123 Đường Lê Lợi" required value={formData.address} onChange={handleChange} error={errors.address}/></div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Thành phố <span className="text-red-500">*</span></label>
                  <select name="city" value={formData.city} onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none appearance-none bg-white ${errors.city ? 'border-red-400 bg-red-50' : 'border-border focus:border-primary'}`}>
                    <option value="">-- Chọn thành phố --</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle size={12}/>{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Ghi chú</label>
                  <input name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú thêm..." className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary outline-none"/>
                </div>
              </div>
              <button onClick={handleStep1Continue} className="mt-6 px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">Tiếp tục →</button>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {[
                  { value:'cod', label:'Thanh toán khi nhận hàng (COD)', desc:'Thanh toán bằng tiền mặt khi nhận hàng' },
                  { value:'bank', label:'Chuyển khoản ngân hàng', desc:'Chuyển khoản qua tài khoản ngân hàng' },
                  { value:'momo', label:'Ví MoMo', desc:'Thanh toán qua ví điện tử MoMo' },
                ].map((m) => (
                  <label key={m.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    <input type="radio" name="paymentMethod" value={m.value} checked={formData.paymentMethod === m.value} onChange={handleChange} className="mt-1 accent-primary"/>
                    <div><p className="font-medium text-sm text-text-dark">{m.label}</p><p className="text-xs text-text-gray mt-0.5">{m.desc}</p></div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep(1)} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors">← Quay lại</button>
                <button onClick={() => setCurrentStep(3)} className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">Tiếp tục →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && !orderPlaced && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-dark mb-6">Xác nhận đơn hàng</h2>
              <div className="bg-bg-gray rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-text-dark mb-3">📦 Thông tin giao hàng</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-text-gray">Họ tên: </span><span className="font-medium">{formData.fullName}</span></div>
                  <div><span className="text-text-gray">SĐT: </span><span className="font-medium">{formData.phone}</span></div>
                  {formData.email && <div><span className="text-text-gray">Email: </span><span className="font-medium">{formData.email}</span></div>}
                  <div><span className="text-text-gray">Thành phố: </span><span className="font-medium">{formData.city}</span></div>
                  <div className="md:col-span-2"><span className="text-text-gray">Địa chỉ: </span><span className="font-medium">{formData.address}</span></div>
                </div>
              </div>
              <div className="bg-bg-gray rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-text-dark mb-2">💳 Thanh toán</h3>
                <p className="text-sm font-medium">{formData.paymentMethod === 'cod' ? 'COD - Thanh toán khi nhận hàng' : formData.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'Ví MoMo'}</p>
                
                {formData.paymentMethod === 'bank' && (
                  <div className="mt-4 bg-white rounded-xl border border-blue-200 p-6 flex flex-col items-center">
                    <div className="text-blue-600 font-bold text-lg mb-4">Quét mã VietQR để thanh toán</div>
                    <img src={`https://img.vietqr.io/image/vcb-1012345678-compact2.png?amount=${total}&addInfo=${orderId}&accountName=NM PET SHOP`} alt="VietQR" className="w-48 h-48 object-contain rounded-xl shadow-sm border border-gray-100" />
                    <div className="mt-4 text-sm text-center space-y-1.5 bg-blue-50 p-3 rounded-lg w-full">
                      <p><span className="text-text-gray">Ngân hàng:</span> <span className="font-semibold">Vietcombank</span></p>
                      <p><span className="text-text-gray">Số tài khoản:</span> <span className="font-semibold">1012345678</span></p>
                      <p><span className="text-text-gray">Chủ tài khoản:</span> <span className="font-semibold">NM PET SHOP</span></p>
                      <p><span className="text-text-gray">Số tiền:</span> <span className="font-bold text-primary">{formatPrice(total)}</span></p>
                      <p><span className="text-text-gray">Nội dung:</span> <span className="font-bold text-accent">{orderId}</span></p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'momo' && (
                  <div className="mt-4 bg-white rounded-xl border border-pink-200 p-6 flex flex-col items-center">
                    <div className="text-pink-600 font-bold text-lg mb-4 flex items-center gap-2">
                      <img src="https://static.mservice.io/img/logo-momo.png" alt="momo" className="w-6 h-6 object-contain"/>
                      Thanh toán qua Ví MoMo
                    </div>
                    <div className="relative">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=a50064&data=momo://pay?amount=${total}%26message=${orderId}`} alt="MoMo QR" className="w-48 h-48 rounded-xl shadow-sm border border-gray-100 p-2" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-1 rounded-md">
                          <img src="https://static.mservice.io/img/logo-momo.png" alt="momo" className="w-8 h-8 object-contain"/>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-center space-y-1.5 bg-pink-50 p-3 rounded-lg w-full">
                      <p><span className="text-text-gray">Người nhận:</span> <span className="font-semibold">NM PET SHOP</span></p>
                      <p><span className="text-text-gray">Số điện thoại:</span> <span className="font-semibold">0901234567</span></p>
                      <p><span className="text-text-gray">Số tiền:</span> <span className="font-bold text-primary">{formatPrice(total)}</span></p>
                      <p><span className="text-text-gray">Lời nhắn:</span> <span className="font-bold text-accent">{orderId}</span></p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-bg-gray rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-text-dark mb-3">🛒 Sản phẩm</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-dark truncate">{item.name}</p>
                        <p className="text-xs text-text-gray">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(2)} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors">← Quay lại</button>
                <button onClick={handlePlaceOrder} className="flex-1 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                  {formData.paymentMethod === 'cod' ? '✓ Đặt hàng ngay' : '✓ Xác nhận đã thanh toán'}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {orderPlaced && (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                  <FiCheck size={36} className="text-white"/>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-2">Đặt hàng thành công!</h3>
                <p className="text-sm text-text-gray mb-1">Cảm ơn bạn đã mua hàng tại NM Pet Shop.</p>
                <p className="text-sm text-text-gray mb-6">Đơn hàng <span className="font-semibold text-primary">#{orderId}</span> đang được xử lý.</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link to={`/don-hang/${orderId}`} className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-light text-white rounded-lg font-medium transition-colors">Xem đơn hàng</Link>
                  <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors">Về trang chủ</Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
            <h3 className="font-semibold text-text-dark mb-4">Đơn hàng ({cartItems.length} sản phẩm)</h3>
            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
              {cartItems.length === 0 ? <p className="text-sm text-text-gray text-center py-3">Giỏ hàng trống</p> :
                cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-text-gray truncate max-w-[60%]">{item.name} x{item.quantity}</span>
                    <span className="font-medium ml-2">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              }
            </div>
            <div className="mb-4">
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary outline-none appearance-none bg-white" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))}>
                <option value={0}>Chọn mã giảm giá...</option>
                <option value={0.1}>Giảm 10% - Khách hàng mới</option>
                <option value={0.15}>Giảm 15% - Mùa hè rực rỡ</option>
                <option value={30000}>Freeship - Giảm 30K</option>
              </select>
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-gray">Tạm tính</span><span>{formatPrice(cartSubtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-gray">Vận chuyển</span><span>{formatPrice(shipping)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-text-gray">Giảm giá</span><span className="text-green-600">-{formatPrice(discountAmount)}</span></div>}
              <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold">Tổng</span><span className="text-lg font-bold text-primary">{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
