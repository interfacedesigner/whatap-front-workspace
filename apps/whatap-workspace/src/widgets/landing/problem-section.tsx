import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { FolderTree, Layers, Lock, Puzzle } from 'lucide-react';
import { motion } from 'motion/react';

const problems = [
  {
    icon: Lock,
    title: 'Complex Permissions',
    description: 'Integrated dashboards have tangled ownership and access control across projects',
  },
  {
    icon: Layers,
    title: 'Scattered Tools',
    description: 'Grey-zone products like Kafka, Milvus, VectorDB require separate operations and support',
  },
  {
    icon: Puzzle,
    title: 'Multi-Project Challenges',
    description: 'AI-based analysis and automation require external permission and data scope alignment',
  },
  {
    icon: FolderTree,
    title: 'Project-Centric Limits',
    description: 'AP, Server, and DB are technically separated with different owners, creating silos',
  },
];

export function ProblemSection() {
  return (
    <section className='py-16 px-4 bg-[rgba(173,173,173,0.3)] overflow-hidden'>
      <div className='max-w-[1092px] mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <ScrollReveal distance={50}>
            <h2 className='text-3xl md:text-[40px] font-bold text-[#222] leading-tight mb-4'>Why Workspace?</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={40}>
            <p className='text-base text-[#757575] max-w-[587px] mx-auto leading-relaxed'>
              Traditional project-centric operations create complexity. Workspace solves this by elevating tenants to
              workspaces, providing a unified experience.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards Grid */}
        <StaggerContainer stagger={0.15} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {problems.map((problem, index) => (
            <StaggerItem key={index} rotate={index % 2 === 0 ? -2 : 2}>
              <motion.div
                whileHover={{ y: -8, scale: 1.03, boxShadow: '0 12px 30px rgba(41,108,242,0.12)' }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className='bg-white border border-[#adadad] rounded p-5 min-h-[200px] cursor-default'
              >
                <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} transition={{ duration: 0.5 }}>
                  <problem.icon className='w-9 h-9 text-[#296cf2] mb-4' />
                </motion.div>
                <h3 className='text-base font-bold text-[#222] mb-2 leading-relaxed'>{problem.title}</h3>
                <p className='text-sm text-[#757575] leading-relaxed'>{problem.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
