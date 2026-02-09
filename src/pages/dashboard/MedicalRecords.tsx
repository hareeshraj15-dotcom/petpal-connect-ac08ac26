import { useEffect, useState } from 'react';
import { FileText, Calendar, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecordRow {
  id: string;
  pet_name: string;
  record_type: string;
  description: string;
  vet_name: string;
  diagnosis: string | null;
  treatment: string | null;
  record_date: string;
}

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('medical_records')
        .select('*')
        .eq('pet_owner_id', user.id)
        .order('record_date', { ascending: false });
      setRecords((data as RecordRow[]) || []);
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
        <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
        <p className="text-muted-foreground">Your pets' complete medical history</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No records yet</h3>
          <p className="text-muted-foreground">Medical records will appear here after vet visits</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <div key={r.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="gradient-primary p-3 rounded-lg"><FileText className="h-5 w-5 text-primary-foreground" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{r.record_type}</h3>
                    <p className="text-muted-foreground text-sm">{r.pet_name}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">{r.record_type}</span>
              </div>
              <p className="mt-4 text-foreground">{r.description}</p>
              {r.diagnosis && <p className="text-sm text-muted-foreground mt-1"><strong>Diagnosis:</strong> {r.diagnosis}</p>}
              {r.treatment && <p className="text-sm text-muted-foreground"><strong>Treatment:</strong> {r.treatment}</p>}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{r.record_date}</span></div>
                <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{r.vet_name}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
