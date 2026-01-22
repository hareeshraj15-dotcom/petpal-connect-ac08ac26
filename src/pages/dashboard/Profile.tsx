import { useEffect, useState } from 'react';
import { api, User } from '@/services/api';
import { User as UserIcon, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="bg-card rounded-xl p-8 shadow-card max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>

        {/* Form */}
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
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, State" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio" 
              className="w-full min-h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              placeholder="Tell us about yourself..."
            />
          </div>

          <Button variant="default">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
