'use client';

import { motion } from 'framer-motion';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { WaveText } from '@/components/ui/wave-text';

interface PageShellProps {
  children: React.ReactNode;
  badge?: string;
  title?: string;
  subtitle?: string;
  /** If true, renders badge+title+subtitle page header before children */
  showHeader?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export function PageShell({ children, badge, title, subtitle, showHeader = false }: PageShellProps) {
  return (
    <div className="relative min-h-full" style={{ background: 'var(--bg-base)' }}>
      {/* Subtle animated path background */}
      <div className="opacity-[0.035] pointer-events-none fixed inset-0 z-0">
        <BackgroundPaths />
      </div>

      {/* Top ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0"
        style={{
          width: 600,
          height: 200,
          background: 'radial-gradient(ellipse, rgba(0,229,153,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        className="relative z-10 px-6 py-6 max-w-[1400px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {showHeader && (title || badge) && (
          <motion.div variants={itemVariants} className="mb-8">
            {badge && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded mb-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(0,229,153,0.08)', border: '1px solid rgba(0,229,153,0.2)', color: '#00E599' }}
              >
                {badge}
              </div>
            )}
            {title && (
              <h1 className="text-3xl font-black tracking-tighter leading-none mb-2" style={{ color: 'var(--text-primary)' }}>
                <WaveText text={title} />
              </h1>
            )}
            {subtitle && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
            )}
          </motion.div>
        )}

        {children}
      </motion.div>
    </div>
  );
}

export { itemVariants, containerVariants };
