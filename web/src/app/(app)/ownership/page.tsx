'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business, CapTableEntry } from '@/lib/types';
import { formatCurrency, formatCompact } from '@/lib/calculator';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Plus, Trash2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
} as const;

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
  const [searchTerm, setSearchTerm] = useState('');

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
  const impliedPricePerShare = entries.length > 0 ? entries.reduce((s, e) => s + e.purchase_price_per_share * e.shares_held, 0) / totalShares : 0;
  const companyValuation = totalShares * impliedPricePerShare;

  const filtered = entries.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

  if (loading) {
    return (
      <div className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 6 }} />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-content"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ paddingBottom: '3rem' }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 className="section-title">Cap Table</h1>
          <p className="section-subtitle">Ownership structure and dilution modeling</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={15} strokeWidth={2.5} /> Add Shareholder
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}
      >
        {[
          { label: 'Total Shares', value: totalShares.toLocaleString() },
          { label: 'Implied Valuation', value: companyValuation > 0 ? formatCompact(companyValuation) : 'N/A' },
          { label: 'Shareholders', value: entries.length.toString() },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Add shareholder form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="card"
            style={{ marginBottom: '1.5rem' }}
          >
            <div style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Add Shareholder</div>
            <form onSubmit={addEntry}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button className="btn-primary" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Shareholder'}</button>
                <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shareholders table */}
      <motion.div
        variants={itemVariants}
        className="card"
        style={{ marginBottom: '1.5rem', padding: 0, overflow: 'hidden' }}
      >
        {/* Table toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search shareholders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 9999,
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
          </div>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 9999, color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <Filter size={14} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Shareholder', 'Class', 'Shares', 'Ownership', 'Value', ''].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((entry, idx) => {
                  const pct = totalShares > 0 ? (entry.shares_held / totalShares * 100).toFixed(1) : '0.0';
                  const impliedValue = entry.shares_held * impliedPricePerShare;
                  const initials = entry.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <motion.tr
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                      transition={{ duration: 0.18, delay: idx * 0.02 }}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '1.125rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'var(--bg-overlay)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0,
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{entry.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Stakeholder</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '0.2rem 0.75rem', borderRadius: 9999,
                          fontSize: '0.75rem', fontWeight: 500,
                          background: entry.share_class === 'Common' ? 'var(--green-dim)' : 'var(--bg-overlay)',
                          color: entry.share_class === 'Common' ? 'var(--green)' : 'var(--text-secondary)',
                          border: `1px solid ${entry.share_class === 'Common' ? 'var(--green-border)' : 'var(--border)'}`,
                        }}>
                          {entry.share_class}
                        </span>
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {entry.shares_held.toLocaleString()}
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                        {pct}%
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {impliedValue > 0 ? formatCompact(impliedValue) : '—'}
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          style={{
                            padding: '0.375rem', borderRadius: '50%', background: 'none', border: 'none',
                            color: 'var(--text-tertiary)', cursor: 'pointer', opacity: 0,
                            display: 'flex', alignItems: 'center',
                          }}
                          className="delete-btn"
                          aria-label={`Delete ${entry.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    <Search size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3, display: 'block' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>No shareholders found</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add one with the button above</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>
            Showing {filtered.length} shareholders
          </p>
        </div>
      </motion.div>

      {/* Dilution modeler */}
      {totalShares > 0 && (
        <motion.div variants={itemVariants} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Dilution Modeler</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, maxWidth: 300 }}>
              <label className="label">New Shares to Issue</label>
              <input className="input" type="number" value={dilutionShares} onChange={e => setDilutionShares(e.target.value)} placeholder="500000" min="0" />
            </div>
          </div>
          {newShareCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {entries.map(e => {
                const pre = totalShares > 0 ? (e.shares_held / totalShares * 100).toFixed(1) : '0.0';
                const post = dilutedTotal > 0 ? (e.shares_held / dilutedTotal * 100).toFixed(1) : '0.0';
                return (
                  <div key={e.id} className="data-row">
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.name}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{pre}%</span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>→</span>
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>{post}%</span>
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', letterSpacing: '0.03em' }}>
                New shares: {newShareCount.toLocaleString()} · Total diluted: {dilutedTotal.toLocaleString()}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Buy-side AI memo */}
      <motion.div variants={itemVariants} className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Buy-Side Analyst View</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>AI-generated internal deal memo from a PE analyst&apos;s perspective</div>
          </div>
          <button onClick={runBuyerView} disabled={aiLoading} className="btn-secondary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            {aiLoading ? 'Generating...' : 'Generate Memo'}
          </button>
        </div>
        {aiResult && (
          <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(aiResult) as string }} />
        )}
      </motion.div>
    </motion.div>
  );
}
