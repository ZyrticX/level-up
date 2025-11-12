import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'כניסה מוצלחת!',
        description: 'ברוכים השבים ל-LevelUp',
      });

      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'אימייל או סיסמה שגויים';
      toast({
        title: 'שגיאה בכניסה',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">אימייל</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus={false}
            autoComplete="email"
            className="h-12 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">סיסמה</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-12 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="text-left">
          <Button
            type="button"
            variant="link"
            className="text-primary text-sm px-0 hover:underline"
            onClick={() => {
              toast({
                title: 'שחזור סיסמה',
                description: 'תכונה זו תהיה זמינה בקרוב',
              });
            }}
          >
            שכחתי סיסמה
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        {loading ? 'מתחבר...' : 'כניסה'}
      </Button>
    </form>
  );
};

export default LoginForm;

