import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trophy, Medal, Award } from 'lucide-react';
import { format } from 'date-fns';

interface Winner {
  id: string;
  name: string;
  mobile: string;
  panchayath: string;
  score: number;
  created_at: string;
  position: number;
}

const QuizWinners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, name, mobile, panchayath, score, created_at')
        .order('created_at', { ascending: true })
        .limit(3);

      if (error) throw error;

      const winnersWithPosition = (data || []).map((submission, index) => ({
        ...submission,
        position: index + 1,
      }));

      setWinners(winnersWithPosition);
    } catch (error) {
      console.error('Error fetching winners:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz winners.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 1:
        return '1st Place - Gold Prize';
      case 2:
        return '2nd Place - Silver Prize';
      case 3:
        return '3rd Place - Bronze Prize';
      default:
        return '';
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'border-yellow-500 bg-yellow-50';
      case 2:
        return 'border-gray-400 bg-gray-50';
      case 3:
        return 'border-amber-600 bg-amber-50';
      default:
        return 'border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading quiz winners...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Quiz Winners (Fastest Submissions)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {winners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No quiz submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner) => (
              <Card 
                key={winner.id} 
                className={`border-2 ${getPositionColor(winner.position)}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getPositionIcon(winner.position)}
                      <div>
                        <h3 className="text-xl font-bold text-primary">
                          {winner.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {winner.mobile} • {winner.panchayath}
                        </p>
                        <p className="text-lg font-semibold text-primary mt-1">
                          {getPositionText(winner.position)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {winner.score}/20
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {format(new Date(winner.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizWinners;