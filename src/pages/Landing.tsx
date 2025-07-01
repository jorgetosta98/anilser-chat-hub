
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PageTransition } from '@/components/ui/page-transition';

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
        <LandingFooter />
      </div>
    </PageTransition>
  );
}
