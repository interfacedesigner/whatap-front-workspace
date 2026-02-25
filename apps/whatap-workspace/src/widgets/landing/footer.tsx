import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Updates', 'Roadmap'],
  Resources: ['Documentation', 'Guides', 'API Reference', 'Support'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className='relative bg-[#1a1a2e] border-t border-[#3a3a4e]/50'>
      {/* Gradient overlay at top */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00BEB8]/50 to-transparent' />

      <div className='max-w-[1092px] mx-auto px-4 py-16'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-6 gap-10 mb-12'>
          {/* Brand Column */}
          <div className='md:col-span-2'>
            <ScrollReveal distance={30}>
              <div className='flex items-center gap-2.5 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-[#00BEB8] to-[#296cf2] rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>W</span>
                </div>
                <span className='text-xl font-bold text-white'>OpsGent</span>
              </div>
              <p className='text-sm text-[#a0a0b0] leading-relaxed mb-6 max-w-[280px]'>
                Next-generation AIOps platform for intelligent operations and automated incident response.
              </p>

              {/* Social Links */}
              <div className='flex gap-3'>
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className='w-10 h-10 rounded-lg bg-[#2a2a42] border border-[#3a3a4e] flex items-center justify-center text-[#a0a0b0] hover:text-[#00BEB8] hover:border-[#00BEB8]/50 transition-colors'
                    aria-label={social.label}
                  >
                    <social.icon className='w-4 h-4' />
                  </motion.a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Links Columns */}
          <StaggerContainer stagger={0.1} className='md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8'>
            {Object.entries(footerLinks).map(([category, links]) => (
              <StaggerItem key={category} distance={30}>
                <div>
                  <h4 className='text-sm font-semibold text-white mb-4'>{category}</h4>
                  <ul className='space-y-3'>
                    {links.map((link) => (
                      <li key={link}>
                        <motion.a
                          href='#'
                          whileHover={{ x: 4 }}
                          className='text-sm text-[#a0a0b0] hover:text-[#00BEB8] transition-colors inline-flex items-center gap-1 group'
                        >
                          <span className='w-0 h-px bg-[#00BEB8] group-hover:w-2 transition-all duration-300' />
                          {link}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Divider */}
        <div className='h-px bg-gradient-to-r from-transparent via-[#3a3a4e] to-transparent mb-8' />

        {/* Bottom Bar */}
        <ScrollReveal distance={20}>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-[#757575]'>© 2026 OpsGent. All rights reserved.</p>
            <div className='flex items-center gap-6'>
              <motion.a href='#' whileHover={{ color: '#00BEB8' }} className='text-sm text-[#757575] transition-colors'>
                Status
              </motion.a>
              <motion.a href='#' whileHover={{ color: '#00BEB8' }} className='text-sm text-[#757575] transition-colors'>
                Security
              </motion.a>
              <motion.a href='#' whileHover={{ color: '#00BEB8' }} className='text-sm text-[#757575] transition-colors'>
                Sitemap
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom gradient line */}
      <div className='h-1 bg-gradient-to-r from-[#00BEB8] via-[#296cf2] to-[#8b5cf6]' />
    </footer>
  );
}
