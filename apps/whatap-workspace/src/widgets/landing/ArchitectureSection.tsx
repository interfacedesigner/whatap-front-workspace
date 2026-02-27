import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle2,
  Code2,
  GitBranch,
  Lock,
  RotateCcw,
  Server,
  Shield,
  ShieldAlert,
  Undo2,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/* ================================================================
   Architecture Diagram Types & Data
   ================================================================ */

interface PipelineNode {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  colorVar: string; /* CSS var name, e.g. '--chart-1' */
  tailwindColor: string; /* Tailwind class prefix, e.g. 'chart-1' */
}

const PIPELINE: PipelineNode[] = [
  {
    id: 'monitor',
    icon: <Server size={20} />,
    title: 'Monitoring',
    subtitle: 'Yard Agents',
    colorVar: '--chart-1',
    tailwindColor: 'chart-1',
  },
  {
    id: 'event',
    icon: <Activity size={20} />,
    title: 'Event Pipeline',
    subtitle: 'Dynamic Baselines',
    colorVar: '--chart-4',
    tailwindColor: 'chart-4',
  },
  {
    id: 'incident',
    icon: <ShieldAlert size={20} />,
    title: 'Incident Engine',
    subtitle: '5-Type Classifier',
    colorVar: '--chart-2',
    tailwindColor: 'chart-2',
  },
  {
    id: 'action',
    icon: <Brain size={20} />,
    title: 'ActionBook',
    subtitle: 'AI Remediation',
    colorVar: '--chart-3',
    tailwindColor: 'chart-3',
  },
];

interface OutputNode {
  id: string;
  icon: ReactNode;
  label: string;
  colorVar: string;
  tailwindColor: string;
}

const OUTPUTS: OutputNode[] = [
  {
    id: 'notify',
    icon: <Bell size={16} />,
    label: 'NotiServer',
    colorVar: '--chart-5',
    tailwindColor: 'chart-5',
  },
  {
    id: 'rollback',
    icon: <Undo2 size={16} />,
    label: 'Cascade Rollback',
    colorVar: '--primary',
    tailwindColor: 'primary',
  },
];

/* ---------- Flowing Particle ---------- */

