import { useEffect, useState } from 'react';
import { api, Appointment } from '@/services/api';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VetAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    const loadAppointments = async () => {
      const user = api.getCurrentUser();
      if (user) {
        const data = await api.getAppointments(user.id, user.role);
        setAppointments(data);
      }
      setIsLoading(false);
    };

    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter(a => 
    filter === 'all' ? true : a.status === filter
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage your patient appointments</p>
        </div>
        <div className="flex gap-2">
          {['all', 'scheduled', 'completed'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f as typeof filter)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
          <p className="text-muted-foreground">Appointments will appear here when scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="gradient-primary p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{appointment.petName}</h3>
                    <p className="text-muted-foreground text-sm">Owner: {appointment.ownerName}</p>
                    <p className="text-muted-foreground text-sm">{appointment.reason}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 text-sm rounded-full capitalize",
                  getStatusStyles(appointment.status)
                )}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              {appointment.status === 'scheduled' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="default" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetAppointments;
