import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Building2, Cpu, Database, LayoutDashboard, Server } from 'lucide-react';
import { motion } from 'motion/react';

const principles = [
  {
    icon: Building2,
    title: 'Tenant = Workspace',
    description:
      'Unified permissions, pricing, sharing, and dashboards are all workspace-scoped, not scattered across projects',
  },
  {
    icon: Server,
    title: 'Server-Centric View',
    description:
      'Servers are a first-class entity. Query from any DB, API, or log attribute to find specific machines.',
  },
  {
    icon: Cpu,
    title: 'One Agent Experience',
    description:
      'Single installer collects all you need for servers. Deploy K8s in DB-only with one helm chart deploy.',
  },
  {
    icon: LayoutDashboard,
    title: 'Inventory as Entry Point',
    description: 'View management follows what you have first and is also enabled by WhaTap open source Solution',
  },
  {
    icon: Database,
    title: 'Data Sovereignty',
    description: 'Export to Parquet. Your S3 bucket. Breaking vendor lock-in with your data',
  },
];

function PrincipleCard({ principle }: { principle: (typeof principles)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03, boxShadow: '0 12px 30px rgba(41,108,242,0.12)' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className='bg-white border border-[#adadad] rounded-md p-7 cursor-default'
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className='w-[42px] h-[42px] bg-[#d7e2ff] rounded flex items-center justify-center mb-4'
      >
        <principle.icon className='w-5 h-5 text-[#296cf2]' />
      </motion.div>
      <h3 className='text-xl font-bold text-[#222] mb-3 leading-7'>{principle.title}</h3>
      <p className='text-sm text-[#757575] leading-relaxed'>{principle.description}</p>
    </motion.div>
  );
}

export function CorePrinciplesSection() {
  return (
    <section className='py-16 px-4 overflow-hidden'>
      <div className='max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-[40px] font-bold text-[#222] leading-tight mb-4'>Core Principles</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-base text-[#757575] max-w-[588px] mx-auto leading-relaxed'>
              Built on foundational principles that deliver true unified operations
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid - 3 on top */}
        <StaggerContainer stagger={0.15} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {principles.slice(0, 3).map((principle, index) => (
            <StaggerItem key={index} rotate={index === 1 ? 0 : index === 0 ? -2 : 2}>
              <PrincipleCard principle={principle} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom row - 2 cards centered */}
        <StaggerContainer
          stagger={0.15}
          className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 max-w-[712px] mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[180px]'
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
