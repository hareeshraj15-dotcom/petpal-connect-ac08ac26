import { useEffect, useState } from 'react';
import { api, Pet, User } from '@/services/api';
import { PawPrint, Plus, Weight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      const user = api.getCurrentUser();
      if (user) {
        const petData = await api.getPets(user.id);
        setPets(petData);
      }
      setIsLoading(false);
    };

    loadPets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading pets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
          <p className="text-muted-foreground">Manage your pet profiles</p>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No pets yet</h3>
          <p className="text-muted-foreground mb-4">Add your first pet to get started</p>
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-4 rounded-xl">
                  <PawPrint className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{pet.name}</h3>
                  <p className="text-muted-foreground">{pet.breed}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Species:</span>
                  <span className="text-foreground">{pet.species}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{pet.age} years old</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{pet.weight} kg</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPets;
