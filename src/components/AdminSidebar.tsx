import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  PawPrint, 
  Calendar, 
  Settings, 
  LogOut,
  Shield,
  Menu,
  X,
  BarChart3,
  UserCog,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { useState } from 'react';

const menuItems = [
  { to: '/admin-dashboard', icon: Home, label: 'Dashboard', end: true },
  { to: '/admin-dashboard/users', icon: Users, label: 'User Management' },
  { to: '/admin-dashboard/veterinarians', icon: UserCog, label: 'Veterinarians' },
  { to: '/admin-dashboard/pets', icon: PawPrint, label: 'Pets' },
  { to: '/admin-dashboard/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin-dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin-dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin-dashboard/settings', icon: Settings, label: 'Settings' },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await api.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="bg-destructive p-2 rounded-lg">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-sidebar-foreground">PetCare</span>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "sidebar-link",
                        isActive && "active"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
