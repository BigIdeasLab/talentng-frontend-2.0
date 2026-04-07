"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecruiterPublicData } from "@/lib/mock-data/recruiters-detail";
import { TYPE_CONFIG } from "@/lib/types/opportunities";

export interface RecruiterDetailPublicProps {
  data: RecruiterPublicData;
}

type TabType = "about" | "opportunities";

const tabs: { id: TabType; label: string }[] = [
  { id: "about", label: "About" },
  { id: "opportunities", label: "Open Opportunities" },
];

export function RecruiterDetailPublic({ data }: RecruiterDetailPublicProps) {
  const [activeTab, setActiveTab] = useState<TabType>("about");

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.companyName,
    description: data.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.location,
    },
    logo: data.companyLogo,
    industry: data.industry,
  };

  return (
    <div className="bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[350px_1fr] gap-0">
          {/* Left Sidebar */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-r border-[#E1E4EA] px-[25px] py-[15px]">
            <div className="flex flex-col items-center gap-[20px]">
              {/* Company Logo */}
              <div className="relative w-[110px] h-[110px]">
                {data.companyLogo ? (
                  <img
                    src={data.companyLogo}
                    alt={data.companyName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ backgroundColor: data.logoBg }}
                  >
                    {data.initials}
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex flex-col items-center gap-[12px] w-full">
                <div className="text-center">
                  <h1 className="text-[16px] font-medium text-black font-inter-tight">
                    {data.companyName}
                  </h1>
                  {data.industry && (
                    <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                      {data.industry}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-col items-start gap-[10px] w-full">
                  {/* Location */}
                  {data.location && (
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="w-[18px] h-[18px] text-[#525866]" />
                      <span className="text-[12px] font-normal text-black font-inter-tight">
                        {data.location}
                      </span>
                    </div>
                  )}

                  {/* Jobs Posted */}
                  <div className="flex items-center gap-[6px]">
                    <Briefcase className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {data.jobsPosted} Jobs Posted
                    </span>
                  </div>

                  {/* Talents Hired */}
                  <div className="flex items-center gap-[6px]">
                    <Users className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {data.talentsHired} Talents Hired
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Opportunities Button */}
            <button
              onClick={() => setActiveTab("opportunities")}
              className="w-full h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] text-white font-normal text-[14px] font-inter-tight transition-colors mt-[20px]"
            >
              View Opportunities
            </button>

            {/* Sign Up CTA */}
            <Link
              href="/signup"
              className="flex items-center justify-center w-full h-[44px] rounded-full bg-[#5C30FF] hover:bg-[#4a26d4] text-white font-normal text-[14px] font-inter-tight transition-colors mt-[10px]"
            >
              Sign Up to Apply
            </Link>
          </div>

          {/* Right Content */}
          <main className="flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="flex items-center gap-0 border-b border-[#E1E4EA] sticky top-0 bg-white z-30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
                    activeTab === tab.id
                      ? "text-black"
                      : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5">
                  {/* About Section */}
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-black font-inter-tight">
                      About {data.companyName}
                    </h2>
                    <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                      {data.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  </div>

                  {/* Hiring For Section */}
                  {data.hiringFor && data.hiringFor.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-lg font-semibold text-black font-inter-tight">
                        Hiring For
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.hiringFor.map((role, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-full bg-[#F5F5F5] text-black text-sm font-medium font-inter-tight"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Open Opportunities Tab */}
              {activeTab === "opportunities" && (
                <div className="p-3 md:p-4 lg:p-5 pb-20">
                  {data.openPositions && data.openPositions.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {data.openPositions.map((position) => {
                        const config =
                          TYPE_CONFIG[position.type] || TYPE_CONFIG["FullTime"];
                        return (
                          <Link
                            key={position.id}
                            href={`/opportunities-public/${position.id}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#E1E4EA] rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="space-y-1.5">
                              <h3 className="text-[14px] font-semibold text-black font-inter-tight">
                                {position.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-[12px] text-[rgba(0,0,0,0.50)] font-inter-tight">
                                <span>{position.location}</span>
                                <span className="text-[#E1E4EA]">•</span>
                                <span>{position.postedDate}</span>
                              </div>
                            </div>
                            <div
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md flex-shrink-0 self-start sm:self-center"
                              style={{
                                backgroundColor: `${config.dotColor}1A`,
                              }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: config.dotColor }}
                              />
                              <span
                                className="text-sm font-normal"
                                style={{ color: config.dotColor }}
                              >
                                {config.label}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center py-12">
                      <div className="text-center">
                        <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-[13px] text-gray-500 font-inter-tight">
                          No open opportunities yet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
