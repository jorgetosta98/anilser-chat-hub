
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingIntegrations } from '@/components/landing/LandingIntegrations';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingTestimonials } from '@/components/landing/LandingTestimonials';
import { LandingResources } from '@/components/landing/LandingResources';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PageTransition } from '@/components/ui/page-transition';

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <LandingHero />
        <LandingFeatures />
        <LandingIntegrations />
        <LandingPricing />
        <LandingTestimonials />
        <LandingResources />
        <LandingCTA />
        <LandingFooter />
      </div>
    </PageTransition>
  );
}
