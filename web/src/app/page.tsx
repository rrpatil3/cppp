'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { RevealImageList } from '@/components/ui/reveal-images';
import { GlassFilter } from '@/components/ui/liquid-glass';
import {
  BarChart3, FileText, MessageSquare, ClipboardList,
  ArrowRight, CheckCircle2, Zap, Shield, Clock, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'DSCR & SBA Ratios',
    desc: 'Automated debt-service coverage ratio analysis with SBA 7(a) compliance scoring in seconds.',
    color: '#06B6D4',
  },
  {
    icon: FileText,
    title: 'Credit Memo Generator',
    desc: 'AI drafts full credit memos from financials. Loan officer reviews, edits, approves. Done.',
    color: '#EC4899',
  },
  {
    icon: MessageSquare,
    title: 'AI Underwriter Advisor',
    desc: 'Ask complex underwriting questions. Get SBA-specific guidance backed by your borrower data.',
    color: '#06B6D4',
  },
  {
    icon: ClipboardList,
    title: 'Due Diligence Checklists',
    desc: 'Auto-generated document request lists tailored to each borrower profile and loan type.',
    color: '#EC4899',
  },
];

const METRICS = [
  { value: '30 min', label: 'Avg. Underwrite Time', sub: 'Down from 6–8 hours' },
  { value: '94%', label: 'Analyst Time Saved', sub: 'Per SBA application' },
  { value: '$200–$600', label: 'Cost Per Loan (manual)', sub: 'Reduced to near zero' },
  { value: 'SBA 7(a)', label: 'Specialized For', sub: 'Not a generic tool' },
];

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard');
      else setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent spinner"
          style={{ borderColor: '#06B6D4', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#050505', color: '#ffffff', fontFamily: 'Aspekta, system-ui, sans-serif' }}>
      <GlassFilter />

      {/* ── Sticky Nav with mix-blend-difference ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ padding: '1.5rem 2rem' }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between"
          style={{ mixBlendMode: 'difference' }}
        >
          {/* Logo + live dot */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full animate-live-pulse"
                style={{ background: '#ef4444' }}
              />
            </div>
            <div
              className="font-black tracking-tight"
              style={{ fontSize: '1rem', letterSpacing: '-0.02em', color: '#ffffff', fontWeight: 900 }}
            >
              CAPTABLE AI
            </div>
          </div>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Platform', 'Features', 'Workflow', 'Pricing'].map((item) => (
              <span
                key={item}
                className="text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
                style={{ color: '#ffffff', letterSpacing: '0.05em', fontWeight: 500 }}
              >
                {item}
              </span>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: '#ffffff', fontWeight: 500 }}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-bold px-5 py-2 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                color: '#ffffff',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', perspective: '2000px' }}
      >
        <BackgroundPaths />

        {/* Massive background text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            style={{
              fontSize: '20vw',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 0.025,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              fontFamily: 'Aspekta, system-ui, sans-serif',
            }}
          >
            UNDERWRITE
          </span>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex justify-center mb-8">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.22)',
                  color: '#06B6D4',
                  letterSpacing: '0.14em',
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                }}
              >
                <Zap size={10} />
                SBA 7(a) Underwriting Intelligence
              </span>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 9rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#ffffff',
                fontFamily: 'Aspekta, system-ui, sans-serif',
                marginBottom: '0.25em',
              }}
            >
              Underwrite
            </h1>
            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 9rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Aspekta, system-ui, sans-serif',
                marginBottom: '1.5rem',
              }}
            >
              Smarter.
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                color: '#999999',
                maxWidth: '40rem',
                margin: '0 auto 2.5rem',
                lineHeight: 1.6,
              }}
            >
              AI-powered SBA 7(a) underwriting. From borrower intake to credit memo in 30 minutes.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-transform hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'Aspekta, system-ui, sans-serif',
              }}
            >
              Start Underwriting Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontSize: '0.9rem',
                backdropFilter: 'blur(8px)',
                fontFamily: 'Aspekta, system-ui, sans-serif',
              }}
            >
              Sign in to dashboard
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <CheckCircle2 size={12} style={{ color: '#06B6D4' }} />
            <span style={{ fontSize: '0.75rem', color: '#555555' }}>
              No credit card required · SBA 7(a) specialized · Built for loan officers
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Metrics Strip ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 text-center"
            >
              <div
                className="font-black font-mono mb-2"
                style={{
                  fontSize: '1.75rem',
                  background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {m.value}
              </div>
              <div
                className="text-xs font-bold uppercase mb-1"
                style={{ color: '#ffffff', letterSpacing: '0.08em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#555555' }}>{m.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.22)',
                  color: '#06B6D4',
                  letterSpacing: '0.14em',
                }}
              >
                <Zap size={10} />
                Platform Features
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 7rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: '#ffffff',
                lineHeight: 0.95,
                fontFamily: 'Aspekta, system-ui, sans-serif',
                marginBottom: '1rem',
              }}
            >
              Everything a loan
              <br />officer needs.
            </h2>
            <p style={{ fontSize: '1.125rem', fontWeight: 300, color: '#999999', maxWidth: '36rem', margin: '0 auto' }}>
              From borrower intake to credit memo — the full SBA 7(a) underwriting workflow, automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: `${f.color}12`,
                        border: `1px solid ${f.color}30`,
                      }}
                    >
                      <Icon size={18} style={{ color: f.color }} />
                    </div>
                    <div>
                      <div
                        className="font-bold text-sm mb-2 uppercase"
                        style={{ color: '#ffffff', letterSpacing: '0.08em', fontFamily: 'Aspekta, system-ui, sans-serif', fontWeight: 700 }}
                      >
                        {f.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 300, color: '#999999', lineHeight: 1.6 }}>
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-xs font-bold uppercase mb-6"
                style={{ color: '#06B6D4', letterSpacing: '0.2em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
              >
                Core Workflow
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  color: '#ffffff',
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                  marginBottom: '1.25rem',
                }}
              >
                Six hours
                <br />
                <span
                  style={{
                    background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Thirty minutes.
                </span>
              </h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 300, color: '#999999', lineHeight: 1.6, marginBottom: '2rem' }}>
                CapTable AI handles the financial analysis, narrative writing, and checklist generation so loan officers can focus on the relationship — not the spreadsheet.
              </p>
              <div className="space-y-4">
                {[
                  'Enter borrower financials once',
                  'AI calculates DSCR and all SBA ratios',
                  'Review auto-generated credit memo',
                  'Export and submit to underwriting',
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{
                        background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                        color: '#ffffff',
                        fontFamily: 'Aspekta, system-ui, sans-serif',
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 300, color: '#cccccc' }}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <RevealImageList />
          </div>
        </div>
      </section>

      {/* ── Security Strip ── */}
      <section className="py-16 px-4">
        <div
          className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-12"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 0' }}
        >
          {[
            { icon: Shield, text: 'Bank-grade data security' },
            { icon: CheckCircle2, text: 'SBA compliance built-in' },
            { icon: Clock, text: 'Audit trail for every analysis' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon size={16} style={{ color: '#06B6D4' }} />
              <span
                className="text-sm font-medium uppercase"
                style={{ color: '#999999', letterSpacing: '0.08em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section with Purple Glow ── */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="purple-glow-card relative p-16 rounded-2xl"
            style={{
              background: '#0B0216',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="relative z-10">
              <div
                className="text-xs font-bold uppercase mb-6"
                style={{ color: '#7C3AED', letterSpacing: '0.2em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
              >
                Ready to modernize your SBA workflow?
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  lineHeight: 0.95,
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                  marginBottom: '1.5rem',
                }}
              >
                Start your first
                <br />
                <span
                  style={{
                    background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  analysis today.
                </span>
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 300,
                  color: '#999999',
                  marginBottom: '2.5rem',
                  maxWidth: '32rem',
                  margin: '0 auto 2.5rem',
                }}
              >
                No setup fees. No training required. Works with your existing borrower data.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold transition-transform hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                }}
              >
                Create Free Account
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-16 px-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Logo block */}
            <div>
              <div
                className="font-black uppercase mb-2"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 4rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                  background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CapTable AI
              </div>
              <div style={{ fontSize: '0.75rem', color: '#555555', letterSpacing: '0.08em', fontFamily: 'Aspekta, system-ui, sans-serif' }}>
                SBA LENDER PLATFORM
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="text-xs font-medium uppercase transition-opacity hover:opacity-60"
                  style={{ color: '#555555', letterSpacing: '0.1em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="text-xs font-medium uppercase transition-opacity hover:opacity-60"
                  style={{ color: '#555555', letterSpacing: '0.1em', fontFamily: 'Aspekta, system-ui, sans-serif' }}
                >
                  Get Started
                </Link>
              </div>
              <p style={{ fontSize: '0.65rem', color: '#333333', textAlign: 'right', maxWidth: '28rem' }}>
                For loan officer analytical support only. Not a credit decision tool.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
