import { useEffect, useState } from 'react';
import { api, Appointment } from '@/services/api';
import { Calendar, Clock, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      const data = await api.getAppointments();
      setAppointments(data);
      setIsLoading(false);
    };

    loadAppointments();
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage vet visits</p>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No appointments</h3>
          <p className="text-muted-foreground mb-4">Schedule your first vet appointment</p>
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="gradient-primary p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{appointment.petName}</h3>
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
                <div className="text-muted-foreground">
                  with <span className="text-foreground font-medium">{appointment.vetName}</span>
                </div>
              </div>

              {appointment.status === 'scheduled' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
