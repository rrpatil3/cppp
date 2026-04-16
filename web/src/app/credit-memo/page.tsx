'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/calculator';
import type { Business, BalanceSheetItem } from '@/lib/types';

interface MemoForm {
  loanAmount: string;
  loanPurpose: string;
  collateralDescription: string;
  borrowerBackground: string;
  dscrValue: string;
  additionalContext: string;
}

export default function CreditMemoPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [items, setItems] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [memo, setMemo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState<MemoForm>({
    loanAmount: '',
    loanPurpose: '',
    collateralDescription: '',
    borrowerBackground: '',
    dscrValue: '',
    additionalContext: '',
  });

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const [bizResult, bsResult] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('balance_sheet_items').select('*').eq('user_id', user.id),
      ]);
      if (!bizResult.data) { router.push('/onboarding'); return; }
      setBusiness(bizResult.data as Business);
      setItems((bsResult.data || []) as BalanceSheetItem[]);
      setLoading(false);
    }
    load();
  }, [router]);

  async function generateMemo() {
    if (!business) return;
    setGenerating(true);
    setError('');
    setMemo(null);

    try {
      const assets = items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
      const liabilities = items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
      const equity = assets - liabilities;
      const netMargin = business.annual_revenue > 0 ? ((business.net_income / business.annual_revenue) * 100).toFixed(1) : '0.0';

      const systemPrompt = `You are a senior SBA loan officer writing an internal credit memo for a Preferred Lender Program (PLP) institution. Write a structured, professional credit memo suitable for an SBA 7(a) loan file. Format in markdown with clear sections. Be factual, analytical, and note both strengths and risks. Always include a disclaimer that this is analytical support requiring loan officer review.`;

      const userMessage = `Write a credit memo for the following SBA loan application:

## Borrower Profile
- Business Name: ${business.business_name}
- Industry: ${business.industry || 'Not specified'}
- Employees: ${business.employees}
- Annual Revenue: ${formatCurrency(business.annual_revenue)}
- Net Income: ${formatCurrency(business.net_income)}
- EBIT: ${formatCurrency(business.ebit)}
- Net Margin: ${netMargin}%
- Total Assets: ${formatCurrency(assets)}
- Total Liabilities: ${formatCurrency(liabilities)}
- Net Equity: ${formatCurrency(equity)}

## Loan Details
- Requested Amount: ${form.loanAmount ? formatCurrency(parseFloat(form.loanAmount)) : 'Not specified'}
- Loan Purpose: ${form.loanPurpose || 'Not specified'}
- Collateral: ${form.collateralDescription || 'Not specified'}
- DSCR (if calculated): ${form.dscrValue ? `${parseFloat(form.dscrValue).toFixed(2)}x` : 'Not provided'}

## Borrower Background
${form.borrowerBackground || 'Not provided'}

## Additional Context
${form.additionalContext || 'None'}

Write a complete SBA credit memo with sections: (1) Executive Summary, (2) Borrower Background, (3) Financial Analysis, (4) DSCR & Debt Service Capacity, (5) Collateral Analysis, (6) Credit Strengths, (7) Credit Risks & Mitigants, (8) Recommendation Summary.

Include a prominent disclaimer at the top and bottom that this is analytical support only, requires loan officer review, and does not constitute a credit opinion.`;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'credit-memo',
          message: userMessage,
          business,
          balanceSheetItems: items,
        }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMemo(json.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate credit memo');
    } finally {
      setGenerating(false);
    }
  }

  function copyMemo() {
    if (memo) navigator.clipboard.writeText(memo);
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[80, 200, 160].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: '1rem' }} />)}
      </div>
    );
  }

  if (!business) return null;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Credit Memo Generator
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          {business.business_name} · AI-drafted SBA credit memo · Requires loan officer review
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1rem' }}>
        {/* Input panel */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="stripe-row-title" style={{ marginBottom: '1rem' }}>Loan Details</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>{business.business_name}</strong> · {business.industry || 'Industry N/A'}
              <br />{formatCurrency(business.annual_revenue)} revenue · {formatCurrency(business.net_income)} net income
            </div>

            {[
              { key: 'loanAmount' as const, label: 'Loan Amount Requested ($)', type: 'number', placeholder: '500000' },
              { key: 'loanPurpose' as const, label: 'Loan Purpose', type: 'text', placeholder: 'Working capital, equipment acquisition...' },
              { key: 'collateralDescription' as const, label: 'Collateral Description', type: 'text', placeholder: 'Real estate, equipment, SBA guarantee...' },
              { key: 'dscrValue' as const, label: 'DSCR (if pre-calculated)', type: 'number', placeholder: '1.35' },
            ].map(f => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            ))}

            {[
              { key: 'borrowerBackground' as const, label: 'Borrower Background', placeholder: 'Years in business, owner experience, management team...' },
              { key: 'additionalContext' as const, label: 'Additional Context', placeholder: 'Any other relevant information for the credit file...' },
            ].map(f => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
                <textarea
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                  rows={3}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            ))}

            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <button
              onClick={generateMemo}
              disabled={generating}
              className="btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600, opacity: generating ? 0.6 : 1 }}
            >
              {generating ? 'Generating Credit Memo...' : 'Generate Credit Memo'}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div>
          {memo ? (
            <div className="card reveal d0">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="stripe-row-title">Generated Credit Memo</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={copyMemo}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-elevated)',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  maxHeight: '70vh',
                  overflowY: 'auto',
                }}
              >
                {memo}
              </div>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Important:</strong> This AI-generated credit memo is analytical support only. It must be reviewed, verified, and approved by the loan officer before inclusion in any SBA credit file. It does not constitute a credit decision or credit opinion.
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>📄</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>AI Credit Memo Generator</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', maxWidth: 300 }}>
                  Fill in the loan details on the left, then click &ldquo;Generate Credit Memo&rdquo; to create an SBA-formatted credit memo draft.
                </p>
              </div>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: '0.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: 360, textAlign: 'center' }}>
                Generates: Executive Summary · Financial Analysis · DSCR · Credit Strengths & Risks · Recommendation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
