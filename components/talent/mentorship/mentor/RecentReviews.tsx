import { MessageSquare, ArrowUpRight, Star, CheckCircle } from "lucide-react";
import type { MentorRecentReview } from "@/lib/api/mentorship";

interface ReviewCardProps {
  rating: number;
  comment: string;
  reviewerInitial: string;
  reviewerName: string;
  verified: boolean;
}

function ReviewCard({
  rating,
  comment,
  reviewerInitial,
  reviewerName,
  verified,
}: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#E4E7EB] bg-[#FFFDF5] p-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating ? "fill-[#FBBE24]" : "fill-gray-300"
              }`}
              strokeWidth={0}
            />
          ))}
        </div>
        <p className="text-[12px] font-inter-tight leading-normal text-[#6A7280]">
          {comment}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#E39B00] flex items-center justify-center">
          <span className="text-[10px] font-medium font-inter-tight text-white">
            {reviewerInitial}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-inter-tight text-black">
            {reviewerName}
          </span>
          {verified && (
            <CheckCircle
              className="w-3.5 h-3.5 fill-[#008B47] stroke-[#008B47]"
              strokeWidth={1.6}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface RecentReviewsProps {
  reviews: MentorRecentReview[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-[#E5E6ED] bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#E9B305]" />
          <h2 className="text-[15px] font-semibold font-inter-tight">
            Recent Reviews
          </h2>
        </div>
        <button className="flex items-center gap-1 text-[#5C30FF] text-[12px] font-medium font-inter-tight hover:opacity-80 transition-opacity">
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {reviews.length === 0 ? (
        <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
          No reviews yet
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              rating={review.rating}
              comment={review.comment}
              reviewerInitial={review.reviewerInitial}
              reviewerName={review.reviewerName}
              verified={review.verified}
            />
          ))}
        </div>
      )}
    </div>
  );
}
