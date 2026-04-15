'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/types';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
} as const;

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

function Toggle({ label, desc, defaultChecked = false }: { label: string; desc?: string; defaultChecked?: boolean }) {
  const [isOn, setIsOn] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>{desc}</div>}
      </div>
      <button
        onClick={() => setIsOn(!isOn)}
        aria-label={label}
        style={{
          position: 'relative',
          width: 46,
          height: 24,
          borderRadius: 9999,
          border: `1px solid ${isOn ? 'var(--green)' : 'var(--border)'}`,
          background: isOn ? 'rgba(0,229,153,0.15)' : 'var(--bg-base)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        <motion.div
          animate={{ x: isOn ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isOn ? 'var(--green)' : 'var(--text-tertiary)',
          }}
        />
      </button>
    </div>
  );
}

const SETTINGS_TABS = [
  { icon: User, label: 'Profile' },
  { icon: Bell, label: 'Notifications' },
  { icon: Lock, label: 'Security' },
  { icon: Globe, label: 'Preferences' },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<Partial<Business>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
    setTimeout(() => setSaved(false), 2500);
  }

  function set(key: keyof Business, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  if (!business) {
    return (
      <div className="page-content">
        <div className="skeleton" style={{ height: 300, borderRadius: '1rem' }} />
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
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Settings</h1>
        <p className="section-subtitle">Manage your business profile and preferences</p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left side nav */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.875rem', paddingLeft: '0.5rem' }}>
            Account
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {SETTINGS_TABS.map((tab, i) => {
              const Icon = tab.icon;
              const active = activeTab === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    fontSize: '0.875rem', fontWeight: active ? 500 : 400, cursor: 'pointer',
                    border: active ? '1px solid var(--border)' : '1px solid transparent',
                    background: active ? 'var(--bg-elevated)' : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textAlign: 'left', width: '100%',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <Icon size={16} style={{ color: active ? 'var(--green)' : 'inherit' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right content panels */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={save}>
            {/* Business info panel */}
            <div className="card" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(0,229,153,0.02)', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Business Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

            {/* CIM Narrative */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>CIM Narrative Fields</h2>
              {[
                { key: 'business_description' as keyof Business, label: 'Business Description', placeholder: 'What does your business do?' },
                { key: 'growth_story' as keyof Business, label: 'Growth Story', placeholder: 'How has the business grown?' },
                { key: 'competitive_moat' as keyof Business, label: 'Competitive Moat', placeholder: 'What makes you defensible?' },
                { key: 'reason_for_sale' as keyof Business, label: 'Reason for Sale', placeholder: 'Why are you selling?' },
              ].map(f => (
                <div key={f.key as string} style={{ marginBottom: '1rem' }}>
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

            {/* Exit Readiness */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Exit Readiness Factors</h2>
              {READINESS_LABELS.map(r => (
                <div key={r.key as string} className="data-row">
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{r.label}</span>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {READINESS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set(r.key, opt.value)}
                        style={{
                          padding: '0.3rem 0.75rem', borderRadius: 9999,
                          border: '1px solid',
                          borderColor: (form[r.key] as number) === opt.value ? 'var(--green)' : 'var(--border)',
                          background: (form[r.key] as number) === opt.value ? 'var(--green-dim)' : 'transparent',
                          color: (form[r.key] as number) === opt.value ? 'var(--green)' : 'var(--text-tertiary)',
                          fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Notifications</h2>
              <Toggle label="Cap Table Updates" desc="Get notified when cap table changes are made." defaultChecked={true} />
              <Toggle label="Valuation Alerts" desc="Receive updates on pricing or funding milestones." defaultChecked={true} />
              <Toggle label="Document Uploads" desc="Alert me when new legal documents are processed." defaultChecked={false} />
            </div>

            {/* API Key */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Anthropic API Key</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Optional — provide your own key for AI features. Stored encrypted.
              </p>
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
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" type="submit" disabled={saving} style={{ minWidth: 140, justifyContent: 'center' }}>
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
