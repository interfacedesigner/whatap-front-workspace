import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Activity, Bell, BookOpen, Briefcase, FolderKanban, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const capabilities = [
  {
    icon: Activity,
    title: 'Agent Monitoring',
    description:
      'Real-time server resource monitoring — CPU, Memory, Network, Disk I/O — with lightweight agent-based data collection.',
    color: '#00BEB8',
  },
  {
    icon: FolderKanban,
    title: 'Event Management',
    description:
      'Configure event rules, browse event history, and manage delivery track flexible multi-channel event tracking.',
    color: '#296cf2',
  },
  {
    icon: Zap,
    title: 'Incident Automation',
    description:
      'Set up incident rules and Automation policies for advanced incident processing, escalation, and resolution.',
    color: '#8b5cf6',
  },
  {
    icon: BookOpen,
    title: 'AI ActionBook',
    description:
      'LLM-powered ActionBook generation with AI. Auto-configuration and on-agent execution for intelligent automation.',
    color: '#f59e0b',
  },
  {
    icon: Briefcase,
    title: 'Workspace Management',
    description:
      'Create and manage workspaces with role-based access control, team organizations, and tenant hierarchy grouping.',
    color: '#ec4899',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description:
      'Multi-channel notification delivery through Notification with configurable delivery rules and full history tracking.',
    color: '#10b981',
  },
];

function CapabilityCard({ capability }: { capability: (typeof capabilities)[number] }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: `0 16px 32px ${capability.color}15`,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='relative bg-[#2a2a42]/80 backdrop-blur-sm border border-[#3a3a4e] rounded-xl p-6 h-full cursor-default group overflow-hidden'
    >
      {/* Gradient overlay on hover */}
      <div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{
          background: `linear-gradient(135deg, ${capability.color}10, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className='relative z-10 flex flex-col h-full'>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className='w-11 h-11 rounded-lg flex items-center justify-center mb-4'
          style={{
            backgroundColor: `${capability.color}15`,
            border: `1px solid ${capability.color}30`,
          }}
        >
          <capability.icon className='w-5 h-5' style={{ color: capability.color }} />
        </motion.div>
        <h3 className='text-base font-semibold text-white mb-2'>{capability.title}</h3>
        <p className='text-sm text-[#a0a0b0] leading-relaxed flex-grow'>{capability.description}</p>
      </div>

      {/* Corner accent */}
      <div
        className='absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{
          background: `linear-gradient(to bottom-left, ${capability.color}15, transparent)`,
        }}
      />
    </motion.div>
  );
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={sectionRef} className='relative py-24 px-4 bg-[#222222] overflow-hidden'>
      {/* Animated Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className='absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#296cf2]/10 to-[#00BEB8]/10 blur-3xl'
      />
      <motion.div
        style={{ y: y1 }}
        className='absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10 blur-3xl'
      />

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 opacity-[0.03]'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='problemGrid' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'>
              <path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#problemGrid)' />
        </svg>
      </div>

      <div className='relative max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-14'>
          <ScrollReveal distance={50}>
            <span className='text-sm font-medium text-[#00BEB8] uppercase tracking-wider mb-4 block'>
              CORE CAPABILITIES
            </span>
          </ScrollReveal>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-4xl font-bold text-white leading-tight'>
              Everything You Need for{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BEB8] to-[#296cf2]'>
                Intelligent Operations
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-base text-[#a0a0b0] max-w-[620px] mx-auto leading-relaxed mt-4'>
              From agent deployment to AI-driven incident resolution, our platform covers the entire operations
              lifecycle.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 3x2 with equal heights */}
        <StaggerContainer stagger={0.1} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {capabilities.map((capability, index) => (
            <StaggerItem key={index} distance={40}>
              <CapabilityCard capability={capability} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
