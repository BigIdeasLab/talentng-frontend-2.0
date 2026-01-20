"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { Service } from "@/lib/api/talent-service";

interface ServiceDetailViewProps {
  service: Service;
  onClose: () => void;
}

const PLACEHOLDER_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/780f63b8b0d88ebedad122515b826af8f4ef2c7a?width=1334";

export function ServiceDetailView({
  service,
  onClose,
}: ServiceDetailViewProps) {
  const mainImage = service.images?.[0] || PLACEHOLDER_IMAGE;
  const thumbnails = service.images?.slice(1, 5) || [];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto h-screen">
      <div className="min-h-screen flex justify-center items-start bg-white">
        <div className="w-full max-w-[990px] px-3 md:px-[210px] py-5 md:py-5">
          {/* Close Button - Fixed Position */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-50 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close service detail"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Content Container */}
          <div className="flex flex-col gap-6 w-full max-w-[565px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              {/* Service Title */}
              <h1 className="text-[34px] font-semibold leading-normal font-inter-tight text-black">
                {service.title}
              </h1>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap items-start gap-x-1 gap-y-1.5">
                  {service.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex px-3 py-2 justify-center items-center rounded-[24px] bg-[#F5F5F5]"
                    >
                      <span className="text-[12px] font-normal leading-[105%] text-center font-inter-tight text-black">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing */}
              {service.price && (
                <div className="flex items-center gap-1">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.66602 11.6666C1.66602 9.32584 1.66602 8.15543 2.22778 7.31469C2.47098 6.95072 2.78348 6.63822 3.14745 6.39502C3.98819 5.83325 5.15858 5.83325 7.49935 5.83325H12.4993C14.8401 5.83325 16.0105 5.83325 16.8513 6.39502C17.2152 6.63822 17.5277 6.95072 17.7709 7.31469C18.3327 8.15543 18.3327 9.32584 18.3327 11.6666C18.3327 14.0073 18.3327 15.1778 17.7709 16.0185C17.5277 16.3824 17.2152 16.6949 16.8513 16.9382C16.0105 17.4999 14.8401 17.4999 12.4993 17.4999H7.49935C5.15858 17.4999 3.98819 17.4999 3.14745 16.9382C2.78348 16.6949 2.47098 16.3824 2.22778 16.0185C1.66602 15.1778 1.66602 14.0073 1.66602 11.6666Z"
                      stroke="#525866"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3327 5.83333C13.3327 4.26198 13.3327 3.47631 12.8445 2.98816C12.3563 2.5 11.5707 2.5 9.99935 2.5C8.42802 2.5 7.64232 2.5 7.15417 2.98816C6.66602 3.47631 6.66602 4.26198 6.66602 5.83333"
                      stroke="#525866"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 9.16675L5.54331 9.33508C8.40425 10.2217 11.5957 10.2217 14.4567 9.33508L15 9.16675M10 10.0001V11.6667"
                      stroke="#525866"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[14px] font-light leading-normal font-inter-tight text-[#525866]">
                    {service.price}
                  </span>
                </div>
              )}

              {/* Get in Touch Button */}
              <button className="flex h-8 px-4 py-2 items-center gap-1 rounded-[42px] bg-[#181B25] hover:bg-[#2a2d38] transition-colors self-start">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.08398 12.0834H12.9173M7.08398 7.91675H10.0007"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.8082 17.4087C15.294 17.177 18.0707 14.3609 18.2992 10.8257C18.3438 10.1338 18.3438 9.41734 18.2992 8.7255C18.0707 5.19024 15.294 2.37419 11.8082 2.14248C10.6189 2.06343 9.37735 2.06359 8.19051 2.14248C4.70467 2.37419 1.92802 5.19024 1.69955 8.7255C1.65484 9.41734 1.65484 10.1338 1.69955 10.8257C1.78276 12.1133 2.35221 13.3054 3.02261 14.3121C3.41186 15.0168 3.15496 15.8964 2.74952 16.6648C2.45719 17.2188 2.31102 17.4958 2.42838 17.6958C2.54575 17.8959 2.8079 17.9023 3.33221 17.9151C4.36907 17.9403 5.06825 17.6463 5.62325 17.2371C5.93801 17.005 6.09541 16.8889 6.20388 16.8756C6.31235 16.8623 6.52582 16.9502 6.95269 17.126C7.33635 17.284 7.78181 17.3815 8.19051 17.4087C9.37735 17.4876 10.6189 17.4878 11.8082 17.4087Z"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-medium leading-normal text-center font-inter-tight text-white">
                  Get in touch
                </span>
              </button>
            </div>

            {/* Images Section */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div className="relative w-full aspect-[565/425] rounded-[6px] overflow-hidden bg-gray-100">
                  <Image
                    src={mainImage}
                    alt={service.title}
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
                          alt={`${service.title} thumbnail ${idx + 1}`}
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

              {/* About Service Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[21px] font-semibold leading-normal font-inter-tight text-black">
                  About Service
                </h2>
                <p className="text-[15px] font-normal leading-[22px] font-inter-tight text-black whitespace-pre-wrap">
                  {service.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
