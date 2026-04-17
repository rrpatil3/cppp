'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, BalanceSheetItem } from '@/lib/types';
import {
  computeSDE, calculateAfterTaxProceeds, detectRedFlags, modelScenario,
  formatCurrency, formatCompact,
} from '@/lib/calculator';
import { getIndustryBenchmark as getBenchmark, getMarginPercentile, COMPARABLE_TRANSACTIONS } from '@/lib/benchmarks';
import { marked } from 'marked';

const TOOLS = [
  { key: 'scenario', label: 'Scenario Modeler' },
  { key: 'sde', label: 'SDE Calculator' },
  { key: 'after-tax', label: 'After-Tax Proceeds' },
  { key: 'red-flags', label: 'Red Flags' },
  { key: 'benchmarks', label: 'Industry Benchmarks' },
  { key: 'value-drivers', label: 'Value Drivers' },
  { key: 'buyer-view', label: 'Buyer View' },
  { key: 'comparables', label: 'Comparable Transactions' },
  { key: 'coverage', label: 'Interest Coverage' },
];

function ToolsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [bsItems, setBsItems] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const activeTool = searchParams.get('tool') || 'scenario';

  // Tool-specific state
  const [revChangePct, setRevChangePct] = useState('10');
  const [marginChangePct, setMarginChangePct] = useState('0');
  const [ownerSalary, setOwnerSalary] = useState('');
  const [ownerPerks, setOwnerPerks] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [nonRecurring, setNonRecurring] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [stateTaxRate, setStateTaxRate] = useState('5');
  const [ordinaryIncome, setOrdinaryIncome] = useState('0');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: biz }, { data: items }] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('balance_sheet_items').select('*').eq('user_id', user.id),
      ]);
      if (biz) setBusiness(biz as Business);
      setBsItems((items || []) as BalanceSheetItem[]);
      setLoading(false);
    }
    load();
  }, []);

  async function runAI(type: string) {
    if (!business) return;
    setAiLoading(l => ({ ...l, [type]: true }));
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, business }),
    });
    const data = await res.json();
    setAiResults(r => ({ ...r, [type]: data.result || data.error || '' }));
    setAiLoading(l => ({ ...l, [type]: false }));
  }

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!business) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Business not found.</div>;

  const assets = bsItems.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
  const liabilities = bsItems.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
  const equity = assets - liabilities;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Financial Analysis Tools</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>9 tools to analyze and improve your business</p>
      </div>

      {/* Tool selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1.5rem' }}>
        {TOOLS.map(t => (
          <button key={t.key} onClick={() => router.push(`/tools?tool=${t.key}`)} style={{
            padding: '0.35rem 0.875rem', borderRadius: '9999px', border: '1px solid',
            borderColor: activeTool === t.key ? 'var(--green)' : 'var(--border)',
            background: activeTool === t.key ? 'var(--green-dim)' : 'transparent',
            color: activeTool === t.key ? 'var(--green)' : 'var(--text-secondary)',
            fontWeight: activeTool === t.key ? 600 : 400, fontSize: '0.8rem', cursor: 'pointer',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Scenario Modeler */}
      {activeTool === 'scenario' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Scenario Modeler</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="label">Revenue Change (%)</label>
              <input className="input" type="number" value={revChangePct} onChange={e => setRevChangePct(e.target.value)} />
            </div>
            <div>
              <label className="label">Margin Change (%)</label>
              <input className="input" type="number" value={marginChangePct} onChange={e => setMarginChangePct(e.target.value)} />
            </div>
          </div>
          {(() => {
            const result = modelScenario(business, parseFloat(revChangePct) || 0, parseFloat(marginChangePct) || 0);
            return (
              <div>
                {[
                  { label: 'Current Revenue', value: formatCurrency(business.annual_revenue) },
                  { label: 'Projected Revenue', value: formatCurrency(result.projectedRevenue) },
                  { label: 'Current Net Income', value: formatCurrency(business.net_income) },
                  { label: 'Projected Net Income', value: formatCurrency(result.projectedIncome) },
                  { label: 'Projected Valuation Range', value: `${formatCompact(result.valuationLow)} – ${formatCompact(result.valuationHigh)}` },
                ].map(r => (
                  <div className="data-row" key={r.label}>
                    <span className="data-row-label">{r.label}</span>
                    <span className="data-row-value">{r.value}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* SDE Calculator */}
      {activeTool === 'sde' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Seller&apos;s Discretionary Earnings</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Owner Salary Add-Back ($)', val: ownerSalary, set: setOwnerSalary, ph: '120000' },
              { label: 'Owner Perks ($)', val: ownerPerks, set: setOwnerPerks, ph: '25000' },
              { label: 'Depreciation ($)', val: depreciation, set: setDepreciation, ph: '30000' },
              { label: 'Non-Recurring Items ($)', val: nonRecurring, set: setNonRecurring, ph: '15000' },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} min="0" />
              </div>
            ))}
          </div>
          {(() => {
            const sde = computeSDE(business.ebit, parseFloat(ownerSalary) || 0, parseFloat(ownerPerks) || 0, parseFloat(depreciation) || 0, parseFloat(nonRecurring) || 0);
            return (
              <div>
                <div className="data-row"><span className="data-row-label">EBIT</span><span className="data-row-value">{formatCurrency(business.ebit)}</span></div>
                <div className="data-row"><span className="data-row-label">SDE</span><span className="value-positive" style={{ fontSize: '1.25rem' }}>{formatCurrency(sde)}</span></div>
                <div className="data-row"><span className="data-row-label">SDE × 2.5 (Low)</span><span className="data-row-value">{formatCurrency(sde * 2.5)}</span></div>
                <div className="data-row"><span className="data-row-label">SDE × 3.5 (Mid)</span><span className="data-row-value">{formatCurrency(sde * 3.5)}</span></div>
                <div className="data-row"><span className="data-row-label">SDE × 4.5 (High)</span><span className="data-row-value">{formatCurrency(sde * 4.5)}</span></div>
              </div>
            );
          })()}
        </div>
      )}

      {/* After-Tax Proceeds */}
      {activeTool === 'after-tax' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>After-Tax Proceeds Calculator</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="label">Gross Sale Price ($)</label>
              <input className="input" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="5000000" min="0" />
            </div>
            <div>
              <label className="label">Cost Basis ($)</label>
              <input className="input" type="number" value={costBasis} onChange={e => setCostBasis(e.target.value)} placeholder="500000" min="0" />
            </div>
            <div>
              <label className="label">State Tax Rate (%)</label>
              <input className="input" type="number" value={stateTaxRate} onChange={e => setStateTaxRate(e.target.value)} step="0.1" min="0" max="20" />
            </div>
            <div>
              <label className="label">Ordinary Income Portion ($)</label>
              <input className="input" type="number" value={ordinaryIncome} onChange={e => setOrdinaryIncome(e.target.value)} placeholder="0" min="0" />
            </div>
          </div>
          {salePrice && costBasis && (() => {
            const r = calculateAfterTaxProceeds(parseFloat(salePrice), parseFloat(costBasis), parseFloat(stateTaxRate), false, parseFloat(ordinaryIncome) || 0);
            return (
              <div>
                {[
                  { label: 'Gross Sale Price', value: formatCurrency(r.grossSalePrice) },
                  { label: 'Federal Capital Gains Tax', value: formatCurrency(r.federalTax) },
                  { label: 'Net Investment Income Tax (3.8%)', value: formatCurrency(r.netInvestmentIncomeTax) },
                  { label: 'State Tax', value: formatCurrency(r.stateTax) },
                  { label: 'Total Tax', value: formatCurrency(r.totalTax) },
                  { label: 'Net Proceeds', value: formatCurrency(r.netProceeds) },
                  { label: 'Effective Tax Rate', value: `${(r.effectiveRate * 100).toFixed(1)}%` },
                ].map(row => (
                  <div className="data-row" key={row.label}>
                    <span className="data-row-label">{row.label}</span>
                    <span className={row.label === 'Net Proceeds' ? 'value-positive' : row.label.includes('Tax') ? 'value-negative' : 'data-row-value'}>{row.value}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Red Flags */}
      {activeTool === 'red-flags' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '1rem' }}>Risk Factor Analysis</div>
          {(() => {
            const flags = detectRedFlags(business, liabilities, equity);
            if (flags.length === 0) return <div style={{ color: 'var(--green)', fontSize: '0.875rem' }}>No significant red flags detected. Business looks healthy!</div>;
            return flags.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className={`badge ${f.severity === 'critical' ? 'badge-red' : f.severity === 'warning' ? 'badge-yellow' : 'badge-muted'}`} style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }}>
                  {f.severity}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{f.detail}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Action: {f.action}</div>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Benchmarks */}
      {activeTool === 'benchmarks' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '1rem' }}>Industry Benchmarks</div>
          {(() => {
            const bm = getBenchmark(business.industry || '');
            if (!bm) return <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No benchmark data found for industry: {business.industry || 'not set'}. Update your industry in Settings.</div>;
            const netMargin = business.annual_revenue > 0 ? business.net_income / business.annual_revenue : 0;
            const pct = getMarginPercentile(netMargin, bm);
            return (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="badge-green badge">{bm.industry}</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Your margin percentile: <strong style={{ color: 'var(--text-primary)' }}>{pct}th</strong></span>
                </div>
                {[
                  { label: 'Median Net Margin', value: `${(bm.netMarginMedian * 100).toFixed(1)}%`, yours: `${(netMargin * 100).toFixed(1)}%` },
                  { label: 'Top 25% Net Margin', value: `${(bm.netMarginTop25 * 100).toFixed(1)}%`, yours: null },
                  { label: 'Revenue Multiple (Low–Median–High)', value: `${bm.revenueMultipleLow}×–${bm.revenueMultipleMedian}×–${bm.revenueMultipleHigh}×`, yours: null },
                  { label: 'EBITDA Multiple (Low–Median–High)', value: `${bm.ebitdaMultipleLow}×–${bm.ebitdaMultipleMedian}×–${bm.ebitdaMultipleHigh}×`, yours: null },
                  { label: 'Avg Deal Size', value: bm.avgDealSize, yours: null },
                ].map(r => (
                  <div className="data-row" key={r.label}>
                    <span className="data-row-label">{r.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div className="data-row-value">{r.value}</div>
                      {r.yours && <div style={{ fontSize: '0.7rem', color: 'var(--green)' }}>Yours: {r.yours}</div>}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.375rem' }}>Key Value Drivers</div>
                  {bm.keyValueDrivers.map(d => <div key={d} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.2rem 0' }}>· {d}</div>)}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.375rem' }}>Common Risks</div>
                  {bm.commonRisks.map(r => <div key={r} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.2rem 0' }}>· {r}</div>)}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Value Drivers */}
      {activeTool === 'value-drivers' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Value Creation Roadmap</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI-ranked actions to increase your business value</div>
            </div>
            <button onClick={() => runAI('value-drivers')} disabled={aiLoading['value-drivers']} className="btn-primary">
              {aiLoading['value-drivers'] ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {aiResults['value-drivers'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(aiResults['value-drivers']) as string }} />}
        </div>
      )}

      {/* Buyer View */}
      {activeTool === 'buyer-view' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Buy-Side Analyst View</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Internal deal memo from a PE analyst&apos;s perspective</div>
            </div>
            <button onClick={() => runAI('buyer-view')} disabled={aiLoading['buyer-view']} className="btn-primary">
              {aiLoading['buyer-view'] ? 'Generating...' : 'Generate Memo'}
            </button>
          </div>
          {aiResults['buyer-view'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(aiResults['buyer-view']) as string }} />}
        </div>
      )}

      {/* Comparables */}
      {activeTool === 'comparables' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '1rem' }}>Comparable Transactions (2022–2024)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {COMPARABLE_TRANSACTIONS.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 4, padding: '0.875rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.industry}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-muted">{t.year}</span>
                    <span className="value-positive">{t.multiple}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>{t.revenueRange} · {t.dealStructure}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{t.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interest Coverage */}
      {activeTool === 'coverage' && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '1rem' }}>Interest Coverage Ratio</div>
          {(() => {
            const ratio = business.interest_expense > 0 ? business.ebit / business.interest_expense : null;
            const stress1 = ratio ? business.ebit * 0.8 / business.interest_expense : null;
            const stress2 = ratio ? business.ebit * 0.6 / business.interest_expense : null;
            return (
              <div>
                {[
                  { label: 'EBIT', value: formatCurrency(business.ebit) },
                  { label: 'Interest Expense', value: formatCurrency(business.interest_expense) },
                  { label: 'Coverage Ratio', value: ratio ? `${ratio.toFixed(2)}×` : 'N/A (no debt)' },
                  { label: '−20% Revenue Stress', value: stress1 ? `${stress1.toFixed(2)}×` : 'N/A' },
                  { label: '−40% Revenue Stress', value: stress2 ? `${stress2.toFixed(2)}×` : 'N/A' },
                ].map(r => (
                  <div className="data-row" key={r.label}>
                    <span className="data-row-label">{r.label}</span>
                    <span className={
                      r.label === 'Coverage Ratio' && ratio
                        ? ratio >= 3 ? 'value-positive' : ratio >= 1.5 ? 'value-neutral' : 'value-negative'
                        : 'data-row-value'
                    }>{r.value}</span>
                  </div>
                ))}
                {ratio && (
                  <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {ratio >= 3 ? 'Strong coverage. Lenders and buyers will view this positively.' : ratio >= 1.5 ? 'Adequate coverage, but limited buffer. Watch in a downturn.' : 'Thin coverage. High risk — consider reducing debt before a sale.'}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
