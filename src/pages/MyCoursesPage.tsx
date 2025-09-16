import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Atom, Cpu, Calculator, FlaskConical, GraduationCap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock user courses data - only courses the user is enrolled in
const userCourses = [
  {
    id: 'physics-101',
    name: 'פיזיקה 1 - מכניקה קלאסית',
    department: 'פיזיקה',
    institution: 'הטכניון',
    progress: 65,
    icon: Atom,
    lastWatched: 'אתמול'
  },
  {
    id: 'calculus-1',
    name: 'חשבון דיפרנציאלי ואינטגרלי 1',
    department: 'מתמטיקה',
    institution: 'האוניברסיטה העברית',
    progress: 40,
    icon: Calculator,
    lastWatched: 'לפני 3 ימים'
  },
  {
    id: 'cs-intro',
    name: 'מבוא למדעי המחשב',
    department: 'מדעי המחשב',
    institution: 'הטכניון',
    progress: 85,
    icon: Cpu,
    lastWatched: 'היום'
  },
  {
    id: 'chemistry-101',
    name: 'כימיה כללית',
    department: 'כימיה',
    institution: 'אוניברסיטת תל אביב',
    progress: 20,
    icon: FlaskConical,
    lastWatched: 'לפני שבוע'
  }
];

// Mock user data
const userData = {
  firstName: 'דני',
  lastName: 'כהן'
};

const MyCoursesPage = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="section-standard">
        <div className="container-standard space-elements">
          {/* Welcome Section */}
          <div className="bg-primary text-white rounded-xl p-8 text-center space-elements">
            <p className="text-paragraph text-white/90">שלום שוב, כיף לראות אותך!</p>
            <h1 className="text-h1 text-white text-right">הקורסים שלי</h1>
            <p className="text-paragraph text-white/80 text-right">המשך ללמוד מהמקום שעצרת</p>
          </div>

          {/* Courses Section */}
          {userCourses.length > 0 ? (
            <div className="space-elements">
              <h2 className="text-h2 text-foreground text-right">
                הקורסים הפעילים שלך ({userCourses.length})
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userCourses.map((course) => {
                const IconComponent = course.icon;
                return (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="card-course group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      
                      <h3 className="text-h3 text-foreground text-right leading-tight">
                        {course.name}
                      </h3>
                      
                      <div className="space-elements">
                        <p className="text-paragraph text-muted-foreground text-right">
                          <span className="font-medium">חוג:</span> {course.department}
                        </p>
                        <p className="text-paragraph text-muted-foreground text-right">
                          <span className="font-medium">מוסד:</span> {course.institution}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-elements">
                        <div className="flex justify-between text-nav">
                          <span className="text-muted-foreground">התקדמות</span>
                          <span className="text-primary font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Last Watched */}
                      <div className="text-nav text-muted-foreground text-right">
                        <Clock className="w-3 h-3 inline ml-1" />
                        צפייה אחרונה: {course.lastWatched}
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <span className="text-nav font-medium text-primary">לחץ לצפייה בקורס</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-6 justify-center">
                <Link to="/watch/physics-101">
                  <button className="btn-primary">
                    <BookOpen className="w-4 h-4 ml-2" />
                    המשך הקורס האחרון
                  </button>
                </Link>
                <Link to="/">
                  <button className="btn-secondary">
                    <Star className="w-4 h-4 ml-2" />
                    חפש קורסים נוספים
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Empty State */
            <Card className="text-center py-16 mx-auto max-w-md">
              <CardContent className="space-elements">
                <BookOpen className="w-20 h-20 text-muted-foreground mx-auto" />
                <h3 className="text-h2 text-foreground text-right">עדיין אין לכם קורסים</h3>
                <p className="text-paragraph text-muted-foreground text-right leading-relaxed">
                  התחילו את המסע הלימודי שלכם ורכשו את הקורס הראשון.
                  גלו את מגוון הקורסים הרחב שלנו ובחרו את הנושא שמעניין אתכם ביותר.
                </p>
                <Link to="/">
                  <button className="btn-primary">
                    עברו לקטלוג הקורסים
                  </button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Section */}
          {userCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-academic text-center">
                <CardContent className="py-8 space-elements">
                  <BookOpen className="w-10 h-10 text-primary mx-auto" />
                  <div className="text-h2 font-bold text-foreground">{userCourses.length}</div>
                  <div className="text-nav text-muted-foreground">קורסים פעילים</div>
                </CardContent>
              </Card>
              <Card className="card-academic text-center">
                <CardContent className="py-8 space-elements">
                  <Clock className="w-10 h-10 text-primary mx-auto" />
                  <div className="text-h2 font-bold text-foreground">
                    {Math.round(userCourses.reduce((acc, course) => acc + course.progress, 0) / userCourses.length)}%
                  </div>
                  <div className="text-nav text-muted-foreground">התקדמות ממוצעת</div>
                </CardContent>
              </Card>
              <Card className="card-academic text-center">
                <CardContent className="py-8 space-elements">
                  <Users className="w-10 h-10 text-primary mx-auto" />
                  <div className="text-h2 font-bold text-foreground">
                    {userCourses.filter(course => course.progress > 0).length}
                  </div>
                  <div className="text-nav text-muted-foreground">קורסים בלמידה</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">LU</span>
                  </div>
                  <span className="text-xl font-semibold text-foreground">LevelUp</span>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                  המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">קישורים מהירים</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">אודותינו</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">צור קשר</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">שאלות נפוצות</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">תמיכה טכנית</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">תמיכה</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">מרכז עזרה</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">דרכי תשלום</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">החזרים וביטולים</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">מדיניות השימוש</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              {/* Legal Links and Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
                </div>

                <div className="text-sm text-muted-foreground">
                  © 2024 LevelUp. כל הזכויות שמורות.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyCoursesPage;