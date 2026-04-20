'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const STATS = [
  { value: '57K+', label: 'SBA 7(a) Loans' },
  { value: '5 hrs',  label: 'Saved / App' },
  { value: '140',   label: 'Target PLPs' },
];

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
        background: '#FBFBFA',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Ambient background */}
      <div className="ambient-layer" aria-hidden />

      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between"
        style={{
          flex: '0 0 42%',
          borderRight: '1px solid #EAEAEA',
          padding: '3rem 3.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              color: '#111111',
            }}
          >
            CapTable AI
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: '#AEABA4',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: 4,
              fontFamily: 'var(--font-body)',
            }}
          >
            SBA Lender Platform
          </div>
        </motion.div>

        {/* Center statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#111111',
              maxWidth: 340,
              marginBottom: '1.25rem',
            }}
          >
            SBA underwriting in under 30 minutes.
          </p>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 400,
            color: '#787774',
            maxWidth: 320,
            lineHeight: 1.65,
            fontFamily: 'var(--font-body)',
          }}>
            AI-powered financial spreading, DSCR ratios, credit memo generation, and due diligence — built for loan officers.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem' }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: '#111111',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    color: '#AEABA4',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    marginTop: 3,
                    fontFamily: 'var(--font-body)',
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
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            fontSize: '0.65rem',
            color: '#C5C2BB',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)',
          }}
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
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
              color: '#111111',
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
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#111111',
                marginBottom: '0.375rem',
              }}
            >
              {tab === 'signin' ? 'Welcome back.' : 'Create account.'}
            </h2>
            <p style={{ fontSize: '0.875rem', fontWeight: 400, color: '#787774', fontFamily: 'var(--font-body)' }}>
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
              gap: '0',
              marginBottom: '1.5rem',
              background: '#F7F6F3',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #EAEAEA',
            }}
          >
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '0.475rem',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  background: tab === t ? '#FFFFFF' : 'transparent',
                  color: tab === t ? '#111111' : '#787774',
                  fontWeight: tab === t ? 500 : 400,
                  fontSize: '0.825rem',
                  fontFamily: 'var(--font-body)',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
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
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#FDEBEC',
                      border: '1px solid #F0BFBF',
                      borderRadius: '8px',
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.825rem',
                      color: '#9F2F2D',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#EDF3EC',
                      border: '1px solid #C5D9C4',
                      borderRadius: '8px',
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.825rem',
                      color: '#346538',
                      fontFamily: 'var(--font-body)',
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
                  style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg
                        className="spinner"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
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
              fontSize: '0.65rem',
              color: '#C5C2BB',
              textAlign: 'center',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
            }}
          >
            By continuing you agree to our terms of service. Analytical support only — not a credit decision platform.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
