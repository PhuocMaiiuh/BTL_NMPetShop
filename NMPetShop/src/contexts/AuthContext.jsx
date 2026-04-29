import { createContext, useContext, useState } from 'react';

// Mock users database
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@nmpetshop.com',
    password: 'admin123',
    name: 'Admin NM',
    role: 'admin',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 2,
    customerCode: 'KH26001',
    email: 'user@nmpetshop.com',
    password: 'user123',
    name: 'Nguyễn Văn A',
    role: 'user',
    phone: '0987654321',
    birthday: '15/08/1995',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberLevel: 'Thành viên Bạc',
    avatar: '',
  },
];

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('nm_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nm_user');
  };

  const updateUser = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('nm_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
