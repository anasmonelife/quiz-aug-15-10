import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
}

interface DatabaseQuestion {
  id: string;
  question_text: string;
  options: any;
  correct_answer: string;
}

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    panchayath: '',
    reference_id: searchParams.get('ref') || '',
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('random()')
        .limit(5);

      if (error) throw error;
      
      const formattedQuestions: Question[] = (data || []).map((item: DatabaseQuestion) => ({
        id: item.id,
        question_text: item.question_text,
        options: item.options as { A: string; B: string; C: string; D: string },
        correct_answer: item.correct_answer,
      }));
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (userAnswers: Record<string, string>) => {
    let score = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correct_answer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.panchayath) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const score = calculateScore(answers);
      
      const { error } = await supabase
        .from('submissions')
        .insert({
          name: formData.name,
          mobile: formData.mobile,
          panchayath: formData.panchayath,
          reference_id: formData.reference_id || null,
          answers,
          score,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Submitted",
            description: "This mobile number has already been used to submit the quiz.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Quiz Submitted!",
        description: `Thank you for participating! Your score: ${score}/${questions.length}`,
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading quiz questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-primary">Independence Day Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Participant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Participant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="panchayath">Panchayath *</Label>
                <Input
                  id="panchayath"
                  value={formData.panchayath}
                  onChange={(e) => setFormData(prev => ({ ...prev, panchayath: e.target.value }))}
                  placeholder="Enter your panchayath"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reference_id">Reference ID</Label>
                <Input
                  id="reference_id"
                  value={formData.reference_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference_id: e.target.value }))}
                  placeholder="Reference ID (if any)"
                  disabled={!!searchParams.get('ref')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiz Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions ({questions.length} Questions)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg bg-card">
                  <h3 className="font-semibold mb-4">
                    {index + 1}. {question.question_text}
                  </h3>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
                  >
                    {Object.entries(question.options).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={`${question.id}-${key}`} />
                        <Label htmlFor={`${question.id}-${key}`} className="flex-1 cursor-pointer">
                          {key}) {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Quiz;