import { useEffect, useState } from 'react';
import { api, HealthRecord } from '@/services/api';
import { FileText, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VetPetRecords = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadRecords = async () => {
      const data = await api.getHealthRecords();
      setRecords(data);
      setIsLoading(false);
    };

    loadRecords();
  }, []);

  const filteredRecords = records.filter(r =>
    r.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pet Records</h1>
          <p className="text-muted-foreground">View and manage patient records</p>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by pet name or record type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add a new record</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-foreground">Pet</th>
                <th className="text-left px-6 py-4 font-medium text-foreground">Type</th>
                <th className="text-left px-6 py-4 font-medium text-foreground">Date</th>
                <th className="text-left px-6 py-4 font-medium text-foreground">Description</th>
                <th className="text-left px-6 py-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium text-foreground">{record.petName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{record.date}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{record.description}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VetPetRecords;
