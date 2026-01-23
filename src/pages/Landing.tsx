import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, PawPrint, Calendar, Stethoscope, Shield, MessageCircle, ArrowRight } from 'lucide-react';
import heroPetsImage from '@/assets/hero-pets.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-lg">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PetCare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
                <PawPrint className="h-4 w-4" />
                Your Pet's Health, Simplified
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Complete Pet Healthcare
                <br />
                <span className="text-primary">Management Platform</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                Connect with veterinarians, track health records, schedule appointments, and give your pets the care they deserve — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <Button variant="hero" size="xl" className="group">
                    Start Free Today
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <img 
                src={heroPetsImage} 
                alt="Happy dog and cat together" 
                className="w-full h-auto rounded-2xl shadow-hover object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools for pet owners and veterinarians
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: PawPrint,
                title: 'Pet Profiles',
                description: 'Manage all your pets in one place with detailed health profiles and history.',
              },
              {
                icon: Calendar,
                title: 'Appointments',
                description: 'Schedule and manage vet visits with easy online booking.',
              },
              {
                icon: Stethoscope,
                title: 'Health Records',
                description: 'Keep track of vaccinations, treatments, and medical history.',
              },
              {
                icon: MessageCircle,
                title: 'Direct Messaging',
                description: 'Communicate directly with your veterinarian for quick consultations.',
              },
              {
                icon: Shield,
                title: 'Prescriptions',
                description: 'View and manage your pet\'s prescriptions and medications.',
              },
              {
                icon: Heart,
                title: 'Wellness Tracking',
                description: 'Monitor your pet\'s overall health and wellness over time.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-hover transition-shadow duration-300"
              >
                <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center shadow-button">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-lg">
              Join thousands of pet owners who trust PetCare for their pet's health management.
            </p>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="xl"
                className="bg-card text-foreground hover:bg-card/90"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="gradient-primary p-2 rounded-lg">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">PetCare</span>
          </div>
          <p className="text-sm">© 2026 PetCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
