import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { CHART_HEX } from './constants';
import { useAnimatedCounter } from './use-animated-counter';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  decimals: number;
  trend: 'up' | 'down' | 'stable';
  index: number;
  isInView: boolean;
}

const trendConfig = {
  up: { Icon: TrendingUp, color: CHART_HEX.green },
  down: { Icon: TrendingDown, color: CHART_HEX.red },
  stable: { Icon: Minus, color: CHART_HEX.amber },
} as const;

export function MetricCard({ label, value, unit, decimals, trend, index, isInView }: MetricCardProps) {
  const shouldReduce = useReducedMotion();
  const display = useAnimatedCounter(value, 1.5, decimals, isInView);
  const { Icon, color } = trendConfig[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: shouldReduce ? 0 : 0.5,
        delay: shouldReduce ? 0 : 0.5 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className='bg-white/80 border border-[#adadad]/20 rounded px-2.5 py-2'
    >
      <div className='flex items-center justify-between mb-1'>
        <span className='text-[8px] text-[#757575] uppercase tracking-wide'>{label}</span>
        <Icon className='w-2.5 h-2.5' style={{ color }} />
      </div>
      <div className='flex items-baseline gap-0.5'>
        <motion.span className='text-[16px] font-bold text-[#222] leading-none tabular-nums'>{display}</motion.span>
        <span className='text-[8px] text-[#757575]'>{unit}</span>
      </div>
    </motion.div>
  );
}
