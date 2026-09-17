import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ActivityTracker from "@/components/ActivityTracker";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import GlobalPopup from "@/components/GlobalPopup";

const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--body' });
const display = Outfit({ subsets: ["latin"], variable: '--display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.broswebstudio.in'),
  title: "Bro's WebStudio — Premium Websites, College Projects & Graphic Design",
  description: "Website development, college major/minor projects, and graphic design — under one roof, priced upfront, delivered on time.",
  keywords: ["Web Development", "College Projects", "Graphic Design", "React", "Next.js", "WebStudio", "Custom Websites", "UI/UX Design", "College Viva Projects"],
  authors: [{ name: "Bro's WebStudio" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.broswebstudio.in",
    title: "Bro's WebStudio — Premium Websites, College Projects & Graphic Design",
    description: "Get custom websites, college tech projects, and stunning graphic designs with clear upfront pricing.",
    siteName: "Bro's WebStudio",
    images: [{
      url: "/og-image.png", // Add an actual image in public/og-image.png later
      width: 1200,
      height: 630,
      alt: "Bro's WebStudio Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bro's WebStudio — Premium Websites, College Projects & Graphic Design",
    description: "Get custom websites, college tech projects, and stunning graphic designs with clear upfront pricing.",
    images: ["/og-image.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bro's WebStudio",
              "url": "https://www.broswebstudio.in",
              "logo": "https://www.broswebstudio.in/icon.png",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8368079768",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className={`${body.variable} ${display.variable} ${jetbrainsMono.variable}`}>
        <Suspense fallback={null}>
          <ActivityTracker />
        </Suspense>
        
        <div className="hide-on-mobile-banner" style={{ background: 'linear-gradient(90deg, #0f172a, #27272a)', color: '#fff', textAlign: 'center', padding: '12px 20px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px', zIndex: 9999, position: 'relative' }}>
          <span style={{ backgroundColor: '#facc15', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>NEW</span>
          <span>We build Premium Websites & Projects. Know your exact price in 30 seconds.</span>
          <a href="/estimate" style={{ color: '#facc15', textDecoration: 'underline', fontWeight: 600, marginLeft: '8px', whiteSpace: 'nowrap' }}>Calculate Cost &rarr;</a>
        </div>

        <Header />
        
        <main>
          {children}
        </main>

        <Footer />
        <ExitIntentPopup />
        <FloatingWhatsApp />
        <GlobalPopup />
      </body>
    </html>
  );
}
