'use client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const chips = [
  { label: 'DSCR', value: '1.45×', color: '#00E599' },
  { label: 'Health', value: '87/100', color: '#3B82F6' },
  { label: 'Value', value: '$12.6M', color: '#8B5CF6' },
  { label: 'Revenue', value: '$4.2M', color: '#F59E0B' },
];

function MetricChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="px-3 py-2 rounded-xl text-center"
      style={{ background: `${color}10`, border: `1px solid ${color}28`, minWidth: 72 }}
    >
      <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `${color}88` }}>{label}</div>
      <div className="text-xs font-extrabold font-mono mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}

export function FinancialHeroViz() {
  return (
    <div className="relative select-none" style={{ width: 280, height: 280 }}>
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,153,0.08) 0%, transparent 65%)' }} />

      {/* Outer dashed ring — rotates clockwise */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: 8, borderRadius: '50%', border: '1px dashed rgba(0,229,153,0.2)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner ring — counter-rotates */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: 40, borderRadius: '50%', border: '1px solid rgba(0,229,153,0.10)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Central icon — pulses */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(0,229,153,0.10)', border: '1.5px solid rgba(0,229,153,0.30)' }}
          animate={{
            boxShadow: [
              '0 0 16px rgba(0,229,153,0.15)',
              '0 0 32px rgba(0,229,153,0.30)',
              '0 0 16px rgba(0,229,153,0.15)',
            ],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FileText size={32} style={{ color: '#00E599' }} />
        </motion.div>
      </div>

      {/* ── Cardinal chips — gently bob ── */}
      {/* Top */}
      <motion.div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
        animate={{ y: [0, -5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}>
        <MetricChip {...chips[0]} />
      </motion.div>

      {/* Right */}
      <motion.div className="absolute" style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
        animate={{ x: [0, 5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}>
        <MetricChip {...chips[1]} />
      </motion.div>

      {/* Bottom */}
      <motion.div className="absolute" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        animate={{ y: [0, 5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}>
        <MetricChip {...chips[2]} />
      </motion.div>

      {/* Left */}
      <motion.div className="absolute" style={{ left: 0, top: '50%', transform: 'translateY(-50%)' }}
        animate={{ x: [0, -5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}>
        <MetricChip {...chips[3]} />
      </motion.div>

      {/* Orbiting dot on outer ring */}
      {[0, 180].map((startDeg, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ background: '#00E599', left: '50%', top: '50%', marginLeft: -4, marginTop: -4 }}
          animate={{
            x: Array.from({ length: 37 }, (_, k) => {
              const rad = ((startDeg + k * 10) * Math.PI) / 180;
              return Math.cos(rad) * 124;
            }),
            y: Array.from({ length: 37 }, (_, k) => {
              const rad = ((startDeg + k * 10) * Math.PI) / 180;
              return Math.sin(rad) * 124;
            }),
            opacity: [0.9, 0.3, 0.9],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: i * 6 }}
        />
      ))}
    </div>
  );
}
