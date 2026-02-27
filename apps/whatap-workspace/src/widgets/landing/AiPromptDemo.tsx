import { CheckCircle, Loader2, Send, Sparkles, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

interface DemoStep {
  prompt: string;
  response: string[];
  status?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    prompt: 'Analyze CPU spike on prod-server-03',
    response: [
      'Scanning metrics for prod-server-03...',
      'Root cause: Memory leak in node process (PID 2847)',
      'Incident type: Resource Saturation — exceeded P95 baseline',
    ],
    status: 'ActionBook triggered → auto-restart + cascade rollback ready',
  },
  {
    prompt: 'Show P1 incidents from the last 24h',
    response: [
      'Found 2 P1 incidents across 47 monitored hosts',
      '1. DB pool exhaustion (Wide Impact, 12 hosts) — MTTR: 47s',
      '2. API 5xx surge (Escalation, sev 3→5) — auto-remediated',
    ],
    status: 'Average MTTR: 38s — 94% faster than manual baseline',
  },
  {
    prompt: 'Run rollback on payment-svc deploy v2.4.1',
    response: [
      'Loading ActionBook: payment-svc-rollback-v2.4.1',
      'Step 1/3: Draining traffic from canary (2 pods) — done',
      'Step 2/3: Reverting image tag to v2.3.9 — rollout complete',
    ],
    status: 'Cascade rollback succeeded — all 3 steps verified healthy',
  },
];

const TYPING_SPEED = 30;
const LINE_TYPING_SPEED = 15;
const RESPONSE_LINE_DELAY = 400;
const STATUS_DELAY = 400;
const PAUSE_BETWEEN_STEPS = 3000;

interface TypedLine {
  fullText: string;
  typedText: string;
  isComplete: boolean;
}

export function AiPromptDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [typedLines, setTypedLines] = useState<TypedLine[]>([]);
  const [statusText, setStatusText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'responding' | 'done'>('typing');

  const safeIndex = stepIndex % DEMO_STEPS.length;
  const currentStep = DEMO_STEPS[safeIndex]!;

  useEffect(() => {
    if (phase !== 'typing') {
      return;
    }
    setTypedPrompt('');
    setTypedLines([]);
    setStatusText('');

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTypedPrompt(currentStep.prompt.slice(0, i));
      if (i >= currentStep.prompt.length) {
        clearInterval(iv);
        setTimeout(() => setPhase('thinking'), 300);
      }
    }, TYPING_SPEED);

    return () => clearInterval(iv);
  }, [phase, stepIndex, currentStep.prompt]);

  useEffect(() => {
    if (phase !== 'thinking') {
      return;
    }
    const t = setTimeout(() => setPhase('responding'), 500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'responding') {
      return;
    }
    const responses = [...currentStep.response];
    let lineIdx = 0;

    const showNextLine = () => {
      if (lineIdx >= responses.length) {
        if (currentStep.status) {
          setTimeout(() => {
            setStatusText(currentStep.status!);
            setPhase('done');
          }, STATUS_DELAY);
        } else {
          setPhase('done');
        }
        return;
      }

      const fullText = responses[lineIdx]!;
      setTypedLines((prev) => [...prev, { fullText, typedText: '', isComplete: false }]);

      const currentLineIndex = lineIdx;
      lineIdx++;

      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx++;
        setTypedLines((prev) => {
          const updated = [...prev];
          if (updated[currentLineIndex]) {
            updated[currentLineIndex].typedText = fullText.slice(0, charIdx);
            if (charIdx >= fullText.length) {
              updated[currentLineIndex].isComplete = true;
            }
          }
          return updated;
        });

        if (charIdx >= fullText.length) {
          clearInterval(typeInterval);
          setTimeout(showNextLine, RESPONSE_LINE_DELAY);
        }
      }, LINE_TYPING_SPEED);
    };

    showNextLine();
  }, [phase, currentStep]);

  const advance = useCallback(() => {
    setPhase('typing');
    setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
  }, []);

  useEffect(() => {
    if (phase !== 'done') {
      return;
    }
    const t = setTimeout(advance, PAUSE_BETWEEN_STEPS);
    return () => clearTimeout(t);
  }, [phase, advance]);

  return (
    <div
      className='w-full max-w-[520px] overflow-hidden text-left'
      style={{
        background: 'color-mix(in srgb, var(--foreground) 5%, transparent)',
        border: '1px solid color-mix(in srgb, var(--border) 10%, transparent)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className='flex items-center gap-2 px-4'
        style={{
          height: '36px',
          borderBottom: '1px solid color-mix(in srgb, var(--border) 10%, transparent)',
        }}
      >
        <Terminal size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <span
          style={{
            color: 'var(--primary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)' as unknown as number,
            letterSpacing: '0.6px',
          }}
        >
          OpsGent AI Terminal
        </span>
        <div className='ml-auto flex items-center gap-1.5'>
          {phase === 'thinking' && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={10} style={{ color: 'var(--primary)' }} />
            </motion.div>
          )}
          <div
            className='rounded-full'
            style={{ width: '6px', height: '6px', backgroundColor: 'var(--chart-2)', opacity: 0.8 }}
          />
          <span
            style={{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)' as unknown as number,
              opacity: 0.7,
            }}
          >
            {phase === 'thinking' ? 'analyzing' : 'connected'}
          </span>
        </div>
      </div>

      <div className='px-4 py-3 flex flex-col gap-2.5' style={{ height: '210px' }}>
        <div
          className='flex items-center gap-2 px-3'
          style={{
            height: '36px',
            minHeight: '36px',
            background: 'color-mix(in srgb, var(--foreground) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--border) 8%, transparent)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--chart-3)', flexShrink: 0 }} />
          <span
            className='flex-1'
            style={{
              color: 'var(--foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)' as unknown as number,
              lineHeight: '36px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {typedPrompt}
            {phase === 'typing' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className='inline-block'
                style={{ color: 'var(--primary)', width: 0, overflow: 'visible' }}
              >
                |
              </motion.span>
            )}
          </span>
          <motion.div animate={phase !== 'typing' ? { scale: [1, 0.9, 1] } : {}} transition={{ duration: 0.3 }}>
            <Send
              size={12}
              style={{ color: phase !== 'typing' ? 'var(--primary)' : 'var(--muted-foreground)', flexShrink: 0 }}
            />
          </motion.div>
        </div>

        <AnimatePresence mode='popLayout'>
          {typedLines.map((line, i) => (
            <motion.div
              key={`${stepIndex}-line-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='flex items-start gap-2'
            >
              <span
                style={{
                  color: 'var(--chart-1)',
                  fontSize: 'var(--text-xs)',
                  lineHeight: '1.5',
                  marginTop: '1px',
                  flexShrink: 0,
                }}
              >
                &gt;
              </span>
              <span
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)' as unknown as number,
                  lineHeight: '1.5',
                  opacity: 0.8,
                }}
              >
                {line.typedText}
                {!line.isComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ color: 'var(--chart-1)' }}
                  >
                    |
                  </motion.span>
                )}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {statusText && (
            <motion.div
              key={`${stepIndex}-status`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className='flex items-center gap-1.5 px-2.5 py-1.5'
              style={{
                background: 'color-mix(in srgb, var(--chart-2) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--chart-2) 20%, transparent)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <CheckCircle size={12} style={{ color: 'var(--chart-2)', flexShrink: 0 }} />
              <span
                style={{
                  color: 'var(--chart-2)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)' as unknown as number,
                }}
              >
                {statusText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
