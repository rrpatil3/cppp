'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess('Check your email for a confirmation link.');
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Aspekta, system-ui, sans-serif',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '10%',
          width: 400,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between"
        style={{
          flex: '0 0 42%',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '3rem 3.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: '1.2rem',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #06B6D4, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CapTable AI
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: '#333333',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            SBA Lender Platform
          </div>
        </motion.div>

        {/* Center statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: '#ffffff',
              maxWidth: 340,
              marginBottom: '1.5rem',
            }}
          >
            SBA underwriting in under 30 minutes.
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 300, color: '#999999', maxWidth: 320, lineHeight: 1.65 }}>
            AI-powered financial spreading, DSCR ratios, credit memo generation, and due diligence — built for loan officers.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            {[
              { value: '57K+', label: 'SBA 7(a) Loans' },
              { value: '5 hrs',  label: 'Saved / App' },
              { value: '140',   label: 'Target PLPs' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    fontFamily: 'ui-monospace, monospace',
                    background: 'linear-gradient(to right, #06B6D4, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    color: '#555555',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compliance note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ fontSize: '0.65rem', color: '#333333', lineHeight: 1.6 }}
        >
          Analytical support only. All credit decisions remain with the loan officer.
        </motion.p>
      </div>

      {/* Right panel — auth form */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          flex: 1,
          padding: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Mobile wordmark */}
        <div className="md:hidden mb-8 text-center">
          <div
            style={{
              fontWeight: 900,
              fontSize: '1.4rem',
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #06B6D4, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CapTable AI
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: 380 }}
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '0.375rem',
                fontFamily: 'Aspekta, system-ui, sans-serif',
              }}
            >
              {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', fontWeight: 300, color: '#999999' }}>
              {tab === 'signin'
                ? 'Sign in to your institution account.'
                : 'Start your free analysis today.'}
            </p>
          </motion.div>

          {/* Tab switcher */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '1.5rem',
              background: 'rgba(255,255,255,0.04)',
              padding: '0.25rem',
              borderRadius: '0.625rem',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  borderRadius: '0.425rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: tab === t
                    ? 'linear-gradient(to right, #06B6D4, #EC4899)'
                    : 'transparent',
                  color: tab === t ? '#ffffff' : '#555555',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'Aspekta, system-ui, sans-serif',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </motion.div>

          {/* Form */}
          <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
            <motion.div
              variants={containerVariants}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <motion.div variants={itemVariants}>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      background: 'var(--red-dim)',
                      border: '1px solid var(--red-border)',
                      borderRadius: '0.625rem',
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.8rem',
                      color: 'var(--red)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      background: 'var(--green-dim)',
                      border: '1px solid var(--green-border)',
                      borderRadius: '0.625rem',
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.8rem',
                      color: 'var(--green)',
                    }}
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="spinner"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Loading...
                    </span>
                  ) : tab === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </motion.div>
            </motion.div>
          </form>

          {/* Compliance */}
          <motion.p
            variants={itemVariants}
            style={{
              marginTop: '1.25rem',
              fontSize: '0.6rem',
              color: '#333333',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            By continuing you agree to our terms of service. Analytical support only — not a credit decision platform.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
