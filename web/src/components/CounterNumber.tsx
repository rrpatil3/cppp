'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
  formatter?: (v: number) => string;
}

export default function CounterNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1200,
  style,
  className,
  formatter,
}: CounterNumberProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  const formatted = formatter ? formatter(display) : display.toLocaleString('en-US');

  return (
    <span style={style} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
