'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface KPIChip {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

const METRICS: KPIChip[] = [
  { label: 'Avg DSCR',        value: '1.42x',   delta: '+0.07',  positive: true  },
  { label: 'Pipeline Value',  value: '$14.7M',  delta: '+$2.1M', positive: true  },
  { label: 'Avg SBA Rate',    value: '11.25%',  delta: '-0.25%', positive: true  },
  { label: 'Approvals MTD',   value: '23',      delta: '+4',     positive: true  },
  { label: 'Avg LTV',         value: '67.3%',   delta: '-1.2%',  positive: true  },
  { label: 'Active Loans',    value: '141',     delta: '+6',     positive: true  },
  { label: 'Credit Memos',    value: '8',       delta: 'pending',               },
  { label: 'Avg Note Term',   value: '84 mo',                                   },
  { label: 'In Underwriting', value: '12',      delta: '+3',     positive: false },
  { label: 'Avg Equity Inj',  value: '22.4%',                                   },
];

const Chip = memo(({ label, value, delta, positive }: KPIChip) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.3rem 0.85rem',
      borderRadius: 9999,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}
  >
    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
      {label}
    </span>
    <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </span>
    {delta && (
      <span
        style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          color: positive === false ? '#EF4444' : positive ? 'var(--green)' : 'var(--text-tertiary)',
        }}
      >
        {delta}
      </span>
    )}
  </div>
));
Chip.displayName = 'Chip';

const LiveKPIStream = memo(function LiveKPIStream() {
  const doubled = [...METRICS, ...METRICS];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Edge fade masks */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 64,
          background: 'linear-gradient(to right, var(--bg-base), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 64,
          background: 'linear-gradient(to left, var(--bg-base), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{
          display: 'flex',
          gap: '0.5rem',
          width: 'max-content',
          padding: '0.25rem 0',
        }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {doubled.map((chip, i) => (
          <Chip key={i} {...chip} />
        ))}
      </motion.div>
    </div>
  );
});

export default LiveKPIStream;
