"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { browseRecruiters } from "@/lib/api/public/recruiters";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10.2133 16.0253C9.88807 16.3298 9.4533 16.5 9.00082 16.5C8.54835 16.5 8.11365 16.3298 7.78838 16.0253C4.80977 13.2195 0.81807 10.0852 2.7647 5.53475C3.81722 3.07437 6.34375 1.5 9.00082 1.5C11.6579 1.5 14.1845 3.07437 15.237 5.53475C17.1812 10.0795 13.1992 13.2292 10.2133 16.0253Z"
        stroke="#525866"
        strokeWidth="1.125"
      />
      <path
        d="M11.625 8.25C11.625 9.69975 10.4497 10.875 9 10.875C7.55025 10.875 6.375 9.69975 6.375 8.25C6.375 6.80025 7.55025 5.625 9 5.625C10.4497 5.625 11.625 6.80025 11.625 8.25Z"
        stroke="#525866"
        strokeWidth="1.125"
      />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1.5 10.5C1.5 8.39333 1.5 7.33996 2.00559 6.58329C2.22447 6.25572 2.50572 5.97447 2.83329 5.75559C3.58996 5.25 4.64331 5.25 6.75 5.25H11.25C13.3567 5.25 14.41 5.25 15.1667 5.75559C15.4942 5.97447 15.7755 6.25572 15.9944 6.58329C16.5 7.33996 16.5 8.39333 16.5 10.5C16.5 12.6067 16.5 13.6601 15.9944 14.4167C15.7755 14.7443 15.4942 15.0255 15.1667 15.2444C14.41 15.75 13.3567 15.75 11.25 15.75H6.75C4.64331 15.75 3.58996 15.75 2.83329 15.2444C2.50572 15.0255 2.22447 14.7443 2.00559 14.4167C1.5 13.6601 1.5 12.6067 1.5 10.5Z"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.25C12 3.83578 12 3.12868 11.5606 2.68934C11.1213 2.25 10.4142 2.25 9 2.25C7.5858 2.25 6.87868 2.25 6.43934 2.68934C6 3.12868 6 3.83578 6 5.25"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.25L4.98898 8.4015C7.56382 9.1995 10.4362 9.1995 13.011 8.4015L13.5 8.25M9 9V10.5"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="6" r="3" stroke="#525866" strokeWidth="1.25" />
      <path
        d="M2 15C2 12.2386 4.23858 10 7 10C9.76142 10 12 12.2386 12 15"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="13" cy="7" r="2" stroke="#525866" strokeWidth="1.25" />
      <path
        d="M13 11C14.6569 11 16 12.3431 16 14"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Consulting",
  "Media",
  "Manufacturing",
];

interface RecruiterData {
  id: number | string;
  companyName: string;
  industry: string;
  location: string;
  jobsPosted: number;
  talentsHired: number;
  description: string;
  hiringFor: string[];
  logoBg: string;
  initials: string;
}

const footerLinks: Record<string, string[]> = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RecruiterCard({ recruiter }: { recruiter: RecruiterData }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E1E4EA] p-4 overflow-hidden hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] transition-all">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: recruiter.logoBg }}
            >
              {recruiter.initials}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-black font-medium text-[15px] leading-tight truncate">
                {recruiter.companyName}
              </span>
              <span className="text-black/30 text-sm font-light leading-tight truncate">
                {recruiter.industry}
              </span>
            </div>
          </div>
          <Link
            href={`/recruiters/${recruiter.id}`}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#181B25] border border-[#181B25] text-white text-[13px] whitespace-nowrap hover:bg-[#2a2f3d] transition-colors"
          >
            View Company
          </Link>
        </div>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span className="text-[#525866] text-sm truncate">
              {recruiter.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WorkIcon />
            <span className="text-[#525866] text-sm truncate">
              {recruiter.jobsPosted} Jobs Posted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon />
            <span className="text-[#525866] text-sm truncate">
              {recruiter.talentsHired} Hired
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#525866] text-sm leading-relaxed line-clamp-2">
        {recruiter.description}
      </p>

      {/* Hiring For Tags */}
      <div className="flex flex-wrap gap-2">
        {recruiter.hiringFor.map((role, index) => (
          <span
            key={`${role}-${index}`}
            className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-sm"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RecruitersPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruiters, setRecruiters] = useState<RecruiterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        setLoading(true);
        setError(null);
        const data = await browseRecruiters({
          industry: activeCategory === "All" ? undefined : activeCategory,
          limit: 50,
        });

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          setError("Invalid data format received from server.");
          setRecruiters([]);
          return;
        }

        // Transform API response to match RecruiterData interface
        const transformedData: RecruiterData[] = data.map((recruiter) => {
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
          const initials = recruiter.company
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
          const colorIndex = recruiter.company.length % colors.length;

          return {
            id: recruiter.id, // Profile ID - this is what we link to
            companyName: recruiter.company,
            industry: recruiter.industry,
            location: recruiter.location,
            jobsPosted: 0, // Not available in API
            talentsHired: 0, // Not available in API
            description: recruiter.bio || "",
            hiringFor: [], // Not available in API
            logoBg: colors[colorIndex],
            initials: initials,
          };
        });

        setRecruiters(transformedData);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
        setError("Failed to load recruiters. Please try again later.");
        setRecruiters([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecruiters();
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
                  link.label === "Recruiters"
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
                  link.label === "Recruiters"
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

      {/* ── Discover Recruiters ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[40px] font-bold text-black">
              Discover Recruiters
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
              <p className="mt-4 text-gray-600">Loading recruiters...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Recruiter cards grid */}
          {!loading && !error && (
            <>
              {recruiters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No recruiters found in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {recruiters.map((recruiter) => (
                    <RecruiterCard key={recruiter.id} recruiter={recruiter} />
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
