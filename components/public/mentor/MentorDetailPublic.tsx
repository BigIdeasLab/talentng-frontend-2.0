"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MentorPublicData } from "@/lib/mock-data/mentors-detail";

export interface MentorDetailPublicProps {
  data: MentorPublicData;
}

export function MentorDetailPublic({ data }: MentorDetailPublicProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
    "overview",
  );

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.title,
    worksFor: data.company
      ? {
          "@type": "Organization",
          name: data.company,
        }
      : undefined,
    address: data.location
      ? {
          "@type": "PostalAddress",
          addressLocality: data.location,
        }
      : undefined,
    description: data.bio,
    knowsAbout: data.expertise,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data.rating,
      reviewCount: data.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    image: data.avatar,
  };

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "reviews" as const, label: `Reviews (${data.totalReviews})` },
  ];

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
          <div className="lg:sticky lg:top-0 lg:self-start lg:border-r border-[#E1E4EA] lg:h-screen lg:overflow-y-auto scrollbar-hidden">
            <div className="px-[25px] py-[15px]">
              <div className="flex flex-col gap-5">
                {/* Profile Section */}
                <div className="flex flex-col items-center gap-[20px]">
                  {/* Avatar */}
                  <div className="relative w-[110px] h-[110px] flex-shrink-0">
                    <Image
                      src={data.avatar}
                      alt={data.name}
                      width={110}
                      height={110}
                      className="w-full h-full rounded-full object-cover"
                      priority
                    />
                  </div>

                  {/* Info Container */}
                  <div className="flex flex-col items-center gap-[12px] w-full">
                    <div className="text-center">
                      <h1 className="text-[16px] font-medium text-black font-inter-tight">
                        {data.name}
                      </h1>
                      {data.title && (
                        <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                          {data.title}
                        </p>
                      )}
                      {data.company && (
                        <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                          {data.company}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-start gap-[10px] w-full">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 1.83L13.09 8.26H19.92L14.42 12.24L16.51 18.67L11 14.69L5.49 18.67L7.58 12.24L2.08 8.26H8.91L11 1.83Z"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[12px] font-normal text-black font-inter-tight">
                          {data.rating > 0 ? data.rating.toFixed(1) : "N/A"}{" "}
                          Rating
                        </span>
                      </div>

                      {/* Sessions Completed */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.29166 12.6807L5.49999 16.0418L6.43867 15.0584M15.125 5.9585L9.56724 11.7809"
                            stroke="#525866"
                            strokeWidth="1.375"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.875 12.6807L10.0833 16.0418L19.7083 5.9585"
                            stroke="#525866"
                            strokeWidth="1.375"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[12px] font-normal text-black font-inter-tight">
                          {data.totalSessions} Sessions Completed
                        </span>
                      </div>

                      {/* Session Duration */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 7.33301V10.9997L13.2917 13.2913"
                            stroke="#525866"
                            strokeWidth="1.375"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.1667 11.0002C20.1667 16.0627 16.0626 20.1668 11 20.1668C5.9374 20.1668 1.83334 16.0627 1.83334 11.0002C1.83334 5.93755 5.9374 1.8335 11 1.8335C16.0626 1.8335 20.1667 5.93755 20.1667 11.0002Z"
                            stroke="#525866"
                            strokeWidth="1.375"
                          />
                        </svg>
                        <span className="text-[12px] font-normal text-black font-inter-tight">
                          {data.sessionDuration} min / session
                        </span>
                      </div>

                      {/* Location */}
                      {data.location && (
                        <div className="flex items-center gap-1.5">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.4829 19.5865C12.0859 19.9586 11.5548 20.1665 11.0009 20.1665C10.4471 20.1665 9.91668 19.9586 9.51909 19.5865C5.87415 16.1571 0.992534 12.325 3.37478 6.76356C4.66105 3.7575 7.74903 1.8335 11.0009 1.8335C14.2485 1.8335 17.3365 3.7575 18.6228 6.76356C20.9992 12.3194 16.1281 16.168 12.4829 19.5865Z"
                              stroke="#525866"
                              strokeWidth="1.375"
                            />
                            <path
                              d="M14.2083 10.0832C14.2083 11.8551 12.7719 13.2915 11 13.2915C9.22812 13.2915 7.79166 11.8551 7.79166 10.0832C7.79166 8.31128 9.22812 6.87482 11 6.87482C12.7719 6.87482 14.2083 8.31128 14.2083 10.0832Z"
                              stroke="#525866"
                              strokeWidth="1.375"
                            />
                          </svg>
                          <span className="text-[12px] font-normal text-black font-inter-tight">
                            {data.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tools & Stack */}
                {data.stack && data.stack.length > 0 && (
                  <div className="flex flex-col items-start gap-[12px]">
                    <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                      Tools & Stack
                    </h3>
                    <div className="flex flex-wrap gap-[6px] w-full">
                      {data.stack.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-[11px] font-inter-tight"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button - Desktop */}
                <Link
                  href="/signup"
                  className="hidden lg:flex items-center justify-center w-full h-[44px] rounded-full bg-[#5C30FF] text-white font-normal text-[14px] font-inter-tight hover:bg-[#4a26d4] transition-colors"
                >
                  Sign Up to Book Session
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-col pb-24 lg:pb-0">
            {/* Tab Bar */}
            <div className="flex items-center gap-0 border-b border-[#E1E4EA] sticky top-0 z-30 bg-white">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative ${
                    activeTab === tab.key
                      ? "text-black"
                      : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="px-4 lg:px-6 py-5">
              {activeTab === "overview" && (
                <div className="max-w-[560px] flex flex-col gap-6 lg:gap-7">
                  {/* About */}
                  {data.bio && (
                    <div className="flex flex-col items-start gap-4 w-full">
                      <h2 className="text-lg font-semibold text-black font-inter-tight">
                        About
                      </h2>
                      <p className="text-[13px] font-normal text-black font-inter-tight leading-[22px] whitespace-pre-line">
                        {data.bio}
                      </p>
                    </div>
                  )}

                  {/* Expertise */}
                  {data.expertise && data.expertise.length > 0 && (
                    <div className="flex flex-col items-start gap-4 w-full">
                      <h2 className="text-lg font-semibold text-black font-inter-tight">
                        Expertise
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-[12px] font-inter-tight"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Industries */}
                  {data.industries && data.industries.length > 0 && (
                    <div className="flex flex-col items-start gap-4 w-full">
                      <h2 className="text-lg font-semibold text-black font-inter-tight">
                        Industries
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.industries.map((industry, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-[12px] font-inter-tight"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="max-w-[560px] flex flex-col gap-4">
                  {data.reviews && data.reviews.length > 0 ? (
                    data.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-[8px] border border-[#E1E4EA] p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="14"
                                height="14"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11 1.83L13.09 8.26H19.92L14.42 12.24L16.51 18.67L11 14.69L5.49 18.67L7.58 12.24L2.08 8.26H8.91L11 1.83Z"
                                  fill={
                                    i < review.rating ? "#FFD700" : "#E1E4EA"
                                  }
                                  stroke={
                                    i < review.rating ? "#FFD700" : "#E1E4EA"
                                  }
                                  strokeWidth="1"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[12px] text-black/30 font-inter-tight">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                          {review.comment}
                        </p>
                        <p className="text-[12px] text-black/50 font-inter-tight">
                          — {review.author}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-[rgba(0,0,0,0.30)] font-inter-tight text-center py-8">
                      No reviews yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E1E4EA] p-4 z-40">
        <Link
          href="/signup"
          className="flex items-center justify-center w-full h-[44px] rounded-full bg-[#5C30FF] text-white font-normal text-[14px] font-inter-tight hover:bg-[#4a26d4] transition-colors"
        >
          Sign Up to Book Session
        </Link>
      </div>
    </div>
  );
}
