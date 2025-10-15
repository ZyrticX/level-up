import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Mail, Globe, CreditCard, Shield, Bell } from 'lucide-react';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  siteUrl: string;
  enableRegistration: boolean;
  enableEmailNotifications: boolean;
  enableCourseApproval: boolean;
  maintenanceMode: boolean;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'LevelUp',
    siteDescription: 'פלטפורמת למידה מתקדמת למוסדות לימוד',
    contactEmail: 'contact@levelup.co.il',
    supportEmail: 'support@levelup.co.il',
    siteUrl: 'https://levelup.co.il',
    enableRegistration: true,
    enableEmailNotifications: true,
    enableCourseApproval: false,
    maintenanceMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'הצלחה',
      description: 'ההגדרות נשמרו בהצלחה',
    });
    
    setIsSaving(false);
  };

  const handleReset = () => {
    setSettings({
      siteName: 'LevelUp',
      siteDescription: 'פלטפורמת למידה מתקדמת למוסדות לימוד',
      contactEmail: 'contact@levelup.co.il',
      supportEmail: 'support@levelup.co.il',
      siteUrl: 'https://levelup.co.il',
      enableRegistration: true,
      enableEmailNotifications: true,
      enableCourseApproval: false,
      maintenanceMode: false,
    });
    
    toast({
      title: 'איפוס הגדרות',
      description: 'ההגדרות אופסו לברירת המחדל',
    });
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">הגדרות מערכת</h1>
        <p className="text-muted-foreground">נהל את הגדרות המערכת הכלליות</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              הגדרות כלליות
            </CardTitle>
            <CardDescription>מידע בסיסי על האתר והמערכת</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">שם האתר</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="שם האתר"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">תיאור האתר</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="תיאור קצר של האתר"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">כתובת האתר</Label>
              <Input
                id="siteUrl"
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              הגדרות יצירת קשר
            </CardTitle>
            <CardDescription>כתובות אימייל ליצירת קשר ותמיכה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">אימייל ליצירת קשר</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">אימייל תמיכה טכנית</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="support@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              הגדרות פיצ'רים
            </CardTitle>
            <CardDescription>הפעלה וכיבוי של תכונות המערכת</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableRegistration">אפשר הרשמה חדשה</Label>
                <p className="text-sm text-muted-foreground">
                  אפשר למשתמשים חדשים להירשם למערכת
                </p>
              </div>
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableRegistration: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableEmailNotifications">התראות אימייל</Label>
                <p className="text-sm text-muted-foreground">
                  שלח התראות אימייל למשתמשים על אירועים חשובים
                </p>
              </div>
              <Switch
                id="enableEmailNotifications"
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableEmailNotifications: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableCourseApproval">אישור קורסים</Label>
                <p className="text-sm text-muted-foreground">
                  דרוש אישור מנהל לפני פרסום קורסים חדשים
                </p>
              </div>
              <Switch
                id="enableCourseApproval"
                checked={settings.enableCourseApproval}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableCourseApproval: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-destructive">
                  מצב תחזוקה
                </Label>
                <p className="text-sm text-muted-foreground">
                  הפעל מצב תחזוקה - האתר יהיה לא זמין למשתמשים רגילים
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              מידע מערכת
            </CardTitle>
            <CardDescription>פרטי גרסה ומידע טכני</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">גרסת מערכת</div>
                <div className="text-lg font-semibold">1.0.0</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">סביבה</div>
                <div className="text-lg font-semibold">Production</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">תאריך עדכון אחרון</div>
                <div className="text-lg font-semibold">
                  {new Date().toLocaleDateString('he-IL')}
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">סטטוס מערכת</div>
                <div className="text-lg font-semibold text-green-600">פעיל</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleReset}>
            איפוס לברירת מחדל
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
