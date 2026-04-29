import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">NM</span>
            </div>
            <h1 className="text-2xl font-bold text-text-dark">Đăng ký</h1>
            <p className="text-sm text-text-gray mt-1">Tạo tài khoản NM Pet Shop</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Họ và tên</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Số điện thoại</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="0901234567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light"><FiEye size={16} /></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Xác nhận mật khẩu</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">Đăng ký</button>
          </form>

          <p className="text-center text-sm text-text-gray mt-6">
            Đã có tài khoản? <Link to="/dang-nhap" className="text-primary font-medium hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
