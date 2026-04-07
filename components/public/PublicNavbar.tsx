"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface PublicNavbarProps {
  activeLink?: "Talents" | "Recruiters" | "Mentors" | "Opportunities";
}

const navLinks = [
  { label: "Talents" as const, href: "/talents" },
  { label: "Recruiters" as const, href: "/recruiters" },
  { label: "Mentors" as const, href: "/mentors" },
  { label: "Opportunities" as const, href: "/opportunities-public" },
  { label: "FAQ" as const, href: "/#faq" },
];

export function PublicNavbar({ activeLink }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
                link.label === activeLink
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
                link.label === activeLink
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
  );
}
