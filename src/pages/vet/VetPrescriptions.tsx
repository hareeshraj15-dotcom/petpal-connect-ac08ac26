import { useEffect, useState } from 'react';
import { Pill, Plus, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  created_at: string | null;
}

const VetPrescriptions = () => {
  const { user, profile } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    pet_owner_id: '', pet_name: '', medication: '', dosage: '',
    frequency: '', start_date: '', end_date: '', notes: '',
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('vet_id', user.id)
        .order('created_at', { ascending: false });
      setPrescriptions((data as PrescriptionRow[]) || []);
      setIsLoading(false);
    };
    load();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !form.pet_name || !form.medication || !form.dosage || !form.frequency || !form.start_date || !form.end_date) {
      toast.error('Please fill all required fields');
      return;
    }

    const { error } = await supabase.from('prescriptions').insert({
      vet_id: user.id,
      pet_owner_id: form.pet_owner_id || user.id,
      pet_name: form.pet_name,
      medication: form.medication,
      dosage: form.dosage,
      frequency: form.frequency,
      start_date: form.start_date,
      end_date: form.end_date,
      vet_name: profile?.name || 'Doctor',
      notes: form.notes || null,
    });

    if (error) {
      toast.error('Failed to create prescription');
      return;
    }

    toast.success('Prescription published!');
    setIsOpen(false);
    setForm({ pet_owner_id: '', pet_name: '', medication: '', dosage: '', frequency: '', start_date: '', end_date: '', notes: '' });
    // Reload
    const { data } = await supabase.from('prescriptions').select('*').eq('vet_id', user.id).order('created_at', { ascending: false });
    setPrescriptions((data as PrescriptionRow[]) || []);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">Manage and publish patient prescriptions</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Prescription</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Prescription</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label>Pet Owner ID (optional)</Label><Input value={form.pet_owner_id} onChange={e => setForm({...form, pet_owner_id: e.target.value})} placeholder="Paste owner's user ID" /></div>
              <div><Label>Pet Name *</Label><Input value={form.pet_name} onChange={e => setForm({...form, pet_name: e.target.value})} /></div>
              <div><Label>Medication *</Label><Input value={form.medication} onChange={e => setForm({...form, medication: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Dosage *</Label><Input value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} /></div>
                <div><Label>Frequency *</Label><Input value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date *</Label><Input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} /></div>
                <div><Label>End Date *</Label><Input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} /></div>
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <Button className="w-full" onClick={handleCreate}>Publish Prescription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No prescriptions</h3>
          <p className="text-muted-foreground">Create your first prescription above</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-3 rounded-lg"><Pill className="h-5 w-5 text-primary-foreground" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{p.medication}</h3>
                  <p className="text-muted-foreground text-sm">For: {p.pet_name}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {p.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Dosage:</span><span className="text-foreground">{p.dosage}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frequency:</span><span className="text-foreground">{p.frequency}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{p.start_date} - {p.end_date}</span>
                </div>
                {p.notes && <p className="text-muted-foreground text-xs mt-2">{p.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetPrescriptions;
