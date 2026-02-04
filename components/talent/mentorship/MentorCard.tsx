"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MentorCardProps {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  pricePerSession: number;
  sessionsCompleted: number;
}

export function MentorCard({
  id,
  name,
  title,
  imageUrl,
  pricePerSession,
  sessionsCompleted,
}: MentorCardProps) {
  return (
    <div className="flex flex-col gap-3 p-[7.482px] rounded-[14.964px] bg-[#F5F5F5]">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[261/190] rounded-[15px] bg-white overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-5">
        {/* Profile Info */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="font-inter-tight text-base font-medium leading-normal text-black">
              {name}
            </h3>
            <p className="font-inter-tight text-sm font-normal leading-normal text-black/30">
              {title}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2">
            {/* Price */}
            <div className="flex items-center gap-[7px]">
              <DollarCircleIcon className="w-[18px] h-[18px] text-[#525866]" />
              <span className="font-inter-tight text-sm font-normal leading-normal text-[#525866]">
                ${pricePerSession} / Session
              </span>
            </div>

            {/* Sessions Completed */}
            <div className="flex items-center gap-[7px]">
              <CheckDoubleIcon className="w-[18px] h-[18px] text-[#525866]" />
              <span className="font-inter-tight text-sm font-normal leading-normal text-[#525866]">
                {sessionsCompleted} Sessions Completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-start gap-[5px]">
          {/* Book Session Button */}
          <Link
            href={`/sessions/create-session?mentorId=${id}`}
            className="flex-1 flex items-center justify-center gap-1 h-[50px] px-5 py-[17px] rounded-full bg-[#181B25] text-white font-inter-tight text-sm font-medium hover:bg-[#252831] transition-colors"
          >
            Book Session
          </Link>

          {/* External Link Button */}
          <Link
            href={`/profile/${id}`}
            className="flex items-center justify-center h-[50px] w-[50px] rounded-full border border-[#B2B2B2] bg-[#F5F5F5] hover:bg-[#E1E4EA] transition-colors"
          >
            <ArrowUpRight
              className="w-[18px] h-[18px] text-black"
              strokeWidth={1.125}
            />
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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
