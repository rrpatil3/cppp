'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  calculateDSCR, computeValuationRangeForSBA, formatCompact, formatCurrency,
} from '@/lib/calculator';
import type { Business, DSCRData, DSCRResult } from '@/lib/types';
import CounterNumber from '@/components/CounterNumber';
import { motion } from 'framer-motion';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { WaveText } from '@/components/ui/wave-text';

interface DSCRForm {
  proposedDebtService: string;
  existingDebtService: string;
  ownerSalary: string;
  ownerPerks: string;
  depreciation: string;
  nonRecurring: string;
  taxRate: string;
  totalDebt: string;
  totalAssets: string;
  totalEquity: string;
}

export default function UnderwritingPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DSCRResult | null>(null);
  const [form, setForm] = useState<DSCRForm>({
    proposedDebtService: '',
    existingDebtService: '',
    ownerSalary: '',
    ownerPerks: '',
    depreciation: '',
    nonRecurring: '',
    taxRate: '25',
    totalDebt: '',
    totalAssets: '',
    totalEquity: '',
  });

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (!data) { router.push('/onboarding'); return; }
      setBusiness(data as Business);
      setLoading(false);
    }
    load();
  }, [router]);

  function runAnalysis() {
    if (!business) return;
    const data: DSCRData = {
      netOperatingIncome: business.net_income,
      proposedDebtService: parseFloat(form.proposedDebtService) || 0,
      existingDebtService: parseFloat(form.existingDebtService) || 0,
      ownerSalary: parseFloat(form.ownerSalary) || 0,
      ownerPerks: parseFloat(form.ownerPerks) || 0,
      depreciation: parseFloat(form.depreciation) || 0,
      nonRecurring: parseFloat(form.nonRecurring) || 0,
      taxRate: parseFloat(form.taxRate) || 25,
      annualRevenue: business.annual_revenue,
      totalLiabilities: parseFloat(form.totalDebt) || 0,
      totalAssets: parseFloat(form.totalAssets) || 0,
      totalEquity: parseFloat(form.totalEquity) || 0,
    };
    setResult(calculateDSCR(data));
  }

  function field(key: keyof DSCRForm, label: string, placeholder = '0') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
        <input
          type="number"
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '0.625rem 0.875rem',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'var(--font-mono)',
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[80, 200, 160].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 6 }} />)}
      </div>
    );
  }

  if (!business) return null;

  const valuation = computeValuationRangeForSBA(business.annual_revenue, business.ebit, business.industry || '');

  return (
    <div style={{ position: 'relative', background: 'var(--bg-base)', minHeight: '100%' }}>
      <div className="opacity-[0.035] pointer-events-none fixed inset-0 z-0"><BackgroundPaths /></div>

      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.25rem' }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: 4 }}>
          SBA Analysis
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>
          <WaveText text="SBA Underwriting Analysis" />
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          {business.business_name} · DSCR · Global Cash Flow · SBA Ratios
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

        {/* Input Form */}
        <div className="card">
          <div className="stripe-row-title" style={{ marginBottom: '1rem' }}>Debt Service & Add-Back Inputs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Borrower NOI (from business profile):</strong> {formatCurrency(business.net_income)}
            </div>
            {field('proposedDebtService', 'Proposed Annual Debt Service ($)')}
            {field('existingDebtService', 'Existing Annual Debt Service ($)')}
            {field('ownerSalary', 'Owner Salary Add-Back ($)')}
            {field('ownerPerks', 'Owner Perks / Benefits ($)')}
            {field('depreciation', 'Depreciation & Amortization ($)')}
            {field('nonRecurring', 'Non-Recurring Expenses ($)')}
            {field('taxRate', 'Estimated Tax Rate (%)', '25')}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Balance Sheet</div>
              {field('totalDebt', 'Total Debt / Liabilities ($)')}
              {field('totalAssets', 'Total Assets ($)')}
              {field('totalEquity', 'Total Equity ($)')}
            </div>
            <button
              onClick={runAnalysis}
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Run DSCR Analysis
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result ? (
            <>
              {/* DSCR Hero */}
              <div className="card reveal d0">
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Debt Service Coverage Ratio</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <CounterNumber
                    value={result.dscr}
                    formatter={v => v.toFixed(2)}
                    style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: result.dscrColor, lineHeight: 1 }}
                  />
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>x</span>
                </div>
                <span style={{ display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700, background: result.dscr >= 1.25 ? 'var(--green-dim)' : 'rgba(239,68,68,0.12)', color: result.dscrColor }}>
                  {result.dscrLabel}
                </span>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  SBA minimum: 1.25x · Recommended: ≥1.35x
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 6, overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min(100, (result.dscr / 2) * 100)}%`, height: '100%', background: result.dscrColor, transition: 'width 0.6s ease' }} />
                </div>
              </div>

              {/* SBA Health Score */}
              <div className="card reveal d1">
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>SBA Creditworthiness Score</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <CounterNumber
                    value={result.sbaHealthScore}
                    style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: result.sbaHealthScore >= 70 ? 'var(--green)' : result.sbaHealthScore >= 45 ? 'var(--gold)' : 'var(--red)', lineHeight: 1 }}
                  />
                  <span style={{ color: 'var(--text-tertiary)' }}>/100</span>
                </div>
              </div>

              {/* Key SBA Ratios */}
              <div className="card reveal d2">
                <div className="stripe-row-title" style={{ marginBottom: '0.75rem' }}>Key SBA Ratios</div>
                {[
                  { label: 'Global Cash Flow', value: formatCurrency(result.globalCashFlow), note: 'Available for debt service' },
                  { label: 'Adjusted EBITDA', value: formatCurrency(result.adjustedEbitda), note: '' },
                  { label: 'SDE (Seller Discretionary)', value: formatCurrency(result.sde), note: 'Owner-inclusive cash flow' },
                  { label: 'Leverage Ratio', value: `${result.leverageRatio.toFixed(1)}x`, note: 'Debt / EBITDA (SBA max ~4x)' },
                  { label: 'Net Margin', value: `${result.netMargin.toFixed(1)}%`, note: '' },
                  { label: 'Debt / Equity', value: `${result.debtToEquity.toFixed(1)}x`, note: '' },
                ].map(row => (
                  <div className="data-row" key={row.label}>
                    <div>
                      <span className="data-row-label">{row.label}</span>
                      {row.note && <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{row.note}</div>}
                    </div>
                    <span className="data-row-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <p style={{ fontSize: '0.875rem' }}>Enter debt service inputs and click Run Analysis</p>
              </div>
            </div>
          )}

          {/* Valuation Range */}
          <div className="card reveal d3">
            <div className="stripe-row-title" style={{ marginBottom: '0.75rem' }}>Collateral / Business Valuation</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
                {formatCompact(valuation.low)} – {formatCompact(valuation.high)}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {valuation.label} · {valuation.method}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', padding: '0.5rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: 4 }}>
              For loan officer reference only. Independent appraisal required for SBA loan files.
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Analytical Support Only:</strong> All DSCR calculations and ratio analyses generated by this tool require loan officer review and verification before inclusion in the credit file. This tool does not constitute a credit opinion or lending recommendation.
      </div>
    </div>
    </div>
  );
}
