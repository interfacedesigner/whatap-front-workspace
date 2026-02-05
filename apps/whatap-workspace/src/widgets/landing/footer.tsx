import { ScrollReveal, StaggerContainer, StaggerItem } from '@/shared/components/motion';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Updates'],
  Resources: ['Documentation', 'Guides', 'Support'],
  Company: ['About', 'Blog', 'Careers'],
  Legal: ['Terms of Service', 'Privacy Policy'],
};

export function Footer() {
  return (
    <footer className='bg-white border-t border-[#adadad]'>
      <div className='max-w-[1092px] mx-auto px-4 py-10'>
        {/* Links Grid */}
        <StaggerContainer stagger={0.1} className='grid grid-cols-2 md:grid-cols-4 gap-7 mb-10'>
          {Object.entries(footerLinks).map(([category, links]) => (
            <StaggerItem key={category} distance={40}>
              <div>
                <h4 className='text-sm font-bold text-[#222] mb-3.5'>{category}</h4>
                <ul className='space-y-2'>
                  {links.map((link) => (
                    <li key={link}>
                      <a href='#' className='text-sm text-[#757575] hover:text-[#296cf2] transition-colors'>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Copyright */}
        <ScrollReveal distance={30}>
          <div className='border-t border-[#adadad] pt-7'>
            <p className='text-sm text-[#757575] text-center'>© 2026 Workspace. All rights reserved.</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
