"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface WorkDetailViewProps {
  work: {
    id: string;
    title: string;
    description: string;
    images: string[];
    createdAt?: string;
  };
  onClose: () => void;
}

const PLACEHOLDER_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/780f63b8b0d88ebedad122515b826af8f4ef2c7a?width=1334";

export function WorkDetailView({
  work,
  onClose,
}: WorkDetailViewProps) {
  const mainImage = work.images?.[0] || PLACEHOLDER_IMAGE;
  const thumbnails = work.images?.slice(1, 5) || [];

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 bg-white overflow-y-auto scrollbar-styled h-screen w-[calc(100%-80px)] md:w-[calc(100%-260px)] shadow-lg">
      <div className="flex justify-center items-start bg-white min-h-screen">
        <div className="w-full px-3 md:px-6 py-5 md:py-5">
          {/* Close Button - Fixed Position */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-50 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close work detail"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Content Container */}
          <div className="flex flex-col gap-6 w-full max-w-[565px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              {/* Work Title */}
              <h1 className="text-[34px] font-semibold leading-normal font-inter-tight text-black">
                {work.title}
              </h1>

              {/* Date */}
              {work.createdAt && (
                <div className="flex items-center gap-1">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10ZM10 5C9.72386 5 9.5 5.22386 9.5 5.5V10C9.5 10.2761 9.72386 10.5 10 10.5H13.5C13.7761 10.5 14 10.2761 14 10C14 9.72386 13.7761 9.5 13.5 9.5H10.5V5.5C10.5 5.22386 10.2761 5 10 5Z"
                      fill="#525866"
                    />
                  </svg>
                  <span className="text-[14px] font-light leading-normal font-inter-tight text-[#525866]">
                    {new Date(work.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Images Section */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div className="relative w-full aspect-[565/425] rounded-[6px] overflow-hidden bg-gray-100">
                  <Image
                    src={mainImage}
                    alt={work.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Thumbnail Images */}
                {thumbnails.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    {thumbnails.map((image, idx) => (
                      <div
                        key={idx}
                        className="relative w-full aspect-[135/101] rounded-[4px] overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={image}
                          alt={`${work.title} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                    {/* Fill remaining slots with placeholder if less than 4 thumbnails */}
                    {Array.from({
                      length: Math.max(0, 4 - thumbnails.length),
                    }).map((_, idx) => (
                      <div
                        key={`placeholder-${idx}`}
                        className="relative w-full aspect-[135/101] rounded-[4px] overflow-hidden bg-gray-100"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Work Description Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[21px] font-semibold leading-normal font-inter-tight text-black">
                  About This Work
                </h2>
                <p className="text-[15px] font-normal leading-[22px] font-inter-tight text-black whitespace-pre-wrap">
                  {work.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
