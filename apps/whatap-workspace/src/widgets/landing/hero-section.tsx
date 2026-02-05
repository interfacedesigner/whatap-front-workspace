import { Button } from '@/shared/components/ui/button';
import { useIsMobile } from '@/shared/hooks/use-media-query';
import { Link } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { DashboardMock } from './dashboard-mock';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const shouldReduce = useReducedMotion();
  const disabled = isMobile || shouldReduce;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Heading: slow rise with fade + scale shrink
  const headingY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -200]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.5], [1, disabled ? 1 : 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.5], [1, disabled ? 1 : 0.9]);

  // Paragraph: medium speed parallax
  const paragraphY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -140]);
  const paragraphOpacity = useTransform(scrollYProgress, [0, 0.55], [1, disabled ? 1 : 0]);

  // Buttons: float upward
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -100]);
  const buttonsOpacity = useTransform(scrollYProgress, [0, 0.6], [1, disabled ? 1 : 0]);

  // Video: strong parallax with scale + 3D rotation for depth
  const videoY = useTransform(scrollYProgress, [0, 1], [0, disabled ? 0 : -280]);
  const videoScale = useTransform(scrollYProgress, [0, 0.4], [disabled ? 1 : 0.92, 1]);
  const videoRotateX = useTransform(scrollYProgress, [0, 0.3], [disabled ? 0 : 3, 0]);

  return (
    <section ref={sectionRef} className='pt-28 pb-16 px-4 overflow-hidden'>
      <div className='max-w-[1092px] mx-auto flex flex-col items-center gap-7'>
        {/* Heading - entrance animation + scroll parallax */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: headingY, opacity: headingOpacity, scale: headingScale }}
          className='text-center max-w-[765px]'
        >
          <h1 className='text-4xl md:text-[56px] font-bold leading-tight text-[#222]'>
            Unified Operations Console for Your Entire Infrastructure
          </h1>
        </motion.div>

        {/* Paragraph - staggered entrance */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: paragraphY, opacity: paragraphOpacity }}
          className='text-center text-lg md:text-xl text-[#757575] max-w-[585px] leading-7'
        >
          Monitor and manage your infrastructure by workspace, not by scattered projects. From installation to insights,
          everything in one integrated flow.
        </motion.p>

        {/* Buttons - staggered entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: buttonsY, opacity: buttonsOpacity }}
          className='flex gap-3.5'
        >
          <Button asChild className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-xs h-9 px-5 rounded'>
            <Link to='/signup' search={{ token: undefined, email: undefined }}>
              Start Free Trial
            </Link>
          </Button>
          <Button
            variant='outline'
            className='border-[#adadad] text-[#222] text-xs h-9 px-3.5 rounded flex items-center gap-2'
          >
            <Play className='w-3.5 h-3.5' />
            Watch Demo
          </Button>
        </motion.div>

        {/* Dashboard Mock - dramatic entrance with 3D perspective */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: videoY,
            scale: videoScale,
            rotateX: videoRotateX,
            perspective: 1200,
          }}
          className='w-full max-w-[896px] aspect-video rounded-lg shadow-lg overflow-hidden border border-[#adadad]/30'
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}
