import React from 'react';
import Nav from '@/components/Nav';
import AppHeader from '@/components/AppHeader';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1, background: '#050505' }}>
      {/* Purple ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-20%',
          left: '40%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'drift 14s ease-in-out infinite alternate',
        }}
      />

      {/* Sidebar – desktop only */}
      <div className="hidden md:flex">
        <Nav />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppHeader />

        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-0"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Nav mobile />
      </div>

      <ScrollReveal />

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}
