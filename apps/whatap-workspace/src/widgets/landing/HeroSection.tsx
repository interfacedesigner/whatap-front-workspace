import { ArrowRight, Calendar, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

import { AiPromptDemo } from './AiPromptDemo';
import { LiveCounter } from './LiveCounter';

export default function HeroSection() {
  const { scrollY } = useScroll();

  const orbY1 = useTransform(scrollY, [0, 800], [0, 200]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -150]);
  const orbY3 = useTransform(scrollY, [0, 800], [0, 120]);
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const contentY = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20'>
      {/* Grid background */}
      <div
        className='absolute inset-0 opacity-[0.07]'
        style={{
          backgroundImage:
            'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial fade overlay */}
      <div
        className='absolute inset-0'
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--background) 75%)' }}
      />

      {/* Hero parallax orbs */}
      <motion.div
        className='absolute top-[5%] left-[-12%] w-[550px] h-[550px] rounded-full bg-primary opacity-[0.15] blur-[150px]'
        style={{ y: orbY1 }}
      />
      <motion.div
        className='absolute top-[55%] right-[-8%] w-[450px] h-[450px] rounded-full bg-chart-3 opacity-[0.12] blur-[130px]'
        style={{ y: orbY2 }}
      />
      <motion.div
        className='absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full bg-chart-5 opacity-[0.10] blur-[100px]'
        style={{ y: orbY3 }}
      />

      {/* Content */}
      <motion.div
        className='relative z-10 max-w-6xl mx-auto px-6 text-center'
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8'
        >
          <Zap size={14} className='text-primary' />
          <span
            className='text-primary'
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
              letterSpacing: '0.6px',
            }}
          >
            Next-Gen AIOps Platform
          </span>
        </motion.div>

        {/* Headline */}
        <div className='flex justify-center w-full mb-6'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: 'clamp(calc(var(--text-xl) * 1.3), 4.5vw, calc(var(--text-xl) * 2.2))',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
              lineHeight: '1.15',
              whiteSpace: 'nowrap',
            }}
          >
            Intelligent, AI-Powered Observability
          </motion.h1>
        </div>

        {/* Live metrics banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='flex flex-wrap items-center justify-center gap-4 mb-6'
        >
          {[
            { value: 47, suffix: ' hosts monitored', color: 'text-chart-1' },
            { value: 2, suffix: ' incidents resolved', color: 'text-chart-2' },
            { value: 38, suffix: 's MTTR', color: 'text-primary' },
          ].map((metric, i) => (
            <div key={i} className='flex items-center gap-1.5'>
              {i > 0 && (
                <span
                  className='text-border'
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' as unknown as number }}
                >
                  ·
                </span>
              )}
              <span
                className={metric.color}
                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' as unknown as number }}
              >
                <LiveCounter end={metric.value} suffix={metric.suffix} />
              </span>
            </div>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className='text-muted-foreground max-w-2xl mx-auto mb-10'
          style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}
        >
          OpsGent detects five distinct incident patterns, generates AI&#8209;driven remediation scripts, and
          auto&#8209;resolves issues with cascade rollback — reducing MTTR from 47 minutes to 38 seconds, a{' '}
          <span
            className='text-primary'
            style={{ fontWeight: 'var(--font-weight-bold)' as unknown as number, fontSize: 'inherit' }}
          >
            94% improvement
          </span>
          .
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-4'
        >
          <a
            href='#cta'
            className='inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-md hover:opacity-90 transition-all duration-300'
            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
          >
            <Calendar size={16} />
            Schedule Demo
          </a>
          <a
            href='/signup'
            className='inline-flex items-center gap-2 border border-border/30 text-foreground px-7 py-3 rounded-md hover:bg-card/10 transition-all duration-300'
            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
          >
            Start Free Trial
            <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* AI Prompt Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0 }}
          className='mt-12 flex justify-center'
        >
          <AiPromptDemo />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2'
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='w-6 h-10 rounded-full border-2 border-border/30 flex justify-center pt-2'
        >
          <div className='w-1 h-2 rounded-full bg-primary' />
        </motion.div>
      </motion.div>
    </section>
  );
}
