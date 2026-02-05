import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { CHART_HEX, SERVER_STATUSES, SPARKLINE_LABELS } from './constants';

function Sparkline({
  data,
  color,
  isInView,
  delay,
}: {
  data: number[];
  color: string;
  isInView: boolean;
  delay: number;
}) {
  const pathRef = useRef<SVGPolylineElement>(null);
  const [length, setLength] = useState(200);
  const shouldReduce = useReducedMotion();
  const noMotion = shouldReduce;

  const w = 80;
  const h = 28;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = 2 + ((maxVal - val) / range) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  useEffect(() => {
    if (pathRef.current) {
      // Approximate polyline length
      let totalLength = 0;
      const pts = data.map((val, i) => ({
        x: (i / (data.length - 1)) * w,
        y: 2 + ((maxVal - val) / range) * (h - 4),
      }));
      for (let i = 1; i < pts.length; i++) {
        const curr = pts[i]!;
        const prev = pts[i - 1]!;
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
      setLength(totalLength);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className='w-full h-7'>
      <motion.polyline
        ref={pathRef}
        points={points}
        fill='none'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeDasharray={length}
        strokeDashoffset={noMotion ? 0 : length}
        animate={isInView ? { strokeDashoffset: 0 } : {}}
        transition={{
          duration: noMotion ? 0 : 1,
          delay: noMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}

function ServerStatusGrid({ isInView }: { isInView: boolean }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: shouldReduce ? 0 : 0.5, delay: shouldReduce ? 0 : 1.5 }}
      className='bg-white/80 border border-[#adadad]/20 rounded px-2 py-1.5'
    >
      <span className='text-[7px] text-[#757575] uppercase tracking-wider font-medium'>Servers</span>
      <div className='grid grid-cols-3 gap-x-2 gap-y-1 mt-1'>
        {SERVER_STATUSES.map((server, idx) => (
          <div key={server.name} className='flex items-center gap-1'>
            <motion.div
              animate={
                isInView && !shouldReduce
                  ? {
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.6, 1],
                    }
                  : {}
              }
              transition={{
                duration: server.status === 'warning' ? 1.5 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.1,
              }}
              className='w-1.5 h-1.5 rounded-full shrink-0'
              style={{
                backgroundColor: server.status === 'healthy' ? CHART_HEX.green : CHART_HEX.amber,
              }}
            />
            <span className='text-[7px] text-[#757575] truncate'>{server.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface SparklineRowProps {
  sparklines: number[][];
  isInView: boolean;
}

export function SparklineRow({ sparklines, isInView }: SparklineRowProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: shouldReduce ? 0 : 0.5, delay: shouldReduce ? 0 : 1.2 }}
      className='grid grid-cols-4 gap-2 px-3 pb-2.5'
    >
      {SPARKLINE_LABELS.map((item, i) => (
        <div key={item.label} className='bg-white/80 border border-[#adadad]/20 rounded px-2 py-1.5'>
          <div className='flex items-center justify-between mb-0.5'>
            <span className='text-[7px] text-[#757575] uppercase tracking-wider font-medium'>{item.label}</span>
            <span className='text-[9px] font-bold text-[#222]'>{item.value}</span>
          </div>
          <Sparkline data={sparklines[i] ?? []} color={item.color} isInView={isInView} delay={1.3 + i * 0.15} />
        </div>
      ))}
      <ServerStatusGrid isInView={isInView} />
    </motion.div>
  );
}
