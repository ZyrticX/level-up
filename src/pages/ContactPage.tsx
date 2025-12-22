import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Auto-fill user data
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        }));
      }
      setCheckingAuth(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual ticket creation logic
    setTimeout(() => {
      toast({
        title: 'הפנייה נשלחה בהצלחה!',
        description: 'נחזור אליך בהקדם האפשרי',
      });

      setFormData(prev => ({
        ...prev,
        subject: '',
        message: '',
        ...(user ? {} : { name: '', email: '', phone: '' }),
      }));
      setFiles([]);
      setLoading(false);
    }, 1000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">צור קשר</h1>
          <p className="text-muted-foreground">
            יש לך שאלה או בעיה? נשמח לעזור!
          </p>
        </div>

        {/* User Info Banner (for logged-in users) */}
        {user && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{formData.name}</p>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Guest User Fields */}
            {!user && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="text-right"
                      placeholder="השם שלך"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="text-right"
                      dir="ltr"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון (אופציונלי)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="text-right"
                    placeholder="050-0000000"
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">נושא הפנייה *</Label>
              <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)} required>
                <SelectTrigger id="subject" className="text-right">
                  <SelectValue placeholder="בחר נושא" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">בעיה טכנית</SelectItem>
                  <SelectItem value="content">שאלה על תוכן</SelectItem>
                  <SelectItem value="payment">שאלה על תשלום</SelectItem>
                  <SelectItem value="general">פנייה כללית</SelectItem>
                  <SelectItem value="other">אחר</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">הודעה *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                required
                rows={4}
                className="text-right resize-none"
                placeholder="פרט את פנייתך..."
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">צרף קובץ (אופציונלי)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    setFiles(prev => [...prev, ...selectedFiles]);
                  }}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file"
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    לחץ לבחירת קבצים
                  </span>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-destructive/10 rounded-full transition-colors mr-2"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.subject || !formData.message}
              className="w-full"
              size="lg"
            >
              {loading ? 'שולח...' : 'שלח פנייה'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
