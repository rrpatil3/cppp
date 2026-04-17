'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  calculateHealthScore, computeValuationRange, detectRedFlags,
  formatCompact, formatCurrency, getHealthLabel,
} from '@/lib/calculator';
import type { Business, BalanceSheetItem } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp, FileText, CheckSquare, MessageSquare,
  BarChart2, PieChart, ArrowRight, AlertTriangle,
  Zap, Shield, Clock, ChevronRight, Activity,
} from 'lucide-react';
import { LampContainer } from '@/components/ui/lamp';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { Spotlight } from '@/components/ui/spotlight';

interface BorrowerCard {
  business: Business;
  healthScore: number;
  healthLabel: string;
  estimatedValuation: number;
  netMargin: number;
  items: BalanceSheetItem[];
}

interface PageData {
  borrower: BorrowerCard | null;
  recentAdvice: string | null;
}

const workflowItems = [
  { label: 'Run DSCR & SBA Ratios', sub: 'Global cash flow · Leverage · Collateral', href: '/underwriting', step: '1', icon: TrendingUp, color: '#00E599' },
  { label: 'Generate Credit Memo', sub: 'AI-drafted SBA 7(a) credit memo', href: '/credit-memo', step: '2', icon: FileText, color: '#3B82F6' },
  { label: 'Due Diligence Checklist', sub: '12-category DD assessment · Valuation', href: '/tools', step: '3', icon: CheckSquare, color: '#8B5CF6' },
  { label: 'Ask AI Underwriter', sub: 'Structured Q&A on borrower financials', href: '/advisor', step: '4', icon: MessageSquare, color: '#F59E0B' },
  { label: 'M&A Suite & CIM', sub: 'Valuation · Buyer discovery · CIM gen', href: '/ma', step: '5', icon: BarChart2, color: '#EC4899' },
  { label: 'Balance Sheet & Cap Table', sub: 'Asset/liability spreading · Ownership', href: '/balance-sheet', step: '6', icon: PieChart, color: '#10B981' },
];

