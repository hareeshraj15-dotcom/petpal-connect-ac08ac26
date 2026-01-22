import { useEffect, useState } from 'react';
import { api, User } from '@/services/api';
import { PawPrint, Calendar, FileText, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const dashboardStats = await api.getDashboardStats(currentUser.role);
        setStats(dashboardStats);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const statCards = [
    { key: 'totalPets', label: 'My Pets', icon: PawPrint, color: 'bg-primary', link: '/dashboard/my-pets' },
    { key: 'upcomingAppointments', label: 'Upcoming Appointments', icon: Calendar, color: 'bg-secondary', link: '/dashboard/appointments' },
    { key: 'healthRecords', label: 'Health Records', icon: FileText, color: 'bg-accent', link: '/dashboard/health-records' },
    { key: 'unreadMessages', label: 'Unread Messages', icon: MessageCircle, color: 'bg-primary', link: '/dashboard/messages' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-2xl p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Pet Owner'}! 👋
        </h1>
        <p className="text-primary-foreground/80">
          Here's an overview of your pet's health and activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link 
            key={stat.key}
            to={stat.link}
            className="stat-card group hover:shadow-hover transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stats[stat.key] || 0}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium group-hover:gap-2 transition-all">
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              to="/dashboard/appointments"
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-foreground">Schedule New Appointment</span>
            </Link>
            <Link 
              to="/dashboard/my-pets"
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <PawPrint className="h-5 w-5 text-primary" />
              <span className="text-foreground">Add New Pet</span>
            </Link>
            <Link 
              to="/dashboard/messages"
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-foreground">Message Your Vet</span>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-foreground">Buddy's checkup completed</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
              <div>
                <p className="text-foreground">Whiskers vaccination scheduled</p>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-foreground mt-2" />
              <div>
                <p className="text-foreground">New prescription for Max</p>
                <p className="text-sm text-muted-foreground">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
