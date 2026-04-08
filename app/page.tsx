"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DiscoverSection } from "@/components/landing/DiscoverSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="font-inter-tight bg-white min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <RolesSection />
      <HowItWorksSection />
      <DiscoverSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
