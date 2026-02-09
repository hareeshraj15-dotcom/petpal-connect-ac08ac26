import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import HelpBot from '@/components/HelpBot';

const PetOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (role && role !== 'pet_owner') {
      navigate('/login');
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <div className="dashboard-layout flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-8 lg:ml-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <HelpBot role="pet_owner" />
    </div>
  );
};

export default PetOwnerDashboard;
