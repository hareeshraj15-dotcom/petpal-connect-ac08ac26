import { useEffect, useState } from 'react';
import { api, User } from '@/services/api';
import { Calendar, Stethoscope, Pill, MessageCircle, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const VetHome = () => {
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
    { key: 'todayAppointments', label: "Today's Appointments", icon: Calendar, color: 'bg-primary', link: '/vet-dashboard/appointments' },
    { key: 'pendingConsultations', label: 'Pending Consultations', icon: Stethoscope, color: 'bg-secondary', link: '/vet-dashboard/consultations' },
    { key: 'activePrescriptions', label: 'Active Prescriptions', icon: Pill, color: 'bg-accent', link: '/vet-dashboard/prescriptions' },
    { key: 'unreadMessages', label: 'Unread Messages', icon: MessageCircle, color: 'bg-primary', link: '/vet-dashboard/messages' },
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
          Good morning, {user?.name || 'Doctor'}! 🩺
        </h1>
        <p className="text-primary-foreground/80">
          Here's your schedule and pending tasks for today.
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

      {/* Today's Schedule & Tasks */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {[
              { time: '9:00 AM', pet: 'Buddy', owner: 'John Smith', type: 'Checkup' },
              { time: '10:30 AM', pet: 'Whiskers', owner: 'Jane Doe', type: 'Vaccination' },
              { time: '2:00 PM', pet: 'Max', owner: 'Bob Wilson', type: 'Follow-up' },
            ].map((appt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 text-primary font-medium min-w-24">
                  <Clock className="h-4 w-4" />
                  {appt.time}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{appt.pet}</p>
                  <p className="text-sm text-muted-foreground">{appt.owner} • {appt.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <input type="checkbox" className="mt-1 rounded border-border" />
              <div>
                <p className="text-foreground">Review lab results for Max</p>
                <p className="text-sm text-muted-foreground">Blood work completed yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <input type="checkbox" className="mt-1 rounded border-border" />
              <div>
                <p className="text-foreground">Renew prescription for Whiskers</p>
                <p className="text-sm text-muted-foreground">Expires in 3 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <input type="checkbox" className="mt-1 rounded border-border" />
              <div>
                <p className="text-foreground">Follow up with Mrs. Johnson</p>
                <p className="text-sm text-muted-foreground">Regarding Bella's recovery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetHome;
