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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">הגנת הפרטיות שלך חשובה לנו</CardTitle>
              <CardDescription className="mt-2">
                אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלך, לנתח תנועה באתר ולהציג תוכן מותאם אישית.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRejectAll}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!showSettings ? (
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleAcceptAll} className="w-full sm:w-auto">
              קבל הכל
            </Button>
            <Button onClick={handleRejectAll} variant="outline" className="w-full sm:w-auto">
              דחה הכל
            </Button>
            <Button onClick={handleCustomize} variant="secondary" className="w-full sm:w-auto">
              <Settings className="ml-2 h-4 w-4" />
              התאם אישית
            </Button>
          </CardFooter>
        ) : (
          <>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="essential" checked disabled />
                <div className="flex-1">
                  <Label htmlFor="essential" className="font-semibold">
                    עוגיות חיוניות (נדרש)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    עוגיות אלה הכרחיות לתפעול האתר ואינן ניתנות לביטול.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="analytics"
                  checked={consent.analytics}
                  onCheckedChange={(checked) =>
                    setConsent({ ...consent, analytics: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="analytics" className="font-semibold">
                    עוגיות סטטיסטיות
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    עוגיות אלה עוזרות לנו להבין כיצד אתה משתמש באתר ולשפר את השירות.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="marketing"
                  checked={consent.marketing}
                  onCheckedChange={(checked) =>
                    setConsent({ ...consent, marketing: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="marketing" className="font-semibold">
                    עוגיות שיווקיות
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    עוגיות אלה משמשות להצגת פרסומות ותוכן רלוונטי עבורך.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleSaveCustom} className="w-full sm:w-auto">
                שמור העדפות
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="w-full sm:w-auto">
                דחה הכל
              </Button>
            </CardFooter>
          </>
        )}

        <div className="px-6 pb-4 text-xs text-muted-foreground">
          למידע נוסף, עיין ב
          <a href="/privacy" className="underline mr-1">
            מדיניות הפרטיות
          </a>
          שלנו.
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;