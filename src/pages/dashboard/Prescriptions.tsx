import { useEffect, useState } from 'react';
import { Pill, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PrescriptionRow {
  id: string;
  pet_name: string;
  medication: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
  vet_name: string;
  notes: string | null;
  status: string;
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('pet_owner_id', user.id)
        .order('created_at', { ascending: false });
      setPrescriptions((data as PrescriptionRow[]) || []);
      setIsLoading(false);
    };
    load();
  }, [user]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Prescriptions</h1>
        <p className="text-muted-foreground">View prescriptions from your veterinarian</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No prescriptions</h3>
          <p className="text-muted-foreground">Prescriptions from your vet will appear here</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {prescriptions.map(p => (
            <div key={p.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-3 rounded-lg"><Pill className="h-5 w-5 text-primary-foreground" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{p.medication}</h3>
                  <p className="text-muted-foreground text-sm">For: {p.pet_name}</p>
                  <p className="text-muted-foreground text-xs">By: {p.vet_name}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {p.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Dosage:</span><span>{p.dosage}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frequency:</span><span>{p.frequency}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.start_date} - {p.end_date}</span>
                </div>
                {p.notes && <p className="text-muted-foreground text-xs pt-2">{p.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
