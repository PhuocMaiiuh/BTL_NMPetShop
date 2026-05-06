import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
