import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="section-hero py-32 min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            פלטפורמת הלמידה המתקדמת בישראל
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl font-medium text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות של המוסדות האקדמיים המובילים במדינה
          </h2>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              צפו בקורסים
            </Button>
          </div>

          {/* Demo Button */}
          <Button 
            size="lg" 
            variant="ghost"
            className="text-white hover:text-blue-100 hover:bg-white/10 px-8 py-4 text-base font-medium rounded-lg"
          >
            <Play className="w-5 h-5 ml-2" />
            צפו בדמו
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;