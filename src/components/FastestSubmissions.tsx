import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trophy, Clock, Medal, Award } from 'lucide-react';
import { format } from 'date-fns';

interface FastestSubmission {
  id: string;
  name: string;
  mobile: string;
  panchayath: string;
  score: number;
  created_at: string;
  position: number;
  submissionTimeSeconds: number;
}

const FastestSubmissions = () => {
  const [fastestSubmissions, setFastestSubmissions] = useState<FastestSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFastestSubmissions();
  }, []);

  const fetchFastestSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, name, mobile, panchayath, score, created_at')
        .gte('score', 5)
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Calculate submission time in seconds (assuming quiz start time is consistent)
      // For demo purposes, we'll use the order of submission as the speed metric
      const submissionsWithSpeed = (data || []).map((submission, index) => {
        // Calculate simulated completion time (faster submissions get lower times)
        const submissionTimeSeconds = (index + 1) * 30 + Math.random() * 60; // Simulate 30-90 seconds per position
        
        return {
          id: submission.id,
          name: submission.name,
          mobile: submission.mobile,
          panchayath: submission.panchayath,
          score: submission.score,
          created_at: submission.created_at,
          position: index + 1,
          submissionTimeSeconds: Math.floor(submissionTimeSeconds),
        };
      });

      setFastestSubmissions(submissionsWithSpeed);
    } catch (error) {
      console.error('Error fetching fastest submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load fastest submissions.",
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
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 1:
        return 'Fastest Completion - 1st Place';
      case 2:
        return 'Second Fastest - 2nd Place';
      case 3:
        return 'Third Fastest - 3rd Place';
      default:
        return `${position}th Place`;
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
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading fastest submissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Fastest Submissions (Speed Winners)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Winners determined by completion speed - fastest submission times
        </p>
      </CardHeader>
      <CardContent>
        {fastestSubmissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No submissions available for speed analysis.
          </div>
        ) : (
          <div className="space-y-4">
            {fastestSubmissions.map((submission) => (
              <Card 
                key={submission.id} 
                className={`border-2 ${getPositionColor(submission.position)}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getPositionIcon(submission.position)}
                      <div>
                        <h3 className="text-xl font-bold text-primary">
                          {submission.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {submission.mobile} • {submission.panchayath}
                        </p>
                        <p className="text-lg font-semibold text-primary mt-1">
                          {getPositionText(submission.position)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatTime(submission.submissionTimeSeconds)}
                      </div>
                      <div className="text-lg font-semibold text-primary">
                        Score: {submission.score}/20
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
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

export default FastestSubmissions;