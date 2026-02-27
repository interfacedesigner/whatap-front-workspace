import { Activity, Bell, Brain, Server, ShieldAlert, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    icon: <Server size={22} />,
    title: 'Service-Aware Monitoring',
    description:
      'Lightweight agents collect CPU, Memory, Network, and Disk I/O in real time. Servers are auto-grouped by service tag — so you see impact per service, not per host.',
    color: 'text-chart-1',
    borderColor: 'border-chart-1/20',
    bgColor: 'bg-chart-1/10',
  },
  {
    icon: <Activity size={22} />,
    title: 'Dynamic Baselines',
    description:
      'Forget static thresholds. OpsGent analyzes 2 weeks of historical data at P95 to auto-calculate alert boundaries per metric, per time-of-day — and updates them continuously.',
    color: 'text-chart-4',
    borderColor: 'border-chart-4/20',
    bgColor: 'bg-chart-4/10',
  },
  {
    icon: <ShieldAlert size={22} />,
    title: '5-Type Incident Detection',
    description:
      'Not every alert is an incident. OpsGent classifies into Service Impact, Resource Saturation, Wide Impact, Escalation, and Flapping — so the right response fires every time.',
    color: 'text-chart-2',
    borderColor: 'border-chart-2/20',
    bgColor: 'bg-chart-2/10',
  },
  {
    icon: <Brain size={22} />,
    title: 'AI ActionBook Engine',
    description:
      'Tell the LLM what you need. It generates step-by-step remediation scripts using safe, built-in functions only — never raw shell commands. Critical actions require approval before execution.',
    color: 'text-chart-3',
    borderColor: 'border-chart-3/20',
    bgColor: 'bg-chart-3/10',
  },
  {
    icon: <Undo2 size={22} />,
    title: 'Cascade Rollback',
    description:
      'Every ActionBook runs step-by-step. If step 3 fails, OpsGent automatically reverse-executes rollback logic for step 2 and step 1 — restoring your system to a known-good state.',
    color: 'text-primary',
    borderColor: 'border-primary/20',
    bgColor: 'bg-primary/10',
  },
  {
    icon: <Bell size={22} />,
    title: 'Auto Actions & Delivery',
    description:
      'When an incident is confirmed, Auto Actions spin up Jira tickets, fire Slack alerts, and trigger ActionBooks — simultaneously, with full audit trail via NotiServer.',
    color: 'text-chart-5',
    borderColor: 'border-chart-5/20',
    bgColor: 'bg-chart-5/10',
  },
];

export default function FeaturesSection() {
  return (
    <section id='features' className='relative py-28 px-6'>
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
            Core Capabilities
          </span>
          <h2
            style={{
              fontSize: 'clamp(var(--text-lg), 3vw, calc(var(--text-xl) * 1.4))',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
            }}
          >
            From Alert Noise to{' '}
            <span className='text-primary' style={{ fontSize: 'inherit' }}>
              Autonomous Resolution
            </span>
          </h2>
          <p
            className='text-muted-foreground max-w-2xl mx-auto mt-4'
            style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
          >
            Six capabilities that turn reactive firefighting into proactive, AI-driven operations — each built on the
            real-world workflow of Monitoring → Event → Incident → ActionBook.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative bg-card border ${feature.borderColor} rounded-lg p-6 hover:border-primary/30 transition-all duration-500`}
              style={{ boxShadow: 'var(--elevation-sm)' }}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-md ${feature.bgColor} ${feature.color} mb-4`}
              >
                {feature.icon}
              </div>
              <h3
                className='text-foreground mb-2'
                style={{ fontWeight: 'var(--font-weight-bold)' as unknown as number }}
              >
                {feature.title}
              </h3>
              <p className='text-muted-foreground' style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
