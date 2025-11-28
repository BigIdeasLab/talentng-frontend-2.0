"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EmptyState } from "./EmptyState";
import { getTalentRecommendations } from "@/lib/api/talent";
import type { TalentRecommendationDto } from "@/lib/api/talent";

interface Recommendation {
  id: string;
  name: string;
  date: string;
  avatar: string;
  text: string;
}

interface RecommendationsGridProps {
  talentUserId?: string;
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
  return {
    id: apiRec.id,
    name: apiRec.recommendedBy.username || apiRec.recommendedBy.email,
    date: new Date(apiRec.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    avatar: "", // API doesn't provide avatar - using fallback in rendering
    text: apiRec.comment || `Recommended for: ${apiRec.title}`,
  };
}

export function RecommendationsGrid({
  talentUserId,
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
  const [isLoading, setIsLoading] = useState(externalIsLoading && cachedRecommendations.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use cached recommendations if available
    if (cachedRecommendations.length > 0) {
      setRecommendations(cachedRecommendations);
      setIsLoading(false);
      onLoadingChange?.(false);
      return;
    }

    if (externalRecommendations) {
      setRecommendations(externalRecommendations);
      return;
    }

    if (!talentUserId) {
      return;
    }

    let isMounted = true;

    async function fetchRecommendations() {
      if (!talentUserId) return;

      try {
        setIsLoading(true);
        onLoadingChange?.(true);
        setError(null);
        const apiRecommendations = await getTalentRecommendations(
          talentUserId as string,
        );
        
        if (!isMounted) return;
        
        const uiRecommendations = apiRecommendations.map(
          mapApiRecommendationToUI,
        );
        setRecommendations(uiRecommendations);
        onRecommendationsLoaded?.(uiRecommendations);
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Failed to fetch recommendations:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load recommendations",
        );
        setRecommendations([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          onLoadingChange?.(false);
        }
      }
    }

    fetchRecommendations();
    
    return () => {
      isMounted = false;
    };
  }, [talentUserId, externalRecommendations, cachedRecommendations.length]);

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
        buttonText="Request Recommendation"
        onButtonClick={onRecommendationClick as any}
      />
    );
  }

  return (
    <div className="w-full px-[15px] py-[15px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8px]">
        {recommendations.map((recommendation) => (
          <button
            key={recommendation.id}
            onClick={() => onRecommendationClick?.(recommendation)}
            className="flex flex-col items-start gap-[8px] p-[12px_10px] rounded-[12px] border border-[#E1E4EA] text-left hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-start gap-[15px] w-full">
              {/* Header with Avatar and Info */}
              <div className="flex flex-col items-start gap-[5px] w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[8px]">
                    {/* Avatar */}
                    <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      {recommendation.avatar ? (
                        <Image
                          src={recommendation.avatar}
                          alt={recommendation.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-white text-xs font-semibold">
                          {recommendation.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name and Date */}
                    <div className="flex flex-col items-start gap-[4px]">
                      <h3 className="text-[13px] font-medium leading-normal font-inter-tight text-black">
                        {recommendation.name}
                      </h3>
                      <span className="text-[12px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                        {recommendation.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Text */}
              <p className="text-[12px] font-normal leading-[18px] font-inter-tight text-[#525866] w-full">
                {recommendation.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
