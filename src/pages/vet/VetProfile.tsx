import { useEffect, useState } from 'react';
import { api, User } from '@/services/api';
import { User as UserIcon, Mail, Phone, MapPin, Award, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const VetProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your professional profile</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card rounded-xl p-6 shadow-card text-center">
          <div className="gradient-primary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
          <p className="text-primary font-medium">Veterinarian</p>
          <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
          
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-foreground">Licensed Veterinarian</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-foreground">DVM, Cornell University</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Edit Profile</h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" placeholder="VET-12345" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" placeholder="e.g., Small Animals, Surgery" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <textarea 
                id="bio" 
                className="w-full min-h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                placeholder="Tell pet owners about your experience and expertise..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education & Certifications</Label>
              <textarea 
                id="education" 
                className="w-full min-h-20 px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                placeholder="List your degrees and certifications..."
              />
            </div>

            <Button variant="default">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetProfile;
