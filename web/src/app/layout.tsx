import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import ScrollReveal from '@/components/ScrollReveal';
import AppHeader from '@/components/AppHeader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CapTable AI — SBA Underwriting Intelligence',
  description: 'AI-powered financial analysis for SBA lenders. Automates business valuation, document generation, and financial narrative work for SBA 7(a) loan underwriting. Reduces 4–8 hours of analyst work to under 30 minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="ambient-glow" aria-hidden="true" />
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          {/* Sidebar */}
          <div className="hidden md:flex">
            <Nav />
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sticky header */}
            <AppHeader />

            {/* Top glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 800,
                height: 100,
                background: 'rgba(0,229,153,0.06)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <main className="flex-1 overflow-y-auto pb-20 md:pb-0" style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </main>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <Nav mobile />
        </div>

        <ScrollReveal />
      </body>
    </html>
  );
}
