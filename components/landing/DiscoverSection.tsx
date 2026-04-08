"use client";

import { useState } from "react";
import Image from "next/image";
import { categories, talents } from "@/lib/data/landing";
import { LocationIcon, WorkIcon, DollarIcon, PenToolIcon } from "./icons";

function Avatar({
  avatarUrl,
  avatarBg,
  initials,
}: {
  avatarUrl?: string;
  avatarBg: string;
  initials: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={initials}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        loading="lazy"
        sizes="40px"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
      style={{ backgroundColor: avatarBg }}
    >
      {initials}
    </div>
  );
}

function TalentCard({ talent }: { talent: (typeof talents)[0] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E1E4EA] p-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar
              avatarUrl={(talent as any).avatarUrl}
              avatarBg={talent.avatarBg}
              initials={talent.initials}
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-black font-medium text-[15px] leading-tight truncate">
                {talent.name}
              </span>
              <span className="text-black/30 text-sm font-light leading-tight truncate">
                {talent.role}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#181B25] border border-[#181B25] text-white text-[13px] whitespace-nowrap hover:bg-[#2a2f3d] transition-colors">
            View Profile
          </button>
        </div>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span className="text-[#525866] text-sm truncate">
              {talent.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WorkIcon />
            <span className="text-[#525866] text-sm truncate">
              {talent.hired}
            </span>
          </div>
          {talent.showEarned && (
            <div className="flex items-center gap-2">
              <DollarIcon />
              <span className="text-[#525866] text-sm truncate">
                {talent.earned}
              </span>
            </div>
          )}
          {talent.showTag && (
            <div className="flex items-center gap-2">
              <PenToolIcon />
              <span className="text-[#525866] text-sm truncate">
                {talent.tag}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Images */}
      <div className="flex gap-2">
        {talent.images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={200}
            height={144}
            className="flex-1 h-36 object-cover rounded-lg min-w-0"
            loading="lazy"
            sizes="(max-width: 768px) 33vw, 200px"
          />
        ))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {talent.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DiscoverSection() {
  const [activeTab, setActiveTab] = useState<"People" | "Opportunities">(
    "People",
  );
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section
      id="discover"
      className="bg-[#FAFAFA] py-20 md:py-28 border-t border-[#F0F0F0]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
            Discover Nigerian Talent
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
            Browse profiles, portfolios, and opportunities.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("People")}
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
              activeTab === "People"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            People
          </button>
          <button
            onClick={() => setActiveTab("Opportunities")}
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
              activeTab === "Opportunities"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Opportunities
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[#5C30FF] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      </div>
    </section>
  );
}
