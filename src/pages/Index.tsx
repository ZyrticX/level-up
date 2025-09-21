import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Star, CheckCircle, FileText, Clock, Download, Shield, Building, Cpu, Phone, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';
const Index = () => {
  return <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">

      {/* Hero Section */}
      <section className="section-hero relative py-16 md:py-20 lg:py-24 overflow-hidden flex items-center" aria-labelledby="hero-title">
        <div className="container-standard text-center relative z-10 w-full">
          <div className="max-w-6xl mx-auto space-elements">
            <div className="animate-fade-in">
              <h1 id="hero-title" className="text-h1 text-white mb-6 drop-shadow-lg text-center">
                פלטפורמת הלמידה המתקדמת בישראל
              </h1>
              <p className="text-paragraph text-white/95 mb-8 text-center max-w-4xl mx-auto drop-shadow-md">
                מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות של המוסדות האקדמיים המובילים במדינה
              </p>
            </div>
          </div>
        </div>
        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-white/15 rounded-full animate-float blur-sm shadow-lg"></div>
        <div className="absolute top-1/3 right-12 w-16 h-16 bg-white/15 rounded-full animate-float animation-delay-2000 blur-sm shadow-lg"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-float animation-delay-4000 blur-sm shadow-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/20 rounded-full animate-float animation-delay-1000 blur-sm shadow-md"></div>
      </section>


      {/* Features Section */}
      <section className="section-standard" aria-labelledby="features-title">
        <div className="container-standard space-elements">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center max-w-6xl mx-auto" dir="ltr">
            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                תוכן עשיר בכל<br />
                נושא הבחירה
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                זמין 24/7<br />
                תמיד
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                לימוד פרקטי מותאם<br />
                לכל הסטודנטים
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                לא צריך אינטרנט<br />
                זה פשוט
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                קורס אקדמי מדויק<br />
                במלוא האמת
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="section-standard" aria-labelledby="institutions-title">
        <div className="container-standard space-elements">
          <div className="text-center space-elements">
            <h2 id="institutions-title" className="text-h2 text-foreground text-center">בחרו את מוסדות הלימוד שלנו</h2>
            <p className="text-paragraph text-muted-foreground max-w-3xl mx-auto text-center">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[{
            id: 'bar-ilan',
            name: 'אוניברסיטת בר אילן',
            subtitle: 'רמת גן',
            courses: '45+ קורסים',
            icon: Building
          }, {
            id: 'ben-gurion',
            name: 'אוניברסיטת בן גוריון',
            subtitle: 'בנגב',
            courses: '38+ קורסים',
            icon: Building
          }, {
            id: 'afeka',
            name: 'מכללת אפקה',
            subtitle: 'מכללה טכנולוגית',
            courses: '52+ קורסים',
            icon: Cpu
          }, {
            id: 'hadassah',
            name: 'מכללת חפיש',
            subtitle: 'מכללה אקדמית',
            courses: '34+ קורסים',
            icon: GraduationCap
          }, {
            id: 'ariel',
            name: 'אוניברסיטת אריאל שבשומרון',
            subtitle: 'שומרון',
            courses: '28+ קורסים',
            icon: Building
          }, {
            id: 'ben-gurion-2',
            name: 'אוניברסיטת בן גוריון',
            subtitle: 'באר שבע',
            courses: '31+ קורסים',
            icon: Building
          }].map(institution => {
            const IconComponent = institution.icon;
            return <Link key={institution.id} to={`/institution/${institution.id}`} className="card-course group p-6 md:p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors duration-200">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
                    </div>
                  <h3 className="text-h3 text-foreground text-right">{institution.name}</h3>
                  <p className="text-paragraph text-muted-foreground text-right">{institution.subtitle}</p>
                  <div className="badge-academic text-nav text-right">
                    {institution.courses}
                  </div>
                </div>
              </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      

      {/* CTA Section */}
      <section className="bg-primary text-white section-standard" aria-labelledby="cta-title">
        <div className="container-standard text-center">
          <div className="max-w-3xl mx-auto space-elements">
            <h2 id="cta-title" className="text-h2 text-white text-right">מוכנים להתחיל?</h2>
            <p className="text-paragraph text-white/95 text-right">
              הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto max-w-xs mx-auto">
              <button className="bg-white text-primary btn-secondary w-full">
                הירשמו עכשיו
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>;
};
export default Index;