import { Laptop } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-l from-primary to-primary/80 py-20 min-h-[500px] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Right Side */}
          <div className="text-center lg:text-right space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              הדרך שלך מאפס למאה מתחילה כאן!
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות. התוכן נבנה כמסלול מסודר ובהתאמה דקדקנית לחומר המועבר בכיתה, מונגש מהבסיס ואינו מצריך ידע מוקדם.
            </p>
          </div>

          {/* Image - Left Side */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-full max-w-md aspect-video bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 p-12">
              <Laptop className="w-full h-full text-white/60" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default HeroSection;