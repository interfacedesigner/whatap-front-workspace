import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  scale?: boolean;
  rotate?: number;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 60,
  once = true,
  className,
  scale = false,
  rotate = 0,
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion();

  const effectiveDistance = shouldReduce ? 0 : distance;

  const initial = {
    opacity: shouldReduce ? 1 : 0,
    y: direction === 'up' ? effectiveDistance : direction === 'down' ? -effectiveDistance : 0,
    x: direction === 'left' ? effectiveDistance : direction === 'right' ? -effectiveDistance : 0,
    scale: scale && !shouldReduce ? 0.9 : 1,
    rotate: shouldReduce ? 0 : rotate,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration: shouldReduce ? 0 : duration,
        delay: shouldReduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
