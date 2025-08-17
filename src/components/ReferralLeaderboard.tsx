import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trophy, Medal, Award, Award as Certificate } from 'lucide-react';
import ReferralCertificate from '@/components/ReferralCertificate';

interface ReferralData {
  reference_id: string;
  count: number;
  rank: number;
  attendedPanchayaths: number;
  qualifiedReferrals: number;
}

const ReferralLeaderboard = () => {
  const [referralData, setReferralData] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      // Get all submissions
      const { data: allSubmissions, error } = await supabase
        .from('submissions')
        .select('*');

      if (error) throw error;

      // Count referrals by reference_id and calculate additional metrics
      const referralStats: Record<string, {
        count: number;
        attendedPanchayaths: number;
        qualifiedReferrals: number;
      }> = {};

      allSubmissions?.forEach((submission) => {
        if (submission.reference_id) {
          if (!referralStats[submission.reference_id]) {
            referralStats[submission.reference_id] = {
              count: 0,
              attendedPanchayaths: 0,
              qualifiedReferrals: 0
            };
          }
          referralStats[submission.reference_id].count++;
          
          // Count if this referral scored 5 or more
          if (submission.score >= 5) {
            referralStats[submission.reference_id].qualifiedReferrals++;
          }
        }
      });

      // Calculate attended panchayaths for each reference_id
      for (const referenceId of Object.keys(referralStats)) {
        const referenceIdSubmissions = allSubmissions?.filter(s => s.id === referenceId || s.mobile === referenceId) || [];
        const uniquePanchayaths = new Set(referenceIdSubmissions.map(s => s.panchayath));
        referralStats[referenceId].attendedPanchayaths = uniquePanchayaths.size;
      }

      // Convert to array and sort by count
      const sortedReferrals = Object.entries(referralStats)
        .map(([reference_id, stats]) => ({ 
          reference_id, 
          count: stats.count,
          attendedPanchayaths: stats.attendedPanchayaths,
          qualifiedReferrals: stats.qualifiedReferrals
        }))
        .sort((a, b) => b.count - a.count)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      setReferralData(sortedReferrals);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500">1st Place</Badge>;
      case 2:
        return <Badge className="bg-gray-400">2nd Place</Badge>;
      case 3:
        return <Badge className="bg-amber-600">3rd Place</Badge>;
      default:
        return null;
    }
  };

  const handleGenerateCertificate = (referralItem: ReferralData) => {
    // Create a winner object compatible with the certificate component
    const winner = {
      id: referralItem.reference_id,
      name: `Reference ID: ${referralItem.reference_id}`,
      mobile: 'N/A',
      panchayath: 'Referral Leader',
      score: referralItem.count,
      created_at: new Date().toISOString(),
      position: referralItem.rank,
      submissionTimeSeconds: 0, // Not applicable for referrals
      qualifiedReferrals: referralItem.qualifiedReferrals
    };
    
    setSelectedWinner(winner);
    setShowCertificate(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading referral leaderboard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          Referral Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referralData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No referral data available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {referralData.map((item) => (
              <div
                key={item.reference_id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  item.rank <= 3 ? 'bg-accent/10 border-accent' : 'bg-card'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {getRankIcon(item.rank)}
                  <div>
                    <p className="font-semibold">Reference ID: {item.reference_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count} referral{item.count !== 1 ? 's' : ''} • {item.qualifiedReferrals} qualified (5+ score)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {getRankBadge(item.rank)}
                    <p className="text-2xl font-bold text-primary mt-1">{item.count}</p>
                  </div>
                  {item.rank <= 10 && item.count >= 5 && (
                    <Button 
                      onClick={() => handleGenerateCertificate(item)}
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Certificate className="h-4 w-4" />
                      Generate Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {referralData.length > 0 && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <h3 className="font-semibold mb-2">Winners Announcement</h3>
            <div className="space-y-1 text-sm">
              {referralData.slice(0, 3).map((item) => (
                <p key={item.reference_id}>
                  <span className="font-medium">
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'} 
                    {item.rank === 1 ? '1st' : item.rank === 2 ? '2nd' : '3rd'} Place:
                  </span>{' '}
                  Reference ID {item.reference_id} ({item.count} referrals)
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Referral Certificate Modal */}
      {selectedWinner && (
        <ReferralCertificate
          winner={selectedWinner}
          isOpen={showCertificate}
          onClose={() => {
            setShowCertificate(false);
            setSelectedWinner(null);
          }}
        />
      )}
    </Card>
  );
};

export default ReferralLeaderboard;