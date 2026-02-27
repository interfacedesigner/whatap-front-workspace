import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function CTASection() {
  return (
    <section id='cta' className='relative py-28 px-6'>
      <div className='max-w-4xl mx-auto relative'>
        {/* Background glow */}
        <div className='absolute inset-0 bg-primary opacity-[0.05] blur-[100px] rounded-full pointer-events-none' />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className='relative bg-card/5 backdrop-blur-sm rounded-2xl p-10 md:p-16 text-center'
        >
          <h2
            className='mb-4'
            style={{
              fontSize: 'clamp(calc(var(--text-lg) * 1.2), 3vw, calc(var(--text-xl) * 1.5))',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
              lineHeight: '1.2',
            }}
          >
            Stop Firefighting. <br className='hidden sm:block' />
            Start{' '}
            <span
              className='bg-clip-text text-transparent'
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--primary) 0%, var(--chart-3) 100%)',
                fontSize: 'inherit',
              }}
            >
              Auto-Healing
            </span>
            .
          </h2>

          <p
            className='text-muted-foreground max-w-xl mx-auto mb-8'
            style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
          >
            Deploy the agent in 60 seconds. Let OpsGent learn your baselines, classify incidents across five dimensions,
            and resolve them with AI-generated ActionBooks — before your on-call even wakes up.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='#'
              className='inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md hover:opacity-90 transition-opacity'
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
            >
              <Calendar size={16} />
              Schedule Demo
            </a>
            <a
              href='/signup'
              className='inline-flex items-center gap-2 border border-border/30 text-foreground px-8 py-3 rounded-md hover:bg-card/10 transition-colors'
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
            >
              Start Free Trial
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
