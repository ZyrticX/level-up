const HeroSection = () => {
  return (
    <section className="bg-gradient-to-l from-primary to-primary/80 py-16 lg:py-20 min-h-[500px] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Right Side */}
          <div className="text-center lg:text-right space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              הדרך שלך מאפס למאה מתחילה כאן!
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות. התוכן נבנה כמסלול מסודר ובהתאמה דקדקנית לחומר המועבר בכיתה, מונגש מהבסיס ואינו מצריך ידע מוקדם.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="/courses" 
                className="px-8 py-4 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                לקורסים שלנו
              </a>
              <a 
                href="/signup" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300"
              >
                הרשמה חינם
              </a>
            </div>
          </div>

          {/* Image - Left Side */}
          <div className="hidden lg:flex justify-center items-center relative z-10">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-3xl transform scale-90"></div>
              
              {/* Square Image Container */}
              <div className="relative w-[400px] h-[400px] xl:w-[480px] xl:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src="/hero-levelup.png.jpg" 
                  alt="LevelUp Academy - פלטפורמת למידה" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-6 py-3 shadow-xl">
                <span className="text-primary font-bold text-lg">🎓 +1000 סטודנטים</span>
              </div>
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