'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  calculateHealthScore, computeValuationRange, detectRedFlags,
  formatCompact, formatCurrency, getHealthLabel,
} from '@/lib/calculator';
import type { Business, BalanceSheetItem } from '@/lib/types';
import Link from 'next/link';

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

const STATUS_COLORS: Record<string, string> = {
  pipeline: 'var(--text-tertiary)',
  'in-review': 'var(--gold)',
  approved: 'var(--green)',
  declined: 'var(--red)',
  'on-hold': '#f97316',
};

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
          business,
          healthScore,
          healthLabel: getHealthLabel(healthScore),
          estimatedValuation: (valuationRange.low + valuationRange.high) / 2,
          netMargin,
          items,
        },
        recentAdvice: (chatResult.data?.[0] as { content: string } | undefined)?.content ?? null,
      });
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[80, 200, 80, 160].map((h, i) => (
          <div key={i} className="skeleton" style={{ height: h, borderRadius: '1rem' }} />
        ))}
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

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Underwriting Pipeline
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          Active borrower analysis · All outputs require loan officer review before use in credit files
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Borrower Revenue', value: formatCompact(b.business.annual_revenue), sub: 'Annual' },
          { label: 'Net Income', value: formatCompact(b.business.net_income), sub: `${b.netMargin.toFixed(1)}% margin` },
          { label: 'Est. Business Value', value: formatCompact(b.estimatedValuation), sub: 'Blended multiple' },
          { label: 'D/E Ratio', value: deRatio > 0 ? `${deRatio.toFixed(1)}×` : 'N/A', sub: deRatio > 3 ? 'Elevated' : 'Healthy' },
        ].map(m => (
          <div key={m.label} className="card stat-card">
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>{m.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{m.value}</div>
            {m.sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Active borrower card */}
      <div className="card reveal d0" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Active Application</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.business.business_name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.business.industry || 'Industry not specified'} · {b.business.employees} employees</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${b.healthScore >= 70 ? 'badge-green' : b.healthScore >= 45 ? 'badge-yellow' : 'badge-red'}`}>
              {b.healthLabel} · {b.healthScore}/100
            </span>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>SBA Health Score</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Annual Revenue', value: formatCurrency(b.business.annual_revenue) },
            { label: 'Net Income', value: formatCurrency(b.business.net_income) },
            { label: 'EBIT', value: formatCurrency(b.business.ebit) },
            { label: 'Total Equity', value: formatCurrency(equity) },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{row.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk flags */}
      {redFlags.length > 0 && (
        <div className="card reveal d1" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.75rem' }}>
            {redFlags.length} Underwriting Risk{redFlags.length > 1 ? 's' : ''} Detected
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {redFlags.map((flag, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span className={`badge ${flag.severity === 'critical' ? 'badge-red' : flag.severity === 'warning' ? 'badge-yellow' : 'badge-muted'}`} style={{ flexShrink: 0, marginTop: 2 }}>
                  {flag.severity}
                </span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{flag.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{flag.detail}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>{flag.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions — loan officer workflow */}
      <div className="card reveal d2" style={{ marginBottom: '1rem' }}>
        <div className="stripe-row-title" style={{ marginBottom: '0.75rem' }}>Loan Officer Workflow</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { label: 'Run DSCR Analysis', sub: 'Global cash flow · SBA ratios', href: '/underwriting' },
            { label: 'Generate Credit Memo', sub: 'AI-drafted credit memo', href: '/credit-memo' },
            { label: 'Due Diligence Checklist', sub: '12-category DD assessment', href: '/tools' },
            { label: 'Ask AI Underwriter', sub: 'Structured Q&A on this borrower', href: '/advisor' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="quick-action-link" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{a.sub}</div>
              </div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent AI analysis */}
      {recentAdvice && (
        <div className="card reveal d3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="stripe-row-title">Recent AI Analysis</div>
            <Link href="/advisor" style={{ fontSize: '0.75rem', color: 'var(--green)', textDecoration: 'none' }}>View conversation →</Link>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recentAdvice}
          </p>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: '0.5rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            This analysis is for loan officer review only. All credit decisions remain with the loan officer.
          </div>
        </div>
      )}
    </div>
  );
}
