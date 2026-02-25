import { AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

interface EventTracingOverlayProps {
  isInView: boolean;
  isActive: boolean;
}

type TracingPhase = 'idle' | 'alert' | 'scanning' | 'found' | 'resolved';

export function EventTracingOverlay({ isInView, isActive }: EventTracingOverlayProps) {
  const [phase, setPhase] = useState<TracingPhase>('idle');
  const shouldReduce = useReducedMotion();
  const noMotion = shouldReduce;

  const runTracingSequence = useCallback(() => {
    if (noMotion) {
      return;
    }

    // Phase 1: Alert appears (0ms)
    setPhase('alert');

    // Phase 2: Scanning starts (1500ms)
    setTimeout(() => setPhase('scanning'), 1500);

    // Phase 3: Root cause found (3000ms)
    setTimeout(() => setPhase('found'), 3000);

    // Phase 4: Resolved (5500ms)
    setTimeout(() => setPhase('resolved'), 5500);

    // Phase 5: Reset (7500ms)
    setTimeout(() => {
      setPhase('idle');
    }, 7500);
  }, [noMotion]);

  useEffect(() => {
    if (!isInView || !isActive || noMotion) {
      return;
    }

    // Initial delay before first sequence
    const initialDelay = setTimeout(() => {
      runTracingSequence();
    }, 5000);

    // Repeat every 12 seconds
    const interval = setInterval(() => {
      runTracingSequence();
    }, 12000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isInView, isActive, noMotion, runTracingSequence]);

  if (noMotion || phase === 'idle') {
    return null;
  }

  return (
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      {/* Alert notification */}
      <AnimatePresence>
        {(phase === 'alert' || phase === 'scanning') && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className='absolute top-12 right-3 z-20'
          >
            <div className='flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 shadow-lg'>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                <AlertTriangle className='w-3.5 h-3.5 text-amber-500' />
              </motion.div>
              <div className='flex flex-col'>
                <span className='text-[8px] font-semibold text-amber-700'>High Latency Detected</span>
                <span className='text-[7px] text-amber-600'>api-01 · 847ms avg</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning indicator */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 z-10'
          >
            {/* Scanning wave effect */}
            <motion.div
              animate={{
                scaleY: [1, 1.02, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className='absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-transparent'
            />
            {/* Search icon */}
            <motion.div
              animate={{ y: [0, 5, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='absolute top-1/3 left-1/2 -translate-x-1/2'
            >
              <div className='bg-white rounded-full p-1.5 shadow-md border border-gray-200'>
                <Search className='w-3 h-3 text-amber-500' />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root cause found */}
      <AnimatePresence>
        {phase === 'found' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
            className='absolute bottom-20 right-6 z-20'
          >
            <div className='bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[180px]'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center'>
                  <AlertTriangle className='w-3 h-3 text-amber-600' />
                </div>
                <span className='text-[9px] font-semibold text-gray-800'>Root Cause Found</span>
              </div>
              <div className='space-y-1.5 pl-1'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-1.5 h-1.5 rounded-full bg-amber-400' />
                  <span className='text-[7px] text-gray-600'>
                    Server: <span className='font-medium text-gray-800'>api-01</span>
                  </span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-1.5 h-1.5 rounded-full bg-amber-400' />
                  <span className='text-[7px] text-gray-600'>
                    Issue: <span className='font-medium text-gray-800'>DB Connection Pool</span>
                  </span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-1.5 h-1.5 rounded-full bg-amber-400' />
                  <span className='text-[7px] text-gray-600'>
                    Duration: <span className='font-medium text-gray-800'>12m 34s</span>
                  </span>
                </div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.5 }}
                className='h-0.5 bg-gradient-to-r from-amber-400 to-green-400 rounded mt-2'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resolved state */}
      <AnimatePresence>
        {phase === 'resolved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
              className='flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 shadow-xl'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className='w-5 h-5 text-green-500' />
              </motion.div>
              <div className='flex flex-col'>
                <span className='text-[10px] font-semibold text-green-700'>Issue Identified & Traced</span>
                <span className='text-[8px] text-green-600'>Time to resolution: 2.3s</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlight on api-01 server */}
      <AnimatePresence>
        {phase === 'found' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute bottom-[52px] right-[88px] z-15'
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(245, 158, 11, 0)',
                  '0 0 0 4px rgba(245, 158, 11, 0.3)',
                  '0 0 0 0 rgba(245, 158, 11, 0)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='w-[70px] h-[18px] rounded border-2 border-amber-400 bg-amber-50/50'
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
