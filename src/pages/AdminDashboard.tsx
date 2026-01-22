import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, User } from '@/services/api';
import { Users, PawPrint, Calendar, Shield, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    const loadStats = async () => {
      const data = await api.getDashboardStats('ADMIN');
      setStats(data);
    };
    loadStats();
  }, [navigate]);

  const handleLogout = async () => {
    await api.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const statCards = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'bg-primary' },
    { key: 'totalPets', label: 'Total Pets', icon: PawPrint, color: 'bg-secondary' },
    { key: 'totalAppointments', label: 'Appointments', icon: Calendar, color: 'bg-accent' },
  ];

  return (
    <div className="dashboard-layout min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">PetCare</span>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Welcome */}
          <div className="gradient-hero rounded-2xl p-8 text-primary-foreground">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Admin Dashboard 🔐
            </h1>
            <p className="text-primary-foreground/80">
              System overview and management controls
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <div key={stat.key} className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stats[stat.key] || 0}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder for admin features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-4">User Management</h2>
              <p className="text-muted-foreground mb-4">Manage user accounts and roles</p>
              <Button variant="outline">View Users</Button>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-4">System Settings</h2>
              <p className="text-muted-foreground mb-4">Configure system preferences</p>
              <Button variant="outline">Open Settings</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
