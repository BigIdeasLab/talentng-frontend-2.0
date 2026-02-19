"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

export function WorkDetailView({ work, onClose }: WorkDetailViewProps) {
  const images = work.images?.length ? work.images : [PLACEHOLDER_IMAGE];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 bg-white overflow-y-auto scrollbar-styled h-screen w-[calc(100%-80px)] md:w-[calc(100%-250px)]">
      <div className="bg-white min-h-screen">
        <div className="w-full px-4 md:px-8 pt-10 pb-10">
          {/* Close Button - Fixed Position */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-50 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close work detail"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Content Container — side-by-side on md+ */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Left — Image Carousel */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              {/* Main Image with Arrows */}
              <div className="relative w-full aspect-[565/425] rounded-[6px] overflow-hidden bg-gray-100 group">
                <Image
                  src={images[currentIndex]}
                  alt={`${work.title} ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Navigation Arrows — only show if more than 1 image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-start gap-1.5">
                  {images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`relative w-full aspect-[135/101] rounded-[4px] overflow-hidden bg-gray-100 transition-opacity ${
                        idx === currentIndex
                          ? "ring-2 ring-[#5C30FF] opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${work.title} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="w-full md:w-1/2 min-w-0 flex flex-col gap-4">
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

              {/* About This Work */}
              <div className="flex flex-col gap-4 mt-2">
                <h2 className="text-[21px] font-semibold leading-normal font-inter-tight text-black">
                  About This Work
                </h2>
                <p className="text-[15px] font-normal leading-[22px] font-inter-tight text-black whitespace-pre-wrap break-words overflow-hidden">
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
