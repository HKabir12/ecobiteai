import CTA from "@/components/landing/CTA";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

import Pricing from "@/components/landing/Pricing";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />

      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />

      <FAQ />
    </div>
  );
}
