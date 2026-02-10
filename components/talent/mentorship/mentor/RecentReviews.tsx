import { MessageSquare, ArrowUpRight, Star, CheckCircle } from "lucide-react";

interface ReviewCardProps {
  rating: number;
  review: string;
  reviewerInitial: string;
  reviewerName: string;
  verified: boolean;
}

function ReviewCard({
  rating,
  review,
  reviewerInitial,
  reviewerName,
  verified,
}: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E4E7EB] bg-[#FFFDF5] p-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-[18px] w-[18px] ${
                i < rating ? "fill-[#FBBE24]" : "fill-gray-300"
              }`}
              strokeWidth={0}
            />
          ))}
        </div>
        <p className="font-inter-tight text-sm font-normal leading-normal text-[#6A7280]">
          {review}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E39B00]">
          <span className="font-inter-tight text-sm font-medium leading-normal text-white">
            {reviewerInitial}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter-tight text-sm font-normal leading-normal text-black">
            {reviewerName}
          </span>
          {verified && (
            <CheckCircle
              className="h-4 w-4 fill-[#008B47] stroke-[#008B47]"
              strokeWidth={1.6}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function RecentReviews() {
  const reviews: ReviewCardProps[] = [
    {
      rating: 5,
      review: "Incredibly insightful session. Helped me land my dream job!",
      reviewerInitial: "B",
      reviewerName: "Blessing I.",
      verified: true,
    },
    {
      rating: 5,
      review: "Incredibly insightful session. Helped me land my dream job!",
      reviewerInitial: "B",
      reviewerName: "Blessing I.",
      verified: true,
    },
    {
      rating: 5,
      review: "Incredibly insightful session. Helped me land my dream job!",
      reviewerInitial: "B",
      reviewerName: "Blessing I.",
      verified: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#E4E7EB] bg-white p-8 shadow-[0_4px_4px_0_rgba(178,178,178,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 stroke-[#E9B305]" strokeWidth={2} />
          <h2 className="font-inter-tight text-lg font-semibold leading-normal text-black">
            Recent Reviews
          </h2>
        </div>
        <button className="flex items-center gap-2">
          <span className="font-inter-tight text-sm font-normal leading-normal text-black">
            View All
          </span>
          <ArrowUpRight className="h-[18px] w-[18px] stroke-black" strokeWidth={1.6} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
}
