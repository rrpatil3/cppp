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
} from 'lucide-react';

interface NavProps {
  mobile?: boolean;
}

const NAV_ITEMS = [
  { label: 'Pipeline',       route: '/',             icon: LayoutDashboard },
  { label: 'Underwriting',   route: '/underwriting', icon: BarChart3 },
  { label: 'Credit Memo',    route: '/credit-memo',  icon: FileText },
  { label: 'AI Underwriter', route: '/advisor',      icon: MessageSquare },
  { label: 'Due Diligence',  route: '/tools',        icon: ClipboardList },
  { label: 'Balance Sheet',  route: '/balance-sheet', icon: DollarSign },
  { label: 'Ownership',      route: '/ownership',    icon: Users },
  { label: 'Settings',       route: '/settings',     icon: Settings },
];

export default function Nav({ mobile = false }: NavProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav
        style={{
          background: 'var(--bg-base)',
          borderTop: '1px solid var(--border)',
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
                color: active ? 'var(--green)' : 'var(--text-tertiary)',
                background: active ? 'var(--green-dim)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                minWidth: 44,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              <Icon size={18} />
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
      {/* Logo */}
      <div
        style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,229,153,0.3)',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 14L10 2L20 14" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 22L8 10L12 10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>CapTable AI</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>SBA Underwriting</div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          Loan Officer Tools
        </span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
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
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: active ? 500 : 400,
                background: active ? 'var(--bg-elevated)' : 'transparent',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
                transition: 'color 0.2s, background 0.2s',
              }}
              className="nav-item-link"
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? 'var(--green)' : 'inherit', flexShrink: 0, transition: 'color 0.2s' }}
              />
              <span>{item.label}</span>
              {item.label === 'Credit Memo' && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'var(--green-dim)',
                    color: 'var(--green)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 9999,
                  }}
                >
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer — SBA compliance note */}
      <div style={{ padding: '1.5rem 1rem', flexShrink: 0 }}>
        <div
          style={{
            padding: '1rem',
            borderRadius: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Analytical Support Only
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            All outputs require loan officer review before use in credit files. Not a credit decision tool.
          </p>
        </div>
      </div>
    </nav>
  );
}
