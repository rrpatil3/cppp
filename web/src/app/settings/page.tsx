'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/types';

const READINESS_LABELS = [
  { key: 'readiness_clean_books' as keyof Business, label: 'Clean & Auditable Books' },
  { key: 'readiness_revenue_quality' as keyof Business, label: 'High Revenue Quality' },
  { key: 'readiness_owner_independent' as keyof Business, label: 'Owner Independent Operations' },
  { key: 'readiness_no_concentration' as keyof Business, label: 'No Revenue Concentration' },
  { key: 'readiness_growing' as keyof Business, label: 'Consistent Growth' },
];

const READINESS_OPTIONS = [
  { value: 0, label: 'Not Set' },
  { value: 2, label: 'Partial' },
  { value: 3, label: 'Ready' },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<Partial<Business>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (data) { setBusiness(data as Business); setForm(data as Business); }
    }
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    await supabase.from('businesses').update({ ...form, updated_at: new Date().toISOString() }).eq('id', business.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function set(key: keyof Business, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  if (!business) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Settings</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Update your business profile and financial data</p>
      </div>

      <form onSubmit={save}>
        {/* Basic info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Business Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Business Name</label>
              <input className="input" value={(form.business_name as string) || ''} onChange={e => set('business_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" value={(form.industry as string) || ''} onChange={e => set('industry', e.target.value)} placeholder="e.g. SaaS, HVAC" />
            </div>
            <div>
              <label className="label">Employees</label>
              <input className="input" type="number" value={(form.employees as number) ?? 0} onChange={e => set('employees', parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div>
              <label className="label">Annual Revenue ($)</label>
              <input className="input" type="number" value={(form.annual_revenue as number) ?? 0} onChange={e => set('annual_revenue', parseFloat(e.target.value) || 0)} min="0" />
            </div>
            <div>
              <label className="label">Net Income ($)</label>
              <input className="input" type="number" value={(form.net_income as number) ?? 0} onChange={e => set('net_income', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">EBIT ($)</label>
              <input className="input" type="number" value={(form.ebit as number) ?? 0} onChange={e => set('ebit', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Interest Expense ($)</label>
              <input className="input" type="number" value={(form.interest_expense as number) ?? 0} onChange={e => set('interest_expense', parseFloat(e.target.value) || 0)} min="0" />
            </div>
            <div>
              <label className="label">Owner Role</label>
              <input className="input" value={(form.owner_role as string) || ''} onChange={e => set('owner_role', e.target.value)} placeholder="e.g. Operator, Investor" />
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>CIM Narrative Fields</div>
          {[
            { key: 'business_description' as keyof Business, label: 'Business Description', placeholder: 'What does your business do?' },
            { key: 'growth_story' as keyof Business, label: 'Growth Story', placeholder: 'How has the business grown?' },
            { key: 'competitive_moat' as keyof Business, label: 'Competitive Moat', placeholder: 'What makes you defensible?' },
            { key: 'reason_for_sale' as keyof Business, label: 'Reason for Sale', placeholder: 'Why are you selling?' },
          ].map(f => (
            <div key={f.key as string} style={{ marginBottom: '0.75rem' }}>
              <label className="label">{f.label}</label>
              <textarea
                className="input"
                rows={2}
                value={(form[f.key] as string) || ''}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ resize: 'vertical' }}
              />
            </div>
          ))}
        </div>

        {/* Exit readiness */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Exit Readiness Factors</div>
          {READINESS_LABELS.map(r => (
            <div key={r.key as string} className="data-row">
              <span style={{ fontSize: '0.875rem' }}>{r.label}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {READINESS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set(r.key, opt.value)}
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      border: '1px solid',
                      borderColor: (form[r.key] as number) === opt.value ? 'var(--green)' : 'var(--border)',
                      background: (form[r.key] as number) === opt.value ? 'var(--green-dim)' : 'transparent',
                      color: (form[r.key] as number) === opt.value ? 'var(--green)' : 'var(--text-tertiary)',
                      fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Key */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Anthropic API Key</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Optional — provide your own key for AI features. Stored encrypted. Leave blank to use platform key.
          </div>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showKey ? 'text' : 'password'}
              value={(form.anthropic_api_key as string) || ''}
              onChange={e => set('anthropic_api_key', e.target.value)}
              placeholder="sk-ant-..."
            />
            <button
              type="button"
              onClick={() => setShowKey(s => !s)}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={saving} style={{ minWidth: 120 }}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
