import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import VetSidebar from '@/components/VetSidebar';

const VetDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = api.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'VETERINARIAN') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dashboard-layout flex min-h-screen">
      <VetSidebar />
      <main className="flex-1 p-6 lg:p-8 lg:ml-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VetDashboard;
