"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EmptyState } from "./EmptyState";
import { getTalentRecommendations } from "@/lib/api/talent";
import type { TalentRecommendationDto } from "@/lib/api/talent";

interface Recommendation {
  id: string;
  name: string;
  company?: string;
  companyImage?: string;
  date: string;
  avatar: string;
  text: string;
  title: string;
  rating: number;
  isVerified: boolean;
}

interface RecommendationsGridProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
  onRecommendationClick?: (recommendation: Recommendation) => void;
  cachedRecommendations?: Recommendation[];
  onRecommendationsLoaded?: (recommendations: Recommendation[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

function mapApiRecommendationToUI(
  apiRec: TalentRecommendationDto,
): Recommendation {
  const mapped = {
    id: apiRec.id,
    name: apiRec.recommendedBy?.company || "Anonymous",
    company: undefined, // Don't duplicate company
    companyImage:
      apiRec.recommendedBy?.companyImage ||
      apiRec.recommendedBy?.profileImageUrl,
    date: new Date(apiRec.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    avatar: apiRec.recommendedBy?.profileImageUrl || "", // Use recommendedBy avatar
    text: apiRec.comment || "",
    title: apiRec.title,
    rating: apiRec.rating || 0,
    isVerified: apiRec.isVerified || false,
  };

  return mapped;
}

export function RecommendationsGrid({
  recommendations: externalRecommendations,
  isLoading: externalIsLoading = false,
  onRecommendationClick,
  cachedRecommendations = [],
  onRecommendationsLoaded,
  onLoadingChange,
}: RecommendationsGridProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    externalRecommendations || cachedRecommendations || [],
  );
  const [isLoading, setIsLoading] = useState(
    externalIsLoading && cachedRecommendations.length === 0,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {}, [recommendations]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const apiRecs = await getTalentRecommendations();
        const mapped = apiRecs.map(mapApiRecommendationToUI);
        setRecommendations(mapped);
        onRecommendationsLoaded?.(mapped);
        onLoadingChange?.(false);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to fetch recommendations";
        console.error(
          "[RecommendationsGrid] Error fetching recommendations:",
          err,
        );
        setError(errorMsg);
        onLoadingChange?.(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Use cached data if available
    if (cachedRecommendations && cachedRecommendations.length > 0) {
      console.log("[RecommendationsGrid] Using cached recommendations");
      setRecommendations(cachedRecommendations);
      setIsLoading(false);
      onLoadingChange?.(false);
      return;
    }

    if (externalRecommendations && externalRecommendations.length > 0) {
      console.log("[RecommendationsGrid] Using external recommendations");
      setRecommendations(externalRecommendations);
      setIsLoading(false);
      onLoadingChange?.(false);
      return;
    }

    // Fetch if no data is provided
    console.log("[RecommendationsGrid] No cached data, fetching from API");
    fetchRecommendations();
  }, [
    cachedRecommendations,
    externalRecommendations,
    onRecommendationsLoaded,
    onLoadingChange,
  ]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading recommendations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <EmptyState
        title="No recommendations yet"
        description="Request recommendations from clients you've worked with. Testimonials build trust and credibility."
        buttonText=""
      />
    );
  }

  return (
    <div className="w-full px-[15px] py-[15px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8px]">
        {recommendations.map((recommendation, idx) => {
          console.log(
            `[RecommendationsGrid] Rendering recommendation ${idx}:`,
            recommendation,
          );
          console.log(
            `[RecommendationsGrid] companyImage for ${idx}:`,
            recommendation.companyImage,
          );

          return (
            <button
              key={recommendation.id}
              onClick={() => onRecommendationClick?.(recommendation)}
              className="flex flex-col items-start gap-[12px] p-[16px] rounded-[12px] border border-[#E1E4EA] text-left hover:shadow-md transition-shadow bg-white"
            >
              {/* Header with Avatar and Info */}
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-[10px] flex-1">
                  {/* Company Logo */}
                  <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                    {recommendation.companyImage ? (
                      <Image
                        src={recommendation.companyImage}
                        alt={recommendation.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : recommendation.avatar ? (
                      <Image
                        src={recommendation.avatar}
                        alt={recommendation.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {recommendation.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Company Name and Date */}
                  <div className="flex flex-col items-start gap-[2px] flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold leading-normal font-inter-tight text-black">
                      {recommendation.name}
                    </h3>
                    <span className="text-[11px] font-light leading-normal font-inter-tight text-[#A0A0A0]">
                      {recommendation.date}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-[2px] flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= recommendation.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Title */}
              {recommendation.title && (
                <div className="w-full">
                  <p className="text-[12px] font-semibold leading-normal font-inter-tight text-black">
                    {recommendation.title}
                  </p>
                </div>
              )}

              {/* Recommendation Text */}
              {recommendation.text && (
                <p className="text-[12px] font-normal leading-[18px] font-inter-tight text-[#525866] w-full line-clamp-3">
                  {recommendation.text}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
