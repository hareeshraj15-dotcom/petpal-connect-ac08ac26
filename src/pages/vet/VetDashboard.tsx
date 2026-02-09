import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import VetSidebar from '@/components/VetSidebar';
import HelpBot from '@/components/HelpBot';

const VetDashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (role && role !== 'veterinarian') {
      navigate('/login');
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <div className="dashboard-layout flex min-h-screen">
      <VetSidebar />
      <main className="flex-1 p-6 lg:p-8 lg:ml-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <HelpBot role="veterinarian" />
    </div>
  );
};

export default VetDashboard;
