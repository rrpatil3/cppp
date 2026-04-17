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
  Zap, Shield, Clock, ChevronRight,
} from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
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
  { label: 'Ask AI Underwriter', sub: "Structured Q&A on borrower financials", href: '/advisor', step: '4', icon: MessageSquare, color: '#F59E0B' },
  { label: 'M&A Suite & CIM', sub: 'Valuation · Buyer discovery · CIM gen', href: '/ma', step: '5', icon: BarChart2, color: '#EC4899' },
  { label: 'Balance Sheet & Cap Table', sub: 'Asset/liability spreading · Ownership', href: '/balance-sheet', step: '6', icon: PieChart, color: '#10B981' },
];

const platformStats = [
  { label: 'SBA 7(a) Loans (FY2023)', value: '57,362', icon: Shield },
  { label: 'Hours Saved / Application', value: '~5 hrs', icon: Clock },
  { label: 'Target PLPs', value: '140', icon: Zap },
];

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
          business,
          healthScore,
          healthLabel: getHealthLabel(healthScore),
          estimatedValuation: (valuationRange.low + valuationRange.high) / 2,
          netMargin,
          items,
        },
        recentAdvice: (chatResult.data?.[0] as { content: string } | undefined)?.content ?? null,
      });
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        {[80, 280, 80, 160].map((h, i) => (
          <div key={i} className="skeleton rounded-2xl" style={{ height: h }} />
        ))}
      </div>
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
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ── Hero: Spline 3D + Left Content ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 480, borderBottom: '1px solid #1A1A1A' }}>
        <Spotlight size={600} className="z-10" fill="rgba(0,229,153,0.12)" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#00E599 1px, transparent 1px), linear-gradient(90deg, #00E599 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Left text content */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-center z-20 px-10 md:px-16 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(0,229,153,0.08)', border: '1px solid rgba(0,229,153,0.2)', color: '#00E599' }}>
              <Zap size={11} />
              SBA 7(a) AI Underwriting
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4"
              style={{ background: 'linear-gradient(to bottom, #ffffff 40%, #555555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Financial<br />Intelligence
            </h1>

            <p className="text-sm leading-relaxed mb-6" style={{ color: '#888' }}>
              Reduces 4–8 hours of analyst work to under 30 minutes per application.
              Not a credit decision tool — analytical support only.
            </p>

            <div className="flex gap-3">
              <Link href="/underwriting"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{ background: '#00E599', color: '#000' }}>
                Start Analysis <ArrowRight size={14} />
              </Link>
              <Link href="/advisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #222', color: '#fff' }}>
                Ask AI <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Platform stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-8 mt-10"
          >
            {platformStats.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-extrabold font-mono" style={{ color: '#00E599' }}>{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: '#555' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Spline 3D scene */}
        <div className="absolute right-0 top-0 h-full z-10" style={{ width: '52%' }}>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          {/* Fade-left gradient so it blends with left content */}
          <div className="absolute inset-y-0 left-0 w-32"
            style={{ background: 'linear-gradient(to right, var(--bg-base), transparent)' }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto space-y-6">

        {/* KPI strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: '#111', border: '1px solid #1A1A1A' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#555' }}>{m.label}</div>
              <div className="text-2xl font-extrabold font-mono" style={{ color: '#fff' }}>{m.value}</div>
              {m.sub && <div className="text-xs mt-1" style={{ color: '#555' }}>{m.sub}</div>}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10"
                style={{ background: '#00E599', filter: 'blur(20px)' }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Active borrower card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: '#111', border: '1px solid #1A1A1A' }}
        >
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${scoreColor} 0%, transparent 70%)` }} />

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#555' }}>
                Active SBA 7(a) Application
              </div>
              <div className="text-2xl font-bold" style={{ color: '#fff' }}>{b.business.business_name}</div>
              <div className="text-sm mt-0.5" style={{ color: '#888' }}>
                {b.business.industry || 'Industry not specified'} · {b.business.employees} employees
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ background: `${scoreColor}14`, border: `1px solid ${scoreColor}33`, color: scoreColor }}>
                {b.healthLabel} · {b.healthScore}/100
              </div>
              <div className="text-[10px] mt-1.5" style={{ color: '#555' }}>SBA Financial Health Score</div>

              {/* Score bar */}
              <div className="mt-2 w-40 h-1.5 rounded-full ml-auto" style={{ background: '#1A1A1A' }}>
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
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>{row.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: '#fff' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk flags */}
        {redFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
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
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <span className={`badge ${flag.severity === 'critical' ? 'badge-red' : flag.severity === 'warning' ? 'badge-yellow' : 'badge-muted'} flex-shrink-0 mt-0.5`}>
                    {flag.severity}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#fff' }}>{flag.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#888' }}>{flag.detail}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#555' }}>{flag.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workflow grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555' }}>Loan Officer Workflow</div>
              <div className="text-xs mt-0.5" style={{ color: '#444' }}>Complete a full SBA 7(a) underwriting analysis in under 30 minutes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflowItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 block"
                    style={{ background: '#111', border: '1px solid #1A1A1A' }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold rounded-full px-1.5 py-0.5"
                          style={{ background: '#1A1A1A', color: item.color, border: `1px solid ${item.color}25` }}>
                          {item.step}
                        </span>
                        <span className="text-sm font-semibold truncate" style={{ color: '#fff' }}>{item.label}</span>
                      </div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: '#555' }}>{item.sub}</div>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: '#333' }} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Unit economics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl p-6"
          style={{ background: '#111', border: '1px solid #1A1A1A' }}
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#555' }}>Unit Economics at a Glance</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Cost / Application (Manual)', value: '$200–$600', note: 'At $100K analyst salary, 200 loans/yr' },
              { label: 'Time Saved / Application', value: '~5 hours', note: 'From 4–8 hrs → under 30 min' },
              { label: 'Annual Analyst Cost (PLP)', value: '$40–120K', note: '200 loans × $200–600/loan' },
              { label: 'Platform ACV', value: '$24–60K', note: '$2,000–$5,000/month per institution' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl" style={{ background: '#161616', border: '1px solid #1A1A1A' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#555' }}>{s.label}</div>
                <div className="text-base font-extrabold font-mono mb-1" style={{ color: '#00E599' }}>{s.value}</div>
                <div className="text-[10px]" style={{ color: '#444' }}>{s.note}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent AI analysis */}
        {recentAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-6"
            style={{ background: '#111', border: '1px solid #1A1A1A' }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E599' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555' }}>Recent AI Analysis</span>
              </div>
              <Link href="/advisor" className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: '#00E599' }}>
                View conversation <ArrowRight size={11} />
              </Link>
            </div>
            <p className="text-sm leading-relaxed line-clamp-4" style={{ color: '#888' }}>
              {recentAdvice}
            </p>
            <div className="mt-4 px-4 py-2.5 rounded-xl text-xs" style={{ background: '#161616', color: '#444' }}>
              For loan officer review only. All credit decisions remain with the loan officer. Not a credit opinion.
            </div>
          </motion.div>
        )}

        <div className="pb-4" />
      </div>
    </div>
  );
}
