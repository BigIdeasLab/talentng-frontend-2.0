"use client";

import type { Service } from "@/lib/api/talent/types";

interface TalentServicesGridProps {
  services: Service[];
}

export function TalentServicesGrid({ services }: TalentServicesGridProps) {
  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-gray-500">No services offered yet</p>
      </div>
    );
  }

  return (
    <div className="p-[25px]">
      <div className="space-y-[16px] max-w-[800px]">
        {services.map((service, idx) => (
          <div
            key={service.id || `service-${idx}`}
            className="border border-[#E1E4EA] rounded-[12px] p-[16px] hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-[16px]">
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-black mb-[8px]">
                  {service.title}
                </h3>
                <p className="text-[14px] text-gray-600 mb-[12px]">
                  {service.about}
                </p>
                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-[8px]">
                    {service.tags.map((tag, idx) => (
                      <span
                        key={`${service.id}-tag-${idx}`}
                        className="px-[8px] py-[4px] bg-[#F5F5F5] rounded-full text-[11px] text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[18px] font-semibold text-[#5C30FF]">
                  ₦{service.price || "0"}
                </p>
                <p className="text-[12px] text-gray-500">per service</p>
                {service.averageRating > 0 && (
                  <p className="text-[12px] text-yellow-500 mt-[4px]">
                    ★ {service.averageRating.toFixed(1)} ({service.totalReviews})
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
