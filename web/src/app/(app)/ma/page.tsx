'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business, EbitdaAddBack, DueDiligenceCheck } from '@/lib/types';
import { computeAdjustedEbitda, formatCurrency, formatCompact } from '@/lib/calculator';
import { marked } from 'marked';

const DD_ITEMS = [
  'Financial Statements (3 years)', 'Revenue Quality & Recurring %', 'Customer Concentration Analysis',
  'Contracts & Key Agreements', 'IP & Technology Assets', 'HR & Org Structure',
  'Legal & Pending Litigation', 'Regulatory Compliance', 'Operational SOPs & Processes',
  'Facilities & Equipment', 'Environmental Considerations', 'Insurance Policies',
];

export default function MAPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [addBacks, setAddBacks] = useState<EbitdaAddBack[]>([]);
  const [ddChecks, setDdChecks] = useState<DueDiligenceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(1);
  const [results, setResults] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [addBackForm, setAddBackForm] = useState({ label: '', amount: '' });
  const [raiseAmount, setRaiseAmount] = useState('');
  const [cimFields, setCimFields] = useState({ description: '', growth: '', moat: '', reason: '', ownerRole: '' });
  const [debtChangeRevPct, setDebtChangeRevPct] = useState('0');
  const [debtChangeMarginPct, setDebtChangeMarginPct] = useState('0');

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: biz }, { data: ab }, { data: dd }] = await Promise.all([
      supabase.from('businesses').select('*').eq('user_id', user.id).single(),
      supabase.from('ebitda_add_backs').select('*').eq('user_id', user.id),
      supabase.from('due_diligence_checks').select('*').eq('user_id', user.id),
    ]);
    if (biz) setBusiness(biz as Business);
    setAddBacks((ab || []) as EbitdaAddBack[]);
    setDdChecks((dd || []) as DueDiligenceCheck[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function runAI(type: string, extra?: object) {
    if (!business) return;
    setAiLoading(l => ({ ...l, [type]: true }));
    setResults(r => ({ ...r, [type]: '' }));
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, business, addBacks, ddChecks, raiseAmount: parseFloat(raiseAmount) || undefined, cimFields, ...extra }),
    });
    const data = await res.json();
    setResults(r => ({ ...r, [type]: data.result || data.error || '' }));
    setAiLoading(l => ({ ...l, [type]: false }));
  }

  async function addAddBack(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('ebitda_add_backs').insert({ user_id: user.id, label: addBackForm.label, amount: parseFloat(addBackForm.amount) || 0 });
    setAddBackForm({ label: '', amount: '' });
    load();
  }

  async function deleteAddBack(id: string) {
    await supabase.from('ebitda_add_backs').delete().eq('id', id);
    load();
  }

  async function toggleDD(itemKey: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const existing = ddChecks.find(c => c.item_key === itemKey);
    if (existing) {
      await supabase.from('due_diligence_checks').update({ is_complete: !existing.is_complete }).eq('id', existing.id);
    } else {
      await supabase.from('due_diligence_checks').insert({ user_id: user.id, item_key: itemKey, is_complete: true });
    }
    load();
  }

  const adjustedEbitda = business ? computeAdjustedEbitda(business.ebit, addBacks) : 0;

  const SECTIONS = [
    { id: 1, label: 'Valuation', aiType: 'valuation' },
    { id: 2, label: 'EBITDA Add-Backs', aiType: null },
    { id: 3, label: 'Buyer Discovery', aiType: 'buyers' },
    { id: 4, label: 'CIM Summary', aiType: 'cim' },
    { id: 5, label: 'Capital Strategy', aiType: 'strategy' },
    { id: 6, label: 'Due Diligence', aiType: 'dd-report' },
    { id: 7, label: 'Debt Impact', aiType: null },
  ];

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!business) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Business not found.</div>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>M&A Suite</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Complete M&A toolkit powered by AI</p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid',
            borderColor: activeSection === s.id ? 'var(--green)' : 'var(--border)',
            background: activeSection === s.id ? 'var(--green-dim)' : 'transparent',
            color: activeSection === s.id ? 'var(--green)' : 'var(--text-secondary)',
            fontWeight: activeSection === s.id ? 600 : 400, fontSize: '0.8rem', cursor: 'pointer',
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section 1: Valuation */}
      {activeSection === 1 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Business Valuation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI-powered FMV estimate using revenue, EBITDA, and DCF methods</div>
            </div>
            <button onClick={() => runAI('valuation')} disabled={aiLoading['valuation']} className="btn-primary">
              {aiLoading['valuation'] ? 'Analyzing...' : 'Run Valuation'}
            </button>
          </div>
          {results['valuation'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(results['valuation']) as string }} />}
        </div>
      )}

      {/* Section 2: EBITDA Add-Backs */}
      {activeSection === 2 && (
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>EBITDA Add-Backs</div>
            <div className="data-row">
              <span className="data-row-label">Reported EBIT</span>
              <span className="data-row-value">{formatCurrency(business.ebit)}</span>
            </div>
            {addBacks.map(ab => (
              <div key={ab.id} className="data-row">
                <span style={{ fontSize: '0.875rem' }}>{ab.label}</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className="value-positive">+{formatCurrency(ab.amount)}</span>
                  <button onClick={() => deleteAddBack(ab.id)} className="btn-ghost" style={{ padding: '0.2rem', color: 'var(--red)', fontSize: '0.75rem' }}>✕</button>
                </div>
              </div>
            ))}
            <div className="data-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontWeight: 700 }}>Adjusted EBITDA</span>
              <span className="value-positive" style={{ fontSize: '1.1rem' }}>{formatCurrency(adjustedEbitda)}</span>
            </div>
          </div>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Add a Normalizing Item</div>
            <form onSubmit={addAddBack}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label className="label">Label</label>
                  <input className="input" value={addBackForm.label} onChange={e => setAddBackForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Owner's excess salary" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Amount ($)</label>
                  <input className="input" type="number" value={addBackForm.amount} onChange={e => setAddBackForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" required min="0" />
                </div>
                <button className="btn-primary" type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section 3: Buyers */}
      {activeSection === 3 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Buyer Discovery</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Identify strategic and financial acquirers for your business</div>
            </div>
            <button onClick={() => runAI('buyers')} disabled={aiLoading['buyers']} className="btn-primary">
              {aiLoading['buyers'] ? 'Identifying...' : 'Find Buyers'}
            </button>
          </div>
          {results['buyers'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(results['buyers']) as string }} />}
        </div>
      )}

      {/* Section 4: CIM */}
      {activeSection === 4 && (
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>CIM Narrative Inputs</div>
            {[
              { key: 'description', label: 'Business Description', ph: 'What does your business do?' },
              { key: 'growth', label: 'Growth Story', ph: 'Revenue growth and key milestones' },
              { key: 'moat', label: 'Competitive Moat', ph: 'What makes you defensible?' },
              { key: 'reason', label: 'Reason for Sale', ph: 'Why are you selling?' },
              { key: 'ownerRole', label: 'Owner Role', ph: 'Your role in day-to-day operations' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '0.75rem' }}>
                <label className="label">{f.label}</label>
                <textarea className="input" rows={2} value={cimFields[f.key as keyof typeof cimFields]} onChange={e => setCimFields(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.ph} style={{ resize: 'vertical' }} />
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>CIM Executive Summary</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => runAI('cim')} disabled={aiLoading['cim']} className="btn-primary">
                  {aiLoading['cim'] ? 'Generating...' : 'Generate CIM'}
                </button>
                {results['cim'] && <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Print PDF</button>}
              </div>
            </div>
            {results['cim'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(results['cim']) as string }} />}
          </div>
        </div>
      )}

      {/* Section 5: Capital Strategy */}
      {activeSection === 5 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Capital Strategy</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Best capital-raising options for your business</div>
            </div>
            <button onClick={() => runAI('strategy')} disabled={aiLoading['strategy']} className="btn-primary">
              {aiLoading['strategy'] ? 'Analyzing...' : 'Analyze Options'}
            </button>
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label className="label">Target Raise Amount ($) — optional</label>
            <input className="input" type="number" value={raiseAmount} onChange={e => setRaiseAmount(e.target.value)} placeholder="500000" min="0" style={{ maxWidth: 200 }} />
          </div>
          {results['strategy'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(results['strategy']) as string }} />}
        </div>
      )}

      {/* Section 6: Due Diligence */}
      {activeSection === 6 && (
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Due Diligence Checklist</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {ddChecks.filter(c => c.is_complete).length} / {DD_ITEMS.length} complete
              </span>
            </div>
            {DD_ITEMS.map(item => {
              const check = ddChecks.find(c => c.item_key === item);
              return (
                <div key={item} className="data-row" style={{ cursor: 'pointer' }} onClick={() => toggleDD(item)}>
                  <span style={{ fontSize: '0.875rem' }}>{item}</span>
                  <div style={{
                    width: 20, height: 20, borderRadius: 3, border: '2px solid',
                    borderColor: check?.is_complete ? 'var(--green)' : 'var(--border)',
                    background: check?.is_complete ? 'var(--green)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', fontSize: '0.7rem', fontWeight: 800,
                  }}>
                    {check?.is_complete ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>DD Readiness Report</div>
              <button onClick={() => runAI('dd-report')} disabled={aiLoading['dd-report']} className="btn-primary">
                {aiLoading['dd-report'] ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
            {results['dd-report'] && <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(results['dd-report']) as string }} />}
          </div>
        </div>
      )}

      {/* Section 7: Debt Impact Modeler */}
      {activeSection === 7 && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Debt Impact Modeler</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Model how changes in revenue and margin affect your valuation.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="label">Revenue Change (%)</label>
              <input className="input" type="number" value={debtChangeRevPct} onChange={e => setDebtChangeRevPct(e.target.value)} placeholder="10" />
            </div>
            <div>
              <label className="label">Margin Change (%)</label>
              <input className="input" type="number" value={debtChangeMarginPct} onChange={e => setDebtChangeMarginPct(e.target.value)} placeholder="2" />
            </div>
          </div>
          {(() => {
            const revChange = parseFloat(debtChangeRevPct) || 0;
            const marginChange = parseFloat(debtChangeMarginPct) || 0;
            const projRev = business.annual_revenue * (1 + revChange / 100);
            const currentMargin = business.annual_revenue > 0 ? business.net_income / business.annual_revenue : 0;
            const newMargin = currentMargin + marginChange / 100;
            const projIncome = projRev * newMargin;
            return (
              <div>
                <div className="data-row">
                  <span className="data-row-label">Projected Revenue</span>
                  <span className="data-row-value">{formatCurrency(projRev)}</span>
                </div>
                <div className="data-row">
                  <span className="data-row-label">Projected Net Income</span>
                  <span className="data-row-value">{formatCurrency(projIncome)}</span>
                </div>
                <div className="data-row">
                  <span className="data-row-label">Projected Margin</span>
                  <span className="data-row-value">{(newMargin * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
