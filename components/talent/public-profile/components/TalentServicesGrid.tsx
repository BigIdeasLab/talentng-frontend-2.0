"use client";

import Image from "next/image";
import { Briefcase, Star } from "lucide-react";
import type { Service } from "@/lib/api/talent/types";

interface TalentServicesGridProps {
  services: Service[];
}

const PLACEHOLDER_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/006e1249db9b7d609ae3b3246ecaa7c825dfa329?width=518";

export function TalentServicesGrid({ services }: TalentServicesGridProps) {
  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-gray-500">No services offered yet</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[15px] py-[15px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[10px] gap-y-[20px]">
        {services.map((service) => (
          <div
            key={service.id}
            className="group flex flex-col items-start gap-[8px] text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Service Image */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              {service.images && service.images.length > 0 ? (
                <Image
                  src={service.images[0]}
                  alt={service.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt={service.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Service Details */}
            <div className="flex flex-col items-start gap-[12px] w-full">
              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-[4px]">
                  {service.tags.slice(0, 3).map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex px-[10px] py-[8px] justify-center items-center rounded-[30px] bg-[#F5F5F5]"
                    >
                      <span className="text-[11px] font-normal leading-[105%] font-inter-tight text-black">
                        {tag}
                      </span>
                    </div>
                  ))}
                  {service.tags.length > 3 && (
                    <div className="flex px-[10px] py-[8px] justify-center items-center rounded-[30px] bg-[#F5F5F5]">
                      <span className="text-[11px] font-normal leading-[105%] font-inter-tight text-black">
                        +{service.tags.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                {service.title}
              </h3>

              {/* Rating */}
              {service.totalReviews > 0 && (
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-[13px] font-medium text-black">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-500">
                    ({service.totalReviews} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              {service.price && (
                <div className="flex items-center gap-[4px]">
                  <Briefcase
                    className="w-[16px] h-[16px]"
                    strokeWidth={1.2}
                    color="rgba(0, 0, 0, 0.3)"
                  />
                  <span className="text-[13px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                    {service.price}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
