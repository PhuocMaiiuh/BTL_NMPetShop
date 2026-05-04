import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminMessages from './pages/admin/AdminMessages';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
          {/* Customer-facing pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham" element={<ProductListPage />} />
            <Route path="/san-pham/:id" element={<ProductDetailPage />} />
            <Route path="/gio-hang" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/thanh-toan" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/ho-so" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/don-hang/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Auth pages */}
          <Route element={<AuthLayout />}>
            <Route path="/dang-nhap" element={<AuthPage />} />
            <Route path="/dang-ky" element={<AuthPage />} />
          </Route>

          {/* Admin pages */}
          <Route element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/san-pham" element={<AdminProducts />} />
            <Route path="/admin/khuyen-mai" element={<AdminDiscounts />} />
            <Route path="/admin/tin-nhan" element={<AdminMessages />} />
            <Route path="/admin/don-hang" element={<AdminOrders />} />
            <Route path="/admin/khach-hang" element={<AdminCustomers />} />
          </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
