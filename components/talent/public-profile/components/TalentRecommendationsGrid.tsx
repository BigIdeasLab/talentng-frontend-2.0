"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";

interface RecommendationData {
  id: string;
  title: string;
  content: string;
  rating: number;
  reviewer: {
    fullName: string;
    headline?: string;
    profileImageUrl?: string;
  };
  createdAt: string;
}

interface TalentRecommendationsGridProps {
  userId: string;
}

export function TalentRecommendationsGrid({
  userId,
}: TalentRecommendationsGridProps) {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement getRecommendations API call for specific talent
        // const data = await getRecommendations(userId);
        // setRecommendations(data);
        setRecommendations([]);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load recommendations",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-[#E1E4EA] rounded-[12px] p-[16px]"
          >
            {/* Rating */}
            <div className="flex items-center gap-[8px] mb-[12px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rec.rating
                      ? "fill-[#FFC107] text-[#FFC107]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-[14px] text-gray-700 mb-[12px] leading-relaxed">
              {rec.content}
            </p>

            {/* Reviewer Info */}
            <div className="flex items-center gap-[12px] pt-[12px] border-t border-[#E1E4EA]">
              <img
                src={rec.reviewer.profileImageUrl || "/default-avatar.jpg"}
                alt={rec.reviewer.fullName}
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              <div>
                <p className="text-[13px] font-semibold text-black">
                  {rec.reviewer.fullName}
                </p>
                <p className="text-[12px] text-gray-600">
                  {rec.reviewer.headline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
