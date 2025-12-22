import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';

interface Institution {
  id: string;
  name: string;
  is_active: boolean;
}

const Index = () => {
  // Fetch institutions from Supabase
  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ['homepage-institutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Institution[];
    }
  });

  return (
    <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">
      <HeroSection />

      {/* Institutions Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background" aria-labelledby="institutions-title">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 id="institutions-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">בחרו מוסד לימודים</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">טוען מוסדות...</p>
            </div>
          ) : institutions.length === 0 ? (
            <div className="text-center py-12">
              <Landmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">עדיין לא הוגדרו מוסדות לימוד</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {institutions.map(institution => (
                <Link
                  key={institution.id}
                  to={`/institution/${institution.id}`}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
                >
                  {/* Decorative gradient blur */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Landmark className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground text-center">{institution.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
