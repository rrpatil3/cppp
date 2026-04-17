'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BalanceSheetItem } from '@/lib/types';
import { formatCurrency } from '@/lib/calculator';

export default function BalanceSheetPage() {
  const supabase = createClient();
  const [items, setItems] = useState<BalanceSheetItem[]>([]);
  const [tab, setTab] = useState<'ASSET' | 'LIABILITY'>('ASSET');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', value: '', interest_rate: '', type: 'ASSET' as 'ASSET' | 'LIABILITY' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('balance_sheet_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setItems((data || []) as BalanceSheetItem[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('balance_sheet_items').insert({
      user_id: user.id,
      name: form.name,
      category: form.category,
      value: parseFloat(form.value) || 0,
      type: form.type,
      interest_rate: parseFloat(form.interest_rate) || 0,
    });
    setForm({ name: '', category: '', value: '', interest_rate: '', type: tab });
    setShowForm(false);
    setAdding(false);
    load();
  }

  async function deleteItem(id: string) {
    await supabase.from('balance_sheet_items').delete().eq('id', id);
    load();
  }

  const assets = items.filter(i => i.type === 'ASSET');
  const liabilities = items.filter(i => i.type === 'LIABILITY');
  const totalAssets = assets.reduce((s, i) => s + i.value, 0);
  const totalLiabilities = liabilities.reduce((s, i) => s + i.value, 0);
  const equity = totalAssets - totalLiabilities;

  const tabItems = tab === 'ASSET' ? assets : liabilities;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Balance Sheet</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Track your assets and liabilities</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Assets', value: formatCurrency(totalAssets), color: 'var(--green)' },
          { label: 'Total Liabilities', value: formatCurrency(totalLiabilities), color: 'var(--red)' },
          { label: 'Net Equity', value: formatCurrency(equity), color: equity >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: '0.5rem', width: 'fit-content' }}>
        {(['ASSET', 'LIABILITY'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setForm(f => ({ ...f, type: t })); }} style={{
            padding: '0.375rem 1rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer',
            background: tab === t ? 'var(--bg-surface)' : 'transparent',
            color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontWeight: tab === t ? 600 : 400, fontSize: '0.875rem',
          }}>
            {t === 'ASSET' ? 'Assets' : 'Liabilities'}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        {loading ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Loading...</div>
        ) : tabItems.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '1rem 0', textAlign: 'center' }}>No {tab.toLowerCase()}s added yet.</div>
        ) : (
          tabItems.map(item => (
            <div key={item.id} className="data-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.category}{item.interest_rate > 0 ? ` · ${item.interest_rate}% interest` : ''}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="data-row-value">{formatCurrency(item.value)}</span>
                <button onClick={() => deleteItem(item.id)} className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--red)', fontSize: '0.75rem' }}>✕</button>
              </div>
            </div>
          ))
        )}
        <div className="data-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Total</span>
          <span className="data-row-value" style={{ color: tab === 'ASSET' ? 'var(--green)' : 'var(--red)' }}>
            {formatCurrency(tab === 'ASSET' ? totalAssets : totalLiabilities)}
          </span>
        </div>
      </div>

      {/* Add item */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add {tab === 'ASSET' ? 'Asset' : 'Liability'}
        </button>
      ) : (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Add {tab === 'ASSET' ? 'Asset' : 'Liability'}</div>
          <form onSubmit={addItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label">Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Checking Account" required />
              </div>
              <div>
                <label className="label">Category *</label>
                <input className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Cash, Equipment, Loan" required />
              </div>
              <div>
                <label className="label">Value ($) *</label>
                <input className="input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="0" required min="0" />
              </div>
              {tab === 'LIABILITY' && (
                <div>
                  <label className="label">Interest Rate (%)</label>
                  <input className="input" type="number" value={form.interest_rate} onChange={e => setForm(f => ({ ...f, interest_rate: e.target.value }))} placeholder="0" step="0.01" min="0" />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem' }}>
              <button className="btn-primary" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Item'}</button>
              <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
