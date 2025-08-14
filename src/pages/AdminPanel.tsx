import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LogOut, Users, Trophy, Settings } from 'lucide-react';
import QuestionManagement from '@/components/QuestionManagement';
import SubmissionsTable from '@/components/SubmissionsTable';
import ReferralLeaderboard from '@/components/ReferralLeaderboard';
import QuizWinners from '@/components/QuizWinners';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalQuestions: 0,
    totalReferrals: 0,
  });

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [submissionsResult, questionsResult, referralsResult] = await Promise.all([
        supabase.from('submissions').select('id', { count: 'exact', head: true }),
        supabase.from('questions').select('id', { count: 'exact', head: true }),
        supabase.from('submissions').select('reference_id').not('reference_id', 'is', null),
      ]);

      setStats({
        totalSubmissions: submissionsResult.count || 0,
        totalQuestions: questionsResult.count || 0,
        totalReferrals: referralsResult.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Trophy className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Question Management</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="winners">Quiz Winners</TabsTrigger>
            <TabsTrigger value="leaderboard">Referral Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionManagement onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTable />
          </TabsContent>

          <TabsContent value="winners">
            <QuizWinners />
          </TabsContent>

          <TabsContent value="leaderboard">
            <ReferralLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;