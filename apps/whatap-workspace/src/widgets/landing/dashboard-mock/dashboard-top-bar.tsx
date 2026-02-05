import { Activity } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { CHART_HEX } from './constants';

const TIME_RANGES = ['1h', '6h', '24h', '7d'];

export function DashboardTopBar({ isInView }: { isInView: boolean }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: shouldReduce ? 0 : 0.5, delay: shouldReduce ? 0 : 0.3 }}
      className='flex items-center justify-between px-3 py-2 bg-[#296cf2]/[0.04] border-b border-[#adadad]/20'
    >
      {/* Left: Logo + Title */}
      <div className='flex items-center gap-1.5'>
        <Activity className='w-3.5 h-3.5 text-[#296cf2]' />
        <span className='text-[10px] font-semibold text-[#222]'>Observability Dashboard</span>
      </div>

      {/* Center: Time Range */}
      <div className='flex items-center gap-0.5'>
        {TIME_RANGES.map((range) => (
          <span
            key={range}
            className={`text-[8px] px-1.5 py-0.5 rounded ${
              range === '24h' ? 'bg-[#296cf2] text-white font-medium' : 'text-[#757575] hover:text-[#222]'
            }`}
          >
            {range}
          </span>
        ))}
      </div>

      {/* Right: Status Indicators */}
      <div className='flex items-center gap-2.5'>
        <div className='flex items-center gap-1'>
          <motion.div
            animate={isInView && !shouldReduce ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className='w-1.5 h-1.5 rounded-full'
            style={{ backgroundColor: CHART_HEX.green }}
          />
          <span className='text-[8px] text-[#757575]'>3 Healthy</span>
        </div>
        <div className='flex items-center gap-1'>
          <motion.div
            animate={isInView && !shouldReduce ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            className='w-1.5 h-1.5 rounded-full'
            style={{ backgroundColor: CHART_HEX.amber }}
          />
          <span className='text-[8px] text-[#757575]'>1 Warning</span>
        </div>
      </div>
    </motion.div>
  );
}
