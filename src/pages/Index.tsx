import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, BookOpen, Clock, Users, ArrowLeft, Building, Cpu, Download, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CoursesSection from '@/components/CoursesSection';
import SignupModal from '@/components/SignupModal';

const Index = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">
      <HeroSection />

      {/* Marketing Icons Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0f3460] to-[#0a1628] relative overflow-hidden" aria-labelledby="features-title">
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center">
            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <img src="/icons/marketing/content.png" alt="Rich Content" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-cyan-100 font-medium">
                תוכן עשיר בכל<br />
                <span className="text-cyan-300">נושא הבחירה</span>
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <img src="/icons/marketing/247.png" alt="24/7 Availability" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-cyan-100 font-medium">
                זמין 24/7<br />
                <span className="text-cyan-300">תמיד</span>
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <img src="/icons/marketing/practical.png" alt="Practical Learning" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-cyan-100 font-medium">
                לימוד פרקטי מותאם<br />
                <span className="text-cyan-300">לכל הסטודנטים</span>
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-cyan-100 font-medium">
                לא צריך אינטרנט<br />
                <span className="text-cyan-300">זה פשוט</span>
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer col-span-2 sm:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-cyan-100 font-medium">
                קורס אקדמי מדויק<br />
                <span className="text-cyan-300">במלוא האמת</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CoursesSection />

      {/* Institutions Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background" aria-labelledby="institutions-title">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 id="institutions-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8">בחרו מוסד לימודים</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[{
              id: 'bar-ilan',
              name: 'אוניברסיטת בר אילן',
              subtitle: 'רמת גן',
              courses: '45+ קורסים'
            }, {
              id: 'ben-gurion',
              name: 'אוניברסיטת בן גוריון',
              subtitle: 'בנגב',
              courses: '38+ קורסים'
            }, {
              id: 'afeka',
              name: 'מכללת אפקה',
              subtitle: 'מכללה טכנולוגית',
              courses: '52+ קורסים'
            }, {
              id: 'hadassah',
              name: 'מכללת חדסה',
              subtitle: 'מכללה אקדמית',
              courses: '34+ קורסים'
            }, {
              id: 'ariel',
              name: 'אוניברסיטת אריאל שבשומרון',
              subtitle: 'שומרון',
              courses: '28+ קורסים'
            }, {
              id: 'technion',
              name: 'הטכניון',
              subtitle: 'חיפה',
              courses: '31+ קורסים'
            }].map(institution => {
              return (
                <Link
                  key={institution.id}
                  to={`/institution/${institution.id}`}
                  className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-200">
                      <Building className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 text-center">{institution.name}</h3>
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

      <Footer />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </main>
  );
};
export default Index;