import { useState, useEffect, useRef } from 'react';

export function useAnimatedCount(target, duration = 1200) {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);
  const animationRef = useRef(null);

  useEffect(() => {
    const start = prevTarget.current;
    const end = target;
    prevTarget.current = target;

    if (start === end) return;

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [target, duration]);

  return current;
}
