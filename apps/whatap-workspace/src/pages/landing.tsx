import {
  CorePrinciplesSection,
  CtaSection,
  Footer,
  Header,
  HeroSection,
  HowItWorksSection,
  MvpFeaturesSection,
  ProblemSection,
} from '@/widgets/landing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/landing')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <CorePrinciplesSection />
        <HowItWorksSection />
        <MvpFeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
