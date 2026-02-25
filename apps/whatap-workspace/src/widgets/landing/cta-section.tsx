import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function CTASection() {
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={sectionRef} className='relative py-24 px-4 bg-[#222222] overflow-hidden'>
      {/* Animated Background */}
      <motion.div
        style={{ y: y1 }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-[#00BEB8]/20 via-[#296cf2]/20 to-[#8b5cf6]/20 blur-3xl'
      />

      {/* Floating particles */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 rounded-full bg-[#00BEB8]/40'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div style={{ scale }} className='relative max-w-[800px] mx-auto'>
        {/* Content Card */}
        <div className='relative bg-gradient-to-br from-[#2a2a42]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-[#3a3a4e] rounded-2xl p-12 md:p-16 text-center overflow-hidden'>
          {/* Inner glow */}
          <div className='absolute inset-0 bg-gradient-to-br from-[#00BEB8]/5 via-transparent to-[#296cf2]/5 rounded-2xl' />

          {/* Heading */}
          <motion.h2
            initial={{ opacity: shouldReduce ? 1 : 0, scale: shouldReduce ? 1 : 0.85, y: shouldReduce ? 0 : 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: shouldReduce ? 0 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className='text-3xl md:text-4xl font-bold text-white leading-tight mb-6'
          >
            Ready to Transform Your{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BEB8] to-[#296cf2]'>
              Operations
            </span>
            ?
          </motion.h2>

          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0.2,
            }}
            className='text-base text-[#a0a0b0] mb-10 max-w-md mx-auto'
          >
            Join thousands of teams using WhaTap AIOps to monitor, detect, and resolve infrastructure incidents
            automatically.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 40, scale: shouldReduce ? 1 : 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: shouldReduce ? 0 : 0.7,
              delay: shouldReduce ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <Button
              asChild
              className='bg-[#00BEB8] hover:bg-[#00a8a3] text-[#1a1a2e] font-semibold text-sm h-11 px-6 rounded-lg shadow-lg shadow-[#00BEB8]/25 group'
            >
              <Link to='/signup' search={{ token: undefined, email: undefined }}>
                Start Free Trial
                <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
              </Link>
            </Button>
            <Button
              variant='outline'
              className='border-[#3a3a4e] hover:border-[#00BEB8]/50 text-white hover:text-[#00BEB8] bg-transparent text-sm h-11 px-6 rounded-lg transition-colors'
            >
              Schedule Demo
            </Button>
          </motion.div>

          {/* Corner decorations */}
          <div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00BEB8]/10 to-transparent rounded-br-full' />
          <div className='absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#296cf2]/10 to-transparent rounded-tl-full' />
        </div>
      </motion.div>
    </section>
  );
}
