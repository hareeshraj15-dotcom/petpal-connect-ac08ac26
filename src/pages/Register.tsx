import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, PawPrint, Stethoscope, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

type AppRole = 'pet_owner' | 'veterinarian' | 'admin';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AppRole>('pet_owner');
  const [isLoading, setIsLoading] = useState(false);

  // Vet-specific fields
  const [vetSpecialization, setVetSpecialization] = useState('');
  const [vetExperience, setVetExperience] = useState('');
  const [vetClinic, setVetClinic] = useState('');

  // Pet owner fields
  const [petOwnerPhone, setPetOwnerPhone] = useState('');
  const [petOwnerLocation, setPetOwnerLocation] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, name, role);
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          toast.error('An account with this email already exists.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Account created! Please check your email to verify your account.');
        navigate('/verify-email');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (r: AppRole) => {
    switch (r) {
      case 'pet_owner': return <PawPrint className="h-5 w-5" />;
      case 'veterinarian': return <Stethoscope className="h-5 w-5" />;
      case 'admin': return <Shield className="h-5 w-5" />;
    }
  };

  const getRoleLabel = (r: AppRole) => {
    switch (r) {
      case 'pet_owner': return 'Pet Owner';
      case 'veterinarian': return 'Veterinarian';
      case 'admin': return 'Administrator';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="gradient-primary p-3 rounded-xl shadow-button">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">PetCare</h1>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join PetCare to manage your pet's health</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label>Register as</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <SelectValue>{getRoleLabel(role)}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet_owner"><div className="flex items-center gap-2"><PawPrint className="h-4 w-4" />Pet Owner</div></SelectItem>
                    <SelectItem value="veterinarian"><div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" />Veterinarian</div></SelectItem>
                    <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="h-4 w-4" />Administrator</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pet Owner extra fields */}
              {role === 'pet_owner' && (
                <div className="space-y-3 p-4 bg-accent/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Pet Owner Details</p>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="Your phone number" value={petOwnerPhone} onChange={(e) => setPetOwnerPhone(e.target.value)} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="City, State" value={petOwnerLocation} onChange={(e) => setPetOwnerLocation(e.target.value)} className="h-10" />
                  </div>
                </div>
              )}

              {/* Vet extra fields */}
              {role === 'veterinarian' && (
                <div className="space-y-3 p-4 bg-accent/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Veterinary Details</p>
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Select value={vetSpecialization} onValueChange={setVetSpecialization}>
                      <SelectTrigger className="h-10"><SelectValue placeholder="Select specialization" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Practice</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="dentistry">Dentistry</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="emergency">Emergency Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input type="number" placeholder="e.g., 5" value={vetExperience} onChange={(e) => setVetExperience(e.target.value)} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Clinic / Hospital Name</Label>
                    <Input placeholder="Your clinic name" value={vetClinic} onChange={(e) => setVetClinic(e.target.value)} className="h-10" />
                  </div>
                  <p className="text-xs text-muted-foreground">After registration, upload your license & degree in the Documents section for verification.</p>
                </div>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
