import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'OpsGent reduced our incident response time from 47 minutes to 38 seconds — a 94% improvement. The AI ActionBooks handle database pool exhaustion, API rate limits, and canary rollbacks without waking engineers at 3 AM.',
    name: 'Jane Davidson',
    title: 'VP Engineering',
    company: 'TechCorp',
    initials: 'JD',
    rating: 5,
  },
  {
    quote:
      'Dynamic Baseline eliminated 89% of our false alerts. No more manual threshold tuning — the P95 auto-adjustment saved us 12 hours per week and caught 3 production outages before customers noticed.',
    name: 'Michael Chen',
    title: 'CTO',
    company: 'DataFlow',
    initials: 'MC',
    rating: 5,
  },
  {
    quote:
      'Cascade Rollback saved us during a midnight deployment disaster. When step 3 of our 5-step migration failed, OpsGent automatically reversed steps 2 and 1 — restoring service in 22 seconds. Game changer.',
    name: 'Sarah Williams',
    title: 'Site Reliability Lead',
    company: 'CloudScale',
    initials: 'SW',
    rating: 5,
  },
  {
    quote:
      'The NotionServer integration is brilliant. Our on-call engineers document incidents in real-time via Notion, and OpsGent auto-generates runbooks from those notes. Knowledge sharing has never been easier.',
    name: 'David Park',
    title: 'DevOps Director',
    company: 'SecureNet',
    initials: 'DP',
    rating: 5,
  },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function SocialProofSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const cardY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const statsY = useTransform(scrollYProgress, [0, 1], [150, -50]);

  return (
    <section ref={ref} className='relative py-20 px-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Section header with parallax */}
        <motion.div style={{ y: headerY, opacity }} className='text-center mb-12'>
          <h2
            className='text-foreground'
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-bold)' as unknown as number,
              letterSpacing: '-0.02em',
            }}
          >
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonial carousel */}
        <motion.div style={{ scale, y: cardY, opacity }} className='max-w-4xl mx-auto'>
          <div className='relative'>
            <div
              className='relative bg-card/5 border border-border/10 rounded-lg p-8 md:p-10 backdrop-blur-sm overflow-hidden'
              style={{
                background: 'color-mix(in srgb, var(--foreground) 3%, transparent)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Quote
                size={32}
                className='text-primary absolute top-6 left-6 opacity-20 z-0'
                style={{ strokeWidth: 1.5 }}
              />

              <AnimatePresence mode='wait' initial={false} custom={direction}>
                {(() => {
                  const current = testimonials[currentIndex]!;
                  return (
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial='enter'
                      animate='center'
                      exit='exit'
                      transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                      className='relative z-10'
                    >
                      <p
                        className='text-foreground'
                        style={{ fontSize: 'var(--text-base)', lineHeight: '1.7', opacity: 0.95, marginBottom: '16px' }}
                      >
                        &ldquo;{current.quote}&rdquo;
                      </p>

                      <div className='flex items-center gap-4'>
                        <div
                          className='w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0'
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-bold)' as unknown as number,
                            color: 'var(--primary)',
                          }}
                        >
                          {current.initials}
                        </div>
                        <div className='flex-1'>
                          <div
                            className='text-foreground'
                            style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)' as unknown as number,
                            }}
                          >
                            {current.name}
                          </div>
                          <div
                            className='text-muted-foreground'
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-normal)' as unknown as number,
                            }}
                          >
                            {current.title}, {current.company}
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className='flex items-center gap-1'>
                          {[...Array(current.rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className='text-chart-4'
                              fill='var(--chart-4)'
                              style={{ opacity: 0.9 }}
                            />
                          ))}
                          <span
                            className='ml-2 text-muted-foreground'
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)' as unknown as number,
                            }}
                          >
                            {current.rating}.0
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrev}
              className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 w-10 h-10 rounded-full bg-card/10 border border-border/20 flex items-center justify-center backdrop-blur-sm hover:bg-card/20 transition-all duration-300'
              aria-label='Previous testimonial'
            >
              <ChevronLeft size={20} className='text-foreground' />
            </button>
            <button
              onClick={handleNext}
              className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 w-10 h-10 rounded-full bg-card/10 border border-border/20 flex items-center justify-center backdrop-blur-sm hover:bg-card/20 transition-all duration-300'
              aria-label='Next testimonial'
            >
              <ChevronRight size={20} className='text-foreground' />
            </button>

            {/* Pagination dots */}
            <div className='flex justify-center gap-2 mt-6'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className='w-2 h-2 rounded-full transition-all duration-300'
                  style={{
                    backgroundColor: i === currentIndex ? 'var(--primary)' : 'var(--muted-foreground)',
                    opacity: i === currentIndex ? 1 : 0.3,
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <motion.div style={{ y: statsY }} className='grid grid-cols-3 gap-4 mt-8'>
            {[
              { label: 'G2 Rating', value: '4.9/5' },
              { label: 'Avg MTTR', value: '38s' },
              { label: 'Uptime', value: '99.97%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className='text-center bg-card/5 border border-border/10 rounded-md py-3 backdrop-blur-sm'
              >
                <div
                  className='text-primary'
                  style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' as unknown as number }}
                >
                  {stat.value}
                </div>
                <div
                  className='text-muted-foreground mt-1'
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' as unknown as number }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
