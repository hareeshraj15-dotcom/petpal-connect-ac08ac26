import { useEffect, useState } from 'react';
import { api, User } from '@/services/api';
import { Users, PawPrint, Calendar, TrendingUp, Activity, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const data = await api.getDashboardStats('ADMIN');
        setStats(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const statCards = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'bg-primary', trend: '+12%' },
    { key: 'totalPets', label: 'Total Pets', icon: PawPrint, color: 'bg-secondary', trend: '+8%' },
    { key: 'totalAppointments', label: 'Appointments', icon: Calendar, color: 'bg-accent', trend: '+15%' },
    { key: 'activeVets', label: 'Active Vets', icon: UserCheck, color: 'bg-chart-4', trend: '+3%' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-destructive/90 to-destructive rounded-2xl p-8 text-destructive-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name} 🔐
        </h1>
        <p className="text-destructive-foreground/80">
          System overview and management controls
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stats[stat.key] || 0}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend} this month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '5 minutes ago', type: 'user' },
                { action: 'Appointment completed', time: '15 minutes ago', type: 'appointment' },
                { action: 'New pet added', time: '1 hour ago', type: 'pet' },
                { action: 'Vet verified', time: '2 hours ago', type: 'vet' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-foreground">{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'View Users', icon: Users },
                { label: 'Manage Vets', icon: UserCheck },
                { label: 'View Reports', icon: TrendingUp },
                { label: 'Settings', icon: Activity },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
