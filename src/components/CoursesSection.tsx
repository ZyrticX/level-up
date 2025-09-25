import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CoursesSection = () => {
  const courses = [
    {
      id: 'calculus-1',
      title: 'חשבון דיפרנציאלי ואינטגרלי א\'',
      description: 'קורס יסודי בחשבון דיפרנציאלי ואינטגרלי המותאם לסטודנטים במדעי המחשב והנדסה',
      instructor: 'פרופ\' דן כהן',
      students: 1250,
      duration: '42 שעות',
      rating: 4.8,
      image: '/placeholder.svg'
    },
    {
      id: 'linear-algebra',
      title: 'אלגברה לינארית',
      description: 'מושגי יסוד באלגברה לינארית: מטריצות, וקטורים, מרחבים וקטוריים והעתקות לינאריות',
      instructor: 'ד"ר שרה לוי',
      students: 980,
      duration: '36 שעות',
      rating: 4.7,
      image: '/placeholder.svg'
    },
    {
      id: 'data-structures',
      title: 'מבני נתונים ואלגוריתמים',
      description: 'קורס מתקדם במבני נתונים ואלגוריתמים יעילים לפתרון בעיות מחשוב מורכבות',
      instructor: 'פרופ\' אמיר רוזן',
      students: 750,
      duration: '48 שעות',
      rating: 4.9,
      image: '/placeholder.svg'
    },
    {
      id: 'statistics',
      title: 'סטטיסטיקה והסתברות',
      description: 'עקרונות הסטטיסטיקה וההסתברות עם דגש על יישומים במדעי המחשב וניתוח נתונים',
      instructor: 'ד"ר מיכל אבן',
      students: 650,
      duration: '40 שעות',
      rating: 4.6,
      image: '/placeholder.svg'
    }
  ];

  return (
    <section className="py-20 bg-background" aria-labelledby="courses-title">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 id="courses-title" className="text-4xl font-bold text-foreground mb-8">הקורסים הפופולריים ביותר</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            גלו את הקורסים המובילים שלנו המותאמים במיוחד לסטודנטים במוסדות האקדמיים המובילים בישראל
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 ml-1" />
                      {course.students.toLocaleString()} סטודנטים
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 ml-1 text-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 ml-1" />
                    {course.duration}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {course.instructor}
                  </div>
                </div>
                
                <Link to={`/course/${course.id}`}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
                    size="sm"
                  >
                    לפרטים על הקורס
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/courses">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
            >
              צפו בכל הקורסים
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;