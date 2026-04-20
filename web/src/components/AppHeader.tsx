'use client';

import { usePathname } from 'next/navigation';

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
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        borderBottom: '1px solid #EAEAEA',
        background: 'rgba(251,251,250,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {meta.section && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#AEABA4',
              fontFamily: 'var(--font-body)',
            }}
          >
            {meta.section}
          </span>
        )}
        {meta.section && (
          <span style={{ color: '#EAEAEA', fontSize: '0.75rem' }}>/</span>
        )}
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#111111',
            fontFamily: 'var(--font-body)',
            letterSpacing: '-0.01em',
          }}
        >
          {meta.title}
        </span>
      </div>

      {/* Right: search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#AEABA4"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            style={{
              width: 180,
              padding: '0.4rem 0.875rem 0.4rem 2.125rem',
              background: '#F7F6F3',
              border: '1px solid #EAEAEA',
              borderRadius: 8,
              color: '#111111',
              fontSize: '0.8rem',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            className="header-search-input"
          />
        </div>
      </div>
    </header>
  );
}
