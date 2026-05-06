import { createContext, useContext, useState } from 'react';
import { loginApi } from '../services/userApi';

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
    if (!saved) return null;
    const userData = JSON.parse(saved);
    return {
      ...userData,
      name: userData.fullName || userData.name || 'Người dùng'
    };
  });

  const login = async (email, password) => {
    try {
      const userData = await loginApi(email, password);
      // Normalize user data: ensure both name and fullName exist
      const normalizedUser = {
        ...userData,
        name: userData.fullName || userData.name || 'Người dùng'
      };
      setUser(normalizedUser);
      localStorage.setItem('nm_user', JSON.stringify(normalizedUser));
      return { success: true, user: normalizedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
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
