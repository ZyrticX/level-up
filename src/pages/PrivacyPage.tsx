import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Mail, Clock, UserCheck, FileText, Settings } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "15 אוקטובר 2025";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">מדיניות פרטיות</h1>
          <p className="text-muted-foreground">
            עודכן לאחרונה: {lastUpdated}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              הקדמה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              ברוכים הבאים ל-LevelUp. אנו מחויבים להגן על פרטיותך ולעמוד בכל דרישות חוק הגנת הפרטיות, תשמ"א-1981 ותיקון 13 לחוק (אוגוסט 2025).
            </p>
            <p>
              מדיניות זו מסבירה כיצד אנו אוספים, משתמשים, מאחסנים ומגנים על המידע האישי שלך.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              אילו מידע אנחנו אוספים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">מידע שאתה מספק לנו:</h3>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>שם פרטי ושם משפחה</li>
                <li>כתובת דואר אלקטרוני</li>
                <li>מספר טלפון</li>
                <li>מוסד לימודים ומחלקה</li>
                <li>מידע נוסף שתבחר לשתף</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">מידע שנאסף אוטומטית:</h3>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>כתובת IP</li>
                <li>סוג דפדפן ומערכת הפעלה</li>
                <li>דפים שביקרת באתר</li>
                <li>זמן ותאריך הביקור</li>
                <li>עוגיות ומזהים ייחודיים (רק אם נתת הסכמה)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              שימוש במידע
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>אנו משתמשים במידע שלך למטרות הבאות:</p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>מתן גישה לקורסים ולתכנים לימודיים</li>
              <li>ניהול חשבון המשתמש שלך</li>
              <li>שליחת עדכונים והודעות רלוונטיות</li>
              <li>שיפור השירות וחוויית המשתמש</li>
              <li>ניתוח סטטיסטי (רק עם הסכמה מפורשת)</li>
              <li>שיווק ופרסום (רק עם הסכמה מפורשת)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              העברת מידע לצדדים שלישיים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              אנו <strong>לא</strong> מוכרים או משכירים את המידע האישי שלך לצדדים שלישיים.
            </p>
            <p>המידע שלך עשוי להיות משותף עם:</p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>ספקי שירותים טכניים (אחסון, תשתיות)</li>
              <li>שירותי אנליטיקה (רק עם הסכמה מפורשת)</li>
              <li>רשויות חוק, אם נדרש על פי דין</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              כל צד שלישי מחויב לעמוד באותן דרישות אבטחה והגנת פרטיות כמו שלנו.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              תקופת שמירת המידע
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              אנו שומרים את המידע האישי שלך כל עוד החשבון שלך פעיל, או כפי שנדרש כדי לספק לך שירותים.
            </p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>מידע חשבון משתמש: עד למחיקת החשבון</li>
              <li>היסטוריית הסכמות: 7 שנים (בהתאם לדרישות החוק)</li>
              <li>נתוני אנליטיקה: עד 24 חודשים</li>
              <li>לוגים טכניים: עד 90 יום</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>זכויותיך</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>בהתאם לחוק הגנת הפרטיות, יש לך את הזכויות הבאות:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong>זכות עיון:</strong> לצפות במידע שנאסף עליך</li>
              <li><strong>זכות תיקון:</strong> לתקן מידע שגוי או לא מדויק</li>
              <li><strong>זכות מחיקה:</strong> למחוק את המידע שלך (למעט מידע שחובה לשמור על פי דין)</li>
              <li><strong>זכות התנגדות:</strong> להתנגד לעיבוד מידע למטרות שיווק</li>
              <li><strong>זכות להסרה מרשימות תפוצה:</strong> להפסיק קבלת דיוור שיווקי</li>
              <li><strong>זכות לשאת מידע:</strong> לקבל את המידע שלך בפורמט נייד</li>
              <li><strong>זכות לבטל הסכמה:</strong> למשוך הסכמה שניתנה בעבר בכל עת</li>
            </ul>

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">איך לממש את זכויותיך:</h3>
              <p className="mb-3">
                לממש את זכויותיך, ניתן לפנות אלינו בדרכים הבאות:
              </p>
              <ul className="list-disc list-inside space-y-1 mr-4 mb-4">
                <li>דואר אלקטרוני: privacy@levelup.co.il</li>
                <li>טלפון: 03-1234567</li>
                <li>דרך הגדרות החשבון באתר</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                נענה לבקשתך תוך 30 יום מקבלתה.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>עוגיות (Cookies)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלך. בהתאם לתיקון 13 לחוק הגנת הפרטיות, אנו נוטלים עוגיות שאינן חיוניות <strong>רק לאחר קבלת הסכמה מפורשת ממך</strong>.
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">סוגי העוגיות שבהן אנו משתמשים:</h3>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li><strong>עוגיות חיוניות:</strong> נדרשות לתפעול האתר (לא ניתן לביטול)</li>
                <li><strong>עוגיות סטטיסטיות:</strong> לניתוח שימוש באתר (דורש הסכמה)</li>
                <li><strong>עוגיות שיווקיות:</strong> להצגת פרסומות רלוונטיות (דורש הסכמה)</li>
              </ul>
            </div>

            <p>
              ניתן לנהל את העדפות העוגיות שלך בכל עת דרך{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  localStorage.removeItem('cookieConsent');
                  window.location.reload();
                }}
              >
                הגדרות עוגיות
              </Button>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>אבטחת המידע</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              אנו נוקטים באמצעי אבטחה פיזיים, טכנולוgiים וארגוניים כדי להגן על המידע שלך מפני גישה, שימוש או גילוי בלתי מורשים.
            </p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>הצפנת SSL/TLS לכל התקשורת</li>
              <li>גישה מוגבלת למידע רק לעובדים מורשים</li>
              <li>גיבויים קבועים ובטוחים</li>
              <li>ניטור שוטף של מערכות האבטחה</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>שינויים במדיניות זו</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר ובדואר אלקטרוני למשתמשים רשומים.
            </p>
            <p className="text-sm text-muted-foreground">
              תאריך עדכון אחרון: <strong>{lastUpdated}</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle>צור קשר</CardTitle>
            <CardDescription>
              יש לך שאלות או רוצה לממש את זכויותיך? אנחנו כאן בשבילך
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>דואר אלקטרוני:</strong> privacy@levelup.co.il</p>
            <p><strong>טלפון:</strong> 03-1234567</p>
            <p><strong>כתובת:</strong> רחוב הטכניון 1, חיפה</p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button asChild>
            <a href="/">חזרה לדף הבית</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;