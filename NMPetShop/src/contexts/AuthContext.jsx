import { createContext, useContext, useState } from 'react';
import { loginApi, registerApi, updateProfileApi } from '../services/userApi';

// ... (MOCK_USERS kept for reference if needed)

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
    const saved = sessionStorage.getItem('nm_user');
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
      sessionStorage.setItem('nm_user', JSON.stringify(normalizedUser));
      return { success: true, user: normalizedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerApi(userData);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('nm_user');
  };

  const updateUser = async (data) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      // Map frontend fields to backend if necessary
      const apiData = {
        fullName: data.name || data.fullName,
        email: data.email,
        phone: data.phone,
        birthday: data.birthday,
        address: data.address,
        avatar: data.avatar
      };
      
      const updatedUser = await updateProfileApi(user.id, apiData);
      const normalizedUser = {
        ...updatedUser,
        name: updatedUser.fullName || updatedUser.name || 'Người dùng'
      };
      setUser(normalizedUser);
      sessionStorage.setItem('nm_user', JSON.stringify(normalizedUser));
      return { success: true, user: normalizedUser };
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
