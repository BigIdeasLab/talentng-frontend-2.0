"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TYPE_CONFIG } from "@/lib/types/opportunities";
import { browseOpportunities } from "@/lib/api/public/opportunities";

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Talents", href: "/talents" },
  { label: "Recruiters", href: "/recruiters" },
  { label: "Mentors", href: "/mentors" },
  { label: "Opportunities", href: "/opportunities-public" },
  { label: "FAQ", href: "/#faq" },
];

const categories = [
  "All",
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Data Science",
  "Project Management",
  "Video & Animation",
  "Music & Audio",
];

interface PublicOpportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  companyLogoBg: string;
  companyInitials: string;
  date: string;
  type: string;
  title: string;
  location: string;
  experienceLevel: string;
  category: string;
  skills: string[];
  priceMode: "range" | "fixed";
  minBudget?: number;
  maxBudget?: number;
  price?: number;
  paymentType?: "hourly" | "weekly" | "monthly" | "";
}

const footerLinks: Record<string, string[]> = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function OpportunityCardPublic({
  opportunity,
}: {
  opportunity: PublicOpportunity;
}) {
  const config = TYPE_CONFIG[opportunity.type] || TYPE_CONFIG["FullTime"];

  return (
    <Link href={`/opportunities-public/${opportunity.id}`} className="block">
      <div className="relative">
        <div className="flex flex-col items-start gap-4 pt-4 pb-4 border border-[#E1E4EA] rounded-[16px] bg-white transition-all cursor-pointer hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] active:scale-[0.98] active:shadow-sm h-full">
          {/* Card Content */}
          <div className="flex flex-col items-start gap-3.5 w-full px-4 md:px-5 flex-1">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-3 w-full">
              {/* Profile */}
              <div className="flex items-center gap-2">
                {opportunity.companyLogo ? (
                  <img
                    src={opportunity.companyLogo}
                    alt={opportunity.companyName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default.png";
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: opportunity.companyLogoBg }}
                  >
                    {opportunity.companyInitials}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-medium font-inter-tight text-black">
                    {opportunity.companyName}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-light font-inter-tight text-[#525866]">
                    <span>{opportunity.date}</span>
                    {opportunity.category && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{opportunity.category}</span>
                      </>
                    )}
                    {opportunity.location && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{opportunity.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0"
                style={{ backgroundColor: `${config.dotColor}1A` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.dotColor }}
                />
                <span
                  className="text-[11px] font-normal font-inter-tight"
                  style={{ color: config.dotColor }}
                >
                  {config.label}
                </span>
              </div>
            </div>

            {/* Job Title */}
            <h3 className="text-[15px] font-medium font-inter-tight text-black">
              {opportunity.title}
            </h3>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {opportunity.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-[#F5F5F5] text-[#525866] text-[11px] font-normal font-inter-tight rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Rate and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-[#E1E4EA] w-full">
              <div className="text-[15px] font-medium font-inter-tight text-black">
                {opportunity.priceMode === "fixed" ? (
                  <>
                    ₦{(opportunity.price || 0).toLocaleString()}
                    {opportunity.paymentType && (
                      <span>
                        /
                        {opportunity.paymentType === "hourly"
                          ? "hr"
                          : opportunity.paymentType === "weekly"
                            ? "wk"
                            : "mo"}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    ₦{(opportunity.minBudget || 0).toLocaleString()} - ₦
                    {(opportunity.maxBudget || 0).toLocaleString()}
                    {opportunity.paymentType && (
                      <span>
                        /
                        {opportunity.paymentType === "hourly"
                          ? "hr"
                          : opportunity.paymentType === "weekly"
                            ? "wk"
                            : "mo"}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="sm:ml-auto">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/signup";
                  }}
                  className="flex items-center gap-2 px-4 py-2 h-8 rounded-full bg-[#5C30FF] border border-[#5C30FF] text-white hover:bg-[#4a26d4] transition-colors"
                >
                  <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                    Sign Up to Apply
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OpportunitiesPublicPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<PublicOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true);
        setError(null);
        const data = await browseOpportunities({
          category: activeCategory === "All" ? undefined : activeCategory,
          limit: 50,
        });

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          setError("Invalid data format received from server.");
          setOpportunities([]);
          return;
        }

        // Transform API response to match PublicOpportunity interface
        const transformedData: PublicOpportunity[] = data.map((opp) => {
          // Extract string values from arrays that might contain objects
          const extractStrings = (arr: any): string[] => {
            if (!Array.isArray(arr)) return [];
            return arr.map((item) => {
              if (typeof item === "string") return item;
              if (typeof item === "object" && item !== null && "name" in item)
                return item.name;
              return String(item);
            });
          };

          // Generate initials from company name
          const companyName = opp.company || "Unknown Company";
          const initials = companyName
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          // Generate a color based on company name
          const colors = [
            "#3359DF",
            "#F5A623",
            "#00C3F7",
            "#5C30FF",
            "#0066F5",
            "#ED1C24",
          ];
          const colorIndex = companyName.length % colors.length;

          // Calculate relative date
          const createdDate = new Date(opp.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          let dateStr = "";
          if (diffDays === 0) dateStr = "Today";
          else if (diffDays === 1) dateStr = "1 day ago";
          else if (diffDays < 7) dateStr = `${diffDays} days ago`;
          else if (diffDays < 14) dateStr = "1 week ago";
          else if (diffDays < 30)
            dateStr = `${Math.floor(diffDays / 7)} weeks ago`;
          else dateStr = `${Math.floor(diffDays / 30)} months ago`;

          // Parse compensation string or use budget fields
          let priceMode: "range" | "fixed" = "fixed";
          let minBudget = 0;
          let maxBudget = 0;
          let price = 0;
          let paymentType: "hourly" | "weekly" | "monthly" | "" = "";

          // Check if API provides structured budget fields
          if (opp.priceMode && (opp.minBudget || opp.maxBudget || opp.price)) {
            priceMode = opp.priceMode as "range" | "fixed";
            minBudget = opp.minBudget || 0;
            maxBudget = opp.maxBudget || 0;
            price = opp.price || 0;
            paymentType =
              (opp.paymentType as "hourly" | "weekly" | "monthly") || "";
          } else if (opp.compensation) {
            // Try to parse compensation string
            const comp = opp.compensation.toLowerCase();
            if (comp.includes("-")) {
              priceMode = "range";
              const matches = comp.match(/(\d+(?:,\d+)*)\s*-\s*(\d+(?:,\d+)*)/);
              if (matches) {
                minBudget = parseInt(matches[1].replace(/,/g, ""));
                maxBudget = parseInt(matches[2].replace(/,/g, ""));
              }
            } else {
              priceMode = "fixed";
              const matches = comp.match(/(\d+(?:,\d+)*)/);
              if (matches) {
                price = parseInt(matches[1].replace(/,/g, ""));
              }
            }

            // Detect payment type from compensation string
            if (comp.includes("hour") || comp.includes("/hr"))
              paymentType = "hourly";
            else if (comp.includes("week") || comp.includes("/wk"))
              paymentType = "weekly";
            else if (comp.includes("month") || comp.includes("/mo"))
              paymentType = "monthly";
          }

          return {
            id: opp.id,
            companyName: companyName,
            companyLogo: opp.logo || "",
            companyLogoBg: colors[colorIndex],
            companyInitials: initials,
            date: dateStr,
            type: opp.type,
            title: opp.title,
            location: opp.location,
            experienceLevel: opp.experienceLevel || "",
            category: opp.category,
            skills: extractStrings(opp.tags),
            priceMode,
            minBudget,
            maxBudget,
            price,
            paymentType,
          };
        });

        setOpportunities(transformedData);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setError("Failed to load opportunities. Please try again later.");
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, [activeCategory]);

  return (
    <div className="font-inter-tight bg-white min-h-screen">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/landing-page-logo.png"
              alt="Talent.ng"
              width={200}
              height={70}
              className="h-[70px] w-auto object-contain"
              sizes="200px"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[15px] transition-colors ${
                  link.label === "Opportunities"
                    ? "text-[#5C30FF] font-medium"
                    : "text-gray-800 hover:text-[#5C30FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-[15px] font-medium text-gray-800 hover:text-[#5C30FF] transition-colors px-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#5C30FF] text-white text-[15px] font-medium hover:bg-[#4a26d4] transition-colors whitespace-nowrap"
            >
              Create Free Account
            </Link>
            <button
              className="md:hidden p-3 text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileMenuOpen ? (
                  <path d="M4 4L18 18M18 4L4 18" />
                ) : (
                  <path d="M3 6h16M3 12h16M3 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#F0F0F0] px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-base ${
                  link.label === "Opportunities"
                    ? "text-[#5C30FF] font-medium"
                    : "text-gray-800 hover:text-[#5C30FF]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-base font-medium text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
          </div>
        )}
      </header>

      {/* ── Discover Opportunities ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[40px] font-bold text-black">
              Discover Opportunities
            </h2>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
                  activeCategory === cat
                    ? "bg-[#181B25] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-[#E1E4EA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C30FF]"></div>
              <p className="mt-4 text-gray-600">Loading opportunities...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Opportunity cards grid */}
          {!loading && !error && (
            <>
              {opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No opportunities found in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {opportunities.map((opportunity) => (
                    <OpportunityCardPublic
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center text-center gap-5">
            <Image
              src="/landing-page-logo.png"
              alt="Talent.ng Logo"
              width={400}
              height={200}
              className="h-[200px] w-auto object-contain"
              sizes="400px"
            />
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl sm:text-[56px] md:text-[60px] font-normal text-black leading-[1.05]">
                Try Talents.ng today
              </h2>
              <p className="text-base sm:text-xl text-black">
                Manage your freelance projects commission
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 rounded-full bg-[#5C30FF] border border-[#5C30FF] text-white text-lg font-medium hover:bg-[#4a26d4] transition-colors"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#F0F0F0] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 pb-12">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="md:w-[320px] flex-shrink-0 flex flex-col gap-6">
              <Image
                src="/landing-page-logo.png"
                alt="Talent.ng"
                width={200}
                height={70}
                className="h-[70px] w-auto object-contain self-start"
                sizes="200px"
              />
              <p className="text-[#525866] text-base leading-6 max-w-xs">
                Nigeria&rsquo;s centralized platform connecting talents,
                recruiters, and mentors in one structured ecosystem.
              </p>
            </div>

            <div className="flex flex-1 flex-wrap gap-8 sm:gap-12">
              {Object.entries(footerLinks).map(([heading, links]) => (
                <div
                  key={heading}
                  className="flex flex-col gap-4 min-w-[100px]"
                >
                  <h4 className="text-black font-semibold text-base">
                    {heading}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {links.map((link) => (
                      <Link
                        key={link}
                        href="#"
                        className="text-[#525866] text-base hover:text-black transition-colors flex items-center gap-2"
                      >
                        {link}
                        {link === "Learning Hub" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#525866]">
                            Coming Soon
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#F0F0F0] text-center text-sm text-[#525866]">
            &copy;2026 Talent.ng. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
