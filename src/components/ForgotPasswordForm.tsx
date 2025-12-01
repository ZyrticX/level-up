import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await authService.sendPasswordResetEmail(email);

    if (result.success) {
      setEmailSent(true);
      toast({
        title: 'נשלח אימייל לאיפוס סיסמה',
        description: 'בדוק את תיבת הדואר שלך',
      });
    } else {
      toast({
        title: 'שגיאה',
        description: result.error,
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4" dir="rtl">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold">האימייל נשלח!</h3>
        <p className="text-muted-foreground">
          שלחנו לך אימייל עם קישור לאיפוס הסיסמה.
          <br />
          בדוק את תיבת הדואר שלך (כולל תיקיית הספאם).
        </p>
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזור להתחברות
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">שכחת סיסמה?</h3>
        <p className="text-sm text-muted-foreground">
          הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email">אימייל</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="text-right"
          dir="ltr"
        />
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12"
        >
          {loading ? 'שולח...' : 'שלח קישור לאיפוס'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          חזור להתחברות
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

