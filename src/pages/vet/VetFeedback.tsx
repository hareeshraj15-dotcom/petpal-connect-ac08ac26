import { useEffect, useState } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const VetFeedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('feedback')
        .select('*')
        .eq('vet_id', user.id)
        .order('created_at', { ascending: false });
      setFeedback((data as FeedbackRow[]) || []);
      setIsLoading(false);
    };
    load();
  }, [user]);

  const avgRating = feedback.length > 0
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback & Reviews</h1>
        <p className="text-muted-foreground">See what pet owners say about your care</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
        <div className="bg-card rounded-xl p-6 shadow-card text-center">
          <p className="text-3xl font-bold text-primary">{avgRating}</p>
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <div className="flex justify-center mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card text-center">
          <p className="text-3xl font-bold text-foreground">{feedback.length}</p>
          <p className="text-sm text-muted-foreground">Total Reviews</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card text-center">
          <p className="text-3xl font-bold text-foreground">{feedback.filter(f => f.rating >= 4).length}</p>
          <p className="text-sm text-muted-foreground">Positive (4-5★)</p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No feedback yet</h3>
          <p className="text-muted-foreground">Feedback from pet owners will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {feedback.map(f => (
            <div key={f.id} className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= f.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-2">{new Date(f.created_at).toLocaleDateString()}</span>
              </div>
              {f.comment && <p className="text-foreground text-sm">{f.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetFeedback;
