import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Failed to verify your email. The link may have expired.');
          return;
        }

        if (session?.user) {
          // Check if profile exists, if not create it
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!existingProfile) {
            // Create profile from user metadata
            const metadata = session.user.user_metadata;
            const name = metadata?.name || session.user.email?.split('@')[0] || 'User';
            const role = metadata?.role || 'pet_owner';

            // Insert profile
            await supabase.from('profiles').insert({
              user_id: session.user.id,
              name,
            });

            // Insert role
            await supabase.from('user_roles').insert({
              user_id: session.user.id,
              role,
            });
          }

          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');

          // Redirect based on role
          setTimeout(async () => {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();

            const userRole = roleData?.role || 'pet_owner';

            switch (userRole) {
              case 'veterinarian':
                navigate('/vet-dashboard');
                break;
              case 'admin':
                navigate('/admin-dashboard');
                break;
              default:
                navigate('/dashboard');
            }
          }, 1500);
        } else {
          setStatus('error');
          setMessage('No session found. Please try signing in again.');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

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
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === 'loading' && 'Processing your verification...'}
              {status === 'success' && 'Your email has been verified!'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-primary" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
            
            <p className="text-center text-muted-foreground">{message}</p>

            {status === 'error' && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
