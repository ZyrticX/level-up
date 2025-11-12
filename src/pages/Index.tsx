import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, BookOpen, Clock, Users, ArrowLeft, Building, Cpu, CheckCircle, FileText, Download, Shield } from 'lucide-react';
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
      <section className="py-12 sm:py-16 bg-background" aria-labelledby="features-title">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center">
            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">
                תוכן עשיר בכל<br />
                נושא הבחירה
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">
                זמין 24/7<br />
                תמיד
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">
                לימוד פרקטי מותאם<br />
                לכל הסטודנטים
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">
                לא צריך אינטרנט<br />
                זה פשוט
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 group cursor-pointer col-span-2 sm:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">
                קורס אקדמי מדויק<br />
                במלוא האמת
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