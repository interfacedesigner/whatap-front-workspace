import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Bot, Cog, Download, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    icon: Download,
    number: '01',
    title: 'Deploy Agent',
    description:
      'Install the WhaTap agent on your servers. Automatically discover and inventory all server resources and processes.',
    color: '#00BEB8',
  },
  {
    icon: Cog,
    number: '02',
    title: 'Configure Rules',
    description:
      'Set up event rules, incident rules, and ActionBook policies tailored to your infrastructure requirements.',
    color: '#296cf2',
  },
  {
    icon: Bot,
    number: '03',
    title: 'AI Analyzes',
    description:
      'LLM service generates intelligent ActionBooks from your configurations, usage patterns, and best practices.',
    color: '#8b5cf6',
  },
  {
    icon: Sparkles,
    number: '04',
    title: 'Auto-Resolve',
    description:
      'Incidents are automatically detected, analyzed, and resolved via ActionBook execution on the target agents.',
    color: '#f59e0b',
  },
];

function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: `0 16px 32px ${step.color}15`,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='relative bg-[#2a2a42]/80 backdrop-blur-sm border border-[#3a3a4e] rounded-xl p-6 h-full cursor-default group overflow-hidden text-center'
    >
      {/* Content */}
      <div className='relative z-10 flex flex-col items-center h-full'>
        {/* Icon with circle background */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className='w-14 h-14 rounded-full flex items-center justify-center mb-4 relative'
          style={{
            backgroundColor: `${step.color}15`,
            border: `2px solid ${step.color}40`,
          }}
        >
          <step.icon className='w-6 h-6' style={{ color: step.color }} />
          {/* Step number badge */}
          <span
            className='absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white'
            style={{ backgroundColor: step.color }}
          >
            {index + 1}
          </span>
        </motion.div>

        <h3 className='text-base font-semibold text-white mb-2'>{step.title}</h3>
        <p className='text-sm text-[#a0a0b0] leading-relaxed flex-grow'>{step.description}</p>
      </div>

      {/* Gradient line at bottom on hover */}
      <div
        className='absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'
        style={{ backgroundColor: step.color }}
      />
    </motion.div>
  );
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={sectionRef} className='relative py-24 px-4 bg-[#1a1a2e] overflow-hidden'>
      {/* Animated Background */}
      <motion.div
        style={{ y: y1 }}
        className='absolute top-1/3 right-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#00BEB8]/10 to-[#296cf2]/10 blur-3xl'
      />
      <motion.div
        style={{ y: y1 }}
        className='absolute bottom-1/4 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#f59e0b]/10 blur-3xl'
      />

      {/* Grid Pattern */}
      <div className='absolute inset-0 opacity-[0.02]'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='howItWorksGrid' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'>
              <circle cx='30' cy='30' r='1' fill='white' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#howItWorksGrid)' />
        </svg>
      </div>

      <div className='relative max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-14'>
          <ScrollReveal distance={50}>
            <span className='text-sm font-medium text-[#00BEB8] uppercase tracking-wider mb-4 block'>
              GETTING STARTED
            </span>
          </ScrollReveal>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-4xl font-bold text-white leading-tight'>
              How It{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BEB8] to-[#296cf2]'>Works</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Connection line between steps (desktop only) */}
        <div className='hidden lg:block absolute top-[280px] left-1/2 -translate-x-1/2 w-[700px]'>
          <svg viewBox='0 0 700 2' className='w-full'>
            <line x1='0' y1='1' x2='700' y2='1' stroke='#3a3a4e' strokeWidth='2' strokeDasharray='8 8' />
          </svg>
        </div>

        {/* Cards Grid - 4 columns */}
        <StaggerContainer stagger={0.12} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {steps.map((step, index) => (
            <StaggerItem key={index} distance={40}>
              <StepCard step={step} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
