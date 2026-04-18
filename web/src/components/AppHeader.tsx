'use client';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

const PAGE_META: Record<string, { section: string; title: string }> = {
  '/dashboard':     { section: 'SBA Lender',    title: 'Underwriting Pipeline' },
  '/underwriting':  { section: 'SBA Analysis',  title: 'DSCR & SBA Ratios' },
  '/credit-memo':   { section: 'AI',            title: 'Credit Memo Generator' },
  '/advisor':       { section: 'AI',            title: 'AI Underwriter Advisor' },
  '/ma':            { section: 'M&A',           title: 'M&A Suite' },
  '/tools':         { section: 'Due Diligence', title: 'Financial Analysis Tools' },
  '/balance-sheet': { section: 'Finance',       title: 'Balance Sheet' },
  '/ownership':     { section: 'Equity',        title: 'Cap Table' },
  '/settings':      { section: 'Account',       title: 'Institution Settings' },
  '/onboarding':    { section: 'Setup',         title: 'Add Borrower' },
  '/login':         { section: '',              title: 'Sign In' },
};

export default function AppHeader() {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { section: 'Main', title: 'Dashboard' };

  return (
    <header
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {meta.section && (
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#333333',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3em',
              fontFamily: 'Aspekta, system-ui, sans-serif',
            }}
          >
            {meta.section}
            <span style={{ opacity: 0.4 }}>/</span>
            <span
              style={{
                background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {meta.title}
            </span>
          </span>
        )}
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            fontFamily: 'Aspekta, system-ui, sans-serif',
          }}
        >
          {meta.title}
        </span>
      </div>

      {/* Right: search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div
          style={{
            position: 'relative',
            padding: '1px',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <Search
            size={12}
            style={{
              position: 'absolute',
              left: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#555555',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            style={{
              width: 188,
              padding: '0.42rem 1rem 0.42rem 2rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9999,
              color: '#ffffff',
              fontSize: '0.76rem',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              fontFamily: 'Aspekta, system-ui, sans-serif',
              transition: 'border-color 0.2s ease',
            }}
            className="header-search-input"
          />
        </div>
      </div>
    </header>
  );
}
