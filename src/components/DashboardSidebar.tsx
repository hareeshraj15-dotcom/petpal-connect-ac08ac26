import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, PawPrint, FileText, Calendar, ShoppingBag, Package, 
  MessageCircle, User, Settings, LogOut, Heart, Menu, X, Pill, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const menuItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard', end: true },
  { to: '/dashboard/my-pets', icon: PawPrint, label: 'My Pets' },
  { to: '/dashboard/medical-records', icon: Activity, label: 'Medical Records' },
  { to: '/dashboard/prescriptions', icon: Pill, label: 'Prescriptions' },
  { to: '/dashboard/health-records', icon: FileText, label: 'Health Records' },
  { to: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/dashboard/orders', icon: Package, label: 'Orders' },
  { to: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/20 z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="gradient-primary p-2 rounded-lg">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">PetCare</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn("sidebar-link", isActive && "active")}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <button onClick={handleLogout} className="sidebar-link w-full text-destructive hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
