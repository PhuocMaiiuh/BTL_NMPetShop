import { useLocation, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const sidebarCategories = [
  { name: 'Mua đồ cho chó', path: '/san-pham?category=cho' },
  { name: 'Mua đồ cho mèo', path: '/san-pham?category=meo' },
  { name: 'Phụ kiện thú cưng', path: '/san-pham?category=phu-kien' },
  { name: 'Khuyến mãi', path: '/san-pham?category=sale' },
  { name: 'Liên hệ', path: '/lien-he' },
];

const sidebarPromoProducts = [
  { name: '[500g - 1.5kg] Thức ăn hạt Royal Canin Poodle', price: '195.000đ', image: 'https://cdn.pixabay.com/photo/2019/08/19/07/45/corgi-4415649_1280.jpg' },
  { name: 'Áo thun cho thú cưng dễ thương', price: '39.000đ', image: 'https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg' },
  { name: 'Pate lon cho mèo KitCat', price: '23.400đ', image: 'https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_1280.jpg' },
  { name: 'Snack thưởng cho chó mèo', price: '39.000đ', image: 'https://cdn.pixabay.com/photo/2016/02/19/15/46/dog-1210559_1280.jpg' },
];

const Sidebar = () => (
  <div className="space-y-6">
    {/* Danh mục */}
    <div className="border border-border">
      <h3 className="bg-white py-3 px-4 font-medium text-text-dark uppercase border-b border-border text-sm">Danh mục</h3>
      <ul className="bg-white">
        {sidebarCategories.map((cat, idx) => (
          <li key={idx} className="border-b border-border last:border-b-0">
            <Link to={cat.path} className="flex items-center justify-between px-4 py-3 text-sm text-text-gray hover:text-primary transition-colors">
              <span className="uppercase text-[13px]">{cat.name}</span>
              <span className="text-lg leading-none">+</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Khuyến mãi */}
    <div className="border border-border">
      <h3 className="bg-white py-3 px-4 font-medium text-text-dark uppercase border-b border-border text-sm">Khuyến mãi</h3>
      <div className="bg-white p-4 space-y-4">
        {sidebarPromoProducts.map((product, idx) => (
          <div key={idx} className="flex gap-3 items-center group cursor-pointer">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover border border-border" />
            <div>
              <h4 className="text-[13px] text-text-dark group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">{product.name}</h4>
              <p className="text-sm font-semibold text-red-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutContent = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-medium text-text-dark mb-6 uppercase text-center">Về chúng tôi</h2>
    <div className="bg-white p-6 border border-border text-sm text-text-gray leading-relaxed space-y-4">
      <p>
        NM Pet Shop là cửa hàng thú cưng uy tín hàng đầu, chuyên cung cấp các sản phẩm chất lượng cao dành cho chó và mèo. 
        Chúng tôi cam kết mang lại những giá trị tốt nhất cho thú cưng của bạn bằng việc cung cấp các sản phẩm chính hãng, an toàn và đa dạng.
      </p>
      <p>
        Đội ngũ nhân viên tư vấn nhiệt tình, có chuyên môn về chăm sóc thú cưng luôn sẵn sàng hỗ trợ khách hàng mọi lúc.
        Tất cả sản phẩm đều được kiểm định kỹ lưỡng, đảm bảo an toàn tuyệt đối.
      </p>
      <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1471&auto=format&fit=crop" alt="Pet Shop" className="w-full h-64 object-cover my-6" />
      <p>
        Cam kết giao hàng nhanh chóng, đúng hẹn đến tay khách hàng. Niềm vui của thú cưng là sứ mệnh của chúng tôi.
      </p>
    </div>
  </div>
);

const ContactContent = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (gồm 10 chữ số)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addToast('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setErrors({});
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-text-dark mb-6 text-center uppercase">Liên hệ</h2>
      
      {/* Map */}
      <div className="w-full h-80 bg-gray-200 mb-10 border border-border">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.294119864275!2d106.68007231462243!3d10.788769261918342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2d9b626e29%3A0x8e1a1795db28b988!2sNM%20Pet%20Shop!5e0!3m2!1svi!2s!4v1699999999999!5m2!1svi!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form (Left) */}
        <div>
          <h3 className="text-base font-medium text-text-dark mb-6 uppercase">Gửi thắc mắc cho chúng tôi</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-text-dark mb-1">Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nhập tên của bạn" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-2 border text-sm outline-none bg-white ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm text-text-dark mb-1">Số điện thoại</label>
              <input 
                type="tel" 
                placeholder="Nhập số điện thoại của bạn" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className={`w-full px-4 py-2 border text-sm outline-none bg-white ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`} 
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm text-text-dark mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-2 border text-sm outline-none bg-white ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-text-dark mb-1">Message</label>
              <textarea 
                rows="4" 
                placeholder="Nội dung..." 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className={`w-full px-4 py-2 border text-sm outline-none resize-none bg-white ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 rounded">
              Gửi liên hệ <FiSend size={14}/>
            </button>
          </form>
        </div>

        {/* Info (Right) */}
        <div>
          <h3 className="text-base font-medium text-text-dark mb-6 uppercase">Thông tin liên hệ</h3>
          <p className="text-sm text-text-gray mb-6 leading-relaxed">
            NM Pet Shop là trang mua sắm trực tuyến các sản phẩm bán lẻ dành cho thú cưng của NM Pet Shop.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-text-dark mt-1 shrink-0" size={16} />
              <p className="text-sm text-text-gray"><span className="font-semibold text-text-dark">Địa chỉ:</span> 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM</p>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone className="text-text-dark mt-1 shrink-0" size={16} />
              <p className="text-sm text-text-gray"><span className="font-semibold text-text-dark">Số điện thoại:</span> 0901234567</p>
            </div>
            <div className="flex items-start gap-3">
              <FiMail className="text-text-dark mt-1 shrink-0" size={16} />
              <p className="text-sm text-text-gray"><span className="font-semibold text-text-dark">Email:</span> cskh@nmpetshop.vn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PolicyContent = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-medium text-text-dark mb-6 uppercase text-center">Chính sách</h2>
    <div className="bg-white p-6 border border-border text-sm text-text-gray leading-relaxed space-y-6">
      <div>
        <h3 className="font-semibold text-text-dark mb-2 uppercase">1. Chính sách đổi trả</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.</li>
          <li>Sản phẩm đổi trả phải còn nguyên tem mác, bao bì và chưa qua sử dụng.</li>
          <li>Miễn phí đổi trả nếu lỗi phát sinh từ nhà sản xuất.</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-text-dark mb-2 uppercase">2. Chính sách giao hàng</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên trong nội thành TP.HCM.</li>
          <li>Giao hàng hỏa tốc trong 2H nội thành.</li>
          <li>Giao hàng toàn quốc từ 2-4 ngày làm việc.</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-text-dark mb-2 uppercase">3. Bảo mật thông tin</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng.</li>
          <li>Không chia sẻ dữ liệu cho bên thứ 3 dưới mọi hình thức.</li>
          <li>Mọi giao dịch thanh toán đều được mã hóa an toàn.</li>
        </ul>
      </div>
    </div>
  </div>
);

const PaymentInfoContent = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-medium text-text-dark mb-6 uppercase text-center">Hướng dẫn thanh toán</h2>
    <div className="bg-white p-6 border border-border text-sm text-text-gray leading-relaxed space-y-6">
      <p>Chúng tôi hỗ trợ đa dạng các phương thức thanh toán nhằm mang lại sự tiện lợi tối đa cho khách hàng:</p>
      
      <div>
        <h3 className="font-semibold text-text-dark mb-2">1. Thanh toán khi nhận hàng (COD)</h3>
        <p className="ml-2">Khách hàng kiểm tra sản phẩm và thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng.</p>
      </div>

      <div>
        <h3 className="font-semibold text-text-dark mb-2">2. Chuyển khoản (VietQR)</h3>
        <p className="ml-2 mb-2">Sử dụng ứng dụng ngân hàng quét mã VietQR để thanh toán nhanh chóng, chính xác không cần nhập số tài khoản.</p>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg inline-block ml-2">
           <p><span className="font-semibold">Ngân hàng:</span> Vietcombank</p>
           <p><span className="font-semibold">Số tài khoản:</span> 1012345678</p>
           <p><span className="font-semibold">Tên tài khoản:</span> NM PET SHOP</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-text-dark mb-2">3. Ví điện tử MoMo</h3>
        <p className="ml-2">Quét mã bằng ứng dụng MoMo để hoàn tất thanh toán an toàn, bảo mật và miễn phí giao dịch.</p>
      </div>
    </div>
  </div>
);

const InfoPage = () => {
  const { pathname } = useLocation();

  const renderContent = () => {
    switch (pathname) {
      case '/ve-chung-toi':
        return <AboutContent />;
      case '/lien-he':
        return <ContactContent />;
      case '/chinh-sach':
        return <PolicyContent />;
      case '/huong-dan-thanh-toan':
        return <PaymentInfoContent />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-text-dark mb-2">Trang đang được cập nhật</h2>
            <p className="text-text-gray">Vui lòng quay lại sau.</p>
          </div>
        );
    }
  };

  const getBreadcrumb = () => {
    switch (pathname) {
      case '/ve-chung-toi': return 'Về chúng tôi';
      case '/lien-he': return 'Liên hệ';
      case '/chinh-sach': return 'Chính sách';
      case '/huong-dan-thanh-toan': return 'Thanh toán';
      default: return 'Thông tin';
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-[60vh] pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb - Left aligned as requested */}
        <div className="text-sm text-text-gray mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">{getBreadcrumb()}</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar (25%) */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>

          {/* Right Content (75%) */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoPage;
