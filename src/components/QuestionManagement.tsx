import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

interface QuestionManagementProps {
  onUpdate: () => void;
}

const QuestionManagement = ({ onUpdate }: QuestionManagementProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_answer: '',
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at');

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
        description: "Failed to load questions.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correct_answer: '',
    });
    setEditingQuestion(null);
    setShowAddForm(false);
  };

  const handleEdit = (question: Question) => {
    setFormData({
      question_text: question.question_text,
      optionA: question.options.A,
      optionB: question.options.B,
      optionC: question.options.C,
      optionD: question.options.D,
      correct_answer: question.correct_answer,
    });
    setEditingQuestion(question);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_text || !formData.optionA || !formData.optionB || 
        !formData.optionC || !formData.optionD || !formData.correct_answer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const questionData = {
      question_text: formData.question_text,
      options: {
        A: formData.optionA,
        B: formData.optionB,
        C: formData.optionC,
        D: formData.optionD,
      },
      correct_answer: formData.correct_answer,
    };

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast({
          title: "Question Updated",
          description: "Question has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('questions')
          .insert(questionData);

        if (error) throw error;
        toast({
          title: "Question Added",
          description: "New question has been added successfully.",
        });
      }

      resetForm();
      fetchQuestions();
      onUpdate();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Question Deleted",
        description: "Question has been deleted successfully.",
      });

      fetchQuestions();
      onUpdate();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question_text">Question</Label>
                <Textarea
                  id="question_text"
                  value={formData.question_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                  placeholder="Enter the question"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionA">Option A</Label>
                  <Input
                    id="optionA"
                    value={formData.optionA}
                    onChange={(e) => setFormData(prev => ({ ...prev, optionA: e.target.value }))}
                    placeholder="Option A"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="optionB">Option B</Label>
                  <Input
                    id="optionB"
                    value={formData.optionB}
                    onChange={(e) => setFormData(prev => ({ ...prev, optionB: e.target.value }))}
                    placeholder="Option B"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="optionC">Option C</Label>
                  <Input
                    id="optionC"
                    value={formData.optionC}
                    onChange={(e) => setFormData(prev => ({ ...prev, optionC: e.target.value }))}
                    placeholder="Option C"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="optionD">Option D</Label>
                  <Input
                    id="optionD"
                    value={formData.optionD}
                    onChange={(e) => setFormData(prev => ({ ...prev, optionD: e.target.value }))}
                    placeholder="Option D"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correct_answer">Correct Answer</Label>
                <Select value={formData.correct_answer} onValueChange={(value) => setFormData(prev => ({ ...prev, correct_answer: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    {index + 1}. {question.question_text}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>A) {question.options.A}</div>
                    <div>B) {question.options.B}</div>
                    <div>C) {question.options.C}</div>
                    <div>D) {question.options.D}</div>
                  </div>
                  <p className="text-sm font-medium text-accent mt-2">
                    Correct Answer: {question.correct_answer}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(question)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(question.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionManagement;