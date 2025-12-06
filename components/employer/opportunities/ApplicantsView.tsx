"use client";

import Link from "next/link";
import { useState } from "react";
import { ApplicantsTable } from "./ApplicantsTable";
import { ApplicantsHeader } from "./ApplicantsHeader";

interface ApplicantsViewProps {
  opportunityId: string;
}

export function ApplicantsView({ opportunityId }: ApplicantsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-[1129px] mx-auto">
        {/* Back Button */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2.5 mb-6 text-black/30 hover:text-black/50 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.78251 11.7826C9.71284 11.8525 9.63004 11.9079 9.53888 11.9458C9.44771 11.9837 9.34997 12.0031 9.25126 12.0031C9.15255 12.0031 9.05481 11.9837 8.96365 11.9458C8.87249 11.9079 8.78969 11.8525 8.72001 11.7826L5.72001 8.78255C5.65009 8.71287 5.59462 8.63008 5.55676 8.53891C5.51891 8.44775 5.49942 8.35001 5.49942 8.2513C5.49942 8.15259 5.51891 8.05485 5.55676 7.96369C5.59462 7.87252 5.65009 7.78973 5.72001 7.72005L8.72001 4.72005C8.86091 4.57915 9.05201 4.5 9.25126 4.5C9.45052 4.5 9.64162 4.57915 9.78251 4.72005C9.92341 4.86095 10.0026 5.05204 10.0026 5.2513C10.0026 5.45056 9.92341 5.64165 9.78251 5.78255L7.31439 8.25193L9.78439 10.7213C9.854 10.7911 9.90917 10.8739 9.94675 10.965C9.98434 11.0561 10.0036 11.1538 10.0034 11.2523C10.0032 11.3509 9.98364 11.4484 9.94574 11.5394C9.90784 11.6304 9.85237 11.713 9.78251 11.7826Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-inter-tight text-[15px] font-normal">
            Back to opportunities
          </span>
        </Link>

        {/* Page Title */}
        <h1 className="font-inter-tight text-[25px] font-medium text-black mb-6">
          Applicants
        </h1>

        {/* Search and Filters */}
        <ApplicantsHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Applicants Table */}
        <div className="mt-6">
          <ApplicantsTable searchQuery={searchQuery} sortBy={sortBy} />
        </div>
      </div>
    </div>
  );
}
