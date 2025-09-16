import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const Layout = ({ 
  children, 
  title = "LevelUp - פלטפורמת הלמידה המתקדמת בישראל",
  description = "מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות של המוסדות האקדמיים המובילים במדינה. הצטרפו ל-15,000+ סטודנטים שכבר משיגים הצלחה עם LevelUp.",
  keywords = "לימודים אקדמיים, מרתונים מוקלטים, בחינות סופיות, טכניון, אוניברסיטה העברית, תל אביב, בן גוריון, בר אילן, חיפה, הכנה לבחינות, קורסים מקוונים",
  ogImage = "/levelup-og-image.jpg",
  canonicalUrl
}: LayoutProps) => {
  const currentUrl = canonicalUrl || window.location.href;

  return (
    <>
      <Helmet>
        {/* Essential Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="he" />
        <meta name="author" content="LevelUp Team" />
        
        {/* Viewport and Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:site_name" content="LevelUp" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "LevelUp",
            "description": description,
            "url": currentUrl,
            "logo": "/levelup-logo-new-transparent.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "Hebrew"
            },
            "areaServed": "IL",
            "serviceType": "Online Education Platform"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background font-sans" dir="rtl">
        {children}
      </div>
    </>
  );
};

export default Layout;