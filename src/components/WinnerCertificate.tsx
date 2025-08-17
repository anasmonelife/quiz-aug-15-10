import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award, Download, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WinnerData {
  id: string;
  name: string;
  mobile: string;
  panchayath: string;
  score: number;
  created_at: string;
  position: number;
  submissionTimeSeconds: number;
}

interface WinnerCertificateProps {
  winner: WinnerData;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerCertificate: React.FC<WinnerCertificateProps> = ({ winner, isOpen, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${winner.name.replace(/\s+/g, '_')}_winner_certificate.png`;
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
    const message = `🎉 Congratulations! ${winner.name} has won ${getPositionOrdinal(winner.position)} place in the Quiz Competition!

🏆 Position: ${getPositionText(winner.position)}
📊 Score: ${winner.score}/20
⏱️ Completion Time: ${formatTime(winner.submissionTimeSeconds)}
📍 Panchayath: ${winner.panchayath}
📅 Date: ${formatDate(winner.created_at)}

Well done! 🎊`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Winner Certificate</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Certificate */}
          <Card className="bg-gradient-to-br from-blue-50 to-pink-50">
            <CardContent className="p-0">
              <div 
                ref={certificateRef}
                className="relative bg-gradient-to-br from-blue-100 via-background to-pink-100 p-3 sm:p-6 text-center border-2 sm:border-4 border-blue-300 mx-auto w-80 h-80 sm:w-[500px] sm:h-[500px]"
              >
                {/* Decorative corners */}
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-4 h-4 sm:w-8 sm:h-8 border-l-2 border-t-2 border-blue-400"></div>
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-8 sm:h-8 border-r-2 border-t-2 border-pink-400"></div>
                <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-8 sm:h-8 border-l-2 border-b-2 border-blue-400"></div>
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-8 sm:h-8 border-r-2 border-b-2 border-pink-400"></div>

                {/* Header */}
                <div className="mb-2 sm:mb-4">
                  <div className="mb-1 sm:mb-2">
                    <h1 className="text-sm sm:text-lg font-bold text-blue-600 mb-1">E-life Society</h1>
                    <p className="text-xs text-muted-foreground">(powered by Eva Marketing Solutions Pvt. Ltd.)</p>
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-blue-600 mb-1">CERTIFICATE OF ACHIEVEMENT</h2>
                  <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mb-1 sm:mb-2"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">AZADI-2025 Quiz Competition Winner</p>
                </div>

                {/* Award Icon */}
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="scale-50 sm:scale-75">{getPositionIcon(winner.position)}</div>
                </div>

                {/* Main Content */}
                <div className="mb-2 sm:mb-4">
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-2">This is to certify that</p>
                  <h2 className="text-lg sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-3 tracking-wide">{winner.name}</h2>
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-2">has successfully achieved</p>
                  <div className="bg-gradient-to-r from-blue-100 to-pink-100 p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 border border-blue-200">
                    <h3 className="text-sm sm:text-lg font-bold text-blue-600 mb-1">{getPositionText(winner.position)}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">in the Quiz Competition</p>
                  </div>
                </div>

                {/* Achievement Details */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-4">
                  <div className="bg-blue-50 p-1 sm:p-2 rounded border border-blue-200">
                    <div className="text-sm sm:text-lg font-bold text-blue-600">{winner.score}/20</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="bg-pink-50 p-1 sm:p-2 rounded border border-pink-200">
                    <div className="text-xs sm:text-lg font-bold text-pink-600">{formatTime(winner.submissionTimeSeconds)}</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                  <div className="bg-blue-50 p-1 sm:p-2 rounded border border-blue-200">
                    <div className="text-xs sm:text-sm font-bold text-blue-600">{winner.panchayath}</div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-blue-200 pt-2 sm:pt-3">
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-2">Awarded on {formatDate(winner.created_at)}</p>
                  <div className="flex justify-center items-center">
                    <div className="text-center">
                      <div className="w-16 sm:w-20 border-t border-muted-foreground mb-1"></div>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Button onClick={downloadCertificate} className="flex items-center gap-2" size="sm">
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
            <Button onClick={shareToWhatsApp} variant="outline" className="flex items-center gap-2" size="sm">
              <Share2 className="h-4 w-4" />
              Share on WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerCertificate;