import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Atom, Cpu, Calculator, FlaskConical, GraduationCap } from 'lucide-react';

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
    lastWatched: 'אתמול',
    isActive: true
  },
  {
    id: 'calculus-1',
    name: 'חשבון דיפרנציאלי ואינטגרלי 1',
    department: 'מתמטיקה',
    institution: 'האוניברסיטה העברית',
    progress: 40,
    icon: Calculator,
    lastWatched: 'לפני 3 ימים',
    isActive: true
  },
  {
    id: 'cs-intro',
    name: 'מבוא למדעי המחשב',
    department: 'מדעי המחשב',
    institution: 'הטכניון',
    progress: 85,
    icon: Cpu,
    lastWatched: 'היום',
    isActive: true
  },
  {
    id: 'chemistry-101',
    name: 'כימיה כללית',
    department: 'כימיה',
    institution: 'אוניברסיטת תל אביב',
    progress: 0,
    icon: FlaskConical,
    lastWatched: 'לא התחלת',
    isActive: false
  },
  {
    id: 'algebra-1',
    name: 'אלגברה לינארית',
    department: 'מתמטיקה',
    institution: 'אוניברסיטת בר אילן',
    progress: 0,
    icon: Calculator,
    lastWatched: 'לא התחלת',
    isActive: false
  }
];

// Mock user data
const userData = {
  firstName: 'דני',
  lastName: 'כהן'
};

const MyCoursesPage = () => {
  const activeCourses = userCourses.filter(course => course.isActive);
  const inactiveCourses = userCourses.filter(course => !course.isActive);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground text-right">הקורסים שלי</h1>
          </div>

          {/* Active Courses Section */}
          {activeCourses.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-foreground text-right mb-6">
                קורסים פעילים
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => {
                const IconComponent = course.icon;
                return (
                  <Link
                    key={course.id}
                    to={`/watch/${course.id}`}
                    className="bg-gradient-to-br from-white to-primary/5 border-2 border-border hover:border-primary/40 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground text-right leading-tight mb-2">
                            {course.name}
                          </h3>
                          <p className="text-sm text-muted-foreground text-right">
                            {course.institution}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-auto pt-4 border-t border-primary/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">התקדמות</span>
                          <span className="text-lg font-bold text-primary">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            </div>
          )}

          {/* Inactive Courses Section */}
          {inactiveCourses.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-foreground text-right mb-6">
                קורסים לא פעילים
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveCourses.map((course) => {
                const IconComponent = course.icon;
                return (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="bg-gradient-to-br from-white to-muted/20 border-2 border-border hover:border-primary/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group opacity-75 hover:opacity-100"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-all">
                          <IconComponent className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground text-right leading-tight mb-2">
                            {course.name}
                          </h3>
                          <p className="text-sm text-muted-foreground text-right">
                            {course.institution}
                          </p>
                        </div>
                      </div>

                      {/* Not Started Badge */}
                      <div className="mt-auto pt-4 border-t border-border">
                        <div className="text-center py-2 bg-muted rounded-lg">
                          <span className="text-sm font-medium text-muted-foreground">לא התחלת</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            </div>
          )}

          {/* Empty State */}
          {userCourses.length === 0 && (
            <Card className="text-center py-16 mx-auto max-w-md bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 rounded-2xl">
              <CardContent className="space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">עדיין אין לכם קורסים</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  התחילו את המסע הלימודי שלכם ורכשו את הקורס הראשון.
                  גלו את מגוון הקורסים הרחב שלנו ובחרו את הנושא שמעניין אתכם ביותר.
                </p>
                <Link to="/">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                    עברו לקטלוג הקורסים
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyCoursesPage;