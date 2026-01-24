import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import AdminSidebar from '@/components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = api.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dashboard-layout flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 lg:ml-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
