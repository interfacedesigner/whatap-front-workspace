import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Building2, Database, LayoutDashboard, Plug, Server } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Server,
    title: 'Inventory Service',
    subtitle: 'Single source of truth for all servers',
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
    items: ['Export to Parquet format', 'Store in your own S3 bucket', 'Break free from data hostage pricing'],
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(41,108,242,0.12)' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='bg-white border border-[#adadad] rounded-md p-7 cursor-default'
    >
      <div className='flex items-start gap-3.5 mb-5'>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
          transition={{ duration: 0.4 }}
          className='w-[42px] h-[42px] bg-[#296cf2] rounded flex items-center justify-center shrink-0'
        >
          <feature.icon className='w-5 h-5 text-white' />
        </motion.div>
        <div>
          <h3 className='text-xl font-bold text-[#222] leading-7'>{feature.title}</h3>
          <p className='text-sm text-[#757575] leading-relaxed'>{feature.subtitle}</p>
        </div>
      </div>
      <ul className='space-y-2 pl-14'>
        {feature.items.map((item, itemIndex) => (
          <li key={itemIndex} className='flex items-start gap-3'>
            <span className='w-1.5 h-1.5 bg-[#296cf2] rounded-full mt-2 shrink-0' />
            <span className='text-sm text-[#222] leading-relaxed'>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function MVPFeaturesSection() {
  return (
    <section className='py-16 px-4 overflow-hidden'>
      <div className='max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-[40px] font-bold text-[#222] leading-tight mb-4'>MVP Features</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-base text-[#757575] max-w-[588px] mx-auto leading-relaxed'>
              Proven value through integrated operational experience, not just promises
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 2 columns with directional stagger */}
        <StaggerContainer stagger={0.18} className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {features.slice(0, 4).map((feature, index) => (
            <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'} distance={50}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Last card centered - scale reveal */}
        {features[4] && (
          <div className='max-w-[490px] mx-auto mt-5'>
            <ScrollReveal duration={0.7} scale>
              <FeatureCard feature={features[4]} />
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}
