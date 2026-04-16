import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { calculateHealthScore, computeDealReadinessScore, computeValuationRange, detectRedFlags, formatCompact, formatCurrency, getHealthLabel, getHealthInsight } from '@/lib/calculator';
import type { Business, BalanceSheetItem } from '@/lib/types';
import AnimatedSparkline from '@/components/AnimatedSparkline';
import CounterNumber from '@/components/CounterNumber';
import Link from 'next/link';

export const revalidate = 0;

// Re-throw Next.js redirect/notFound signals so they aren't swallowed by catch blocks
function isNextInternalError(e: unknown): boolean {
  const digest = (e as { digest?: string })?.digest ?? '';
  return digest.startsWith('NEXT_REDIRECT') || digest.startsWith('NEXT_NOT_FOUND');
}

export default async function DashboardPage() {
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient();
  } catch (e) {
    if (isNextInternalError(e)) throw e;
    redirect('/login');
  }

  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    if (isNextInternalError(e)) throw e;
    redirect('/login');
  }

  if (!user) redirect('/login');

  let business: Business | null = null;
  let bsItems: BalanceSheetItem[] | null = null;
  let lastChat: { content: string }[] | null = null;
  let snapshots: { annual_revenue: number | null; snapshot_date: string }[] | null = null;

  try {
    const [bizResult, bsResult, chatResult, snapResult] = await Promise.all([
      supabase.from('businesses').select('*').eq('user_id', user.id).single(),
      supabase.from('balance_sheet_items').select('*').eq('user_id', user.id),
      supabase.from('chat_history').select('content').eq('user_id', user.id).eq('role', 'assistant').order('created_at', { ascending: false }).limit(1),
      supabase.from('business_snapshots').select('*').eq('user_id', user.id).order('snapshot_date', { ascending: true }).limit(30),
    ]);
    business = (bizResult.data as Business) ?? null;
    bsItems = bizResult.error ? null : (bsResult.data as BalanceSheetItem[]);
    lastChat = chatResult.data as { content: string }[] ?? null;
    snapshots = snapResult.data as { annual_revenue: number | null; snapshot_date: string }[] ?? null;
  } catch (e) {
    if (isNextInternalError(e)) throw e;
    redirect('/login');
  }

  if (!business) redirect('/onboarding');

  const b = business;

  const items: BalanceSheetItem[] = bsItems || [];
  const assets = items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
  const liabilities = items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
  const equity = assets - liabilities;

  const healthScore = calculateHealthScore(b, assets, liabilities, equity);
  const readinessScore = computeDealReadinessScore(b);
  const valuationRange = computeValuationRange(b);
  const redFlags = detectRedFlags(b, liabilities, equity);
  const estimatedValuation = (valuationRange.low + valuationRange.high) / 2;
  const netMargin = b.annual_revenue > 0 ? (b.net_income / b.annual_revenue) * 100 : 0;
  const deRatio = equity > 0 ? liabilities / equity : 0;
  const healthLabel = getHealthLabel(healthScore);
  const healthInsight = getHealthInsight(healthScore, b, equity);
  const recentAdvice = lastChat?.[0]?.content || null;

  const sparkData = snapshots?.map(s => ({ value: s.annual_revenue ?? b.annual_revenue })) || [];

  const readinessFactors = [
    { label: 'Clean Books', val: b.readiness_clean_books },
    { label: 'Revenue Quality', val: b.readiness_revenue_quality },
    { label: 'Owner Independent', val: b.readiness_owner_independent },
    { label: 'No Concentration', val: b.readiness_no_concentration },
    { label: 'Growing', val: b.readiness_growing },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
        <div className="card" style={{ paddingBottom: '0' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Estimated Valuation</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <CounterNumber
              value={estimatedValuation}
              formatter={v => formatCompact(v)}
              style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Range: {formatCompact(valuationRange.low)} – {formatCompact(valuationRange.high)} · {valuationRange.label}
          </div>
          <AnimatedSparkline data={sparkData.length > 1 ? sparkData : undefined} height={56} />
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Business Health</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <CounterNumber value={healthScore} style={{ fontSize: '2.25rem', fontWeight: 800, color: healthScore >= 70 ? 'var(--green)' : healthScore >= 45 ? 'var(--gold)' : 'var(--red)', fontFamily: 'var(--font-mono)' }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>/100</span>
          </div>
          <span className={`badge ${healthScore >= 70 ? 'badge-green' : healthScore >= 45 ? 'badge-yellow' : 'badge-red'}`} style={{ alignSelf: 'flex-start' }}>{healthLabel}</span>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 6, overflow: 'hidden', marginTop: '0.25rem' }}>
            <div className="bar-fill" style={{ width: `${healthScore}%`, background: healthScore >= 70 ? 'var(--green)' : healthScore >= 45 ? 'var(--gold)' : 'var(--red)' }} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {[
          { label: 'Annual Revenue', value: formatCompact(b.annual_revenue), sub: '' },
          { label: 'Net Income', value: formatCompact(b.net_income), sub: `${netMargin.toFixed(1)}% margin` },
          { label: 'D/E Ratio', value: deRatio > 0 ? `${deRatio.toFixed(1)}×` : 'N/A', sub: deRatio > 3 ? 'Elevated' : 'Healthy' },
          { label: 'Net Margin', value: `${netMargin.toFixed(1)}%`, sub: netMargin > 10 ? 'Strong' : netMargin > 5 ? 'Moderate' : 'Thin' },
        ].map(m => (
          <div key={m.label} className="card stat-card">
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>{m.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{m.value}</div>
            {m.sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <div className="card reveal d0" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.75rem' }}>
            {redFlags.length} Risk Factor{redFlags.length > 1 ? 's' : ''} Detected
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Financial Health */}
        <div className="card reveal d1">
          <div className="stripe-row-title" style={{ marginBottom: '0.75rem' }}>Financial Health</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.875rem' }}>{healthInsight}</p>
          {[
            { label: 'Revenue', value: formatCurrency(b.annual_revenue) },
            { label: 'Net Income', value: formatCurrency(b.net_income) },
            { label: 'EBIT', value: formatCurrency(b.ebit) },
            { label: 'Net Equity', value: formatCurrency(equity) },
          ].map(row => (
            <div className="data-row" key={row.label}>
              <span className="data-row-label">{row.label}</span>
              <span className="data-row-value">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Exit Readiness */}
        <div className="card reveal d2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div className="stripe-row-title">Exit Readiness</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: readinessScore >= 70 ? 'var(--green)' : readinessScore >= 40 ? 'var(--gold)' : 'var(--red)' }}>{readinessScore}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>/ 100</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {readinessFactors.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.label}</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3].map(v => (
                    <div key={v} style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: f.val >= v ? 'var(--green)' : 'var(--bg-overlay)',
                      border: '1px solid',
                      borderColor: f.val >= v ? 'var(--green)' : 'var(--border)',
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href="/settings" style={{ fontSize: '0.75rem', color: 'var(--green)', textDecoration: 'none', marginTop: '0.75rem', display: 'block' }}>
            Update readiness factors →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card reveal d3" style={{ marginBottom: '1rem' }}>
        <div className="stripe-row-title" style={{ marginBottom: '0.75rem' }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { label: 'Run Financial Analysis', sub: '9 analysis tools', href: '/tools' },
            { label: 'Explore M&A Options', sub: 'Valuation, buyers, CIM', href: '/ma' },
            { label: 'Update Balance Sheet', sub: 'Assets & liabilities', href: '/balance-sheet' },
            { label: 'Ask AI Advisor', sub: 'Get personalized advice', href: '/advisor' },
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

      {/* Recent Advice */}
      {recentAdvice && (
        <div className="card reveal d4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="stripe-row-title">Recent AI Advice</div>
            <Link href="/advisor" style={{ fontSize: '0.75rem', color: 'var(--green)', textDecoration: 'none' }}>View conversation →</Link>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recentAdvice}
          </p>
        </div>
      )}
    </div>
  );
}
