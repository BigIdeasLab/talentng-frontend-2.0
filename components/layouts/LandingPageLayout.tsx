import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
