import { useEffect, useState } from 'react';
import { api, Prescription } from '@/services/api';
import { Pill, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VetPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrescriptions = async () => {
      const data = await api.getPrescriptions();
      setPrescriptions(data);
      setIsLoading(false);
    };

    loadPrescriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">Manage patient prescriptions</p>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No prescriptions</h3>
          <p className="text-muted-foreground">Prescriptions will appear here when created</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-3 rounded-lg">
                  <Pill className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{prescription.medication}</h3>
                  <p className="text-muted-foreground text-sm">For: {prescription.petName}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dosage:</span>
                  <span className="text-foreground">{prescription.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="text-foreground">{prescription.frequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {prescription.startDate} - {prescription.endDate}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">Renew</Button>
                <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetPrescriptions;
