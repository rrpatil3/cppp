'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business, CapTableEntry } from '@/lib/types';
import { formatCurrency, formatCompact } from '@/lib/calculator';
import { marked } from 'marked';

export default function OwnershipPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [entries, setEntries] = useState<CapTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', share_class: 'Common', shares_held: '', purchase_price_per_share: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dilutionShares, setDilutionShares] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: biz }, { data: cap }] = await Promise.all([
      supabase.from('businesses').select('*').eq('user_id', user.id).single(),
      supabase.from('cap_table_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    ]);
    if (biz) setBusiness(biz as Business);
    setEntries((cap || []) as CapTableEntry[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const totalShares = entries.reduce((s, e) => s + e.shares_held, 0);
  const newShareCount = parseInt(dilutionShares) || 0;
  const dilutedTotal = totalShares + newShareCount;

  async function addEntry(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('cap_table_entries').insert({
      user_id: user.id,
      name: form.name,
      share_class: form.share_class,
      shares_held: parseInt(form.shares_held) || 0,
      purchase_price_per_share: parseFloat(form.purchase_price_per_share) || 0,
    });
    setForm({ name: '', share_class: 'Common', shares_held: '', purchase_price_per_share: '' });
    setShowForm(false);
    setAdding(false);
    load();
  }

  async function deleteEntry(id: string) {
    await supabase.from('cap_table_entries').delete().eq('id', id);
    load();
  }

  async function runBuyerView() {
    if (!business) return;
    setAiLoading(true);
    setAiResult('');
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'buyer-view', business }),
    });
    const data = await res.json();
    setAiResult(data.result || data.error || '');
    setAiLoading(false);
  }

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

  const impliedPricePerShare = entries.length > 0 ? entries.reduce((s, e) => s + e.purchase_price_per_share * e.shares_held, 0) / totalShares : 0;
  const companyValuation = totalShares * impliedPricePerShare;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cap Table</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Ownership structure and dilution modeling</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Shares', value: totalShares.toLocaleString() },
          { label: 'Implied Valuation', value: companyValuation > 0 ? formatCompact(companyValuation) : 'N/A' },
          { label: 'Shareholders', value: entries.length.toString() },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Cap table */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Shareholders</div>
        {entries.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '1rem 0', textAlign: 'center' }}>No shareholders added yet.</div>
        ) : (
          entries.map(entry => {
            const pct = totalShares > 0 ? (entry.shares_held / totalShares * 100).toFixed(1) : '0.0';
            const impliedValue = entry.shares_held * impliedPricePerShare;
            return (
              <div key={entry.id} className="data-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{entry.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{entry.share_class} · {entry.shares_held.toLocaleString()} shares</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="value-neutral">{pct}%</div>
                    {impliedValue > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{formatCompact(impliedValue)}</div>}
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--red)' }}>✕</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add entry */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary" style={{ marginBottom: '1rem' }}>
          + Add Shareholder
        </button>
      ) : (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Add Shareholder</div>
          <form onSubmit={addEntry}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label">Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" required />
              </div>
              <div>
                <label className="label">Share Class *</label>
                <select className="input" value={form.share_class} onChange={e => setForm(f => ({ ...f, share_class: e.target.value }))}>
                  {['Common', 'Preferred A', 'Preferred B', 'Options', 'Warrants', 'SAFE'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Shares Held *</label>
                <input className="input" type="number" value={form.shares_held} onChange={e => setForm(f => ({ ...f, shares_held: e.target.value }))} placeholder="1000000" required min="1" />
              </div>
              <div>
                <label className="label">Price per Share ($)</label>
                <input className="input" type="number" value={form.purchase_price_per_share} onChange={e => setForm(f => ({ ...f, purchase_price_per_share: e.target.value }))} placeholder="1.00" step="0.0001" min="0" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem' }}>
              <button className="btn-primary" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Shareholder'}</button>
              <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Dilution modeler */}
      {totalShares > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Dilution Modeler</div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '0.875rem' }}>
            <div style={{ flex: 1 }}>
              <label className="label">New Shares to Issue</label>
              <input className="input" type="number" value={dilutionShares} onChange={e => setDilutionShares(e.target.value)} placeholder="500000" min="0" />
            </div>
          </div>
          {newShareCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {entries.map(e => {
                const pre = totalShares > 0 ? (e.shares_held / totalShares * 100).toFixed(1) : '0.0';
                const post = dilutedTotal > 0 ? (e.shares_held / dilutedTotal * 100).toFixed(1) : '0.0';
                return (
                  <div key={e.id} className="data-row">
                    <span style={{ fontSize: '0.875rem' }}>{e.name}</span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{pre}%</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>→</span>
                      <span style={{ color: 'var(--green)' }}>{post}%</span>
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                New shares: {newShareCount.toLocaleString()} · Total diluted: {dilutedTotal.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buyer view AI */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Buy-Side Analyst View</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI-generated internal deal memo from a PE analyst's perspective</div>
          </div>
          <button onClick={runBuyerView} disabled={aiLoading} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
            {aiLoading ? 'Generating...' : 'Generate Memo'}
          </button>
        </div>
        {aiResult && (
          <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(aiResult) as string }} />
        )}
      </div>
    </div>
  );
}
