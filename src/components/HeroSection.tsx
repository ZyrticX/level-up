import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-light to-secondary-light py-20">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-8 leading-tight">
            הדרך שלך מאפס למאה – מתחילה כאן!
          </h1>

          {/* Description */}
          <div className="text-xl md:text-2xl text-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
            <p className="mb-6">
              מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות.
            </p>
            <p>
              התוכן נבנה כמסלול מסודר ובהתאמה מוחלטת לחומר המועבר בכיתה, 
              מונגש מהבסיס ואינו מצריך ידע מוקדם.
            </p>
          </div>

          {/* Features Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card-academic text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">מרתונים מוקלטים</h3>
              <p className="text-muted-foreground">
                תוכן מלא ומקיף המותאם לבחינות
              </p>
            </div>
            
            <div className="card-academic text-center">
              <GraduationCap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">מסלול מסודר</h3>
              <p className="text-muted-foreground">
                למידה שלב אחר שלב מהבסיס
              </p>
            </div>

            <div className="card-academic text-center">
              <ArrowLeft className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">התאמה מוחלטת</h3>
              <p className="text-muted-foreground">
                תוכן המותאם לחומר הכיתתי
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="btn-hero text-lg px-8 py-4"
          >
            התחל עכשיו
            <ArrowLeft className="w-5 h-5 mr-3" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;