function FlowingParticle({ colorVar, delay, duration }: { colorVar: string; delay: number; duration: number }) {
  return (
    <motion.div
      className='absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none'
      style={{
        width: 6,
        height: 6,
        backgroundColor: `var(${colorVar})`,
        boxShadow: `0 0 8px var(${colorVar})`,
      }}
      initial={{ left: '-4px', opacity: 0 }}
      animate={{
        left: ['0%', '100%'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

/* ---------- Connection Line ---------- */

function ConnectionLine({ colorVar, vertical = false }: { colorVar: string; vertical?: boolean }) {
  return (
    <div
      className={`relative ${vertical ? 'w-px' : 'h-px'} overflow-visible`}
      style={{
        background: `linear-gradient(${vertical ? '180deg' : '90deg'}, var(${colorVar}), color-mix(in srgb, var(${colorVar}) 30%, transparent))`,
        opacity: 0.35,
        ...(vertical ? { height: '100%' } : { flex: 1, minWidth: 16 }),
      }}
    >
      {/* Flowing particles */}
      {!vertical && (
        <>
          <FlowingParticle colorVar={colorVar} delay={0} duration={2} />
          <FlowingParticle colorVar={colorVar} delay={0.8} duration={2} />
          <FlowingParticle colorVar={colorVar} delay={1.5} duration={2} />
        </>
      )}
      {vertical && (
        <motion.div
          className='absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none'
          style={{
            width: 5,
            height: 5,
            backgroundColor: `var(${colorVar})`,
            boxShadow: `0 0 6px var(${colorVar})`,
          }}
          initial={{ top: '0%', opacity: 0 }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

/* ---------- Pipeline Node Card ---------- */

function PipelineCard({ node, index, isActive }: { node: PipelineNode; index: number; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className='relative flex flex-col items-center shrink-0'
      style={{ width: 'clamp(110px, 18vw, 160px)' }}
    >
      {/* Glow ring */}
      <motion.div
        className='absolute rounded-full pointer-events-none'
        style={{
          width: 72,
          height: 72,
          top: -4,
          backgroundColor: `var(${node.colorVar})`,
          filter: 'blur(20px)',
        }}
        animate={isActive ? { opacity: [0.06, 0.14, 0.06] } : { opacity: 0.04 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Icon container */}
      <motion.div
        className='relative z-10 flex items-center justify-center rounded-xl border backdrop-blur-sm'
        style={{
          width: 64,
          height: 64,
          color: `var(${node.colorVar})`,
          borderColor: `color-mix(in srgb, var(${node.colorVar}) 25%, transparent)`,
          backgroundColor: `color-mix(in srgb, var(${node.colorVar}) 8%, transparent)`,
        }}
        animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {node.icon}
      </motion.div>

      {/* Label */}
      <span
        className='text-foreground mt-3 text-center'
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-bold)' as unknown as number,
          lineHeight: '1.3',
        }}
      >
        {node.title}
      </span>
      <span
        className='text-muted-foreground text-center mt-0.5'
        style={{
          fontSize: 'calc(var(--text-xs) * 0.9)',
          fontWeight: 'var(--font-weight-normal)' as unknown as number,
        }}
      >
        {node.subtitle}
      </span>
    </motion.div>
  );
}

/* ---------- Output Badge ---------- */

function OutputBadge({ node, delay }: { node: OutputNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className='flex items-center gap-2 px-3 py-1.5 rounded-md border backdrop-blur-sm'
      style={{
        color: `var(${node.colorVar})`,
        borderColor: `color-mix(in srgb, var(${node.colorVar}) 20%, transparent)`,
        backgroundColor: `color-mix(in srgb, var(${node.colorVar}) 6%, transparent)`,
      }}
    >
      {node.icon}
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-medium)' as unknown as number,
          color: `var(${node.colorVar})`,
        }}
      >
        {node.label}
      </span>
    </motion.div>
  );
}

/* ---------- Metric Sparkline ---------- */

function MetricSparkline({ colorVar, label }: { colorVar: string; label: string }) {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const generatePoints = () => {
      const pts: number[] = [];
      for (let i = 0; i < 12; i++) {
        pts.push(8 + Math.random() * 20);
      }
      return pts;
    };
    setPoints(generatePoints());
    const iv = setInterval(() => setPoints(generatePoints()), 3000);
    return () => clearInterval(iv);
  }, []);

  if (points.length === 0) {
    return null;
  }

  const width = 80;
  const height = 28;
  const stepX = width / (points.length - 1);
  const d = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - y}`).join(' ');

  return (
    <div className='flex flex-col items-center gap-1'>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className='overflow-visible'>
        <motion.path
          d={d}
          fill='none'
          stroke={`var(${colorVar})`}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <span
        className='text-muted-foreground'
        style={{
          fontSize: 'calc(var(--text-xs) * 0.8)',
          fontWeight: 'var(--font-weight-normal)' as unknown as number,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ================================================================
   Architecture Diagram
   ================================================================ */

function ArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  /* Cycle active node highlight */
  useEffect(() => {
    if (!isInView) {
      return;
    }
    const iv = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PIPELINE.length);
    }, 2200);
    return () => clearInterval(iv);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className='relative rounded-xl overflow-hidden border border-border/20 bg-card/5 backdrop-blur-sm'
    >
      {/* Ambient glow */}
      <div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] rounded-full pointer-events-none'
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 6%, transparent), transparent 70%)',
        }}
      />

      <div className='relative z-10 px-6 py-10 md:px-10 md:py-14'>
        {/* -- Main Pipeline Row (Desktop) -- */}
        <div className='hidden md:flex items-start justify-center'>
          {PIPELINE.map((node, i) => (
            <div key={node.id} className='flex items-start'>
              <PipelineCard node={node} index={i} isActive={activeIndex === i} />
              {i < PIPELINE.length - 1 && (
                <div
                  className='flex items-center mx-2 lg:mx-4'
                  style={{
                    width: 'clamp(32px, 6vw, 80px)',
                    height: 64,
                  }}
                >
                  <ConnectionLine colorVar={PIPELINE[i + 1]!.colorVar} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* -- Main Pipeline Column (Mobile) -- */}
        <div className='flex md:hidden flex-col items-center gap-0'>
          {PIPELINE.map((node, i) => (
            <div key={node.id} className='flex flex-col items-center'>
              <PipelineCard node={node} index={i} isActive={activeIndex === i} />
              {i < PIPELINE.length - 1 && (
                <div className='flex items-center justify-center my-2' style={{ height: 32 }}>
                  <ConnectionLine colorVar={PIPELINE[i + 1]!.colorVar} vertical />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* -- Output Branches -- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6'
        >
          <span
            className='text-muted-foreground'
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Outputs
          </span>
          <div className='flex items-center gap-3'>
            {OUTPUTS.map((out, i) => (
              <OutputBadge key={out.id} node={out} delay={0.7 + i * 0.15} />
            ))}
          </div>
        </motion.div>

        {/* -- Live Metric Sparklines -- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className='mt-8 flex items-center justify-center gap-6 sm:gap-10'
        >
          <MetricSparkline colorVar='--chart-1' label='CPU' />
          <MetricSparkline colorVar='--chart-4' label='Memory' />
          <MetricSparkline colorVar='--chart-2' label='Network' />
          <MetricSparkline colorVar='--chart-5' label='Disk I/O' />
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================
   ActionBook DeepDive
   ================================================================ */

interface Feature {
  id: string;
  title: string;
  icon: typeof Shield;
  tagline: string;
  description: string;
  codeExample?: {
    label: string;
    content: string;
  };
  benefits: string[];
}

const ACTIONBOOK_FEATURES: Feature[] = [
  {
    id: 'safe-dsl',
    title: 'Safe DSL',
    icon: Shield,
    tagline: 'Security-First Execution',
    description:
      'ActionBooks use a domain-specific language with built-in safety constraints. No raw shell commands — only pre-approved functions like restart_service(), scale_pods(), rollback_deploy().',
    codeExample: {
      label: 'Safe Function Library',
      content: `restart_service("api-gateway")
scale_pods("payment-svc", replicas=5)
rollback_deploy("auth-service", "v2.1.3")
drain_traffic(target="canary", percent=100)`,
    },
    benefits: [
      'Prevents accidental data loss or system corruption',
      'Auditable function calls with parameter validation',
      'No arbitrary code execution risk',
    ],
  },
  {
    id: 'what-how',
    title: 'What/How Separation',
    icon: GitBranch,
    tagline: 'Intent vs. Implementation',
    description:
      'Engineers define WHAT to achieve (restart unhealthy pods). OpsGent LLM generates HOW (specific kubectl commands, drainage logic, health checks). This abstraction prevents drift and ensures consistency.',
    codeExample: {
      label: 'Declarative Intent',
      content: `# What: Fix memory leak
intent: "Restart node process with PID leak"

# How: Generated by LLM
steps:
  1. identify_process(name="node", check="mem>2GB")
  2. drain_connections(graceful=30s)
  3. restart_service(pid_from_step_1)
  4. verify_health(endpoint="/health", expect=200)`,
    },
    benefits: [
      'Engineers focus on intent, not infrastructure syntax',
      'LLM adapts to environment changes automatically',
      'Consistent remediation across multi-cloud setups',
    ],
  },
  {
    id: 'approval-gate',
    title: 'Approval Gate',
    icon: Lock,
    tagline: 'Human-in-the-Loop for Critical Ops',
    description:
      'High-risk operations (production restarts, database migrations, payment service changes) pause execution until an admin reviews and approves. Slack/PagerDuty integration for instant notifications.',
    codeExample: {
      label: 'Gated Execution',
      content: `# Step requires approval
rollback_deploy("payment-svc", "v2.3.9")
  requires_approval: true
  approvers: ["ops-lead", "sre-oncall"]
  timeout: 15m

# Notification sent to Slack #ops-alerts
# Execution pauses until approved`,
    },
    benefits: [
      'Prevents automated changes to critical services',
      'Audit trail of who approved what and when',
      'Configurable approval policies per service tier',
    ],
  },
  {
    id: 'rollback',
    title: 'Built-in Rollback',
    icon: RotateCcw,
    tagline: 'Cascade Rollback on Failure',
    description:
      'If any step in an ActionBook fails, OpsGent automatically reverses all previous steps in reverse order. No half-applied changes. No manual cleanup. System returns to last known good state.',
    codeExample: {
      label: 'Automatic Rollback Flow',
      content: `Steps executed:
  ✓ 1. drain_traffic(canary) — success
  ✓ 2. deploy_image(v2.4.1) — success
  ✗ 3. verify_health() — FAILED (5xx errors)

Cascade rollback triggered:
  ← 2. revert_image(v2.3.9) — rolled back
  ← 1. restore_traffic(canary) — rolled back

System restored to v2.3.9 — incident auto-closed`,
    },
    benefits: [
      'Zero manual intervention on failure',
      'Guaranteed state consistency',
      'MTTR reduced by eliminating cleanup time',
    ],
  },
];

function ActionBookDeepDive() {
  const [activeTab, setActiveTab] = useState<string>(ACTIONBOOK_FEATURES[0]!.id);
  const activeFeature = (ACTIONBOOK_FEATURES.find((f) => f.id === activeTab) ?? ACTIONBOOK_FEATURES[0])!;

  return (
    <div className='mt-24'>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center gap-2 mb-4'>
          <Code2 size={18} className='text-primary' />
          <span
            className='text-primary'
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Deep Dive
          </span>
        </div>
        <h3
          style={{
            fontSize: 'clamp(var(--text-lg), 2.8vw, calc(var(--text-xl) * 1.3))',
            fontWeight: 'var(--font-weight-bold)' as unknown as number,
          }}
        >
          AI ActionBook{' '}
          <span
            className='bg-clip-text text-transparent'
            style={{
              backgroundImage: 'linear-gradient(180deg, var(--primary) 0%, var(--chart-3) 100%)',
              fontSize: 'inherit',
            }}
          >
            Engine
          </span>
        </h3>
        <p
          className='text-muted-foreground max-w-2xl mx-auto mt-4'
          style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
        >
          The brain of OpsGent. Generates safe, auditable remediation scripts with approval gates and automatic
          rollback. No raw shell access. No manual cleanup.
        </p>
      </motion.div>

      {/* Tab navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='flex flex-wrap justify-center gap-3 mb-10'
      >
        {ACTIONBOOK_FEATURES.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeTab === feature.id;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className='relative px-5 py-2.5 rounded-lg transition-all'
              style={{
                background: isActive
                  ? 'color-mix(in srgb, var(--primary) 15%, transparent)'
                  : 'color-mix(in srgb, var(--card) 5%, transparent)',
                border: isActive
                  ? '1px solid color-mix(in srgb, var(--primary) 30%, transparent)'
                  : '1px solid color-mix(in srgb, var(--border) 10%, transparent)',
                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              <div className='flex items-center gap-2'>
                <Icon size={16} />
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive
                      ? ('var(--font-weight-medium)' as unknown as number)
                      : ('var(--font-weight-normal)' as unknown as number),
                  }}
                >
                  {feature.title}
                </span>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Feature content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-8'
        >
          {/* Left: Description & Benefits */}
          <div className='bg-card/5 border border-border/10 rounded-xl p-8 backdrop-blur-sm'>
            <div className='flex items-start gap-3 mb-4'>
              <div
                className='p-2.5 rounded-lg'
                style={{
                  background: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
                }}
              >
                {(() => {
                  const Icon = activeFeature.icon;
                  return <Icon size={20} className='text-primary' />;
                })()}
              </div>
              <div>
                <h4
                  className='text-foreground mb-1'
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-bold)' as unknown as number,
                  }}
                >
                  {activeFeature.title}
                </h4>
                <p
                  className='text-primary'
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)' as unknown as number,
                    letterSpacing: '0.05em',
                  }}
                >
                  {activeFeature.tagline}
                </p>
              </div>
            </div>

            <p className='text-muted-foreground mb-6' style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}>
              {activeFeature.description}
            </p>

            <div className='space-y-3'>
              {activeFeature.benefits.map((benefit, idx) => (
                <div key={idx} className='flex items-start gap-2.5'>
                  <CheckCircle2 size={16} className='text-chart-2 mt-0.5' style={{ flexShrink: 0 }} />
                  <span className='text-foreground' style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code Example */}
          {activeFeature.codeExample && (
            <div className='bg-card/5 border border-border/10 rounded-xl overflow-hidden backdrop-blur-sm'>
              {/* Code header */}
              <div
                className='flex items-center gap-2 px-5 py-3'
                style={{
                  background: 'color-mix(in srgb, var(--foreground) 3%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--border) 10%, transparent)',
                }}
              >
                <Code2 size={14} className='text-chart-3' />
                <span
                  className='text-chart-3'
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)' as unknown as number,
                  }}
                >
                  {activeFeature.codeExample.label}
                </span>
              </div>

              {/* Code content */}
              <div className='p-6'>
                <pre
                  className='text-foreground overflow-x-auto'
                  style={{
                    fontSize: 'var(--text-xs)',
                    lineHeight: '1.6',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {activeFeature.codeExample.content}
                </pre>
              </div>

              {/* Security badge for certain features */}
              {(activeFeature.id === 'safe-dsl' || activeFeature.id === 'approval-gate') && (
                <div
                  className='flex items-center gap-2 px-5 py-3'
                  style={{
                    background: 'color-mix(in srgb, var(--chart-2) 8%, transparent)',
                    borderTop: '1px solid color-mix(in srgb, var(--chart-2) 15%, transparent)',
                  }}
                >
                  <Shield size={13} className='text-chart-2' />
                  <span
                    className='text-chart-2'
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)' as unknown as number,
                    }}
                  >
                    SOC 2 compliant — full audit trail
                  </span>
                </div>
              )}

              {/* Rollback indicator */}
              {activeFeature.id === 'rollback' && (
                <div
                  className='flex items-center gap-2 px-5 py-3'
                  style={{
                    background: 'color-mix(in srgb, var(--chart-1) 8%, transparent)',
                    borderTop: '1px solid color-mix(in srgb, var(--chart-1) 15%, transparent)',
                  }}
                >
                  <AlertTriangle size={13} className='text-chart-1' />
                  <span
                    className='text-chart-1'
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)' as unknown as number,
                    }}
                  >
                    Zero manual intervention required
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   Main Architecture Section
   ================================================================ */

export default function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const diagramY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const diagramScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.95, 1, 1, 0.97]);

  return (
    <section id='architecture' className='relative py-28 px-6' ref={sectionRef}>
      <div className='max-w-7xl mx-auto'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <span
            className='inline-block text-primary mb-4'
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            System Design
          </span>
          <h2
            style={{
              fontSize: 'clamp(var(--text-lg), 3vw, calc(var(--text-xl) * 1.4))',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
            }}
          >
            Event-Driven{' '}
            <span
              className='bg-clip-text text-transparent'
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--primary) 0%, var(--chart-3) 100%)',
                fontWeight: 'var(--font-weight-normal)' as unknown as number,
                fontSize: 'inherit',
              }}
            >
              Core Architecture
            </span>
          </h2>
          <p
            className='text-muted-foreground max-w-2xl mx-auto mt-4'
            style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
          >
            Yard collects. OpsLake processes. Redis caches. MySQL persists. The LLM generates. ActionBooks execute.
            Every layer is purpose-built for sub-second incident response.
          </p>
        </motion.div>

        {/* Dynamic architecture diagram with parallax */}
        <motion.div style={{ y: diagramY, scale: diagramScale }}>
          <ArchitectureDiagram />
        </motion.div>

        {/* Architecture highlights -- 3 pillars of the data pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6'
        >
          {[
            {
              title: 'Event Pipeline',
              desc: 'P-Code routes telemetry from Yard to OpsLake. A 5-level severity engine evaluates every signal against dynamic baselines — only true anomalies surface.',
              color: 'text-chart-4',
            },
            {
              title: 'Incident Intelligence',
              desc: 'Five classifiers — Service Impact, Resource Saturation, Wide Impact, Escalation, Flapping — determine whether an event demands human response or auto-remediation.',
              color: 'text-chart-2',
            },
            {
              title: 'LLM Remediation',
              desc: 'The AI generates ActionBooks from safe built-in functions, never raw commands. Critical operations require approval. Failed steps trigger cascade rollback automatically.',
              color: 'text-chart-3',
            },
          ].map((item) => (
            <div key={item.title} className='bg-card/5 border border-border/10 rounded-lg p-5 backdrop-blur-sm'>
              <h4
                className={`${item.color} mb-2`}
                style={{ fontWeight: 'var(--font-weight-bold)' as unknown as number }}
              >
                {item.title}
              </h4>
              <p className='text-muted-foreground' style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ActionBook DeepDive */}
        <ActionBookDeepDive />
      </div>
    </section>
  );
}
