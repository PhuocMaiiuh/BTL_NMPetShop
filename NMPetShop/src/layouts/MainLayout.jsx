import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { isAdmin } = useAuth();

  // Prevent admins from viewing customer-facing pages
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
