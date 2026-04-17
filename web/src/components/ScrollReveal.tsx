'use client';

import { useEffect } from 'react';

/**
 * Enhanced scroll reveal — handles four animation variants:
 *   .reveal        → fade + lift + blur
 *   .reveal-left   → fade + slide from left + blur
 *   .reveal-right  → fade + slide from right + blur
 *   .reveal-scale  → fade + scale up + blur
 *   .reveal-fade   → fade only
 *
 * All become visible when 12% of the element enters the viewport.
 * Add stagger via CSS delay classes: .d0 through .d12
 */
export default function ScrollReveal() {
  useEffect(() => {
    const SELECTORS = [
      '.reveal',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale',
      '.reveal-fade',
    ].join(', ');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(SELECTORS).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
