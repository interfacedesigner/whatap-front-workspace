import {
  ArchitectureSection,
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  Navbar,
  SocialProofSection,
  WorkflowSection,
} from '@/widgets/landing';
import { createFileRoute } from '@tanstack/react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect } from 'react';

export const Route = createFileRoute('/landing')({
  component: LandingPage,
});

function LandingPage() {
  const { scrollY } = useScroll();

  /* Parallax orbs for dark Hero section */
  const globalOrb1Y = useTransform(scrollY, [0, 5000], [0, 600]);
  const globalOrb2Y = useTransform(scrollY, [0, 5000], [0, -400]);

  /* Smooth-scroll for anchor links */
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className='landing-theme min-h-screen overflow-x-hidden max-w-[1920px] mx-auto'>
      {/* ── Navbar — always dark, always on top ── */}
      <div className='dark contents'>
        <Navbar />
      </div>

      {/* ── 1. DARK: Hero ── */}
      <div className='dark relative bg-background text-foreground'>
        {/* Ambient orbs */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <motion.div
            className='absolute top-[10%] left-[-15%] w-[700px] h-[700px] rounded-full bg-primary opacity-[0.04] blur-[200px]'
            style={{ y: globalOrb1Y }}
          />
          <motion.div
            className='absolute top-[55%] right-[-12%] w-[550px] h-[550px] rounded-full bg-chart-3 opacity-[0.03] blur-[180px]'
            style={{ y: globalOrb2Y }}
          />
        </div>
        <div className='relative z-10'>
          <HeroSection />
        </div>
      </div>

      {/* ── 2. LIGHT: Features ── */}
      <div className='bg-background text-foreground'>
        <FeaturesSection />
      </div>

      {/* ── 2.5. LIGHT: Social Proof ── */}
      <div className='bg-background text-foreground'>
        <SocialProofSection />
      </div>

      {/* ── 3. DARK: Architecture ── */}
      <div className='dark relative bg-background text-foreground'>
        {/* Ambient glow */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <div className='absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chart-3 opacity-[0.04] blur-[180px]' />
          <div className='absolute bottom-[10%] right-[-8%] w-[400px] h-[400px] rounded-full bg-primary opacity-[0.03] blur-[160px]' />
        </div>
        <div className='relative z-10'>
          <ArchitectureSection />
        </div>
      </div>

      {/* ── 4. LIGHT: Workflow ── */}
      <div className='bg-background text-foreground'>
        <WorkflowSection />
      </div>

      {/* ── 5. DARK: CTA ── */}
      <div className='dark relative bg-background text-foreground'>
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <div className='absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary opacity-[0.05] blur-[200px]' />
        </div>
        <div className='relative z-10'>
          <CTASection />
        </div>
      </div>

      {/* ── 6. LIGHT: Footer ── */}
      <div className='bg-background text-foreground'>
        <Footer />
      </div>
    </div>
  );
}
