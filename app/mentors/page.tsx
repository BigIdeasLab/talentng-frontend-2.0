"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MentorCard } from "@/components/talent/mentorship/MentorCard";
import { browseMentors } from "@/lib/api/public/mentors";

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
  "Engineering",
  "Product",
  "Marketing",
  "Data Science",
  "Leadership",
  "Career Growth",
  "Entrepreneurship",
];

interface MentorCardData {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  rating: number;
  totalReviews: number;
  expertise: string[];
  imageUrl: string;
}

const footerLinks: Record<string, string[]> = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"],
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mentors, setMentors] = useState<MentorCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentors() {
      try {
        setLoading(true);
        setError(null);
        const data = await browseMentors({
          category: activeCategory === "All" ? undefined : activeCategory,
          limit: 50,
        });

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          setError("Invalid data format received from server.");
          setMentors([]);
          return;
        }

        // Transform API response to match MentorCardData interface
        const transformedData: MentorCardData[] = data.map((mentor) => {
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

          return {
            id: mentor.id,
            name: mentor.fullName,
            title: mentor.headline || "Mentor",
            location: mentor.location || "",
            rating: mentor.avgRating || 0,
            totalReviews: mentor.totalSessions || 0,
            expertise: extractStrings(mentor.expertise),
            imageUrl: mentor.profileImageUrl || "/default.png",
          };
        });

        setMentors(transformedData);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors. Please try again later.");
        setMentors([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMentors();
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
                  link.label === "Mentors"
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
                  link.label === "Mentors"
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

      {/* ── Discover Mentors ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[40px] font-bold text-black">
              Discover Mentors
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
              <p className="mt-4 text-gray-600">Loading mentors...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Mentor cards grid */}
          {!loading && !error && (
            <>
              {mentors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No mentors found in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {mentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      {...mentor}
                      basePath="/mentors"
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
