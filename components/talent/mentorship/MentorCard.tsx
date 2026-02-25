"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MentorCardProps {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  rating?: number;
  totalReviews?: number;
  expertise?: string[];
  company?: string;
  location?: string;
  category?: string;
}

export function MentorCard({
  id,
  name,
  title,
  imageUrl,
  rating = 0,
  totalReviews = 0,
  expertise = [],
  company,
  location,
  category,
}: MentorCardProps) {
  return (
    <div className="flex flex-col gap-2.5 p-1.5 rounded-[16px] border border-[#E1E4EA] bg-white group cursor-pointer h-full transition-all shadow-sm hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      {/* Thumbnail */}
      <Link
        href={`/mentorship/${id}`}
        className="relative w-full aspect-[261/190] rounded-xl bg-white overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="text-[#FFB800] text-[11px]">★</span>
            <span className="font-inter-tight text-[11px] font-medium text-black">
              {Number(rating || 0).toFixed(1)}
            </span>
            {totalReviews > 0 && (
              <span className="font-inter-tight text-[10px] text-black/40">
                ({totalReviews})
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="flex flex-col gap-1.5 flex-1 px-1 pb-2">
        {/* Profile Info */}
        <div className="flex flex-col gap-2.5">
          <Link href={`/mentorship/${id}`} className="flex flex-col gap-1.5">
            <h3 className="font-inter-tight text-[15px] font-semibold leading-tight text-black group-hover:text-black/60 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="font-inter-tight text-[13px] font-medium leading-normal text-black/60 line-clamp-1">
              {title}
            </p>
            {(company || location) && (
              <p className="font-inter-tight text-[11px] font-normal leading-normal text-black/40 line-clamp-1">
                {[company, location].filter(Boolean).join(" • ")}
              </p>
            )}
          </Link>

          {/* Expertise Tags */}
          {expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {expertise.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#8463FF0D] border border-[#8463FF1A] text-[11px] font-medium text-[#8463FF] capitalize"
                >
                  {skill}
                </span>
              ))}
              {expertise.length > 2 && (
                <span className="text-[11px] text-black/30 font-medium">
                  +{expertise.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-2">
          {/* Book Session Button */}
          <Link
            href={`/mentorship/${id}?book=true`}
            className="flex-1 flex items-center justify-center h-[42px] rounded-full bg-[#181B25] text-white font-inter-tight text-[13px] font-medium hover:bg-[#252831] transition-all"
          >
            Book Session
          </Link>

          {/* External Link Button */}
          <Link
            href={`/mentorship/${id}`}
            className="flex items-center justify-center h-[42px] w-[42px] rounded-full border border-[#E1E4EA] bg-white hover:bg-[#F5F5F5] transition-all"
          >
            <ArrowUpRight className="w-5 h-5 text-black" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Dollar Circle Icon
function DollarCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path
        d="M11.0326 7.54533C10.9583 6.97334 10.3015 6.04917 9.1206 6.04915C7.7484 6.04913 7.17102 6.8091 7.05386 7.18909C6.87108 7.69736 6.90764 8.74233 8.51602 8.85626C10.5265 8.99876 11.332 9.23606 11.2295 10.4665C11.127 11.6969 10.0063 11.9628 9.1206 11.9342C8.23485 11.9058 6.78573 11.4989 6.72949 10.4045M8.98005 5.24805V6.05187M8.98005 11.9268V12.748"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Check Double Icon
function CheckDoubleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.875 10.375L4.5 13.125L5.26802 12.3204M12.375 4.875L7.82775 9.63877"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.625 10.375L8.25 13.125L16.125 4.875"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
