'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavProps {
  mobile?: boolean;
}

const NAV_ITEMS = [
  { label: 'Pipeline',       route: '/dashboard',     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null },
  { label: 'Underwriting',   route: '/underwriting',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', badge: null },
  { label: 'Credit Memo',    route: '/credit-memo',   icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', badge: 'AI' },
  { label: 'AI Advisor',     route: '/advisor',       icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', badge: 'AI' },
  { label: 'M&A Suite',      route: '/ma',            icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: 'AI' },
  { label: 'Due Diligence',  route: '/tools',         icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', badge: null },
  { label: 'Balance Sheet',  route: '/balance-sheet', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', badge: null },
  { label: 'Cap Table',      route: '/ownership',     icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', badge: null },
  { label: 'Settings',       route: '/settings',      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', badge: null },
];

function NavIcon({ path, active }: { path: string; active: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {path.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  );
}

export default function Nav({ mobile = false }: NavProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #EAEAEA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.5rem 0',
        }}
      >
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const active = pathname === item.route;
          return (
            <Link
              key={item.route}
              href={item.route}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.625rem',
                borderRadius: '8px',
                color: active ? '#111111' : '#AEABA4',
                background: active ? '#F7F6F3' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                minWidth: 44,
                fontFamily: 'var(--font-body)',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
            >
              <NavIcon path={item.icon} active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      style={{
        width: 'var(--sidebar-width)',
        background: '#FFFFFF',
        borderRight: '1px solid #EAEAEA',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          borderBottom: '1px solid #EAEAEA',
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: '#111111',
            }}
          >
            CapTable AI
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: '#AEABA4',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: 2,
              fontFamily: 'var(--font-body)',
            }}
          >
            SBA Lender Platform
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '1.25rem 1.25rem 0.375rem' }}>
        <span
          style={{
            fontSize: '0.6rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#AEABA4',
            fontFamily: 'var(--font-body)',
          }}
        >
          Loan Officer Tools
        </span>
      </div>

      {/* Nav items */}
      <div
        style={{
          flex: 1,
          padding: '0.25rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.route;

          return (
            <Link
              key={item.route}
              href={item.route}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                color: active ? '#111111' : '#787774',
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: active ? 500 : 400,
                fontFamily: 'var(--font-body)',
                background: active ? '#F7F6F3' : 'transparent',
                border: active ? '1px solid #EAEAEA' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
              className="nav-item-link"
            >
              <NavIcon path={item.icon} active={active} />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badge && (
                <span
                  style={{
                    fontSize: '0.55rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: '#E1F3FE',
                    color: '#1F6C9F',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 9999,
                    border: '1px solid #A8D4F0',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div style={{ padding: '1rem 0.75rem', flexShrink: 0 }}>
        <div
          style={{
            padding: '0.75rem 0.875rem',
            borderRadius: '8px',
            background: '#F7F6F3',
            border: '1px solid #EAEAEA',
          }}
        >
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            color: '#AEABA4',
            marginBottom: '0.2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-body)',
          }}>
            Analytical Support Only
          </p>
          <p style={{ fontSize: '0.6rem', color: '#C5C2BB', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
            All outputs require loan officer review. Not a credit decision tool.
          </p>
        </div>
      </div>
    </nav>
  );
}
