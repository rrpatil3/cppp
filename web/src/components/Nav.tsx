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
          background: 'rgba(9,13,22,0.96)',
          borderTop: '1px solid var(--border)',
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
                color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                minWidth: 44,
                transition: 'color 0.2s cubic-bezier(0.22,1,0.36,1), background 0.2s cubic-bezier(0.22,1,0.36,1)',
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
        background: 'var(--bg-base)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
      }}
    >
      {/* Wordmark – no logo icon */}
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.75rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            CapTable
            <span style={{ color: 'var(--accent)', marginLeft: 2 }}>AI</span>
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-tertiary)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 2,
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
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
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
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: active ? 600 : 400,
                background: active ? 'var(--bg-elevated)' : 'transparent',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
                boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.07)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
              }}
              className="nav-item-link"
            >
              {/* Active left accent bar */}
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
                    background: 'var(--accent)',
                  }}
                />
              )}

              <Icon
                size={16}
                strokeWidth={active ? 2.5 : 1.75}
                style={{
                  color: active ? 'var(--accent)' : 'inherit',
                  flexShrink: 0,
                  transition: 'color 0.2s ease',
                }}
              />
              <span>{item.label}</span>

              {item.badge && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'var(--accent-dim)',
                    color: 'var(--accent)',
                    padding: '0.12rem 0.45rem',
                    borderRadius: 9999,
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '1.25rem 0.875rem', flexShrink: 0 }}>
        <div
          className="footer-card-hover"
          style={{
            padding: '0.875rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            transition: 'border-color 0.2s ease',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.2rem',
            }}
          >
            Analytical Support Only
          </p>
          <p
            style={{
              fontSize: '0.62rem',
              color: 'var(--text-tertiary)',
              lineHeight: 1.5,
            }}
          >
            All outputs require loan officer review. Not a credit decision tool.
          </p>
        </div>
      </div>
    </nav>
  );
}
