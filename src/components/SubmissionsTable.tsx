import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const filtered = submissions.filter(submission =>
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.mobile.includes(searchTerm) ||
      submission.panchayath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.reference_id && submission.reference_id.includes(searchTerm))
    );
    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
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

  const exportToExcel = () => {
    const dataToExport = filteredSubmissions.map(submission => ({
      Name: submission.name,
      Mobile: submission.mobile,
      Panchayath: submission.panchayath,
      'Reference ID': submission.reference_id || '-',
      Score: `${submission.score}/20`,
      'Submission Time': format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Submissions');
    
    const fileName = `quiz_submissions_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Export Successful",
      description: `${filteredSubmissions.length} submissions exported to ${fileName}`,
    });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Quiz Submissions ({filteredSubmissions.length}/{submissions.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, mobile, panchayath..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Button onClick={exportToExcel} variant="outline" disabled={filteredSubmissions.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No submissions found matching your search.' : 'No submissions yet.'}
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
                {filteredSubmissions.map((submission) => (
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