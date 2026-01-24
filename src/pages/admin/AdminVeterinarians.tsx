import { useState } from 'react';
import { UserCog, Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockVeterinarians = [
  { id: 1, name: 'Dr. Sarah Wilson', email: 'sarah@vetclinic.com', specialty: 'General Practice', verified: true, rating: 4.8, patients: 124 },
  { id: 2, name: 'Dr. Emily Chen', email: 'emily@petcare.com', specialty: 'Surgery', verified: false, rating: 0, patients: 0 },
  { id: 3, name: 'Dr. James Miller', email: 'james@animalhealth.com', specialty: 'Dermatology', verified: true, rating: 4.5, patients: 89 },
  { id: 4, name: 'Dr. Maria Garcia', email: 'maria@vetcare.com', specialty: 'Emergency Care', verified: true, rating: 4.9, patients: 156 },
];

const AdminVeterinarians = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVets = mockVeterinarians.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Veterinarian Management</h1>
          <p className="text-muted-foreground">Verify and manage veterinarians</p>
        </div>
      </div>

      {/* Pending Verification */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-yellow-700">Pending Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {mockVeterinarians.filter((v) => !v.verified).length > 0 ? (
            <div className="space-y-4">
              {mockVeterinarians
                .filter((v) => !v.verified)
                .map((vet) => (
                  <div key={vet.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{vet.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{vet.name}</p>
                        <p className="text-sm text-muted-foreground">{vet.specialty}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Review
                      </Button>
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending verifications</p>
          )}
        </CardContent>
      </Card>

      {/* All Veterinarians */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Verified Veterinarians
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search veterinarians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredVets
              .filter((v) => v.verified)
              .map((vet) => (
                <div key={vet.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {vet.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{vet.name}</h3>
                        <Badge className="bg-green-500">Verified</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vet.specialty}</p>
                      <p className="text-sm text-muted-foreground">{vet.email}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-foreground">⭐ {vet.rating}</span>
                        <span className="text-muted-foreground">{vet.patients} patients</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVeterinarians;
