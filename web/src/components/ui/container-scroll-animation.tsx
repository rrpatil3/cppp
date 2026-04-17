'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, type MotionValue } from 'framer-motion';

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Find the nearest scrollable parent (handles Next.js layout with overflow-y:auto)
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      if (!el || el === document.body) return null;
      const { overflowY } = window.getComputedStyle(el);
      if (overflowY === 'auto' || overflowY === 'scroll') return el;
      return findScrollParent(el.parentElement);
    };
    const parent = findScrollParent(containerRef.current?.parentElement ?? null);
    scrollParentRef.current = parent;
    setScrollParent(parent);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollParent ? (scrollParentRef as React.RefObject<HTMLElement>) : undefined,
    offset: ['start 0.8', 'end 0.2'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      className="h-[50rem] md:h-[70rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: '1000px' }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center mb-4">
    {titleComponent}
  </motion.div>
);

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a',
    }}
    className="max-w-5xl -mt-12 mx-auto h-[28rem] md:h-[38rem] w-full border-2 border-[#2A2A2A] p-2 md:p-4 bg-[#111] rounded-[24px] shadow-2xl"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#0A0A0A]">
      {children}
    </div>
  </motion.div>
);
