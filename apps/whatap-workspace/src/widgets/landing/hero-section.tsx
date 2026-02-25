import { Button } from '@/shared/components/ui/button';
import { useIsMobile } from '@/shared/hooks/use-media-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle, Clock, Cpu } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { HeroAbstractBackground } from './abstract-objects';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const shouldReduce = useReducedMotion();
  const disabled = isMobile || shouldReduce;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const headingY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -200]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.5], [1, disabled ? 1 : 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.5], [1, disabled ? 1 : 0.9]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -140]);
  const paragraphOpacity = useTransform(scrollYProgress, [0, 0.55], [1, disabled ? 1 : 0]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -100]);
  const buttonsOpacity = useTransform(scrollYProgress, [0, 0.6], [1, disabled ? 1 : 0]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -80]);
  const statsOpacity = useTransform(scrollYProgress, [0, 0.65], [1, disabled ? 1 : 0]);

  return (
    <section ref={sectionRef} className='relative min-h-screen pt-28 pb-20 px-4 overflow-hidden bg-[#1a1a2e]'>
      {/* Top blend zone - connects with Header */}
      <div className='absolute top-0 left-0 right-0 h-[100px] pointer-events-none z-[1]'>
        <div
          className='absolute inset-0'
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(26, 26, 46, 0.9) 0%,
                rgba(26, 26, 46, 0.5) 40%,
                transparent 100%
              )
            `,
          }}
        />
        {/* Subtle glow from header */}
        <div
          className='absolute inset-0'
          style={{
            background: `
              radial-gradient(
                ellipse 60% 100% at 50% 0%,
                rgba(41, 108, 242, 0.1) 0%,
                rgba(139, 82, 255, 0.05) 50%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      {/* Abstract Background */}
      <HeroAbstractBackground />

      <div className='relative z-10 max-w-[1092px] mx-auto flex flex-col items-center gap-8'>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00BEB8]/30 bg-[#00BEB8]/10'
        >
          <span className='w-2 h-2 rounded-full bg-[#00BEB8] animate-pulse' />
          <span className='text-sm text-[#00BEB8] font-medium'>Next-Gen AIOps Platform</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: headingY, opacity: headingOpacity, scale: headingScale }}
          className='text-center w-full'
        >
          <h1 className='text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] font-bold leading-[1.1] whitespace-nowrap'>
            <span className='animated-gradient-text'>Intelligent AI based Observability,</span>
          </h1>
          <h2 className='text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] font-normal leading-[1.1] text-white mt-2'>
            Automated Response
          </h2>
          {/* Gradient animation styles with enhanced visibility */}
          <style>{`
            .animated-gradient-text {
              background: linear-gradient(
                90deg,
                #4A90FF 0%,
                #A855F7 25%,
                #4A90FF 50%,
                #A855F7 75%,
                #4A90FF 100%
              );
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradient-shift 3s ease-in-out infinite;
              filter: drop-shadow(0 0 20px rgba(74, 144, 255, 0.3));
            }
            @keyframes gradient-shift {
              0% {
                background-position: 0% center;
              }
              50% {
                background-position: 100% center;
              }
              100% {
                background-position: 0% center;
              }
            }
          `}</style>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: paragraphY, opacity: paragraphOpacity }}
          className='text-center text-lg md:text-xl text-[#a0a0b0] max-w-[620px] leading-relaxed'
        >
          Monitor infrastructure in real-time, automate incident response with AI-powered ActionBooks, and resolve
          issues before they impact your business.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: buttonsY, opacity: buttonsOpacity }}
          className='flex flex-col sm:flex-row gap-4'
        >
          <Button
            asChild
            className='bg-[#00BEB8] hover:bg-[#00a8a3] text-[#1a1a2e] font-semibold text-sm h-11 px-6 rounded-lg flex items-center gap-2'
          >
            <Link to='/signup' search={{ token: undefined, email: undefined }}>
              Start Free Trial
              <ArrowRight className='w-4 h-4' />
            </Link>
          </Button>
          <Button
            variant='outline'
            className='border-white bg-transparent hover:bg-[#2a2a3e] text-white text-sm h-11 px-6 rounded-lg'
          >
            View Architecture
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: statsY, opacity: statsOpacity }}
          className='flex flex-wrap justify-center gap-6 md:gap-10 mt-4'
        >
          <StatItem icon={<CheckCircle className='w-4 h-4' />} value='99.9%' label='Uptime SLA' />
          <StatItem icon={<Clock className='w-4 h-4' />} value='< 30s' label='Incident Response' />
          <StatItem icon={<Cpu className='w-4 h-4' />} value='AI-Powered' label='ActionBook Engine' />
        </motion.div>
      </div>

      {/* Scroll indicator - positioned from browser bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className='absolute bottom-[120px] left-1/2 -translate-x-1/2 z-10'
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className='w-6 h-10 rounded-full border-2 border-[#3a3a4e] flex justify-center pt-2'
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className='w-1 h-2 rounded-full bg-[#00BEB8]'
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className='flex flex-col items-center gap-1.5 px-5 py-3 rounded-lg bg-[#2a2a3e]/50 border border-[#3a3a4e] w-[160px]'>
      <div className='text-[#00BEB8]'>{icon}</div>
      <p className='text-white font-semibold text-sm'>{value}</p>
      <p className='text-[#707080] text-xs'>{label}</p>
    </div>
  );
}
