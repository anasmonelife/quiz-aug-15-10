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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Flag className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Independence Day Quiz</h1>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/quiz')} className="bg-primary hover:bg-primary/90">
                Take Quiz
              </Button>
              <Button onClick={() => navigate('/admin-login')} variant="outline">
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-primary mb-4">
              🇮🇳 Independence Day Quiz Competition 🇮🇳
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge about India's freedom struggle and Independence Day. 
              Participate in our quiz competition and share with friends to win prizes!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Participate</h3>
                <p className="text-muted-foreground">Answer 20 questions about India's Independence</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Share2 className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Share & Refer</h3>
                <p className="text-muted-foreground">Generate your referral link and invite friends</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Win Prizes</h3>
                <p className="text-muted-foreground">Top referrers will be announced as winners</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/quiz')} 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
            >
              Start Quiz Now
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Generate Referral Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Your Referral Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobile">Your Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <Button onClick={generateReferralLink} className="w-full">
                    Generate Link
                  </Button>
                  
                  {generatedLink && (
                    <div className="space-y-2">
                      <Label>Your Referral Link:</Label>
                      <div className="flex space-x-2">
                        <Input value={generatedLink} readOnly className="flex-1" />
                        <Button onClick={copyToClipboard} variant="outline">
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share this link with friends and family to invite them to the quiz!
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-8 text-primary">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">For Participants:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Fill out the quiz form with your details</li>
                <li>• Answer 20 Independence Day questions</li>
                <li>• Your score will be calculated automatically</li>
                <li>• Each mobile number can submit only once</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">For Referrers:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Generate your unique referral link</li>
                <li>• Share with friends and family</li>
                <li>• Track your referrals in the leaderboard</li>
                <li>• Top 3 referrers will be declared winners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <p className="text-lg font-semibold">Independence Day Quiz Competition 2024</p>
          <p className="mt-2 opacity-90">Celebrating 77 years of freedom 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
