import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const days = [
  { name: 'Monday', enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
  { name: 'Tuesday', enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
  { name: 'Wednesday', enabled: true, slots: ['9:00 AM - 12:00 PM'] },
  { name: 'Thursday', enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
  { name: 'Friday', enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
  { name: 'Saturday', enabled: false, slots: [] },
  { name: 'Sunday', enabled: false, slots: [] },
];

const VetAvailability = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Availability</h1>
        <p className="text-muted-foreground">Set your working hours for appointments</p>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-card max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Weekly Schedule</h2>
        </div>

        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.name} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="w-32 flex items-center gap-3">
                <Switch defaultChecked={day.enabled} />
                <Label className="font-medium text-foreground">{day.name}</Label>
              </div>
              
              <div className="flex-1">
                {day.enabled ? (
                  <div className="space-y-2">
                    {day.slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="px-3 py-2 bg-accent text-accent-foreground rounded-lg text-sm">
                          {slot}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-2">Not available</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-foreground mb-4">Appointment Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Default Appointment Duration</Label>
                <p className="text-sm text-muted-foreground">30 minutes</p>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Buffer Between Appointments</Label>
                <p className="text-sm text-muted-foreground">15 minutes</p>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </div>
        </div>

        <Button variant="default" className="mt-6">Save Schedule</Button>
      </div>
    </div>
  );
};

export default VetAvailability;
