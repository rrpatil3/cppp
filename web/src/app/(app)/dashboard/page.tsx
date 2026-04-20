'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  calculateHealthScore, computeValuationRange, detectRedFlags,
  formatCompact, formatCurrency, getHealthLabel,
} from '@/lib/calculator';
import type { Business, BalanceSheetItem } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BorrowerCard {
  business: Business;
  healthScore: number;
  healthLabel: string;
  estimatedValuation: number;
  netMargin: number;
  items: BalanceSheetItem[];
}

interface PageData {
  borrower: BorrowerCard | null;
  recentAdvice: string | null;
}

const workflowItems = [
  { label: 'Run DSCR & SBA Ratios', sub: 'Global cash flow · Leverage · Collateral', href: '/underwriting', step: '01' },
  { label: 'Generate Credit Memo', sub: 'AI-drafted SBA 7(a) credit memo', href: '/credit-memo', step: '02', tag: 'AI' },
  { label: 'Due Diligence Checklist', sub: '12-category DD assessment · Valuation', href: '/tools', step: '03' },
  { label: 'Ask AI Underwriter', sub: 'Structured Q&A on borrower financials', href: '/advisor', step: '04', tag: 'AI' },
  { label: 'M&A Suite & CIM', sub: 'Valuation · Buyer discovery · CIM generation', href: '/ma', step: '05', tag: 'AI' },
  { label: 'Balance Sheet & Cap Table', sub: 'Asset/liability spreading · Ownership', href: '/balance-sheet', step: '06' },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function PipelineDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [bizResult, bsResult, chatResult] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('balance_sheet_items').select('*').eq('user_id', user.id),
        supabase.from('chat_history').select('content').eq('user_id', user.id).eq('role', 'assistant').order('created_at', { ascending: false }).limit(1),
      ]);

      if (!bizResult.data) { router.push('/onboarding'); return; }

      const business = bizResult.data as Business;
      const items = (bsResult.data || []) as BalanceSheetItem[];
      const assets = items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
      const liabilities = items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
      const equity = assets - liabilities;
      const healthScore = calculateHealthScore(business, assets, liabilities, equity);
      const valuationRange = computeValuationRange(business);
      const netMargin = business.annual_revenue > 0 ? (business.net_income / business.annual_revenue) * 100 : 0;

      setData({
        borrower: {
          business, healthScore,
          healthLabel: getHealthLabel(healthScore),
          estimatedValuation: (valuationRange.low + valuationRange.high) / 2,
          netMargin, items,
        },
        recentAdvice: (chatResult.data?.[0] as { content: string } | undefined)?.content ?? null,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  const hero = (
    <section
      style={{
        padding: '5rem 2.5rem 4rem',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Platform tag */}
      <RevealBlock>
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="eyebrow">SBA 7(a) AI Underwriting Platform</span>
        </div>
      </RevealBlock>

      {/* Hero headline */}
      <RevealBlock delay={60}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#111111',
            maxWidth: 700,
            marginBottom: '1.25rem',
          }}
        >
          AI financial intelligence for SBA loan officers.
        </h1>
      </RevealBlock>

      <RevealBlock delay={120}>
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 400,
            color: '#787774',
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          Reduces 4–8 hours of manual analyst work to under 30 minutes per SBA 7(a) application.
          Analytical support only — credit decisions remain with the loan officer.
        </p>
      </RevealBlock>

      {/* CTAs */}
      <RevealBlock delay={180}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          <Link href="/underwriting" className="btn-primary">
            Start Analysis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link href="/advisor" className="btn-secondary">
            Ask AI Underwriter
          </Link>
        </div>
      </RevealBlock>

      {/* Stats strip */}
      <RevealBlock delay={240}>
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderTop: '1px solid #EAEAEA',
            paddingTop: '2rem',
          }}
        >
          {[
            { value: '57,362', label: 'SBA 7(a) Loans Processed Annually' },
            { value: '~5 hrs', label: 'Saved Per Application' },
            { value: '140',    label: 'Target Preferred Lenders' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                paddingRight: '2.5rem',
                borderRight: i < 2 ? '1px solid #EAEAEA' : 'none',
                paddingLeft: i > 0 ? '2.5rem' : '0',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#111111',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.25rem',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#AEABA4',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>
    </section>
  );

  if (loading) {
    return (
      <div style={{ background: '#FBFBFA', minHeight: '100vh', position: 'relative' }}>
        <div className="ambient-layer" aria-hidden />
        {hero}
        <div style={{ padding: '0 2.5rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
          {[80, 220, 80, 160].map((h, i) => (
            <div key={i} className="skeleton" style={{ height: h, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { borrower: b, recentAdvice } = data;
  if (!b) return null;

  const assets = b.items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
  const liabilities = b.items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
  const equity = assets - liabilities;
  const redFlags = detectRedFlags(b.business, liabilities, equity);
  const deRatio = equity > 0 ? liabilities / equity : 0;
  const healthColor = b.healthScore >= 70 ? 'var(--green)' : b.healthScore >= 45 ? 'var(--gold)' : 'var(--red)';
  const healthBg = b.healthScore >= 70 ? 'var(--green-bg)' : b.healthScore >= 45 ? 'var(--gold-bg)' : 'var(--red-bg)';
  const healthBorder = b.healthScore >= 70 ? 'var(--green-border)' : b.healthScore >= 45 ? 'var(--gold-border)' : 'var(--red-border)';

  return (
    <div style={{ background: '#FBFBFA', minHeight: '100vh', position: 'relative' }}>
      <div className="ambient-layer" aria-hidden />

      {hero}

      {/* Content sections */}
      <div style={{ padding: '0 2.5rem 5rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ flex: 1, height: 1, background: '#EAEAEA' }} />
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#AEABA4',
              fontFamily: 'var(--font-body)',
            }}
          >
            Live Borrower Data
          </span>
          <div style={{ flex: 1, height: 1, background: '#EAEAEA' }} />
        </div>

        {/* KPI strip */}
        <RevealBlock>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
              border: '1px solid #EAEAEA',
              borderRadius: 12,
              background: '#FFFFFF',
              marginBottom: '1.5rem',
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'Borrower Revenue', value: formatCompact(b.business.annual_revenue), sub: 'Annual' },
              { label: 'Net Income', value: formatCompact(b.business.net_income), sub: `${b.netMargin.toFixed(1)}% margin` },
              { label: 'Est. Business Value', value: formatCompact(b.estimatedValuation), sub: 'Blended multiple' },
              { label: 'D/E Ratio', value: deRatio > 0 ? `${deRatio.toFixed(1)}×` : 'N/A', sub: deRatio > 3 ? 'Elevated' : 'Healthy' },
            ].map((m, i) => (
              <div
                key={m.label}
                style={{
                  padding: '1.5rem',
                  borderRight: i < 3 ? '1px solid #EAEAEA' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#AEABA4',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#111111',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {m.value}
                </div>
                {m.sub && (
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#AEABA4', fontFamily: 'var(--font-body)' }}>
                    {m.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* Active borrower card */}
        <RevealBlock delay={60}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#AEABA4',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Active SBA 7(a) Application
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: '#111111',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {b.business.business_name}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#787774', marginTop: '0.25rem', fontFamily: 'var(--font-body)' }}>
                  {b.business.industry || 'Industry not specified'} · {b.business.employees} employees
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.3rem 0.875rem',
                    borderRadius: 9999,
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    background: healthBg,
                    border: `1px solid ${healthBorder}`,
                    color: healthColor,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {b.healthLabel} · {b.healthScore}/100
                </span>
                <div style={{ fontSize: '0.65rem', color: '#AEABA4', marginTop: '0.5rem', fontFamily: 'var(--font-body)' }}>
                  SBA Financial Health Score
                </div>
                <div
                  style={{
                    marginTop: '0.5rem',
                    width: 140,
                    height: 3,
                    background: '#EAEAEA',
                    borderRadius: 9999,
                    marginLeft: 'auto',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 9999,
                      width: `${b.healthScore}%`,
                      background: healthColor,
                      transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 0,
                borderTop: '1px solid #EAEAEA',
                paddingTop: '1.25rem',
              }}
            >
              {[
                { label: 'Annual Revenue', value: formatCurrency(b.business.annual_revenue) },
                { label: 'Net Income', value: formatCurrency(b.business.net_income) },
                { label: 'EBIT', value: formatCurrency(b.business.ebit) },
                { label: 'Total Equity', value: formatCurrency(equity) },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    paddingRight: i < 3 ? '1.5rem' : 0,
                    paddingLeft: i > 0 ? '1.5rem' : 0,
                    borderRight: i < 3 ? '1px solid #EAEAEA' : 'none',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AEABA4', marginBottom: '0.375rem', fontFamily: 'var(--font-body)' }}>
                    {row.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: '#111111' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* Risk flags */}
        {redFlags.length > 0 && (
          <RevealBlock delay={80}>
            <div
              style={{
                background: '#FDEBEC',
                border: '1px solid #F0BFBF',
                borderRadius: 12,
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9F2F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#9F2F2D',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {redFlags.length} Underwriting Risk{redFlags.length > 1 ? 's' : ''} Detected
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {redFlags.map((flag, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.875rem',
                      alignItems: 'flex-start',
                      background: 'rgba(255,255,255,0.6)',
                      padding: '0.875rem 1rem',
                      borderRadius: 8,
                      border: '1px solid #F0BFBF',
                    }}
                  >
                    <span className={`badge ${flag.severity === 'critical' ? 'badge-red' : flag.severity === 'warning' ? 'badge-yellow' : 'badge-muted'}`} style={{ flexShrink: 0, marginTop: 2 }}>
                      {flag.severity}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111111', fontFamily: 'var(--font-body)' }}>{flag.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#787774', marginTop: '0.2rem', fontFamily: 'var(--font-body)' }}>{flag.detail}</div>
                      <div style={{ fontSize: '0.75rem', color: '#AEABA4', marginTop: '0.15rem', fontFamily: 'var(--font-body)' }}>{flag.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        )}

        {/* Workflow — Bento */}
        <RevealBlock delay={100}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#111111',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.25rem',
                }}
              >
                Loan Officer Workflow
              </div>
              <div style={{ fontSize: '0.825rem', color: '#787774', fontFamily: 'var(--font-body)' }}>
                Complete a full SBA 7(a) analysis in under 30 minutes
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}
            >
              {workflowItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  className="workflow-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16,1,0.3,1] }}
                  style={i === 0 || i === 5 ? { gridColumn: 'span 2' } : {}}
                >
                  <Link href={item.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div className="workflow-card-inner" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#AEABA4',
                          flexShrink: 0,
                          width: 28,
                        }}
                      >
                        {item.step}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111111', fontFamily: 'var(--font-body)' }}>
                            {item.label}
                          </span>
                          {item.tag && (
                            <span
                              className="badge badge-accent"
                              style={{ fontSize: '0.55rem', padding: '0.1rem 0.4rem' }}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#AEABA4', fontFamily: 'var(--font-body)' }}>
                          {item.sub}
                        </div>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#AEABA4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* Unit economics */}
        <RevealBlock delay={120}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#AEABA4',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              Unit Economics at a Glance
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 0,
              }}
            >
              {[
                { label: 'Cost / Application (Manual)', value: '$200–$600', note: 'At $100K analyst salary, 200 loans/yr' },
                { label: 'Time Saved / Application', value: '~5 hours', note: 'From 4–8 hrs → under 30 min' },
                { label: 'Annual Analyst Cost (PLP)', value: '$40–120K', note: '200 loans × $200–600/loan' },
                { label: 'Platform ACV', value: '$24–60K', note: '$2,000–$5,000/month per institution' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    paddingRight: i < 3 ? '1.5rem' : 0,
                    paddingLeft: i > 0 ? '1.5rem' : 0,
                    borderRight: i < 3 ? '1px solid #EAEAEA' : 'none',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AEABA4', marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 600, color: '#111111', marginBottom: '0.25rem' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#AEABA4', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
                    {s.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* Recent AI analysis */}
        {recentAdvice && (
          <RevealBlock delay={140}>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#346538',
                      animation: 'floatY 2s ease-in-out infinite',
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#AEABA4', fontFamily: 'var(--font-body)' }}>
                    Recent AI Analysis
                  </span>
                </div>
                <Link
                  href="/advisor"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#787774',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'color 0.15s ease',
                  }}
                >
                  View conversation
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: '#787774',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical' as const,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {recentAdvice}
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 8,
                  background: '#F7F6F3',
                  fontSize: '0.7rem',
                  color: '#AEABA4',
                  fontFamily: 'var(--font-body)',
                }}
              >
                For loan officer review only. All credit decisions remain with the loan officer. Not a credit opinion.
              </div>
            </div>
          </RevealBlock>
        )}
      </div>
    </div>
  );
}
