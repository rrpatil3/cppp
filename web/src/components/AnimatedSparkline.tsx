'use client';

import { useEffect, useRef } from 'react';

interface SparklinePoint {
  value: number;
}

interface AnimatedSparklineProps {
  data?: SparklinePoint[];
  height?: number;
  color?: string;
}

function generatePlaceholder(): SparklinePoint[] {
  const pts: SparklinePoint[] = [];
  let v = 100;
  for (let i = 0; i < 30; i++) {
    v = v + (Math.random() - 0.45) * 8;
    pts.push({ value: Math.max(60, v) });
  }
  return pts;
}

export default function AnimatedSparkline({ data, height = 60, color = 'var(--green)' }: AnimatedSparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const points = data && data.length > 1 ? data : generatePlaceholder();

  const min = Math.min(...points.map(p => p.value));
  const max = Math.max(...points.map(p => p.value));
  const range = max - min || 1;
  const w = 600;
  const h = height;
  const padY = 4;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - padY - ((p.value - min) / range) * (h - padY * 2);
    return `${x},${y}`;
  });

  const d = `M ${coords.join(' L ')}`;

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = 'stroke-dashoffset 1.4s ease';
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });
  }, [d]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
