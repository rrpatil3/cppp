'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { WaveText } from '@/components/ui/wave-text';

interface PageShellProps {
  children: React.ReactNode;
  badge?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible:  {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const badgeVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function PageShell({ children, badge, title, subtitle, showHeader = false }: PageShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-full" style={{ background: 'var(--bg-base)' }}>

      {/* Subtle animated path background – parallax */}
      <motion.div
        style={{ y: bgY }}
        className="opacity-[0.025] pointer-events-none fixed inset-0 z-0"
      >
        <BackgroundPaths />
      </motion.div>

      {/* Accent ambient glow – fades as you scroll */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0"
      >
        <div
          style={{
            width: 700,
            height: 220,
            background: 'radial-gradient(ellipse, rgba(69,128,245,0.07) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 px-6 py-6 max-w-[1400px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {showHeader && (title || badge) && (
          <motion.div variants={itemVariants} className="mb-8">
            {badge && (
              <motion.div variants={badgeVariants} className="mb-3 inline-block">
                <span className="eyebrow">{badge}</span>
              </motion.div>
            )}

            {title && (
              <h1
                className="text-3xl font-black tracking-tighter leading-none mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <WaveText text={title} />
              </h1>
            )}

            {subtitle && (
              <motion.p
                variants={itemVariants}
                className="text-sm max-w-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Animated accent underline */}
            <motion.div
              variants={{
                hidden:  { scaleX: 0, opacity: 0 },
                visible: { scaleX: 1, opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: [0.22,1,0.36,1] as [number,number,number,number] } },
              }}
              className="mt-4"
              style={{
                height: 1,
                width: 48,
                transformOrigin: 'left',
                background: 'var(--accent)',
                borderRadius: 9999,
              }}
            />
          </motion.div>
        )}

        {children}
      </motion.div>
    </div>
  );
}

export { itemVariants, containerVariants };
