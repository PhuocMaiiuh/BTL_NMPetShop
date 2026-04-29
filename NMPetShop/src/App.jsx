import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminDiscounts from './pages/admin/AdminDiscounts';

function App() {
  return (
    <BrowserRouter>
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
            <Route path="/admin/san-pham/them" element={<AdminProductForm />} />
            <Route path="/admin/san-pham/sua/:id" element={<AdminProductForm />} />
            <Route path="/admin/khuyen-mai" element={<AdminDiscounts />} />
          </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
