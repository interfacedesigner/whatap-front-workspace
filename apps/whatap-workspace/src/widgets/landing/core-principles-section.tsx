import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Building2, Cpu, Database, LayoutDashboard, Server, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const principles = [
  {
    icon: Building2,
    title: 'Tenant = Workspace',
    description:
      'Unified permissions, pricing, sharing, and dashboards are all workspace-scoped, not scattered across projects',
    color: '#00BEB8',
  },
  {
    icon: Server,
    title: 'Server-Centric View',
    description:
      'Servers are a first-class entity. Query from any DB, API, or log attribute to find specific machines.',
    color: '#296cf2',
  },
  {
    icon: Cpu,
    title: 'One Agent Experience',
    description:
      'Single installer collects all you need for servers. Deploy K8s in DB-only with one helm chart deploy.',
    color: '#8b5cf6',
  },
  {
    icon: LayoutDashboard,
    title: 'Inventory as Entry Point',
    description: 'View management follows what you have first and is also enabled by WhaTap open source Solution',
    color: '#f59e0b',
  },
  {
    icon: Database,
    title: 'Data Sovereignty',
    description: 'Export to Parquet. Your S3 bucket. Breaking vendor lock-in with your data',
    color: '#ec4899',
  },
];

function PrincipleCard({ principle }: { principle: (typeof principles)[number] }) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
        boxShadow: `0 20px 40px ${principle.color}20`,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='relative bg-[#2a2a42]/80 backdrop-blur-sm border border-[#3a3a4e] rounded-xl p-7 cursor-default group overflow-hidden'
    >
      {/* Animated border gradient */}
      <div
        className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{
          background: `linear-gradient(135deg, ${principle.color}20, transparent 50%)`,
        }}
      />

      {/* Floating particles effect */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-60'
            style={{
              backgroundColor: principle.color,
              left: `${20 + i * 30}%`,
              top: '80%',
            }}
            animate={{
              y: [-20, -60],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className='w-12 h-12 rounded-lg flex items-center justify-center mb-5'
          style={{
            background: `linear-gradient(135deg, ${principle.color}30, ${principle.color}10)`,
            border: `1px solid ${principle.color}40`,
          }}
        >
          <principle.icon className='w-6 h-6' style={{ color: principle.color }} />
        </motion.div>
        <h3 className='text-xl font-bold text-white mb-3 leading-7'>{principle.title}</h3>
        <p className='text-sm text-[#a0a0b0] leading-relaxed'>{principle.description}</p>
      </div>

      {/* Corner glow */}
      <div
        className='absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500'
        style={{ backgroundColor: principle.color }}
      />
    </motion.div>
  );
}

export function CorePrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section ref={sectionRef} className='relative py-24 px-4 bg-[#1a1a2e] overflow-hidden'>
      {/* Animated Background */}
      <motion.div
        style={{ y: y1, rotate }}
        className='absolute top-1/4 -left-20 w-80 h-80 rounded-full border border-[#3a3a4e]/30 opacity-50'
      />
      <motion.div
        style={{ y: y1 }}
        className='absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-[#296cf2]/10 to-[#00BEB8]/10 blur-3xl'
      />

      <div className='relative max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <ScrollReveal distance={50}>
            <div className='inline-flex items-center gap-2 mb-6'>
              <Sparkles className='w-5 h-5 text-[#00BEB8]' />
              <span className='text-sm font-medium text-[#00BEB8] uppercase tracking-wider'>Foundation</span>
            </div>
          </ScrollReveal>
          <ScrollReveal distance={50}>
            <h2 className='text-4xl md:text-5xl font-bold text-white leading-tight mb-6'>
              Core{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BEB8] to-[#296cf2]'>
                Principles
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-lg text-[#a0a0b0] max-w-[588px] mx-auto leading-relaxed'>
              Built on foundational principles that deliver true unified operations
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 3 on top */}
        <StaggerContainer stagger={0.15} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {principles.slice(0, 3).map((principle, index) => (
            <StaggerItem key={index} rotate={index === 1 ? 0 : index === 0 ? -2 : 2}>
              <PrincipleCard principle={principle} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom row - 2 cards centered */}
        <StaggerContainer
          stagger={0.15}
          className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-[712px] mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[180px]'
        >
          {principles.slice(3).map((principle, index) => (
            <StaggerItem key={index + 3} direction={index === 0 ? 'left' : 'right'} distance={50}>
              <PrincipleCard principle={principle} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
