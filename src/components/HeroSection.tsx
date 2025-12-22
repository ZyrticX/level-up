const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] py-16 lg:py-20 min-h-[500px] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Right Side */}
          <div className="text-center lg:text-right space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              הדרך שלך מאפס למאה מתחילה כאן!
            </h1>
            <p className="text-lg md:text-xl text-cyan-100/80 leading-relaxed max-w-2xl">
              מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות. התוכן נבנה כמסלול מסודר ובהתאמה דקדקנית לחומר המועבר בכיתה, מונגש מהבסיס ואינו מצריך ידע מוקדם.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="/courses" 
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
              >
                לקורסים שלנו
              </a>
            </div>
          </div>

          {/* Image - Left Side */}
          <div className="hidden lg:flex justify-center items-center relative z-10">
            <div className="relative">
              {/* Cyan glow effect behind image */}
              <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-3xl transform scale-90"></div>
              
              {/* Square Image Container */}
              <div className="relative w-[400px] h-[400px] xl:w-[480px] xl:h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 border-2 border-cyan-400/20">
                <img 
                  src="/hero-levelup.png.jpg" 
                  alt="LevelUp Academy - פלטפורמת למידה" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Cyan Glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl"></div>
    </section>
  );
};

export default HeroSection;