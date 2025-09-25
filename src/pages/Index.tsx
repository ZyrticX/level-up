import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Users, ArrowLeft, Building, Cpu, CheckCircle, FileText, Download, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CoursesSection from '@/components/CoursesSection';
const Index = () => {
  return (
    <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">
      <HeroSection />
      <CoursesSection />


      {/* Features Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="features-title">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base text-foreground font-medium">
                תוכן עשיר בכל<br />
                נושא הבחירה
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base text-foreground font-medium">
                זמין 24/7<br />
                תמיד
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base text-foreground font-medium">
                לימוד פרקטי מותאם<br />
                לכל הסטודנטים
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base text-foreground font-medium">
                לא צריך אינטרנט<br />
                זה פשוט
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base text-foreground font-medium">
                קורס אקדמי מדויק<br />
                במלוא האמת
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-20 bg-background" aria-labelledby="institutions-title">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 id="institutions-title" className="text-4xl font-bold text-foreground mb-8">המוסדות שלנו</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            return (
              <Link 
                key={institution.id} 
                to={`/institution/${institution.id}`} 
                className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-200">
                    <IconComponent className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{institution.name}</h3>
                  <p className="text-base text-muted-foreground mb-4">{institution.subtitle}</p>
                  <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {institution.courses}
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      

      {/* CTA Section */}
      <section className="bg-primary text-white py-20" aria-labelledby="cta-title">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 id="cta-title" className="text-4xl font-bold text-white mb-8">מוכנים להתחיל?</h2>
          <p className="text-lg text-white/95 mb-12 leading-relaxed">
            הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
          </p>
          <Link to="/auth">
            <button className="bg-white text-primary hover:bg-gray-50 px-12 py-4 rounded-lg text-lg font-bold transition-all duration-300 hover:shadow-lg">
              הירשמו עכשיו
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};
export default Index;