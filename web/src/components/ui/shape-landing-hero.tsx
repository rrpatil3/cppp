"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroGeometric({
  badge = "SBA 7(a) Platform",
  title1 = "Underwrite Smarter.",
  title2 = "Close Loans Faster.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-[#00E599]/[0.12]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-emerald-400/[0.10]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-teal-400/[0.10]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
        <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-[#00E599]/[0.08]" className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" />
        <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-emerald-300/[0.08]" className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 md:mb-12"
            style={{ background: 'rgba(0,229,153,0.08)', border: '1px solid rgba(0,229,153,0.2)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#00E599' }}>
              {badge}
            </span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
                {title1}
              </span>
              <br />
              <span className="text-[#00E599]">{title2}</span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}>
              AI-powered SBA 7(a) underwriting. Cut analysis time from 6 hours to 30 minutes.
              Built for loan officers, not spreadsheets.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
