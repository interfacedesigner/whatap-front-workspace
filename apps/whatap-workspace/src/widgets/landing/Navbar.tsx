import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Docs', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/70 backdrop-blur-2xl border-b border-border/10' : ''
      }`}
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-4'>
        {/* Logo */}
        <a href='#' className='flex items-center'>
          <span className='text-foreground' style={{ fontSize: 'var(--text-lg)' }}>
            <span style={{ fontWeight: 100 }}> Ops</span>
            <span style={{ fontWeight: 'var(--font-weight-normal)' as unknown as number }}>Gent</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-muted-foreground hover:text-foreground transition-colors duration-300'
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className='hidden md:flex items-center gap-4'>
          <Link
            to='/login'
            className='text-muted-foreground hover:text-foreground transition-colors'
            style={{ fontSize: 'var(--text-sm)' }}
          >
            Sign In
          </Link>
          <Link
            to='/signup'
            search={{ token: undefined, email: undefined }}
            className='inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity'
            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className='md:hidden text-foreground p-1'
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label='Toggle menu'
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='md:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-b border-border/10'
          >
            <div className='px-6 py-4 flex flex-col gap-3'>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className='text-muted-foreground hover:text-foreground transition-colors py-2'
                  style={{ fontSize: 'var(--text-sm)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className='border-t border-border/10 pt-3 mt-1 flex flex-col gap-3'>
                <Link
                  to='/login'
                  className='text-muted-foreground hover:text-foreground transition-colors py-2'
                  style={{ fontSize: 'var(--text-sm)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to='/signup'
                  search={{ token: undefined, email: undefined }}
                  className='inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-md'
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as unknown as number }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
