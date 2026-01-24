import { useState } from 'react';
import { PawPrint, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockPets = [
  { id: 1, name: 'Max', species: 'Dog', breed: 'Golden Retriever', owner: 'John Doe', age: 3 },
  { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian', owner: 'Lisa Brown', age: 5 },
  { id: 3, name: 'Buddy', species: 'Dog', breed: 'Labrador', owner: 'Mike Johnson', age: 2 },
  { id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', owner: 'Sarah Adams', age: 4 },
  { id: 5, name: 'Charlie', species: 'Dog', breed: 'Beagle', owner: 'Tom Wilson', age: 6 },
  { id: 6, name: 'Bella', species: 'Dog', breed: 'Poodle', owner: 'Emma Davis', age: 1 },
];

const AdminPets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');

  const filteredPets = mockPets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || pet.species.toLowerCase() === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const getSpeciesEmoji = (species: string) => {
    return species === 'Dog' ? '🐕' : species === 'Cat' ? '🐱' : '🐾';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pet Registry</h1>
          <p className="text-muted-foreground">View all registered pets</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{mockPets.length}</p>
              <p className="text-muted-foreground">Total Pets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {mockPets.filter((p) => p.species === 'Dog').length}
              </p>
              <p className="text-muted-foreground">Dogs 🐕</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {mockPets.filter((p) => p.species === 'Cat').length}
              </p>
              <p className="text-muted-foreground">Cats 🐱</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pet List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              All Pets
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets or owners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
                      {getSpeciesEmoji(pet.species)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    Owner: <span className="text-foreground">{pet.owner}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Age: <span className="text-foreground">{pet.age} years</span>
                  </p>
                </div>
                <div className="mt-3">
                  <Badge variant="secondary">{pet.species}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPets;
