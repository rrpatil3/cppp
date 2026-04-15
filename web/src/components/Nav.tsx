'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Wrench,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
} from 'lucide-react';

interface NavProps {
  mobile?: boolean;
}

const NAV_ITEMS = [
  { label: 'Dashboard',     route: '/',             icon: LayoutDashboard },
  { label: 'AI Advisor',    route: '/advisor',       icon: MessageSquare },
  { label: 'Tools',         route: '/tools',         icon: Wrench },
  { label: 'M&A Suite',     route: '/ma',            icon: TrendingUp },
  { label: 'Balance Sheet', route: '/balance-sheet', icon: DollarSign },
  { label: 'Cap Table',     route: '/ownership',     icon: Users },
  { label: 'Settings',      route: '/settings',      icon: Settings },
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
                borderRadius: '0.5rem',
                color: active ? 'var(--green)' : 'var(--text-tertiary)',
                background: active ? 'var(--green-dim)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                minWidth: 44,
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
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>CapTable</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Financial AI</div>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{ padding: '1.5rem 1rem 0.5rem 1.5rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          Main / Dashboard
        </span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                transition: 'color 0.2s ease',
                zIndex: 0,
              }}
              className="nav-item-link"
            >
              {active && (
                <motion.div
                  layoutId="activeNavIndicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '0.75rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? 'var(--green)' : 'inherit', flexShrink: 0 }}
              />
              <span>{item.label}</span>
              {item.label === 'M&A Suite' && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'var(--bg-overlay)',
                    color: 'var(--text-secondary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 9999,
                  }}
                >
                  New
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer card */}
      <div style={{ padding: '1.5rem 1rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            padding: '1rem',
            borderRadius: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          className="footer-card-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--bg-overlay)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--green)',
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Unlock AI Features
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your financial assistant
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
