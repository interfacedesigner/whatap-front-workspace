const footerLinks: Record<string, string[]> = {
  Product: ['Features', 'Architecture', 'Pricing', 'Changelog'],
  Developers: ['Documentation', 'API Reference', 'Agent SDK', 'ActionBook DSL'],
  Resources: ['Blog', 'Community', 'Status Page', 'Support'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance'],
};

export default function Footer() {
  return (
    <footer className='border-t border-border/20 py-16 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8'>
          {/* Brand column */}
          <div className='col-span-2 md:col-span-1'>
            <div className='flex items-center mb-4'>
              <span className='text-foreground' style={{ fontSize: 'var(--text-lg)' }}>
                <span style={{ fontWeight: 100 }}>Ops</span>
                <span style={{ fontWeight: 'var(--font-weight-normal)' as unknown as number }}>Gent</span>
              </span>
            </div>
            <p className='text-muted-foreground' style={{ fontSize: 'var(--text-xs)', lineHeight: '1.6' }}>
              AI-powered operations agent for modern infrastructure. Detect, classify, remediate — autonomously.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <span
                className='text-foreground block mb-4'
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-bold)' as unknown as number,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {category}
              </span>
              <ul className='flex flex-col gap-2'>
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href='#'
                      className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className='mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4'>
          <span className='text-muted-foreground' style={{ fontSize: 'var(--text-xs)' }}>
            &copy; 2026 OpsGent. All rights reserved.
          </span>
          <div className='flex items-center gap-6'>
            {['GitHub', 'Discord', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                style={{ fontSize: 'var(--text-xs)' }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
