import { useEffect, useState } from 'react';
import { Clock, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Slot {
  id?: string;
  start_time: string;
  end_time: string;
}

interface DayData {
  enabled: boolean;
  slots: Slot[];
}

const VetAvailability = () => {
  const { user } = useAuth();
  const [days, setDays] = useState<DayData[]>(DAY_NAMES.map(() => ({ enabled: false, slots: [] })));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('vet_availability')
        .select('*')
        .eq('vet_id', user.id);

      if (data && data.length > 0) {
        const newDays: DayData[] = DAY_NAMES.map((_, idx) => {
          const daySlots = data.filter(s => s.day_of_week === idx);
          return {
            enabled: daySlots.some(s => s.is_enabled),
            slots: daySlots.map(s => ({ id: s.id, start_time: s.start_time, end_time: s.end_time })),
          };
        });
        setDays(newDays);
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const toggleDay = (idx: number) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, enabled: !d.enabled } : d));
  };

  const addSlot = (idx: number) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, slots: [...d.slots, { start_time: '09:00:00', end_time: '17:00:00' }] } : d));
  };

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setDays(prev => prev.map((d, i) => i === dayIdx ? { ...d, slots: d.slots.filter((_, si) => si !== slotIdx) } : d));
  };

  const updateSlot = (dayIdx: number, slotIdx: number, field: 'start_time' | 'end_time', value: string) => {
    setDays(prev => prev.map((d, i) => i === dayIdx ? {
      ...d,
      slots: d.slots.map((s, si) => si === slotIdx ? { ...s, [field]: value + ':00' } : s),
    } : d));
  };

  const save = async () => {
    if (!user) return;
    setIsSaving(true);
    // Delete existing slots
    await supabase.from('vet_availability').delete().eq('vet_id', user.id);

    // Insert new slots
    const rows = days.flatMap((d, dayIdx) =>
      d.slots.map(s => ({
        vet_id: user.id,
        day_of_week: dayIdx,
        start_time: s.start_time,
        end_time: s.end_time,
        is_enabled: d.enabled,
      }))
    );

    if (rows.length > 0) {
      const { error } = await supabase.from('vet_availability').insert(rows);
      if (error) {
        toast.error('Failed to save schedule');
        setIsSaving(false);
        return;
      }
    }
    toast.success('Schedule saved successfully!');
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

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
          {days.map((day, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="w-32 flex items-center gap-3 pt-2">
                <Switch checked={day.enabled} onCheckedChange={() => toggleDay(idx)} />
                <Label className="font-medium text-foreground">{DAY_NAMES[idx]}</Label>
              </div>

              <div className="flex-1">
                {day.enabled ? (
                  <div className="space-y-2">
                    {day.slots.map((slot, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={slot.start_time.slice(0, 5)}
                          onChange={(e) => updateSlot(idx, si, 'start_time', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={slot.end_time.slice(0, 5)}
                          onChange={(e) => updateSlot(idx, si, 'end_time', e.target.value)}
                          className="w-32"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSlot(idx, si)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addSlot(idx)}>
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

        <Button onClick={save} disabled={isSaving} className="mt-6">
          {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save Schedule'}
        </Button>
      </div>
    </div>
  );
};

export default VetAvailability;
