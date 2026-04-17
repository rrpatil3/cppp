'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { RevealImageList } from '@/components/ui/reveal-images';
import { GlassFilter } from '@/components/ui/liquid-glass';
import {
  BarChart3, FileText, MessageSquare, ClipboardList,
  ArrowRight, CheckCircle2, Zap, Shield, Clock,
  Sun, Moon, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'DSCR & SBA Ratios',
    desc: 'Automated debt-service coverage ratio analysis with SBA 7(a) compliance scoring in seconds.',
    color: '#00E599',
  },
  {
    icon: FileText,
    title: 'Credit Memo Generator',
    desc: 'AI drafts full credit memos from financials. Loan officer reviews, edits, approves. Done.',
    color: '#34d399',
  },
  {
    icon: MessageSquare,
    title: 'AI Underwriter Advisor',
    desc: 'Ask complex underwriting questions. Get SBA-specific guidance backed by your borrower data.',
    color: '#6ee7b7',
  },
  {
    icon: ClipboardList,
    title: 'Due Diligence Checklists',
    desc: 'Auto-generated document request lists tailored to each borrower profile and loan type.',
    color: '#00E599',
  },
];

const METRICS = [
  { value: '30 min', label: 'Avg. underwrite time', sub: 'Down from 6–8 hours' },
  { value: '94%', label: 'Analyst time saved', sub: 'Per SBA application' },
  { value: '$200–$600', label: 'Cost per loan (manual)', sub: 'Reduced to near zero' },
  { value: 'SBA 7(a)', label: 'Specialized for', sub: 'Not a generic tool' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('captable-theme');
    if (stored === 'dark') {
      setDark(true);
      document.documentElement.classList.remove('light');
    } else {
      setDark(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('captable-theme', next ? 'dark' : 'light');
    if (next) document.documentElement.classList.remove('light');
    else document.documentElement.classList.add('light');
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
      }}
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('captable-theme');
    if (!stored || stored === 'light') {
      document.documentElement.classList.add('light');
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard');
      else setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#00E599] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <GlassFilter />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#00E599', boxShadow: '0 0 16px rgba(0,229,153,0.3)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 14L10 2L20 14" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 22L8 10L12 10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>CapTable AI</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>SBA Lender Platform</div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login"
                className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}>
                Sign in
              </Link>
              <Link href="/login"
                className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-150 active:scale-[0.98]"
                style={{ background: '#00E599', color: '#000' }}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <BackgroundPaths />
        <HeroGeometric
          badge="SBA 7(a) Underwriting Intelligence"
          title1="Underwrite Smarter."
          title2="Close Loans Faster."
        />

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <Link href="/login"
            className="group flex items-center gap-3 px-7 py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.98] hover:shadow-lg"
            style={{ background: '#00E599', color: '#000', boxShadow: '0 0 32px rgba(0,229,153,0.25)' }}>
            Start underwriting free
            <div className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-150 group-hover:translate-x-1"
              style={{ background: 'rgba(0,0,0,0.15)' }}>
              <ArrowRight size={13} />
            </div>
          </Link>
          <Link href="/login"
            className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-medium transition-all duration-200 hover:opacity-80"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            Sign in to dashboard
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="relative z-10 flex items-center gap-2 mt-8"
        >
          <CheckCircle2 size={13} style={{ color: '#00E599' }} />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            No credit card required · SBA 7(a) specialized · Built for loan officers
          </span>
        </motion.div>
      </section>

      {/* Metrics strip */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl text-center"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="text-2xl font-black font-mono mb-1" style={{ color: '#00E599' }}>{m.value}</div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{m.label}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{m.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(0,229,153,0.08)', border: '1px solid rgba(0,229,153,0.2)', color: '#00E599' }}>
              <Zap size={10} /> Platform Features
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3" style={{ color: 'var(--text-primary)' }}>
              Everything a loan officer needs.
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              From borrower intake to credit memo — the full SBA 7(a) underwriting workflow, automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-xl transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                      <Icon size={18} style={{ color: f.color }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities reveal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#00E599' }}>
                Core Workflow
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
                Six hours of work.<br />
                <span style={{ color: '#00E599' }}>Thirty minutes with AI.</span>
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                CapTable AI handles the financial analysis, narrative writing, and checklist generation so loan officers can focus on the relationship — not the spreadsheet.
              </p>
              <div className="space-y-3">
                {['Enter borrower financials once', 'AI calculates DSCR and all SBA ratios', 'Review auto-generated credit memo', 'Export and submit to underwriting'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
                      style={{ background: 'rgba(0,229,153,0.12)', border: '1px solid rgba(0,229,153,0.25)', color: '#00E599' }}>
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <RevealImageList />
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { icon: Shield, text: 'Bank-grade data security' },
            { icon: CheckCircle2, text: 'SBA compliance built-in' },
            { icon: Clock, text: 'Audit trail for every analysis' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} style={{ color: '#00E599' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-2xl relative overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 4px 32px rgba(0,229,153,0.08)' }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,153,0.06) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#00E599' }}>
                Ready to modernize your SBA workflow?
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-3" style={{ color: 'var(--text-primary)' }}>
                Start your first underwriting analysis today.
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                No setup fees. No training required. Works with your existing borrower data.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 active:scale-[0.98]"
                style={{ background: '#00E599', color: '#000' }}>
                Create free account
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#00E599' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M4 14L10 2L20 14" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 22L8 10L12 10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>CapTable AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--text-tertiary)' }}>Sign in</Link>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              For loan officer analytical support only. Not a credit decision tool.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
