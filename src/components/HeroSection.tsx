import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="section-hero py-32 min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="font-hebrew text-[46px] md:text-[56px] lg:text-[64px] font-bold text-white leading-tight mb-8">
            המסלול שלך להצלחה מתחיל כאן
          </h1>

          {/* Subtitle */}
          <p className="font-hebrew text-[22px] md:text-[24px] font-normal text-white/90 leading-relaxed max-w-4xl mx-auto mb-8" style={{ marginTop: '32px' }}>
            מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות של המוסדות האקדמיים המובילים במדינה
          </p>

          {/* Action Button */}
          <div className="flex justify-center" style={{ marginTop: '32px' }}>
            <Button 
              className="font-hebrew bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-3 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px]"
            >
              צפו בקורסים
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;