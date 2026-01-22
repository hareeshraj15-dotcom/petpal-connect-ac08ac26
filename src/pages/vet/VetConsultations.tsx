import { Stethoscope, Video, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const consultations = [
  { id: 1, petName: 'Luna', ownerName: 'Sarah Parker', type: 'Video Call', time: '11:00 AM', status: 'pending' },
  { id: 2, petName: 'Charlie', ownerName: 'Mike Brown', type: 'Chat', time: '1:30 PM', status: 'pending' },
  { id: 3, petName: 'Daisy', ownerName: 'Emma Wilson', type: 'Video Call', time: 'Yesterday', status: 'completed' },
];

const VetConsultations = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultations</h1>
        <p className="text-muted-foreground">Virtual consultations with pet owners</p>
      </div>

      <div className="grid gap-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-3 rounded-lg">
                  {consultation.type === 'Video Call' ? (
                    <Video className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <MessageCircle className="h-5 w-5 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{consultation.petName}</h3>
                  <p className="text-muted-foreground text-sm">Owner: {consultation.ownerName}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{consultation.time}</span>
                    <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">
                      {consultation.type}
                    </span>
                  </div>
                </div>
              </div>
              
              {consultation.status === 'pending' ? (
                <Button variant="default">
                  {consultation.type === 'Video Call' ? 'Join Call' : 'Open Chat'}
                </Button>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {consultations.length === 0 && (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No consultations</h3>
          <p className="text-muted-foreground">Virtual consultations will appear here</p>
        </div>
      )}
    </div>
  );
};

export default VetConsultations;
