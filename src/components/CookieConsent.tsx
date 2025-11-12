import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { X, Settings } from 'lucide-react';

interface ConsentSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = async (consentType: string, settings?: ConsentSettings) => {
    const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);

    const { data: { user } } = await supabase.auth.getUser();

    const consentsToSave = consentType === 'all' 
      ? [
          { type: 'essential', given: true },
          { type: 'analytics', given: true },
          { type: 'marketing', given: true },
        ]
      : consentType === 'none'
      ? [
          { type: 'essential', given: true },
          { type: 'analytics', given: false },
          { type: 'marketing', given: false },
        ]
      : [
          { type: 'essential', given: true },
          { type: 'analytics', given: settings?.analytics || false },
          { type: 'marketing', given: settings?.marketing || false },
        ];

    for (const { type, given } of consentsToSave) {
      await supabase.from('user_consents').insert({
        user_id: user?.id || null,
        session_id: sessionId,
        consent_type: type,
        consent_given: given,
      });
    }

    const consentData = {
      timestamp: new Date().toISOString(),
      settings: consentType === 'all' ? { essential: true, analytics: true, marketing: true } 
               : consentType === 'none' ? { essential: true, analytics: false, marketing: false }
               : { essential: true, ...settings },
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowBanner(false);
    setShowSettings(false);

    // Load scripts based on consent
    if (consentData.settings.analytics) {
      // Load analytics scripts here when user consents
      console.log('Analytics enabled');
    }
    if (consentData.settings.marketing) {
      // Load marketing scripts here when user consents
      console.log('Marketing enabled');
    }
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleRejectAll = () => {
    saveConsent('none');
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSaveCustom = () => {
    saveConsent('custom', consent);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center p-4 pointer-events-none" dir="rtl">
      <Card className="w-full max-w-2xl shadow-2xl border-2 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
        {showSettings ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(false)}
              className="absolute top-2 left-2 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pr-10">
              <CardTitle className="text-lg">התאם אישית את העוגיות</CardTitle>
              <CardDescription className="text-sm">
                בחר אילו עוגיות תרצה לאפשר
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox id="essential" checked disabled className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="essential" className="text-sm font-medium">
                    עוגיות חיוניות (נדרש)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    הכרחיות לתפעול האתר
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="analytics"
                  checked={consent.analytics}
                  onCheckedChange={(checked) =>
                    setConsent({ ...consent, analytics: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="analytics" className="text-sm font-medium">
                    עוגיות סטטיסטיות
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    עוזרות לנו לשפר את השירות
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketing"
                  checked={consent.marketing}
                  onCheckedChange={(checked) =>
                    setConsent({ ...consent, marketing: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-sm font-medium">
                    עוגיות שיווקיות
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    תוכן מותאם אישית
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleSaveCustom} className="w-full sm:flex-1" size="sm">
                שמור העדפות
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="w-full sm:w-auto" size="sm">
                דחה הכל
              </Button>
            </CardFooter>
          </div>
        ) : (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold mb-1">
                    🍪 אנו משתמשים בעוגיות
                  </CardTitle>
                  <CardDescription className="text-sm">
                    כדי לשפר את חוויית הגלישה שלך ולהציג תוכן מותאם אישית
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRejectAll}
                  className="shrink-0 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardFooter className="flex flex-wrap gap-2 pt-0">
              <Button 
                onClick={handleAcceptAll} 
                className="flex-1 min-w-[120px]" 
                size="sm"
              >
                קבל הכל
              </Button>
              <Button 
                onClick={handleRejectAll} 
                variant="outline" 
                className="flex-1 min-w-[120px]" 
                size="sm"
              >
                דחה הכל
              </Button>
              <Button 
                onClick={handleCustomize} 
                variant="secondary" 
                className="flex-1 min-w-[120px]" 
                size="sm"
              >
                <Settings className="ml-1.5 h-3.5 w-3.5" />
                התאם אישית
              </Button>
            </CardFooter>

            <div className="px-6 pb-3 text-xs text-muted-foreground text-center">
              על ידי המשך, אתה מסכים ל
              <a href="/privacy" className="underline mr-1 hover:text-foreground">
                מדיניות הפרטיות
              </a>
              שלנו
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CookieConsent;