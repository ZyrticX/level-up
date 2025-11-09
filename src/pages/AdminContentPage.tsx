import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video,
  Edit,
  Layers,
  ArrowRight
} from "lucide-react";

const AdminContentPage = () => {
  const navigate = useNavigate();

  const screens = [
    {
      id: 'library',
      title: 'ספריית סרטונים',
      description: 'ניהול כל הסרטונים במערכת - העלאה, חיפוש, סינון וניהול',
      icon: Video,
      path: '/admin/video-library',
      features: [
        'טבלה של כל הסרטונים',
        'חיפוש וסינון מתקדם',
        'העלאה מרובה של סרטונים',
        'סטטוסים: משויך / לא משויך / טיוטה',
        'פעולות: עריכה / מחיקה / צפייה'
      ]
    },
    {
      id: 'editor',
      title: 'עריכת סרטון',
      description: 'הגדרת כל הפרטים של סרטון בודד - שיוך, תגיות, פרסום',
      icon: Edit,
      path: '/admin/video-editor/new',
      features: [
        'תצוגה מקדימה עם נגן וידאו',
        'פרטים בסיסיים: שם, תיאור, תמונה',
        'שיוך היררכי: מוסד > תחום > קורס > פרק > שיעור',
        'מידע נוסף: סדר תצוגה, תגיות, הערות',
        'הגדרות פרסום וחומרי עזר'
      ]
    },
    {
      id: 'builder',
      title: 'בונה קורסים',
      description: 'ארגון הסרטונים בתוך הקורס בצורה ויזואלית עם drag & drop',
      icon: Layers,
      path: '/admin/course-builder',
      features: [
        'עץ היררכי עם drag & drop',
        'רשימה מפורטת של כל המבנה',
        'מספור אוטומטי (1.1, 1.2, 2.1...)',
        'גרירה לשינוי סדר',
        'הוספת פרקים/שיעורים חדשים',
        'עריכה מהירה של שמות'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ניהול תוכן וסרטונים</h1>
          <p className="text-muted-foreground">
            מערכת ניהול תוכן מתקדמת לניהול סרטונים, קורסים ומבנה היררכי
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {screens.map((screen) => {
            const IconComponent = screen.icon;
            return (
              <Card key={screen.id} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold">{screen.title}</h2>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 flex-1">
                      {screen.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {screen.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate(screen.path)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      פתח {screen.title}
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workflow Guide */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">🔄 תהליך העבודה המומלץ</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  1
                </div>
                <p className="font-semibold">העלאה</p>
                <p className="text-sm text-muted-foreground">העלה קבצים למערכת</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  2
                </div>
                <p className="font-semibold">ארגון ראשוני</p>
                <p className="text-sm text-muted-foreground">צור מבנה קורס</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  3
                </div>
                <p className="font-semibold">שיוך סרטונים</p>
                <p className="text-sm text-muted-foreground">שייך סרטונים לקורסים</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  4
                </div>
                <p className="font-semibold">סידור סופי</p>
                <p className="text-sm text-muted-foreground">גרור לסדר הנכון</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  5
                </div>
                <p className="font-semibold">פרסום</p>
                <p className="text-sm text-muted-foreground">סמן פעיל ופרסם</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContentPage;
