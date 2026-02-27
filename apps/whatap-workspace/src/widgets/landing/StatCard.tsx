import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  colorVar: string;
  delay?: number;
}

export function StatCard({ icon, value, label, colorVar, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ scale: 1.04 }}
      className='relative rounded-lg p-[1px] group'
      style={{
        background: `conic-gradient(from var(--stat-angle, 0deg), rgba(255,255,255,0.2) 0%, color-mix(in srgb, var(${colorVar}) 20%, transparent) 25%, rgba(255,255,255,0.2) 50%, color-mix(in srgb, var(${colorVar}) 20%, transparent) 75%, rgba(255,255,255,0.2) 100%)`,
        animation: 'stat-border-spin 6s linear infinite',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className='relative backdrop-blur-sm rounded-lg px-4 py-4 flex flex-col items-center gap-2 overflow-hidden transition-shadow duration-500'
        style={{
          background: 'var(--background)',
          borderRadius: 'calc(var(--radius-lg) - 1px)',
          boxShadow: `0 0 0 0 var(${colorVar})`,
        }}
      >
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'
          style={{
            background: `radial-gradient(ellipse at 50% 0%, var(${colorVar}) 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
        <div className='relative z-10 flex flex-col items-center gap-2'>
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            {icon}
          </motion.div>
          <span
            className='text-foreground'
            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' as unknown as number }}
          >
            {value}
          </span>
          <span className='text-muted-foreground' style={{ fontSize: 'var(--text-xs)' }}>
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
