import React from "react";
import Header from "../components/Header";
import { HeroSection, CallToAction } from "@/components/landing-page";
import Footer from "../components/Footer";
import Showcase from "@/components/landing-page/Showcase";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Talent Showcase */}
      <Showcase />

      {/* Call to Action */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
}
