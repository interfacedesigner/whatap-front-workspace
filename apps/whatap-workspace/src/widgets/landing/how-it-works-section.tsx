import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Building2, Download, History, List, Map, Share2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: Building2,
    number: '01',
    title: 'Join Workspace',
    description: 'Sign up and invite team members into your workspace',
  },
  {
    icon: Download,
    number: '02',
    title: 'Install Agent',
    description: 'One install. Everything for APM, server, DB, logs, browser collection',
  },
  {
    icon: List,
    number: '03',
    title: 'View Inventory Table',
    description: 'See all your servers, apps, containers, apps...',
  },
  {
    icon: Map,
    number: '04',
    title: 'Explore Inventory Map',
    description: 'Visualize density and changes across your infrastructure',
  },
  {
    icon: TrendingUp,
    number: '05',
    title: 'Track Trends',
    description: 'Monitor resource usage by business unit (HR, Marketing, etc.)',
  },
  {
    icon: History,
    number: '06',
    title: 'Compare History',
    description: 'See what changed compared to any previous point in time',
  },
  {
    icon: Share2,
    number: '07',
    title: 'Keep & Share',
    description: 'Pin current state and share via URL with preserved context',
  },
];

function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03, boxShadow: '0 12px 30px rgba(41,108,242,0.12)' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='bg-white border border-[#adadad] rounded p-5 cursor-default'
    >
      <div className='flex items-start gap-3.5 mb-2.5'>
        <motion.div
          whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
          transition={{ duration: 0.4 }}
          className='w-9 h-9 bg-[#296cf2] rounded flex items-center justify-center shrink-0'
        >
          <step.icon className='w-[18px] h-[18px] text-white' />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, scale: 0.3, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.1 + index * 0.08,
            ease: [0.16, 1, 0.3, 1],
            scale: {
              type: 'spring',
              stiffness: 200,
              damping: 12,
            },
          }}
          className='text-[28px] font-bold text-[#adadad] leading-7'
        >
          {step.number}
        </motion.span>
      </div>
      <h3 className='text-base font-bold text-[#222] mb-2.5 leading-relaxed'>{step.title}</h3>
      <p className='text-sm text-[#757575] leading-relaxed'>{step.description}</p>
    </motion.div>
  );
}

export function HowItWorksSection() {
  return (
    <section className='py-16 px-4 bg-[rgba(173,173,173,0.3)] overflow-hidden'>
      <div className='max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-[40px] font-bold text-[#222] leading-tight mb-4'>How It Works</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-base text-[#757575] max-w-[450px] mx-auto leading-relaxed'>
              From setup to insights in a single, streamlined flow
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 4 on top */}
        <StaggerContainer stagger={0.12} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {steps.slice(0, 4).map((step, index) => (
            <StaggerItem key={index}>
              <StepCard step={step} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom row - 3 cards */}
        <StaggerContainer
          stagger={0.12}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 max-w-[815px] mx-auto lg:max-w-none lg:px-[138px]'
        >
          {steps.slice(4).map((step, index) => (
            <StaggerItem key={index + 4}>
              <StepCard step={step} index={index + 4} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
