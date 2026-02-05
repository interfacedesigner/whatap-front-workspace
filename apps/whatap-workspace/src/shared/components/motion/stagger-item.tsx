import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface StaggerItemProps {
  children: ReactNode;
  direction?: 'up' | 'left' | 'right';
  distance?: number;
  className?: string;
  scale?: boolean;
  rotate?: number;
}

export function StaggerItem({
  children,
  direction = 'up',
  distance = 60,
  className,
  scale = true,
  rotate = 0,
}: StaggerItemProps) {
  const shouldReduce = useReducedMotion();

  const d = shouldReduce ? 0 : distance;

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: shouldReduce ? 1 : 0,
          y: direction === 'up' ? d : 0,
          x: direction === 'left' ? d : direction === 'right' ? -d : 0,
          scale: scale && !shouldReduce ? 0.92 : 1,
          rotate: shouldReduce ? 0 : rotate,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotate: 0,
          transition: {
            duration: shouldReduce ? 0 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
