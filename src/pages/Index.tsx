import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Flag, Trophy, Users, Share2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const generateReferralLink = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = window.location.origin;
    const link = `${baseUrl}/quiz?ref=${mobileNumber}`;
    setGeneratedLink(link);
    
    toast({
      title: "Referral Link Generated!",
      description: "Share this link to invite others to participate.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link Copied!",
        description: "Referral link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-5 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-sm border"></div>
              <h1 className="text-xl font-bold text-slate-800">കിസ് നിസ്സം</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="bg-orange-100 px-3 py-1 rounded-full">0</span>
              <span className="text-slate-600">അയ്യൻ ലൊഗിൻ</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          {/* Indian Flag Emblem */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-orange-500 via-white to-green-500 border-4 border-blue-600 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-orange-600">കിസ്</span>{' '}
              <span className="text-green-600">ലേവാഗം</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              നിങ്ങളുടെ അറിവ് പരീക്ഷിക്കാനുള്ള സമയമായി
            </p>
          </div>

          {/* Main Quiz Button */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/quiz')} 
              size="lg" 
              className="text-lg px-12 py-6 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              കിസ് എടുക്കുക
            </Button>
          </div>

          {/* Share Link Section */}
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Share2 className="h-5 w-5 text-slate-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-700">Create Share Link</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mobile" className="text-slate-700 font-medium">Your Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className="mt-2 border-slate-300 focus:border-blue-500"
                  />
                </div>
                
                <Button 
                  onClick={generateReferralLink} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                >
                  Generate Share Link
                </Button>
                
                {generatedLink && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex space-x-2">
                      <Input value={generatedLink} readOnly className="flex-1 text-sm" />
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Share this link with friends and family to invite them!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Access */}
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/admin-login')} 
              variant="ghost" 
              className="text-slate-500 hover:text-slate-700"
            >
              Admin Panel
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="container mx-auto text-center">
          <p className="text-lg font-semibold text-white">സ്വാതന്ത്ര്യ ദിന കിസ് മത്സരം 2024</p>
          <p className="mt-2 text-white/90">77 വർഷത്തെ സ്വാതന്ത്ര്യം ആഘോഷിക്കുന്നു 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
