import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Clock, Star, BookOpen, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import CourseIcon from '@/components/CourseIcon';
import { CourseIconCategory } from '@/lib/courseIcons';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  students_count: number;
  duration: string | null;
  rating: number;
  icon_category: CourseIconCategory;
  icon_url: string | null;
  price: number | null;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('students_count', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else if (data) {
        setCourses(data);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] py-16 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              כל הקורסים
            </h1>
            <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto mb-8">
              גלו את מגוון הקורסים שלנו המותאמים במיוחד לסטודנטים במוסדות האקדמיים המובילים בישראל
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="חפש קורס..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-6 text-lg rounded-xl bg-white/10 backdrop-blur-sm border-cyan-400/30 text-white placeholder:text-cyan-100/50 focus:border-cyan-400/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">טוען קורסים...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {searchQuery ? 'לא נמצאו קורסים' : 'כרגע אין קורסים במערכת'}
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `לא נמצאו קורסים התואמים את החיפוש "${searchQuery}"`
                  : 'אנחנו עובדים על הוספת קורסים חדשים. חזרו בקרוב!'}
              </p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="rounded-xl"
                >
                  נקה חיפוש
                </Button>
              )}
              <Link to="/">
                <Button className="mr-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl shadow-lg shadow-cyan-500/30">
                  חזרה לעמוד הבית
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-muted-foreground">
                  נמצאו <span className="font-bold text-foreground">{filteredCourses.length}</span> קורסים
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <CourseIcon 
                        category={course.icon_category}
                        customIconUrl={course.icon_url}
                        size={64}
                      />
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
                            {course.students_count.toLocaleString()} סטודנטים
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 ml-1 text-yellow-500" />
                            {course.rating}
                          </span>
                        </div>
                        {course.duration && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 ml-1" />
                            {course.duration}
                          </div>
                        )}
                        {course.instructor && (
                          <div className="text-xs text-muted-foreground">
                            {course.instructor}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        {course.price ? (
                          <span className="text-xl font-bold text-primary">
                            ₪{course.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-lg font-semibold text-green-600">
                            חינם
                          </span>
                        )}
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
                          size="sm"
                        >
                          לפרטים
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CoursesPage;