// ── Financial mini-dashboard shown inside the scroll animation ──
function MiniDashboard() {
  const bars = [58, 74, 63, 88, 71, 95, 82];
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00E599' }} />
          <span className="text-xs font-bold" style={{ color: '#fff' }}>CapTable AI</span>
          <span className="text-[10px]" style={{ color: '#555' }}>· SBA 7(a) Underwriting</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,229,153,0.1)', color: '#00E599', border: '1px solid rgba(0,229,153,0.2)' }}>
            Active Analysis
          </span>
          <Activity size={12} style={{ color: '#555' }} />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2 p-3">
        {[
          { l: 'Health Score', v: '87/100', c: '#00E599', sub: 'Excellent' },
          { l: 'Annual Revenue', v: '$4.2M', c: '#fff', sub: 'FY 2023' },
          { l: 'DSCR Ratio', v: '1.45×', c: '#00E599', sub: 'SBA Qualified' },
          { l: 'Est. Valuation', v: '$12.6M', c: '#fff', sub: 'Blended 3.0×' },
        ].map(k => (
          <div key={k.l} className="rounded-xl p-2.5" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
            <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: '#555' }}>{k.l}</div>
            <div className="text-sm font-extrabold" style={{ color: k.c, fontFamily: 'ui-monospace, monospace' }}>{k.v}</div>
            <div className="text-[8px] mt-0.5" style={{ color: '#444' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Workflow */}
      <div className="flex gap-2 px-3 pb-3 flex-1 min-h-0">
        {/* Revenue bar chart */}
        <div className="flex-1 rounded-xl p-3 flex flex-col min-h-0" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#555' }}>Revenue vs Liabilities (Q1–Q4)</span>
            <span className="text-[8px]" style={{ color: '#00E599' }}>↑ 18% YoY</span>
          </div>
          <div className="flex items-end gap-1.5 flex-1">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-sm" style={{ height: `${h}%`, background: i % 2 === 0 ? '#00E599' : '#1E1E1E', opacity: i % 2 === 0 ? 0.85 : 1, transition: 'height 0.6s ease' }} />
                <span className="text-[6px]" style={{ color: '#333' }}>Q{Math.ceil((i + 1) / 2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk flags panel */}
        <div className="w-44 rounded-xl p-3 flex flex-col" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
          <div className="text-[8px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#555' }}>Underwriting Flags</div>
          {[
            { l: 'DSCR Check', s: 'Pass', c: '#00E599' },
            { l: 'Collateral', s: 'Pass', c: '#00E599' },
            { l: 'Equity Inject.', s: 'Review', c: '#F59E0B' },
            { l: 'Credit History', s: 'Pass', c: '#00E599' },
            { l: 'Ownership Docs', s: 'Pending', c: '#555' },
          ].map(w => (
            <div key={w.l} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid #1A1A1A' }}>
              <span className="text-[8px]" style={{ color: '#888' }}>{w.l}</span>
              <span className="text-[8px] font-bold" style={{ color: w.c }}>{w.s}</span>
            </div>
          ))}
        </div>

        {/* Workflow steps */}
        <div className="w-40 rounded-xl p-3 flex flex-col" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
          <div className="text-[8px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#555' }}>Analysis Workflow</div>
          {[
            { l: 'DSCR & Ratios', s: 'Done', c: '#00E599', n: '1' },
            { l: 'Credit Memo', s: 'Active', c: '#3B82F6', n: '2' },
            { l: 'DD Checklist', s: 'Next', c: '#8B5CF6', n: '3' },
            { l: 'AI Advisor', s: 'Queue', c: '#555', n: '4' },
          ].map(w => (
            <div key={w.l} className="flex items-center gap-1.5 py-1.5" style={{ borderBottom: '1px solid #1A1A1A' }}>
              <span className="text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${w.c}18`, color: w.c, border: `1px solid ${w.c}30` }}>{w.n}</span>
              <span className="text-[8px] flex-1" style={{ color: '#888' }}>{w.l}</span>
              <span className="text-[7px] font-bold" style={{ color: w.c }}>{w.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center gap-3 px-4 py-2" style={{ borderTop: '1px solid #1A1A1A' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E599' }} />
          <span className="text-[8px]" style={{ color: '#555' }}>AI analysis running · 4 of 6 steps complete</span>
        </div>
        <div className="flex-1 h-0.5 rounded-full" style={{ background: '#1A1A1A' }}>
          <div className="h-full rounded-full" style={{ width: '67%', background: '#00E599' }} />
        </div>
        <span className="text-[8px] font-mono font-bold" style={{ color: '#00E599' }}>67%</span>
      </div>
    </div>
  );
}

// ── Main page ──
export default function PipelineDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [bizResult, bsResult, chatResult] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('balance_sheet_items').select('*').eq('user_id', user.id),
        supabase.from('chat_history').select('content').eq('user_id', user.id).eq('role', 'assistant').order('created_at', { ascending: false }).limit(1),
      ]);

      if (!bizResult.data) { router.push('/onboarding'); return; }

      const business = bizResult.data as Business;
      const items = (bsResult.data || []) as BalanceSheetItem[];
      const assets = items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
      const liabilities = items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
      const equity = assets - liabilities;
      const healthScore = calculateHealthScore(business, assets, liabilities, equity);
      const valuationRange = computeValuationRange(business);
      const netMargin = business.annual_revenue > 0 ? (business.net_income / business.annual_revenue) * 100 : 0;

      setData({
        borrower: {
          business, healthScore,
          healthLabel: getHealthLabel(healthScore),
          estimatedValuation: (valuationRange.low + valuationRange.high) / 2,
          netMargin, items,
        },
        recentAdvice: (chatResult.data?.[0] as { content: string } | undefined)?.content ?? null,
      });
      setLoading(false);
    }

    load();
  }, [router]);

  // ── Lamp hero + scroll showcase always render (no data needed) ──
  const hero = (
    <>
      {/* ── SECTION 1: Lamp Hero ── */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center text-center w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(0,229,153,0.08)', border: '1px solid rgba(0,229,153,0.20)', color: '#00E599' }}>
            <Zap size={11} />
            SBA 7(a) AI Underwriting Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 30%, #444444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}>
            AI Financial<br />Intelligence
          </h1>

          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: '#666' }}>
            Reduces 4–8 hours of manual analyst work to under 30 minutes per SBA 7(a) application.
            Analytical support only — all credit decisions remain with the loan officer.
          </p>

          <div className="flex gap-3 mb-12">
            <Link href="/underwriting"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: '#00E599', color: '#000' }}>
              Start Analysis <ArrowRight size={14} />
            </Link>
            <Link href="/advisor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #333', color: '#fff' }}>
              Ask AI Underwriter <ChevronRight size={14} />
            </Link>
          </div>

          {/* Platform stats */}
          <div className="flex gap-10">
            {[
              { icon: Shield, label: 'SBA 7(a) Loans (FY2023)', value: '57,362' },
              { icon: Clock, label: 'Hours Saved / Application', value: '~5 hrs' },
              { icon: Zap, label: 'Target PLP Institutions', value: '140' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon size={14} className="mx-auto mb-1" style={{ color: '#444' }} />
                <div className="text-2xl font-extrabold font-mono" style={{ color: '#00E599' }}>{value}</div>
                <div className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: '#444' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </LampContainer>

      {/* ── SECTION 2: ContainerScrollAnimation — Financial Platform Showcase ── */}
      <div style={{ background: 'var(--bg-base)' }}>
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E599' }}>
                Platform Preview
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Complete SBA 7(a) analysis<br />
                <span style={{ color: '#00E599' }}>in under 30 minutes</span>
              </h2>
              <p className="text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                From DSCR ratios and credit memos to due diligence checklists — everything a loan officer needs in one unified platform.
              </p>
            </motion.div>
          }
        >
          <MiniDashboard />
        </ContainerScroll>
      </div>
    </>
  );

  if (loading) {
    return (
      <>
        {hero}
        <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto space-y-4" style={{ background: 'var(--bg-base)' }}>
          {[80, 240, 80, 180].map((h, i) => (
            <div key={i} className="skeleton rounded-2xl" style={{ height: h }} />
          ))}
        </div>
      </>
    );
  }

  if (!data) return null;
  const { borrower: b, recentAdvice } = data;
  if (!b) return null;

  const assets = b.items.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
  const liabilities = b.items.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
  const equity = assets - liabilities;
  const redFlags = detectRedFlags(b.business, liabilities, equity);
  const deRatio = equity > 0 ? liabilities / equity : 0;
  const scoreColor = b.healthScore >= 70 ? '#00E599' : b.healthScore >= 45 ? '#F59E0B' : '#FF4444';

  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {hero}

      {/* ── SECTION 3: Live Dashboard Data ── */}
      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto space-y-5">

        {/* Section divider */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
            Live Borrower Data
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* KPI strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: 'Borrower Revenue', value: formatCompact(b.business.annual_revenue), sub: 'Annual' },
            { label: 'Net Income', value: formatCompact(b.business.net_income), sub: `${b.netMargin.toFixed(1)}% margin` },
            { label: 'Est. Business Value', value: formatCompact(b.estimatedValuation), sub: 'Blended multiple' },
            { label: 'D/E Ratio', value: deRatio > 0 ? `${deRatio.toFixed(1)}×` : 'N/A', sub: deRatio > 3 ? 'Elevated' : 'Healthy' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <Spotlight size={200} fill="rgba(0,229,153,0.08)" />
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{m.label}</div>
              <div className="text-2xl font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
              {m.sub && <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{m.sub}</div>}
            </motion.div>
          ))}
        </motion.div>

        {/* Active borrower card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-5"
            style={{ background: `radial-gradient(circle, ${scoreColor} 0%, transparent 70%)` }} />

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                Active SBA 7(a) Application
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{b.business.business_name}</div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {b.business.industry || 'Industry not specified'} · {b.business.employees} employees
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ background: `${scoreColor}14`, border: `1px solid ${scoreColor}33`, color: scoreColor }}>
                {b.healthLabel} · {b.healthScore}/100
              </div>
              <div className="text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>SBA Financial Health Score</div>
              <div className="mt-2 w-40 h-1.5 rounded-full ml-auto" style={{ background: 'var(--bg-elevated)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${b.healthScore}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Annual Revenue', value: formatCurrency(b.business.annual_revenue) },
              { label: 'Net Income', value: formatCurrency(b.business.net_income) },
              { label: 'EBIT', value: formatCurrency(b.business.ebit) },
              { label: 'Total Equity', value: formatCurrency(equity) },
            ].map(row => (
              <div key={row.label}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-tertiary)' }}>{row.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk flags */}
        {redFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} style={{ color: '#FF4444' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF4444' }}>
                {redFlags.length} Underwriting Risk{redFlags.length > 1 ? 's' : ''} Detected
              </span>
            </div>
            <div className="space-y-3">
              {redFlags.map((flag, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <span className={`badge ${flag.severity === 'critical' ? 'badge-red' : flag.severity === 'warning' ? 'badge-yellow' : 'badge-muted'} flex-shrink-0 mt-0.5`}>
                    {flag.severity}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{flag.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{flag.detail}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{flag.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workflow grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Loan Officer Workflow</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
              Complete a full SBA 7(a) underwriting analysis in under 30 minutes
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflowItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 p-4 rounded-2xl transition-colors duration-200 block"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold rounded-full px-1.5 py-0.5"
                          style={{ background: 'var(--bg-elevated)', color: item.color, border: `1px solid ${item.color}25` }}>
                          {item.step}
                        </span>
                        <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                      </div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</div>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1"
                      style={{ color: 'var(--text-tertiary)' }} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Unit economics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-tertiary)' }}>Unit Economics at a Glance</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Cost / Application (Manual)', value: '$200–$600', note: 'At $100K analyst salary, 200 loans/yr' },
              { label: 'Time Saved / Application', value: '~5 hours', note: 'From 4–8 hrs → under 30 min' },
              { label: 'Annual Analyst Cost (PLP)', value: '$40–120K', note: '200 loans × $200–600/loan' },
              { label: 'Platform ACV', value: '$24–60K', note: '$2,000–$5,000/month per institution' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
                <div className="text-base font-extrabold font-mono mb-1" style={{ color: '#00E599' }}>{s.value}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{s.note}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent AI analysis */}
        {recentAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E599' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Recent AI Analysis</span>
              </div>
              <Link href="/advisor" className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: '#00E599' }}>
                View conversation <ArrowRight size={11} />
              </Link>
            </div>
            <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>
              {recentAdvice}
            </p>
            <div className="mt-4 px-4 py-2.5 rounded-xl text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>
              For loan officer review only. All credit decisions remain with the loan officer. Not a credit opinion.
            </div>
          </motion.div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
