"use client";

import Image from "next/image";

interface RecommendationData {
  id: string;
  title: string;
  comment?: string;
  rating?: number | null;
  isVerified: boolean;
  avatar?: string;
  date?: string;
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
    <div className="w-full px-[15px] py-[15px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8px]">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col items-start gap-[8px] p-[12px_10px] rounded-[12px] border border-[#E1E4EA] text-left hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col items-start gap-[15px] w-full">
              {/* Header with Avatar and Info */}
              <div className="flex flex-col items-start gap-[5px] w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[8px]">
                    {/* Avatar */}
                    <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      {rec.avatar ? (
                        <Image
                          src={rec.avatar}
                          alt={rec.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-white text-xs font-semibold">
                          {rec.title.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name and Date */}
                    <div className="flex flex-col items-start gap-[4px]">
                      <h3 className="text-[13px] font-medium leading-normal font-inter-tight text-black">
                        {rec.title}
                      </h3>
                      {rec.date && (
                        <span className="text-[12px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                          {rec.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verified Badge */}
                  {rec.isVerified && (
                    <div className="px-[8px] py-[4px] bg-green-100 rounded text-[11px] text-green-700 font-medium flex-shrink-0">
                      ✓ Verified
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation Text */}
              {rec.comment && (
                <p className="text-[12px] font-normal leading-[18px] font-inter-tight text-[#525866] w-full">
                  {rec.comment}
                </p>
              )}

              {/* Rating */}
              {rec.rating && (
                <div className="flex items-center gap-[4px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rec.rating!
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
