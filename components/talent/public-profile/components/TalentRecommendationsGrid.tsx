"use client";

import { Star } from "lucide-react";

interface RecommendationData {
  title: string;
  comment?: string;
  rating?: number | null;
  isVerified: boolean;
}

interface TalentRecommendationsGridProps {
  recommendations: RecommendationData[];
}

export function TalentRecommendationsGrid({
  recommendations,
}: TalentRecommendationsGridProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-gray-500">No recommendations yet</p>
      </div>
    );
  }

  return (
    <div className="p-[25px]">
      <div className="space-y-[16px] max-w-[800px]">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="border border-[#E1E4EA] rounded-[12px] p-[16px]"
          >
            <div className="flex items-start justify-between gap-[12px] mb-[12px]">
              {/* Title & Rating */}
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-black mb-[8px]">
                  {rec.title}
                </h3>
                {rec.rating && (
                   <div className="flex items-center gap-[6px]">
                     {Array.from({ length: 5 }).map((_, i) => (
                       <Star
                         key={i}
                         className={`w-4 h-4 ${
                           i < rec.rating!
                             ? "fill-[#FFC107] text-[#FFC107]"
                             : "text-gray-300"
                         }`}
                       />
                     ))}
                   </div>
                 )}
              </div>

              {/* Verified Badge */}
              {rec.isVerified && (
                <div className="px-[8px] py-[4px] bg-green-100 rounded text-[11px] text-green-700 font-medium flex-shrink-0">
                  ✓ Verified
                </div>
              )}
            </div>

            {/* Content */}
            {rec.comment && (
              <p className="text-[14px] text-gray-700 leading-relaxed">
                {rec.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
