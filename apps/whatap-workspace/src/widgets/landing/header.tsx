import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { motion, useScroll, useTransform } from 'motion/react';

export function Header() {
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(26, 26, 46, 0.8)', 'rgba(26, 26, 46, 0.95)']);
  const headerShadow = useTransform(scrollY, [0, 100], ['0 0 0 rgba(0,0,0,0)', '0 4px 30px rgba(0,0,0,0.3)']);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);
  const backdropFilterValue = useTransform(headerBlur, (v) => `blur(${v}px)`);

  // Header 하단 glow 강도 (스크롤 시 감소)
  const bottomGlowOpacity = useTransform(scrollY, [0, 150], [0.6, 0.2]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        boxShadow: headerShadow,
        backdropFilter: backdropFilterValue,
        WebkitBackdropFilter: backdropFilterValue,
      }}
      className='fixed top-0 left-0 right-0 z-50 border-b border-[#3a3a4e]/50'
    >
      {/* Header bottom glow - blends with Hero section */}
      <motion.div
        style={{ opacity: bottomGlowOpacity }}
        className='absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none'
      >
        <div
          className='absolute inset-0'
          style={{
            background: `
              linear-gradient(
                to bottom,
                transparent 0%,
                rgba(41, 108, 242, 0.08) 40%,
                rgba(139, 82, 255, 0.06) 70%,
                transparent 100%
              )
            `,
          }}
        />
      </motion.div>

      <div className='max-w-[1120px] mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/landing' className='flex items-center gap-2.5 group'>
            <div className='w-8 h-8 bg-gradient-to-br from-[#00BEB8] to-[#296cf2] rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>W</span>
            </div>
            <span className='text-xl font-bold text-white group-hover:text-[#00BEB8] transition-colors'>OpsGent</span>
          </Link>

          {/* Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            <NavLink href='#features'>Features</NavLink>
            <NavLink href='#architecture'>Architecture</NavLink>
            <NavLink href='#workflow'>Workflow</NavLink>
          </nav>

          {/* Auth Buttons */}
          <div className='flex items-center gap-4'>
            <Link to='/login' className='text-sm text-[#a0a0b0] hover:text-white transition-colors'>
              Sign In
            </Link>
            <Button
              asChild
              className='bg-[#00BEB8] hover:bg-[#00a8a3] text-[#1a1a2e] font-semibold text-sm h-9 px-4 rounded-lg'
            >
              <Link to='/signup' search={{ token: undefined, email: undefined }}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className='text-sm text-[#a0a0b0] hover:text-white transition-colors relative group'>
      {children}
      <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BEB8] transition-all duration-300 group-hover:w-full' />
    </a>
  );
}
