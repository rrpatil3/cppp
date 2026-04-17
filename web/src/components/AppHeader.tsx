'use client';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
        borderBottom: '1px solid var(--border)',
        /* Premium glass — tinted, not pure dark */
        background: 'rgba(9,13,22,0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb — eyebrow + title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {meta.section && (
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3em',
            }}
          >
            {meta.section}
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--accent)', opacity: 0.9 }}>{meta.title}</span>
          </span>
        )}
        <span
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
          }}
        >
          {meta.title}
        </span>
      </div>

      {/* Right: search + theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <ThemeToggle />

        {/* Search — bezel pill */}
        <div
          style={{
            position: 'relative',
            padding: '1px',
            borderRadius: 9999,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)',
          }}
        >
          <Search
            size={12}
            style={{
              position: 'absolute',
              left: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
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
              background: 'var(--bg-elevated)',
              border: 'none',
              borderRadius: 9999,
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              outline: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              transition: 'box-shadow 0.25s cubic-bezier(0.32,0.72,0,1)',
            }}
            className="header-search-input"
          />
        </div>
      </div>
    </header>
  );
}
