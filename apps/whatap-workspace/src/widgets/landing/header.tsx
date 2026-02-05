import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { motion, useScroll, useTransform } from 'motion/react';

export function Header() {
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']);
  const headerShadow = useTransform(scrollY, [0, 100], ['0 0 0 rgba(0,0,0,0)', '0 1px 8px rgba(0,0,0,0.08)']);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 12]);
  const backdropFilterValue = useTransform(headerBlur, (v) => `blur(${v}px)`);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        boxShadow: headerShadow,
        backdropFilter: backdropFilterValue,
        WebkitBackdropFilter: backdropFilterValue,
      }}
      className='fixed top-0 left-0 right-0 z-50 border-b border-[#adadad]'
    >
      <div className='max-w-[1120px] mx-auto px-4'>
        <div className='flex items-center justify-between h-14'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-[#296cf2] rounded' />
            <span className='text-xl font-bold text-[#222]'>WhaTap</span>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center gap-5'>
            <a href='#features' className='text-sm text-[#222] hover:text-[#296cf2] transition-colors'>
              Features
            </a>
            <a href='#pricing' className='text-sm text-[#222] hover:text-[#296cf2] transition-colors'>
              Pricing
            </a>
            <a href='#docs' className='text-sm text-[#222] hover:text-[#296cf2] transition-colors'>
              Docs
            </a>
          </nav>

          {/* CTA Button */}
          <Button asChild className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-xs h-8 px-3.5 rounded'>
            <Link to='/signup' search={{ token: undefined, email: undefined }}>
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
