'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/types';
import { User, Bell, Lock, Globe, ShieldCheck } from 'lucide-react';

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
          position: 'relative', width: 46, height: 24, borderRadius: 9999,
          border: `1px solid ${isOn ? 'var(--green)' : 'var(--border)'}`,
          background: isOn ? 'rgba(0,229,153,0.15)' : 'var(--bg-base)',
          cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 3,
            left: isOn ? 'calc(100% - 18px)' : 2,
            width: 16, height: 16, borderRadius: '50%',
            background: isOn ? 'var(--green)' : 'var(--text-tertiary)',
            transition: 'left 0.2s',
          }}
        />
      </button>
    </div>
  );
}

const SETTINGS_TABS = [
  { icon: User,        label: 'Institution Profile' },
  { icon: ShieldCheck, label: 'Compliance Status' },
  { icon: Bell,        label: 'Notifications' },
  { icon: Lock,        label: 'Security & API' },
  { icon: Globe,       label: 'Preferences' },
];

const COMPLIANCE_ITEMS = [
  { label: 'SOC 2 Type I',             timeline: 'Month 3',  cost: '$25,000',  desc: 'Required for pilot conversations with banks' },
  { label: 'Penetration Test',         timeline: 'Month 3',  cost: '$20,000',  desc: 'Required for vendor risk questionnaires' },
  { label: 'SOC 2 Type II',            timeline: 'Month 9',  cost: '$50,000',  desc: 'Required for full contract execution' },
  { label: 'Legal Output Disclaimers', timeline: 'Month 1',  cost: '$5,000',   desc: 'Loan fraud chain protection' },
  { label: 'Privacy Policy + DPA',     timeline: 'Month 1',  cost: '$5,000',   desc: 'GDPR/CCPA baseline, required by larger banks' },
  { label: 'Cyber Liability Insurance',timeline: 'Month 2',  cost: '$8,000/yr',desc: 'Required by most bank vendor contracts' },
];

const LOS_PLATFORMS = ['Baker Hill', 'nCino', 'Finastra', 'Sagent', 'Other', 'None / Manual'];

