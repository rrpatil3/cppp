'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const PAGE_META: Record<string, { section: string; title: string }> = {
  '/':              { section: 'Main',    title: 'Dashboard' },
  '/advisor':       { section: 'AI',      title: 'AI Advisor' },
  '/tools':         { section: 'Tools',   title: 'Financial Tools' },
  '/ma':            { section: 'M&A',     title: 'M&A Suite' },
  '/balance-sheet': { section: 'Finance', title: 'Balance Sheet' },
  '/ownership':     { section: 'Equity',  title: 'Cap Table' },
  '/settings':      { section: 'Account', title: 'Settings' },
  '/onboarding':    { section: 'Setup',   title: 'Onboarding' },
  '/login':         { section: '',        title: 'Sign In' },
};

export default function AppHeader() {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { section: 'Main', title: 'Dashboard' };

  return (
    <header
      style={{
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb + page title */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {meta.section && (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '0.1rem',
            }}
          >
            {meta.section} / {meta.title}
          </span>
        )}
        <span
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {meta.title}
        </span>
      </div>

      {/* Right: bell + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '0.25rem',
          }}
          className="header-icon-btn"
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 7,
              height: 7,
              background: 'var(--green)',
              borderRadius: '50%',
              border: '2px solid var(--bg-base)',
            }}
          />
        </button>

        {/* Search */}
        <div style={{ position: 'relative' }} className="header-search-wrap">
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            style={{
              width: 220,
              padding: '0.55rem 1rem 0.55rem 2.25rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 9999,
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
            className="header-search-input"
          />
        </div>
      </div>
    </header>
  );
}
