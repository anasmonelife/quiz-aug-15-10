import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Submission {
  id: string;
  name: string;
  mobile: string;
  panchayath: string;
  reference_id: string | null;
  score: number;
  created_at: string;
}

const SubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading submissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Submissions ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Panchayath</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submission Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.mobile}</TableCell>
                    <TableCell>{submission.panchayath}</TableCell>
                    <TableCell>
                      {submission.reference_id || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {submission.score}/20
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsTable;