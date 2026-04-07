"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TalentPublicData } from "@/lib/mock-data/talents-detail";

export interface TalentDetailPublicProps {
  data: TalentPublicData;
}

const tabs = [
  { id: "works", label: "Works" },
  { id: "about", label: "About" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function TalentDetailPublic({ data }: TalentDetailPublicProps) {
  const [activeTab, setActiveTab] = useState<TabId>("works");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.fullName,
    jobTitle: data.headline,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.location,
    },
    description: data.bio,
    knowsAbout: data.skills,
    image: data.avatar,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col lg:flex-row max-w-[1280px] mx-auto">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[350px] flex-shrink-0 lg:border-r border-[#E1E4EA] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="px-[25px] py-[15px]">
            {/* Avatar + Info */}
            <div className="flex flex-col items-center gap-[20px]">
              <div className="relative w-[110px] h-[110px]">
                <Image
                  src={data.avatar}
                  alt={data.fullName}
                  width={110}
                  height={110}
                  className="w-full h-full object-cover rounded-full"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default.png";
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-[12px] w-full">
                <div className="text-center">
                  <h1 className="text-[16px] font-medium text-black font-inter-tight">
                    {data.fullName}
                  </h1>
                  {data.headline && (
                    <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                      {data.headline}
                    </p>
                  )}
                </div>

                {/* Stats rows */}
                <div className="flex flex-col items-start gap-[10px] w-full">
                  {data.location && (
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="w-[18px] h-[18px] text-[#525866]" />
                      <span className="text-[12px] font-normal text-black font-inter-tight">
                        {data.location}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-[6px]">
                    <Clock className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {data.timesHired}x Hired
                    </span>
                  </div>

                  {data.availability && data.availability.length > 0 && (
                    <div className="flex items-center gap-[6px]">
                      <CalendarCheck className="w-[18px] h-[18px] text-[#525866]" />
                      <span className="text-[12px] font-normal text-black font-inter-tight">
                        {data.availability.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/signup"
              className="w-full mt-[20px] h-[44px] rounded-full bg-[#5C30FF] hover:bg-[#4a26d4] transition-colors text-white text-[14px] font-normal font-inter-tight flex items-center justify-center"
            >
              Sign Up to Hire
            </Link>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mt-[20px] flex flex-col items-start gap-[12px]">
                <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-[6px] w-full">
                  {data.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-[10px] py-[6px] rounded-full bg-[#F5F5F5]"
                    >
                      <span className="text-[11px] font-normal text-black font-inter-tight">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & Stack */}
            {data.stack && data.stack.length > 0 && (
              <div className="mt-[20px] flex flex-col items-start gap-[12px]">
                <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                  Tools & Stack
                </h3>
                <div className="flex flex-wrap gap-[6px] w-full">
                  {data.stack.map((tool, idx) => (
                    <div
                      key={idx}
                      className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]"
                    >
                      <div className="w-[16px] h-[16px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                      <span className="text-[11px] font-normal text-black font-inter-tight">
                        {tool}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content */}
        <main className="flex-1 flex flex-col min-h-0 pb-24 lg:pb-0">
          {/* Tab Navigation */}
          <div className="flex items-center w-full bg-white border-b border-[#E1E4EA] sticky top-0 z-30">
            <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
                    activeTab === tab.id
                      ? "text-black"
                      : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {/* Works Tab */}
            {activeTab === "works" && (
              <div className="w-full px-[20px] py-[20px]">
                {data.gallery && data.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-[15px] auto-rows-max">
                    {data.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="group relative w-full overflow-hidden rounded-lg bg-gray-100"
                        style={{ aspectRatio: "4/3" }}
                      >
                        <Image
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-[13px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                      No portfolio items yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full max-w-[700px]">
                {/* Bio */}
                {data.bio && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-black font-inter-tight">
                      About {data.fullName}
                    </h2>
                    <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                      {data.bio.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Details */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    Professional Details
                  </h2>
                  <div className="flex flex-col gap-2">
                    {data.category && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          Category
                        </div>
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          {data.category}
                        </div>
                      </div>
                    )}

                    {data.location && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          Location
                        </div>
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          {data.location}
                        </div>
                      </div>
                    )}

                    {data.availability && data.availability.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          Availability
                        </div>
                        <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px] sm:text-right">
                          {data.availability.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-black font-inter-tight">
                      Experience
                    </h2>
                    <div className="flex flex-col gap-4">
                      {data.experience.map((exp, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-2 px-3 py-3 rounded-[8px] border border-[#E1E4EA]"
                        >
                          <div className="text-[14px] font-semibold text-black font-inter-tight">
                            {exp.title}
                          </div>
                          <div className="text-[13px] font-normal text-black/70 font-inter-tight">
                            {exp.company}
                          </div>
                          <div className="text-[12px] font-normal text-black/50 font-inter-tight">
                            {exp.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E1E4EA] p-4 z-40">
        <Link
          href="/signup"
          className="block w-full h-[44px] rounded-full bg-[#5C30FF] hover:bg-[#4a26d4] transition-colors text-white text-center text-[14px] font-normal font-inter-tight leading-[44px]"
        >
          Sign Up to Hire
        </Link>
      </div>
    </div>
  );
}
