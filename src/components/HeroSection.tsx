import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="section-hero py-20 min-h-[75vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        <div className="max-w-4xl mx-auto text-right">
          {/* Main Title */}
          <h1 className="text-h1 font-bold text-white mb-6 leading-tight">
            פלטפורמת הלמידה
          </h1>

          {/* Subtitle */}
          <h2 className="text-h2 font-semibold text-blue-100 mb-8 leading-tight">
            המתקדמת בישראל
          </h2>

          {/* Description */}
          <div className="text-paragraph text-blue-50 leading-relaxed mb-12 max-w-3xl">
            <p className="mb-4">
              פלטפורמה מתקדמת להכשרה מקצועית ולימודים אקדמיים
            </p>
            <p>
              עם מגוון רחב של קורסים איכותיים ומרצים מובילים בתחום
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-button rounded-xl font-bold border-none shadow-lg"
            >
              התחל ללמוד עכשיו
              <ArrowLeft className="w-5 h-5 mr-3" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white hover:bg-gray-50 text-black border-gray-200 px-8 py-4 text-button rounded-xl font-medium"
            >
              צפה בדמו
              <Play className="w-5 h-5 mr-3" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;