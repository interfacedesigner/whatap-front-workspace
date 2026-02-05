import { animate, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect } from 'react';

export function useAnimatedCounter(
  target: number,
  duration: number = 1.5,
  decimals: number = 0,
  isInView: boolean = false,
) {
  const shouldReduce = useReducedMotion();
  const motionValue = useMotionValue(shouldReduce ? target : 0);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    if (shouldReduce) {
      motionValue.set(target);
      return;
    }
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [isInView, target, duration, shouldReduce, motionValue]);

  const display = useTransform(motionValue, (v) => {
    if (decimals === 0 && target >= 1000) {
      return Math.round(v).toLocaleString();
    }
    return v.toFixed(decimals);
  });

  return display;
}
