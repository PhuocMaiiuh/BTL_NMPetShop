import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      addToast('Vui lòng nhập đầy đủ thông tin', 'warning');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      addToast('Đăng nhập thành công!', 'success');
      // Redirect to previous page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">NM</span>
            </div>
            <h1 className="text-2xl font-bold text-text-dark">Đăng nhập</h1>
            <p className="text-sm text-text-gray mt-1">Chào mừng bạn trở lại NM Pet Shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary transition-colors" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary transition-colors pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-gray">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-gray cursor-pointer">
                <input type="checkbox" className="accent-primary" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Quên mật khẩu?</a>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <FiLoader className="animate-spin" size={18} /> : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-text-gray mt-6">
            Chưa có tài khoản? <Link to="/dang-ky" className="text-primary font-medium hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
