import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Folder, 
  FileText, 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  MessageCircle,
  ChevronDown,
  CheckCircle,
  Package
} from 'lucide-react';

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
      { 
        title: 'פרק 1 - מבוא לפיזיקה קלאסית', 
        duration: '05:32:15',
        topics: [
          { name: 'מבוא כללי', duration: '00:45:30' },
          { name: 'יחידות מידה', duration: '01:12:00' },
          { name: 'וקטורים', duration: '01:35:45' },
          { name: 'תרגילים', duration: '01:59:00' }
        ]
      },
      { 
        title: 'פרק 2 - קינמטיקה', 
        duration: '06:15:30',
        topics: [
          { name: 'תנועה חד ממדית', duration: '01:30:00' },
          { name: 'תנועה דו ממדית', duration: '02:00:00' },
          { name: 'תנועה מעגלית', duration: '01:45:30' },
          { name: 'דוגמאות', duration: '01:00:00' }
        ]
      },
      { 
        title: 'פרק 3 - דינמיקה וחוקי ניוטון', 
        duration: '07:45:20',
        topics: [
          { name: 'חוק ניוטון הראשון', duration: '01:15:00' },
          { name: 'חוק ניוטון השני', duration: '02:30:20' },
          { name: 'חוק ניוטון השלישי', duration: '01:45:00' },
          { name: 'יישומים', duration: '02:15:00' }
        ]
      },
      { 
        title: 'פרק 4 - עבודה ואנרגיה', 
        duration: '05:55:45',
        topics: [
          { name: 'מושג העבודה', duration: '01:20:00' },
          { name: 'אנרגיה קינטית', duration: '01:35:15' },
          { name: 'אנרגיה פוטנציאלית', duration: '01:40:30' },
          { name: 'שימור אנרגיה', duration: '01:20:00' }
        ]
      },
      { 
        title: 'פרק 5 - תנע וחוקי שימור', 
        duration: '06:30:10',
        topics: [
          { name: 'מושג התנע', duration: '01:30:00' },
          { name: 'שימור תנע', duration: '02:00:10' },
          { name: 'התנגשויות', duration: '02:00:00' },
          { name: 'תרגילים', duration: '01:00:00' }
        ]
      },
      { 
        title: 'פרק 6 - תנועה סיבובית', 
        duration: '05:20:35',
        topics: [
          { name: 'קינמטיקה סיבובית', duration: '01:45:00' },
          { name: 'דינמיקה סיבובית', duration: '02:15:35' },
          { name: 'תנע זוויתי', duration: '01:20:00' }
        ]
      },
      { 
        title: 'פרק 7 - גרביטציה', 
        duration: '04:45:20',
        topics: [
          { name: 'חוק הכבידה', duration: '01:30:00' },
          { name: 'תנועת כוכבי לכת', duration: '02:00:20' },
          { name: 'שדה כבידה', duration: '01:15:00' }
        ]
      },
      { 
        title: 'פרק 8 - תנודות', 
        duration: '05:10:25',
        topics: [
          { name: 'תנועה הרמונית פשוטה', duration: '02:00:00' },
          { name: 'מטוטלת', duration: '01:30:25' },
          { name: 'תנודות מרוסנות', duration: '01:40:00' }
        ]
      }
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
  const navigate = useNavigate();
  const [isPurchased, setPurchased] = useState(false); // Mock state
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
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
    // Navigate to checkout page
    navigate(`/checkout/${courseId}`);
  };

  const toggleFolder = (folderName: string) => {
    setOpenFolder(openFolder === folderName ? null : folderName);
  };

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back navigation - Bold Box */}
        <div className="mb-8">
          <Link 
            to="/institution/technion"
            className="inline-flex items-center gap-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold px-6 py-3 rounded-xl border-2 border-primary/30 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            <span>חזרה לעמוד הקורסים</span>
          </Link>
        </div>

        {/* Course Overview Section - Modern Design */}
        <div className="bg-gradient-to-br from-white via-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-10 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Package className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">{course.name}</h1>
              <p className="text-lg text-muted-foreground">{course.institution} • {course.department}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 - Right */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">משך הקורס</div>
                  <div className="font-semibold">{course.stats.duration}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">סרטוני וידאו</div>
                  <div className="font-semibold">{course.stats.videos}</div>
                </div>
              </div>
            </div>

            {/* Column 2 - Center */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">שאלות חימום</div>
                  <div className="font-semibold">{course.stats.warmupQuestions}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">שאלות מבחנים</div>
                  <div className="font-semibold">{course.stats.examQuestions}</div>
                </div>
              </div>
            </div>

            {/* Column 3 - Left */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">עדכון אחרון</div>
                  <div className="font-semibold">{course.stats.lastUpdate}</div>
                </div>
              </div>
              
              {isPurchased && (
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">קהילה</div>
                    <a 
                      href={course.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green-600 hover:text-green-700 underline"
                    >
                      קבוצת וואטסאפ
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chapters */}
          <div className="lg:col-span-2 space-y-8">

            {/* Course Chapters with Collapse/Expand */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">פרקי הקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.chapters.map((chapter, index) => (
                    <div 
                      key={index}
                      className="border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      {/* Chapter Header */}
                      <div className="flex items-center gap-3 p-5 bg-muted/30">
                        <button
                          onClick={() => toggleChapter(index)}
                          className="flex items-center gap-4 flex-1 text-right hover:bg-muted/50 transition-colors rounded-lg p-2 -m-2"
                        >
                          <ChevronDown 
                            className={`w-5 h-5 text-primary transition-transform ${
                              expandedChapters.has(index) ? 'rotate-180' : ''
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-foreground text-lg">{chapter.title}</div>
                          </div>
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{chapter.duration}</span>
                          </div>
                          {isPurchased && (
                            <Link to={`/watch/${courseId}?chapter=${index}`}>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video className="w-4 h-4 ml-2" />
                                צפה בפרק
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Chapter Topics (Collapsible) */}
                      {expandedChapters.has(index) && (
                        <div className="bg-background border-t border-border">
                          <div className="p-4 space-y-2">
                            {chapter.topics.map((topic, topicIndex) => (
                              <div 
                                key={topicIndex}
                                className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="text-foreground">{topic.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <Clock className="w-3 h-3" />
                                  <span>{topic.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Study Materials */}
          <div className="space-y-8">
            {/* Purchase Button */}
            {!isPurchased && (
              <Card>
                <CardContent className="p-6">
                  <Button
                    onClick={handlePurchase}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 ml-2" />
                    לחצו לרכישה
                  </Button>
                  <div className="text-center mt-4">
                    <span className="text-2xl font-bold text-foreground">{course.price} ₪</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Study Materials Section */}
            {isPurchased && (
              <Card>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-xl font-bold text-primary">
                    חומרי עזר
                  </CardTitle>
                  {/* Download All Button */}
                  <Button 
                    className="w-full bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3"
                    onClick={() => {
                      // TODO: Implement ZIP download
                      alert('מוריד את כל הקבצים...');
                    }}
                  >
                    <Package className="w-5 h-5 ml-2" />
                    הורד את כל הקבצים (ZIP)
                  </Button>
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
                            <button
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded w-full text-right transition-colors"
                              onClick={() => alert(`מוריד: ${file}`)}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary hover:text-primary/80 flex-shrink-0" />
                            </button>
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
                            <button
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded w-full text-right transition-colors"
                              onClick={() => alert(`מוריד: ${file}`)}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary hover:text-primary/80 flex-shrink-0" />
                            </button>
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
                            <button
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded w-full text-right transition-colors"
                              onClick={() => alert(`מוריד: ${file}`)}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Download className="w-4 h-4 text-primary hover:text-primary/80 flex-shrink-0" />
                            </button>
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