export default function SettingsPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<Partial<Business>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState<Record<string, string>>({});

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
    <div className="page-content" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Institution Settings</h1>
        <p className="section-subtitle">Configure your SBA PLP institution profile, compliance status, and platform preferences</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left tab nav */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.875rem', paddingLeft: '0.5rem' }}>
            Settings
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
                    textAlign: 'left', width: '100%', transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <Icon size={16} style={{ color: active ? 'var(--green)' : 'inherit' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={save}>

            {/* Tab 0: Institution Profile */}
            {activeTab === 0 && (
              <>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Institution Profile</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Your SBA Preferred Lender Program profile. Used to personalize AI analysis outputs and credit memo templates.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="label">Institution Name</label>
                      <input className="input" value={(form.business_name as string) || ''} onChange={e => set('business_name', e.target.value)} placeholder="First National Bank" />
                    </div>
                    <div>
                      <label className="label">SBA PLP Designation #</label>
                      <input className="input" value={(form.industry as string) || ''} onChange={e => set('industry', e.target.value)} placeholder="SBA-XXXXX" />
                    </div>
                    <div>
                      <label className="label">Annual SBA 7(a) Loan Volume</label>
                      <input className="input" type="number" value={(form.annual_revenue as number) ?? 0} onChange={e => set('annual_revenue', parseFloat(e.target.value) || 0)} placeholder="200" />
                    </div>
                    <div>
                      <label className="label">Loan Officers on Team</label>
                      <input className="input" type="number" value={(form.employees as number) ?? 0} onChange={e => set('employees', parseInt(e.target.value) || 0)} placeholder="5" />
                    </div>
                    <div>
                      <label className="label">Primary LOS Platform</label>
                      <select
                        className="input"
                        value={(form.owner_role as string) || ''}
                        onChange={e => set('owner_role', e.target.value)}
                        style={{ appearance: 'none' }}
                      >
                        <option value="">Select LOS…</option>
                        {LOS_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Average Loan Size ($)</label>
                      <input className="input" type="number" value={(form.net_income as number) ?? 0} onChange={e => set('net_income', parseFloat(e.target.value) || 0)} placeholder="479000" />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Credit Memo Template</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Custom context inserted into AI-generated credit memos for your institution.
                  </p>
                  {[
                    { key: 'business_description' as keyof Business, label: 'Institution Underwriting Standards', placeholder: 'Describe your SBA underwriting criteria and risk appetite…' },
                    { key: 'growth_story' as keyof Business, label: 'Preferred Industries / Loan Types', placeholder: 'e.g. HVAC, Manufacturing, Professional Services — 7(a) up to $5M…' },
                    { key: 'competitive_moat' as keyof Business, label: 'Standard Collateral Requirements', placeholder: 'Describe your typical collateral requirements for SBA loans…' },
                  ].map(f => (
                    <div key={f.key as string} style={{ marginBottom: '1rem' }}>
                      <label className="label">{f.label}</label>
                      <textarea className="input" rows={2} value={(form[f.key] as string) || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={{ resize: 'vertical' }} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tab 1: Compliance Status */}
            {activeTab === 1 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Compliance Roadmap</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Required before closing contracts with SBA PLPs. Budget: ~$115,000 in Year 1. Start SOC 2 before signing any pilots.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {COMPLIANCE_ITEMS.map(item => {
                    const status = complianceStatus[item.label] || 'not-started';
                    return (
                      <div key={item.label} style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '0.75rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '0.1rem 0.5rem', borderRadius: 9999 }}>{item.cost}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc} · Target: {item.timeline}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          {['not-started', 'in-progress', 'complete'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setComplianceStatus(prev => ({ ...prev, [item.label]: s }))}
                              style={{
                                padding: '0.25rem 0.625rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                                border: '1px solid',
                                borderColor: status === s ? (s === 'complete' ? 'var(--green)' : s === 'in-progress' ? 'var(--gold)' : 'var(--border)') : 'var(--border)',
                                background: status === s ? (s === 'complete' ? 'var(--green-dim)' : s === 'in-progress' ? 'rgba(234,179,8,0.1)' : 'var(--bg-surface)') : 'transparent',
                                color: status === s ? (s === 'complete' ? 'var(--green)' : s === 'in-progress' ? 'var(--gold)' : 'var(--text-secondary)') : 'var(--text-tertiary)',
                                transition: 'all 0.15s',
                              }}
                            >
                              {s === 'not-started' ? 'Not Started' : s === 'in-progress' ? 'In Progress' : 'Complete'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(0,229,153,0.05)', border: '1px solid rgba(0,229,153,0.15)', borderRadius: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--green)' }}>Compliance budget (Year 1): ~$115,000.</strong> This is not optional — budget it before sales headcount. SOC 2 Type I is the minimum bar for any discovery call with a bank.
                </div>
              </div>
            )}

            {/* Tab 2: Notifications */}
            {activeTab === 2 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Notifications</h2>
                <Toggle label="New Application Alerts" desc="Notify when a new SBA borrower application is ready for analysis." defaultChecked={true} />
                <Toggle label="DSCR Threshold Warnings" desc="Alert when a borrower's DSCR falls below 1.25x SBA minimum." defaultChecked={true} />
                <Toggle label="Credit Memo Ready" desc="Notify when an AI-generated credit memo is ready for loan officer review." defaultChecked={true} />
                <Toggle label="Due Diligence Checklist Updates" desc="Alert when DD items are completed or flagged." defaultChecked={false} />
                <Toggle label="Compliance Deadline Reminders" desc="Remind team of upcoming SOC 2 and compliance milestones." defaultChecked={true} />
              </div>
            )}

            {/* Tab 3: Security & API */}
            {activeTab === 3 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Anthropic API Key</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Powers AI credit memo generation, DSCR narratives, and the AI Underwriter Advisor. Stored encrypted. ~$0.25–$0.75 per full SBA analysis.
                </p>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <input
                    className="input"
                    type={showKey ? 'text' : 'password'}
                    value={(form.anthropic_api_key as string) || ''}
                    onChange={e => set('anthropic_api_key', e.target.value)}
                    placeholder="sk-ant-..."
                  />
                  <button type="button" onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.75rem' }}>
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '0.75rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>AI Cost Estimate</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Cost / Full Analysis', value: '$0.25–$0.75' },
                      { label: '200 Loans / Year', value: '~$100–$150' },
                      { label: '100 Customers × 200 Loans', value: '~$10,000/yr' },
                      { label: 'Gross Margin Impact', value: '<0.5%' },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Preferences */}
            {activeTab === 4 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Platform Preferences</h2>
                <Toggle label="Auto-save Credit Memos" desc="Automatically save generated credit memos to borrower records." defaultChecked={true} />
                <Toggle label="Show Regulatory Disclaimers" desc='Always display "For loan officer review only" on AI outputs.' defaultChecked={true} />
                <Toggle label="DSCR Warning at 1.25×" desc="Flag DSCR below SBA minimum of 1.25x in all analysis views." defaultChecked={true} />
                <Toggle label="Include Global Cash Flow" desc="Include global cash flow (all obligations) in DSCR analysis by default." defaultChecked={true} />
                <Toggle label="Expanded Red Flag Detection" desc="Enable extended red flag analysis including industry-specific risks." defaultChecked={false} />
              </div>
            )}

            {activeTab !== 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" type="submit" disabled={saving} style={{ minWidth: 140, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
