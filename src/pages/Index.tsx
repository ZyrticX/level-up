import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import InstitutionsSection from '@/components/InstitutionsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-hebrew">
      <Header />
      <main>
        <HeroSection />
        <InstitutionsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
