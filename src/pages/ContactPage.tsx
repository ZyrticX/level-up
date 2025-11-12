import { useState } from 'react';
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
import { Upload, X } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual ticket creation logic
    // For now, just simulate success
    setTimeout(() => {
      toast({
        title: 'הפנייה נשלחה בהצלחה!',
        description: 'נחזור אליך בהקדם האפשרי',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setFiles([]);

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">צור קשר</h1>
          <p className="text-lg text-muted-foreground">
            יש לך שאלה או בעיה? נשמח לעזור!
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">פתיחת כרטיס</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">נושא הפנייה</Label>
                <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">הודעה</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                required
                rows={6}
                className="text-right resize-none"
                placeholder="פרט את פנייתך..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">צרף קובץ (אופציונלי)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
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
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <span className="text-sm text-muted-foreground mb-1">
                    לחץ לבחירת קבצים או גרור לכאן
                  </span>
                  <span className="text-xs text-muted-foreground">
                    תמונות, PDF, מסמכי Word וקבצי טקסט
                  </span>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="ml-3 p-1 hover:bg-destructive/10 rounded-full transition-colors"
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
              disabled={loading}
              className="w-full btn-primary text-lg py-6"
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

