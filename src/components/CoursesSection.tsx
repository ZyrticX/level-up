import { Link } from 'react-router-dom';
import { Users, Clock, Star, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import CourseIcon from './CourseIcon';
import { CourseIconCategory } from '@/lib/courseIcons';

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
  videos: { count: number }[];
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, videos(count)')
        .eq('is_published', true)
        .order('students_count', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching courses:', error);
      } else if (data) {
        setCourses(data);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">טוען קורסים...</p>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

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
                <CourseIcon 
                  category={course.icon_category}
                  customIconUrl={course.icon_url}
                  size={48}
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
                      <Video className="w-4 h-4 ml-1 text-primary" />
                      {course.videos?.[0]?.count || 0} סרטונים
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 ml-1 text-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 ml-1" />
                      {course.students_count.toLocaleString()} סטודנטים
                    </span>
                    {course.duration && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 ml-1" />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  {course.instructor && (
                    <div className="text-xs text-muted-foreground">
                      {course.instructor}
                    </div>
                  )}
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