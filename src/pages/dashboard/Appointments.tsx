import { useEffect, useState } from 'react';
import { api, Appointment } from '@/services/api';
import { Calendar, Clock, Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const APPOINTMENT_FEE = 500; // ₹500 consultation fee

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    petName: '',
    reason: '',
    date: '',
    time: '',
  });
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();

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

  const handleBookAppointment = () => {
    if (!bookingForm.petName || !bookingForm.reason || !bookingForm.date || !bookingForm.time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    initiatePayment({
      amount: APPOINTMENT_FEE,
      name: 'PetCare Vet Consultation',
      description: `Appointment for ${bookingForm.petName} - ${bookingForm.reason}`,
      notes: {
        petName: bookingForm.petName,
        reason: bookingForm.reason,
        date: bookingForm.date,
        time: bookingForm.time,
      },
      onSuccess: () => {
        // Add to local appointments (in real app, this would be saved to database)
        const newAppointment: Appointment = {
          id: Date.now(),
          petId: 1,
          petName: bookingForm.petName,
          ownerName: 'You',
          vetId: 1,
          vetName: 'Dr. Sarah Wilson',
          date: bookingForm.date,
          time: bookingForm.time,
          status: 'scheduled',
          reason: bookingForm.reason,
        };
        setAppointments((prev) => [newAppointment, ...prev]);
        setIsBookingOpen(false);
        setBookingForm({ petName: '', reason: '', date: '', time: '' });
        toast({
          title: 'Appointment Booked!',
          description: `Your appointment is confirmed for ${bookingForm.date} at ${bookingForm.time}`,
        });
      },
    });
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
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details below. Consultation fee: ₹{APPOINTMENT_FEE}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  placeholder="Enter your pet's name"
                  value={bookingForm.petName}
                  onChange={(e) => setBookingForm({ ...bookingForm, petName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Select
                  value={bookingForm.reason}
                  onValueChange={(value) => setBookingForm({ ...bookingForm, reason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Checkup">General Checkup</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Illness/Injury">Illness/Injury</SelectItem>
                    <SelectItem value="Dental Care">Dental Care</SelectItem>
                    <SelectItem value="Grooming">Grooming</SelectItem>
                    <SelectItem value="Surgery Consultation">Surgery Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select
                  value={bookingForm.time}
                  onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Consultation Fee</span>
                  <span className="text-xl font-bold text-primary">₹{APPOINTMENT_FEE}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleBookAppointment}
                  disabled={isPaymentLoading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isPaymentLoading ? 'Processing...' : 'Pay & Book Appointment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No appointments</h3>
          <p className="text-muted-foreground mb-4">Schedule your first vet appointment</p>
          <Button variant="default" onClick={() => setIsBookingOpen(true)}>
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
