'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  ClipboardList,
  Briefcase,
} from 'lucide-react';

interface NavProps {
  mobile?: boolean;
}

const NAV_ITEMS = [
  { label: 'Pipeline',       route: '/dashboard',     icon: LayoutDashboard, badge: null },
  { label: 'Underwriting',   route: '/underwriting',  icon: BarChart3,       badge: null },
  { label: 'Credit Memo',    route: '/credit-memo',   icon: FileText,        badge: 'AI' },
  { label: 'AI Advisor',     route: '/advisor',       icon: MessageSquare,   badge: 'AI' },
  { label: 'M&A Suite',      route: '/ma',            icon: Briefcase,       badge: 'AI' },
  { label: 'Due Diligence',  route: '/tools',         icon: ClipboardList,   badge: null },
  { label: 'Balance Sheet',  route: '/balance-sheet', icon: DollarSign,      badge: null },
  { label: 'Cap Table',      route: '/ownership',     icon: Users,           badge: null },
  { label: 'Settings',       route: '/settings',      icon: Settings,        badge: null },
];

export default function Nav({ mobile = false }: NavProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav
        style={{
          background: 'rgba(5,5,5,0.96)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.5rem 0',
        }}
      >
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const active = pathname === item.route;
          const Icon = item.icon;
          return (
            <Link
              key={item.route}
              href={item.route}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.35rem 0.5rem',
                borderRadius: '0.625rem',
                color: active ? '#06B6D4' : '#555555',
                background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                minWidth: 44,
                fontFamily: 'Aspekta, system-ui, sans-serif',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
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
        background: '#050505',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              fontFamily: 'Aspekta, system-ui, sans-serif',
              background: 'linear-gradient(to right, #06B6D4, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CapTable AI
          </div>
          <div
            style={{
              fontSize: '0.55rem',
              color: '#333333',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: 3,
              fontFamily: 'Aspekta, system-ui, sans-serif',
            }}
          >
            SBA Lender Platform
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '1.25rem 1.5rem 0.4rem' }}>
        <span
          style={{
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#333333',
            fontFamily: 'Aspekta, system-ui, sans-serif',
          }}
        >
          Loan Officer Tools
        </span>
      </div>

      {/* Nav items */}
      <div
        style={{
          flex: 1,
          padding: '0.25rem 0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.route;
          const Icon = item.icon;

          return (
            <Link
              key={item.route}
              href={item.route}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.65rem 0.875rem',
                borderRadius: '0.625rem',
                color: active ? '#ffffff' : '#555555',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: active ? 700 : 400,
                fontFamily: 'Aspekta, system-ui, sans-serif',
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                backdropFilter: active ? 'blur(8px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
              }}
              className="nav-item-link"
            >
              {/* Active left accent bar — gradient */}
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: '55%',
                    borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(to bottom, #06B6D4, #EC4899)',
                  }}
                />
              )}

              <Icon
                size={15}
                strokeWidth={active ? 2.5 : 1.75}
                style={{
                  color: active ? '#06B6D4' : 'inherit',
                  flexShrink: 0,
                  transition: 'color 0.2s ease',
                }}
              />
              <span>{item.label}</span>

              {item.badge && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.52rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    background: 'rgba(6,182,212,0.08)',
                    color: '#06B6D4',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 9999,
                    border: '1px solid rgba(6,182,212,0.22)',
                    fontFamily: 'Aspekta, system-ui, sans-serif',
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
      <div style={{ padding: '1.25rem 0.875rem', flexShrink: 0 }}>
        <div
          className="footer-card-hover"
          style={{
            padding: '0.875rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            transition: 'border-color 0.2s ease',
          }}
        >
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#555555', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Aspekta, system-ui, sans-serif' }}>
            Analytical Support Only
          </p>
          <p style={{ fontSize: '0.6rem', color: '#333333', lineHeight: 1.5 }}>
            All outputs require loan officer review. Not a credit decision tool.
          </p>
        </div>
      </div>
    </nav>
  );
}
