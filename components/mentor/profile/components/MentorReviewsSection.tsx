"use client";

import { useEffect, useState } from "react";
import { getMentorReviews } from "@/lib/api/mentorship";
import type { SessionReview } from "@/lib/api/mentorship";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";

interface MentorReviewsSectionProps {
  mentorId?: string;
}

function ReviewCard({ review }: { review: SessionReview }) {
  // Safety check for mentee data
  if (!review.mentee || !review.mentee.name) {
    return null;
  }
  
  // Generate a color based on the reviewer's name
  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B", "#E0BBE4", "#A8E6A3", "#FFB347", 
      "#6B8E23", "#4A90E2", "#F4C430", "#FF69B4"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-start gap-3 p-2.5 sm:p-[12px_10px] rounded-[12px] border border-[#E1E4EA] bg-white">
      <div className="flex flex-col items-start gap-[5px] w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
              style={{ backgroundColor: review.mentee.avatar ? 'transparent' : getAvatarColor(review.mentee.name) }}
            >
              {review.mentee.avatar ? (
                <img
                  src={review.mentee.avatar}
                  alt={review.mentee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-[11px] font-semibold">
                  {review.mentee.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name and Date */}
            <div className="flex flex-col items-start gap-[7px]">
              <div className="text-[13px] font-medium leading-normal font-inter-tight text-black">
                {review.mentee.name}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="text-[12px] font-light leading-normal font-inter-tight"
                  style={{ color: "rgba(0, 0, 0, 0.30)" }}
                >
                  {formatDate(review.createdAt)}
                </div>
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill={i < review.rating ? "#FFD700" : "#E1E4EA"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Text */}
      {review.comment && (
        <div className="text-[12px] font-normal leading-4 font-inter-tight text-[#525866] w-full">
          {review.comment}
        </div>
      )}
    </div>
  );
}

export function MentorReviewsSection({ mentorId }: MentorReviewsSectionProps) {
  const [reviews, setReviews] = useState<SessionReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) {
      setIsLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await getMentorReviews(mentorId, { limit: 20 });
        setReviews(response.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [mentorId]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-sm text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full">
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Reviews from mentees will appear here after completed sessions"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid container - 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
