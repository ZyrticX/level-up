import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock user courses data
const userCourses = [
  {
    id: 'physics-101',
    name: 'פיזיקה 1 - מכניקה קלאסית',
    institution: 'הטכניון',
    progress: 65,
    totalVideos: 32,
    watchedVideos: 21,
    lastWatched: 'אתמול',
    rating: 4.8
  },
  {
    id: 'calculus-1',
    name: 'חשבון דיפרנציאלי ואינטגרלי 1',
    institution: 'האוניברסיטה העברית',
    progress: 40,
    totalVideos: 28,
    watchedVideos: 11,
    lastWatched: 'לפני 3 ימים',
    rating: 4.9
  },
  {
    id: 'cs-intro',
    name: 'מבוא למדעי המחשב',
    institution: 'הטכניון',
    progress: 85,
    totalVideos: 25,
    watchedVideos: 21,
    lastWatched: 'היום',
    rating: 4.7
  }
];

const MyCoursesPage = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">הקורסים שלי</h1>
          <p className="text-muted-foreground">המשך ללמוד מהמקום שעצרת</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 ml-1 text-yellow-500" />
                    {course.rating}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {course.institution}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>התקדמות</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 ml-1" />
                    {course.watchedVideos}/{course.totalVideos} סרטונים
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 ml-1" />
                    צפייה אחרונה: {course.lastWatched}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link to={`/watch/${course.id}`} className="flex-1">
                    <Button className="w-full btn-academic">
                      המשך צפייה
                    </Button>
                  </Link>
                  <Link to={`/course/${course.id}`}>
                    <Button variant="outline" size="sm">
                      פרטים
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State if no courses */}
        {userCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">עדיין אין לכם קורסים</h3>
              <p className="text-muted-foreground mb-6">
                התחילו את המסע הלימודי שלכם ורכשו את הקורס הראשון
              </p>
              <Link to="/">
                <Button className="btn-hero">
                  עברו לקטלוג הקורסים
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="text-center py-6">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{userCourses.length}</div>
              <div className="text-sm text-muted-foreground">קורסים פעילים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userCourses.reduce((acc, course) => acc + course.watchedVideos, 0)}
              </div>
              <div className="text-sm text-muted-foreground">סרטונים נצפו</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round(userCourses.reduce((acc, course) => acc + course.progress, 0) / userCourses.length) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">התקדמות ממוצעת</div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyCoursesPage;