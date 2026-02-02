"use client";

import Image from "next/image";

interface Review {
  id: string;
  name: string;
  date: string;
  avatar: string;
  text: string;
}

// Sample reviews data from Figma design
const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Marcus Lee",
    date: "May 22, 2025",
    avatar: "#FF6B6B", // Red tones
    text: "Marcus spearheaded the redesign of our mobile app, introducing a fresh interface that increased user engagement by 30%.",
  },
  {
    id: "2",
    name: "Nina Patel",
    date: "Jun 5, 2025",
    avatar: "#E0BBE4", // Lavender
    text: "Nina's innovative approach to data visualization in reports enhanced decision-making across teams, making complex data accessible.",
  },
  {
    id: "3",
    name: "Omar Khan",
    date: "Jul 10, 2025",
    avatar: "#A8E6A3", // Mint green
    text: "Omar developed a new AI feature for our customer support chatbot, reducing response times by half and improving user satisfaction.",
  },
  {
    id: "4",
    name: "Lila Chen",
    date: "Aug 18, 2025",
    avatar: "#FFB347", // Orange
    text: "Lila led a workshop series that increased design team collaboration and created a shared vision for our upcoming product lines.",
  },
  {
    id: "5",
    name: "Rajesh Gupta",
    date: "Sep 30, 2025",
    avatar: "#6B8E23", // Olive
    text: "Rajesh's focus on accessibility in our web applications ensured compliance with new regulations and improved usability for all customers.",
  },
  {
    id: "6",
    name: "Sofia Martinez",
    date: "Oct 11, 2025",
    avatar: "#4A90E2", // Blue
    text: "Sofia initiated a user research program that provided key insights, directly influencing our product roadmap for the next year.",
  },
  {
    id: "7",
    name: "David Bryant",
    date: "Nov 20, 2025",
    avatar: "#F4C430", // Gold
    text: "David's creative direction on our branding project revitalized our identity, resulting in a 40% increase in brand recall among target audiences.",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col items-start gap-3 p-2.5 sm:p-[12px_10px] rounded-[12px] border border-[#E1E4EA] bg-white">
      <div className="flex flex-col items-start gap-[5px] w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
              style={{ backgroundColor: review.avatar }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-[11px] font-semibold">
                {review.name.charAt(0)}
              </div>
            </div>

            {/* Name and Date */}
            <div className="flex flex-col items-start gap-[7px]">
              <div className="text-[13px] font-medium leading-normal font-inter-tight text-black">
                {review.name}
              </div>
              <div
                className="text-[12px] font-light leading-normal font-inter-tight"
                style={{ color: "rgba(0, 0, 0, 0.30)" }}
              >
                {review.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <div className="text-[12px] font-normal leading-4 font-inter-tight text-[#525866] w-full">
        {review.text}
      </div>
    </div>
  );
}

export function MentorReviewsSection() {
  return (
    <div className="w-full">
      {/* Grid container - 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {sampleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
