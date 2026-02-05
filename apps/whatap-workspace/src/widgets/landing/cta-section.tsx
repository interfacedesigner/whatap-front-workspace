import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';

export function CTASection() {
  const shouldReduce = useReducedMotion();

  return (
    <section className='py-16 px-4 bg-[rgba(215,226,255,0.3)] overflow-hidden'>
      <div className='max-w-[1092px] mx-auto flex flex-col items-center gap-7'>
        <motion.h2
          initial={{ opacity: shouldReduce ? 1 : 0, scale: shouldReduce ? 1 : 0.85, y: shouldReduce ? 0 : 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: shouldReduce ? 0 : 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className='text-3xl md:text-[40px] font-bold text-[#222] leading-tight text-center'
        >
          Start Today
        </motion.h2>
        <motion.div
          initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 40, scale: shouldReduce ? 1 : 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: shouldReduce ? 0 : 0.7,
            delay: shouldReduce ? 0 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className='flex gap-3.5'
        >
          <Button asChild className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-xs h-9 px-5 rounded'>
            <Link to='/signup' search={{ token: undefined, email: undefined }}>
              Get Started Free
            </Link>
          </Button>
          <Button variant='outline' className='border-[#adadad] text-[#222] text-xs h-9 px-5 rounded'>
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
