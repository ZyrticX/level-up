import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Folder, 
  FileText, 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  MessageCircle 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

// Mock course data
const courseData = {
  'physics-101': {
    name: 'פיזיקה 1 - מכניקה קלאסית',
    institution: 'הטכניון',
    department: 'מדעי המחשב',
    price: 299,
    stats: {
      duration: '45 שעות',
      videos: 32,
      warmupQuestions: 150,
      examQuestions: 85,
      lastUpdate: '15/01/2024'
    },
    chapters: [
      'פרק 1 - מבוא לפיזיקה קלאסית',
      'פרק 2 - קינמטיקה',
      'פרק 3 - דינמיקה וחוקי ניוטון',
      'פרק 4 - עבודה ואנרגיה',
      'פרק 5 - תנע וחוקי שימור',
      'פרק 6 - תנועה סיבובית',
      'פרק 7 - גרביטציה',
      'פרק 8 - תנודות'
    ],
    studyMaterials: {
      summaries: [
        'סיכום פרק 1 - יסודות הפיזיקה.pdf',
        'סיכום פרק 2 - קינמטיקה.pdf',
        'סיכום פרק 3 - דינמיקה.pdf',
        'סיכום פרק 4 - אנרגיה.pdf'
      ],
      generalFiles: [
        'נוסחאות חשובות.pdf',
        'טבלת יחידות מידה.pdf',
        'דוגמאות נוספות.pdf'
      ],
      pastExams: [
        'מבחן מועד א\' 2023.pdf',
        'מבחן מועד ב\' 2023.pdf',
        'מבחן מועד א\' 2022.pdf',
        'מבחן מועד ב\' 2022.pdf'
      ]
    },
    whatsappLink: 'https://chat.whatsapp.com/physics101group'
  }
};

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [discountCode, setDiscountCode] = useState('');
  const [isPurchased, setPurchased] = useState(false); // Mock state
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">הקורס לא נמצא</h1>
          <Link to="/" className="text-primary hover:underline">
            חזרה לדף הבית
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePurchase = () => {
    // Mock purchase logic
    setPurchased(true);
  };

  const toggleFolder = (folderName: string) => {
    setOpenFolder(openFolder === folderName ? null : folderName);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to={`/institution/${course.institution}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            חזרה ל{course.institution}
          </Link>
        </div>

        {/* Course Overview Section */}
        <div className="bg-gradient-to-l from-orange-500 to-orange-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 ml-2" />
                <span>משך הקורס: {course.stats.duration}</span>
              </div>
              <div className="flex items-center">
                <Video className="w-5 h-5 ml-2" />
                <span>סרטוני וידאו: {course.stats.videos}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 ml-2" />
                <span>שאלות חימום: {course.stats.warmupQuestions}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 ml-2" />
                <span>שאלות מבחנים: {course.stats.examQuestions}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 ml-2" />
                <span>עדכון אחרון: {course.stats.lastUpdate}</span>
              </div>
              {isPurchased && (
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  <a 
                    href={course.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 underline"
                  >
                    קבוצת וואטסאפ
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Purchase & Chapters */}
          <div className="lg:col-span-2 space-y-8">
            {/* Purchase Section */}
            {!isPurchased && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    רכישת הקורס
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-foreground">
                    ₪{course.price}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="discount-code" className="text-sm font-medium text-muted-foreground">
                      קוד קופון (אופציונלי)
                    </label>
                    <Input
                      id="discount-code"
                      type="text"
                      placeholder="הכנס קוד קופון"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="text-right"
                    />
                  </div>
                  <Button 
                    onClick={handlePurchase}
                    className="w-full btn-hero text-lg py-3"
                  >
                    רכוש עכשיו
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Course Chapters */}
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">פרקי הקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.chapters.map((chapter, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {chapter}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Study Materials */}
          <div className="space-y-8">
            {/* Study Materials Section */}
            {isPurchased && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary">
                    חומרי עזר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summaries Folder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFolder('summaries')}
                      className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Folder className="w-5 h-5 ml-2 text-primary" />
                        <span className="font-medium">סיכומי שיעורים</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.studyMaterials.summaries.length} קבצים
                      </span>
                    </button>
                    <Collapsible open={openFolder === 'summaries'}>
                      <CollapsibleContent className="border-t">
                        <div className="p-2 space-y-2">
                          {course.studyMaterials.summaries.map((file, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                            >
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 ml-2 text-red-500" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary cursor-pointer hover:text-primary/80" />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* General Files Folder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFolder('general')}
                      className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Folder className="w-5 h-5 ml-2 text-primary" />
                        <span className="font-medium">קבצים כלליים</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.studyMaterials.generalFiles.length} קבצים
                      </span>
                    </button>
                    <Collapsible open={openFolder === 'general'}>
                      <CollapsibleContent className="border-t">
                        <div className="p-2 space-y-2">
                          {course.studyMaterials.generalFiles.map((file, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                            >
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 ml-2 text-blue-500" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary cursor-pointer hover:text-primary/80" />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Past Exams Folder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFolder('exams')}
                      className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Folder className="w-5 h-5 ml-2 text-primary" />
                        <span className="font-medium">מבחני עבר</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.studyMaterials.pastExams.length} קבצים
                      </span>
                    </button>
                    <Collapsible open={openFolder === 'exams'}>
                      <CollapsibleContent className="border-t">
                        <div className="p-2 space-y-2">
                          {course.studyMaterials.pastExams.map((file, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                            >
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 ml-2 text-green-500" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary cursor-pointer hover:text-primary/80" />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message for non-purchased users */}
            {!isPurchased && (
              <Card className="bg-muted">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    חומרי עזר נוספים
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    רכש את הקורס כדי לקבל גישה לחומרי עזר, סיכומים ומבחני עבר
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursePage;