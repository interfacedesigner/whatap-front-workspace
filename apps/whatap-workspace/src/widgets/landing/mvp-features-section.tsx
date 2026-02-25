import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Building2, Check, Database, LayoutDashboard, Plug, Rocket, Server } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const features = [
  {
    icon: Server,
    title: 'Inventory Service',
    subtitle: 'Single source of truth for all servers',
    color: '#00BEB8',
    items: [
      'Centralized server count, specs, tags, and groups',
      'Track additions, removals, and spec changes',
      'Complete change history and comparison tools',
    ],
  },
  {
    icon: Building2,
    title: 'Business Unit Aggregation',
    subtitle: 'Operational KPIs by department',
    color: '#296cf2',
    items: [
      'Core and memory totals by HR, Marketing, B1, B2, etc.',
      'Pre-aggregated daily data for instant access',
      'Increase/decrease reports over time',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Flexboard',
    subtitle: 'Integrated dashboard with clear ownership',
    color: '#8b5cf6',
    items: [
      'Workspace and group-based attribution',
      'Simplified sharing and permissions',
      'No more tangled access control',
    ],
  },
  {
    icon: Plug,
    title: 'Open Source Integration',
    subtitle: 'Entry point for existing stacks',
    color: '#f59e0b',
    items: [
      'Easy Prometheus/Grafana sync for onboarding',
      'Add metrics via WhaTap collector plugin',
      'Zero-lift migration integration support',
    ],
  },
  {
    icon: Database,
    title: 'Data Sovereignty',
    subtitle: 'Own your operational data',
    color: '#ec4899',
    items: ['Export to Parquet format', 'Store in your own S3 bucket', 'Break free from data hostage pricing'],
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.02,
        boxShadow: `0 20px 40px ${feature.color}20`,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='relative bg-[#2a2a42]/80 backdrop-blur-sm border border-[#3a3a4e] rounded-xl p-7 cursor-default group overflow-hidden h-full'
    >
      {/* Animated gradient border */}
      <div
        className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{
          background: `linear-gradient(135deg, ${feature.color}15, transparent 50%, ${feature.color}10)`,
        }}
      />

      {/* Content */}
      <div className='relative z-10'>
        <div className='flex items-start gap-4 mb-6'>
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
            transition={{ duration: 0.4 }}
            className='w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-lg'
            style={{
              background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
              boxShadow: `0 8px 20px ${feature.color}40`,
            }}
          >
            <feature.icon className='w-6 h-6 text-white' />
          </motion.div>
          <div>
            <h3 className='text-xl font-bold text-white leading-7'>{feature.title}</h3>
            <p className='text-sm text-[#a0a0b0] leading-relaxed'>{feature.subtitle}</p>
          </div>
        </div>
        <ul className='space-y-3 pl-16'>
          {feature.items.map((item, itemIndex) => (
            <motion.li
              key={itemIndex}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: itemIndex * 0.1 }}
              className='flex items-start gap-3'
            >
              <div
                className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <Check className='w-3 h-3' style={{ color: feature.color }} />
              </div>
              <span className='text-sm text-[#e0e0e0] leading-relaxed'>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Decorative corner */}
      <div
        className='absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500'
        style={{ backgroundColor: feature.color }}
      />
    </motion.div>
  );
}

export function MVPFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <section ref={sectionRef} className='relative py-24 px-4 bg-[#1a1a2e] overflow-hidden'>
      {/* Animated Background */}
      <motion.div
        style={{ y: y1 }}
        className='absolute top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#296cf2]/10 to-[#00BEB8]/10 blur-3xl'
      />
      <motion.div
        style={{ y: y1, scale }}
        className='absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10 blur-3xl'
      />

      {/* Hexagon Grid Pattern */}
      <div className='absolute inset-0 opacity-[0.03]'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='hexGrid' width='50' height='43.4' patternUnits='userSpaceOnUse' patternTransform='scale(1.5)'>
              <polygon
                points='25,0 50,14.4 50,43.4 25,43.4 0,43.4 0,14.4'
                fill='none'
                stroke='white'
                strokeWidth='0.5'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#hexGrid)' />
        </svg>
      </div>

      <div className='relative max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <ScrollReveal distance={50}>
            <div className='inline-flex items-center gap-2 mb-6'>
              <Rocket className='w-5 h-5 text-[#00BEB8]' />
              <span className='text-sm font-medium text-[#00BEB8] uppercase tracking-wider'>Features</span>
            </div>
          </ScrollReveal>
          <ScrollReveal distance={50}>
            <h2 className='text-4xl md:text-5xl font-bold text-white leading-tight mb-6'>
              MVP{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BEB8] via-[#296cf2] to-[#8b5cf6]'>
                Features
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-lg text-[#a0a0b0] max-w-[588px] mx-auto leading-relaxed'>
              Proven value through integrated operational experience, not just promises
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 2 columns with directional stagger */}
        <StaggerContainer stagger={0.18} className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {features.slice(0, 4).map((feature, index) => (
            <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'} distance={50}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Last card centered - scale reveal */}
        {features[4] && (
          <div className='max-w-[540px] mx-auto mt-6'>
            <ScrollReveal duration={0.7} scale>
              <FeatureCard feature={features[4]} />
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}
