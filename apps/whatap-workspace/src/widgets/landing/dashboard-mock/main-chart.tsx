import { motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CHART_HEX } from './constants';

const W = 800;
const H = 200;
const PAD = 20;
const PAD_LEFT = 35;
const HOURS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const Y_LABELS = ['15k', '10k', '5k', '0'];

function dataToSmoothPath(data: number[], width: number, height: number, padLeft: number, padY: number): string {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const chartW = width - padLeft;

  const points = data.map((val, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    y: padY + ((maxVal - val) / range) * (height - padY * 2),
  }));

  if (points.length === 0) {
    return '';
  }
  const firstPoint = points[0]!;
  let d = `M ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function makeAreaPath(linePath: string, width: number, height: number, padLeft: number): string {
  return `${linePath} L ${width} ${height - PAD} L ${padLeft} ${height - PAD} Z`;
}

interface MainChartProps {
  data: number[];
  secondaryData: number[];
  isInView: boolean;
  reducedMotion: boolean;
}

export function MainChart({ data, secondaryData, isInView, reducedMotion }: MainChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(2000);
  const [path2Length, setPath2Length] = useState(2000);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorValue, setCursorValue] = useState('12.4k');
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const shouldReduce = useReducedMotion();
  const noMotion = reducedMotion || shouldReduce;

  const linePath = dataToSmoothPath(data, W, H, PAD_LEFT, PAD);
  const areaPath = makeAreaPath(linePath, W, H, PAD_LEFT);
  const secondaryPath = dataToSmoothPath(secondaryData, W, H, PAD_LEFT, PAD);

  // Calculate data value at a given position
  const getValueAtPosition = useCallback(
    (progress: number) => {
      const index = progress * (data.length - 1);
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.min(lowerIndex + 1, data.length - 1);
      const t = index - lowerIndex;
      const value = data[lowerIndex]! * (1 - t) + data[upperIndex]! * t;
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toFixed(0);
    },
    [data],
  );

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
    if (path2Ref.current) {
      setPath2Length(path2Ref.current.getTotalLength());
    }
  }, []);

  // Animate cursor along the path
  useEffect(() => {
    if (noMotion || !isInView || !pathRef.current) {
      return;
    }

    const pathElement = pathRef.current;
    const totalLength = pathElement.getTotalLength();
    const animationDuration = 10000; // 10 seconds for full cycle
    const initialDelay = 3000; // Wait for line drawing animation

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < initialDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const animationElapsed = elapsed - initialDelay;
      // Ping-pong animation: go forward then backward
      const cycleTime = animationElapsed % (animationDuration * 2);
      let progress: number;
      if (cycleTime < animationDuration) {
        // Going forward
        progress = cycleTime / animationDuration;
      } else {
        // Going backward
        progress = 1 - (cycleTime - animationDuration) / animationDuration;
      }

      // Add easing for smoother movement
      const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const point = pathElement.getPointAtLength(easedProgress * totalLength);
      setCursorPos({ x: point.x, y: point.y });
      setCursorValue(getValueAtPosition(easedProgress));

      animationRef.current = requestAnimationFrame(animate);
    };

    // Set initial position
    const initialPoint = pathElement.getPointAtLength(0);
    setCursorPos({ x: initialPoint.x, y: initialPoint.y });
    setCursorValue(getValueAtPosition(0));

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [noMotion, isInView, getValueAtPosition]);

  const chartW = W - PAD_LEFT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: noMotion ? 0 : 0.5, delay: noMotion ? 0 : 0.6 }}
      className='w-full h-full bg-white/60 rounded border border-[#adadad]/15 overflow-hidden'
    >
      <div className='flex items-center justify-between px-2.5 pt-1.5'>
        <span className='text-[9px] font-medium text-[#222]'>Request Throughput</span>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-[2px] rounded' style={{ backgroundColor: CHART_HEX.primary }} />
            <span className='text-[7px] text-[#757575]'>Requests</span>
          </div>
          <div className='flex items-center gap-1'>
            <div
              className='w-3 h-[2px] rounded'
              style={{
                backgroundColor: CHART_HEX.secondary,
                opacity: 0.6,
              }}
            />
            <span className='text-[7px] text-[#757575]'>Avg</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio='none' className='w-full h-[calc(100%-20px)]'>
        <defs>
          <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={CHART_HEX.primary} stopOpacity={0.25} />
            <stop offset='100%' stopColor={CHART_HEX.primary} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PAD_LEFT}
            y1={PAD + ratio * (H - PAD * 2)}
            x2={W}
            y2={PAD + ratio * (H - PAD * 2)}
            stroke='#adadad'
            strokeOpacity={0.15}
            strokeDasharray='3 3'
          />
        ))}

        {/* Y-axis labels */}
        {Y_LABELS.map((label, i) => (
          <text
            key={label}
            x={PAD_LEFT - 4}
            y={PAD + (i / (Y_LABELS.length - 1)) * (H - PAD * 2) + 3}
            textAnchor='end'
            fill='#adadad'
            fontSize={8}
          >
            {label}
          </text>
        ))}

        {/* X-axis labels */}
        {HOURS.map((label, i) => (
          <text
            key={label}
            x={PAD_LEFT + (i / (HOURS.length - 1)) * chartW}
            y={H - 4}
            textAnchor='middle'
            fill='#adadad'
            fontSize={7}
          >
            {label}
          </text>
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill='url(#areaGrad)'
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: noMotion ? 0 : 1.5, delay: noMotion ? 0 : 1.2 }}
        />

        {/* Secondary line (dashed avg) */}
        <motion.path
          ref={path2Ref}
          d={secondaryPath}
          fill='none'
          stroke={CHART_HEX.secondary}
          strokeWidth={1.5}
          strokeOpacity={0.5}
          strokeDasharray={noMotion ? '4 4' : `${path2Length}`}
          strokeDashoffset={noMotion ? 0 : path2Length}
          animate={isInView ? { strokeDashoffset: 0, strokeDasharray: '4 4' } : {}}
          transition={{
            strokeDashoffset: {
              duration: noMotion ? 0 : 2,
              delay: noMotion ? 0 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            },
            strokeDasharray: {
              delay: noMotion ? 0 : 2.8,
              duration: 0,
            },
          }}
        />

        {/* Primary line */}
        <motion.path
          ref={pathRef}
          d={linePath}
          fill='none'
          stroke={CHART_HEX.primary}
          strokeWidth={2}
          strokeLinecap='round'
          strokeDasharray={pathLength}
          strokeDashoffset={noMotion ? 0 : pathLength}
          animate={isInView ? { strokeDashoffset: 0 } : {}}
          transition={{
            duration: noMotion ? 0 : 2.2,
            delay: noMotion ? 0 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Animated cursor following the path */}
        {!noMotion && isInView && cursorPos.x > 0 && (
          <g
            style={{
              transform: `translateX(${cursorPos.x - PAD_LEFT}px)`,
              transformOrigin: '50% 50%',
              transformBox: 'fill-box' as const,
            }}
          >
            {/* Vertical guide line */}
            <line
              x1={PAD_LEFT}
              y1={PAD}
              x2={PAD_LEFT}
              y2={H - PAD}
              stroke={CHART_HEX.primary}
              strokeOpacity={0.3}
              strokeWidth={1}
            />
            {/* Cursor point on the path */}
            <circle cx={PAD_LEFT} cy={cursorPos.y} r={3.5} fill='white' stroke={CHART_HEX.primary} strokeWidth={2} />
            {/* Tooltip with dynamic value */}
            <rect
              x={PAD_LEFT - 18}
              y={cursorPos.y - 18}
              width={36}
              height={14}
              rx={3}
              fill={CHART_HEX.primary}
              opacity={0.9}
            />
            <text x={PAD_LEFT} y={cursorPos.y - 9} textAnchor='middle' fill='white' fontSize={7} fontWeight='bold'>
              {cursorValue}
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
