import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award, Download, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReferralWinnerData {
  id: string;
  name: string;
  mobile: string;
  panchayath: string;
  score: number;
  created_at: string;
  position: number;
  submissionTimeSeconds: number;
}

interface ReferralCertificateProps {
  winner: ReferralWinnerData;
  isOpen: boolean;
  onClose: () => void;
}

const ReferralCertificate: React.FC<ReferralCertificateProps> = ({ winner, isOpen, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [contestantName, setContestantName] = useState('');
  const [contestantPanchayath, setContestantPanchayath] = useState('');

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-16 w-16 text-yellow-500" />;
      case 2:
        return <Medal className="h-16 w-16 text-gray-400" />;
      case 3:
        return <Award className="h-16 w-16 text-amber-600" />;
      default:
        return <Trophy className="h-16 w-16 text-primary" />;
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 1:
        return 'FIRST PLACE';
      case 2:
        return 'SECOND PLACE';
      case 3:
        return 'THIRD PLACE';
      default:
        return `${position}TH PLACE`;
    }
  };

  const getPositionOrdinal = (position: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = position % 100;
    return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    if (!contestantName.trim() || !contestantPanchayath.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and panchayath before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${contestantName.replace(/\s+/g, '_')}_referral_certificate.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Success",
        description: "Certificate downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    if (!contestantName.trim() || !contestantPanchayath.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and panchayath before sharing.",
        variant: "destructive",
      });
      return;
    }

    const message = `🎉 Congratulations! ${contestantName} has won ${getPositionOrdinal(winner.position)} place in the Referral Competition!

🏆 Position: ${getPositionText(winner.position)}
📊 Total References: ${winner.score}
📍 Attended Panchayaths: ${contestantPanchayath}
📅 Date: ${formatDate(winner.created_at)}

AZADI-2025 - E-life Society
Well done! 🎊`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Referral Winner Certificate</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Contestant Details Form */}
          <Card className="bg-accent/5">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Please fill in your details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contestantName">Your Name</Label>
                  <Input
                    id="contestantName"
                    value={contestantName}
                    onChange={(e) => setContestantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contestantPanchayath">Attended Panchayaths Count</Label>
                  <Input
                    id="contestantPanchayath"
                    value={contestantPanchayath}
                    onChange={(e) => setContestantPanchayath(e.target.value)}
                    placeholder="Number of panchayaths attended"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardContent className="p-0">
              <div 
                ref={certificateRef}
                className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-12 text-center border-8 border-primary/20"
                style={{ minHeight: '600px' }}
              >
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-primary/30"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-primary/30"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-primary/30"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-primary/30"></div>

                {/* Header */}
                <div className="mb-8">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-primary mb-1">E-life Society</h1>
                    <p className="text-sm text-muted-foreground">(powered by Eva Marketing Solutions Pvt. Ltd.)</p>
                    <p className="text-base text-muted-foreground italic mt-1">a socio-women empowerment practical program</p>
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">CERTIFICATE OF ACHIEVEMENT</h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4"></div>
                  <p className="text-xl text-muted-foreground">AZADI-2025 Referral Competition Winner</p>
                </div>

                {/* Award Icon */}
                <div className="flex justify-center mb-6">
                  {getPositionIcon(winner.position)}
                </div>

                {/* Main Content */}
                <div className="mb-8">
                  <p className="text-lg text-muted-foreground mb-4">This is to certify that</p>
                  <h2 className="text-5xl font-bold text-primary mb-6 tracking-wide">
                    {contestantName || '[Your Name]'}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">has successfully achieved</p>
                  <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg mb-6">
                    <h3 className="text-3xl font-bold text-primary mb-2">{getPositionText(winner.position)}</h3>
                    <p className="text-xl text-muted-foreground">in the Referral Competition</p>
                  </div>
                </div>

                {/* Achievement Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{winner.score}</div>
                    <div className="text-sm text-muted-foreground">Total References</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{contestantPanchayath || '[Count]'}</div>
                    <div className="text-sm text-muted-foreground">Attended Panchayaths</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="text-lg font-bold text-primary">Reference ID: {winner.id}</div>
                    <div className="text-sm text-muted-foreground">Reference Code</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-primary/20 pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Awarded on {formatDate(winner.created_at)}</p>
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <div className="w-32 border-t border-muted-foreground mb-2"></div>
                      <p className="text-sm text-muted-foreground">Program Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={downloadCertificate} 
              className="flex items-center gap-2"
              disabled={!contestantName.trim() || !contestantPanchayath.trim()}
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
            <Button 
              onClick={shareToWhatsApp} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!contestantName.trim() || !contestantPanchayath.trim()}
            >
              <Share2 className="h-4 w-4" />
              Share on WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralCertificate;