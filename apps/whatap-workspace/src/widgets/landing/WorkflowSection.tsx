import { BarChart3, Download, ScanSearch, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface Step {
  icon: ReactNode;
  num: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <Download size={22} />,
    num: '01',
    title: 'Deploy Agent',
    description:
      'Install a lightweight agent per host. It auto-discovers resources, tags each server by service, and starts streaming metrics to Yard within 60 seconds.',
  },
  {
    icon: <BarChart3 size={22} />,
    num: '02',
    title: 'Learn Baselines',
    description:
      'OpsGent analyzes two weeks of historical data, computing P95 thresholds per metric per time-of-day. No more guessing at static alert boundaries.',
  },
  {
    icon: <ScanSearch size={22} />,
    num: '03',
    title: 'Detect & Classify',
    description:
      'Every anomaly is evaluated against five incident classifiers — Service Impact, Saturation, Wide Impact, Escalation, and Flapping — so you only page on what matters.',
  },
  {
    icon: <Zap size={22} />,
    num: '04',
    title: 'Auto-Remediate',
    description:
      'ActionBooks execute step-by-step on target agents. If any step fails, cascade rollback restores the previous state automatically. Jira tickets and Slack alerts fire in parallel.',
  },
];

export default function WorkflowSection() {
  return (
    <section id='workflow' className='relative py-28 px-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className='text-center mb-20'
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
            Getting Started
          </span>
          <h2
            style={{
              fontSize: 'clamp(var(--text-lg), 3vw, calc(var(--text-xl) * 1.4))',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
            }}
          >
            From Zero to Auto-Healing{' '}
            <span
              className='bg-clip-text text-transparent'
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--primary) 0%, var(--chart-3) 100%)',
                fontWeight: 'var(--font-weight-normal)' as unknown as number,
                fontSize: 'inherit',
              }}
            >
              in Four Steps
            </span>
          </h2>
          <p
            className='text-muted-foreground max-w-xl mx-auto mt-4'
            style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
          >
            Deploy once. OpsGent learns your infrastructure, establishes intelligent baselines, and begins autonomous
            incident resolution.
          </p>
        </motion.div>

        {/* Steps */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative'>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className='relative text-center'
            >
              {/* Icon circle */}
              <div className='relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6'>
                {step.icon}
                <span
                  className='absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center'
                  style={{
                    fontSize: 'calc(var(--text-xs) * 0.85)',
                    fontWeight: 'var(--font-weight-bold)' as unknown as number,
                  }}
                >
                  {step.num}
                </span>
              </div>

              <h4
                className='text-foreground mb-2'
                style={{ fontWeight: 'var(--font-weight-bold)' as unknown as number }}
              >
                {step.title}
              </h4>

              <p
                className='text-muted-foreground max-w-[260px] mx-auto'
                style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
