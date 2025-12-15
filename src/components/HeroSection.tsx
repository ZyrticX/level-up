const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-levelup.png.jpg')" }}
      >
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Right Side */}
          <div className="text-center lg:text-right space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              הדרך שלך מאפס למאה מתחילה כאן!
            </h1>
            <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-2xl drop-shadow-md">
              מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות. התוכן נבנה כמסלול מסודר ובהתאמה דקדקנית לחומר המועבר בכיתה, מונגש מהבסיס ואינו מצריך ידע מוקדם.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="/courses" 
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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

          {/* Empty right side - image is now the background */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default HeroSection;