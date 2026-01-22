import { useEffect, useState } from 'react';
import { api, HealthRecord } from '@/services/api';
import { FileText, Calendar, User } from 'lucide-react';

const HealthRecords = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await api.getHealthRecords();
      setRecords(data);
      setIsLoading(false);
    };

    loadRecords();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
        <p className="text-muted-foreground">View your pets' medical history</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No records yet</h3>
          <p className="text-muted-foreground">Health records will appear here after vet visits</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="gradient-primary p-3 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{record.type}</h3>
                    <p className="text-muted-foreground text-sm">{record.petName}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                  {record.type}
                </span>
              </div>
              
              <p className="mt-4 text-foreground">{record.description}</p>
              
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{record.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{record.vetName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
