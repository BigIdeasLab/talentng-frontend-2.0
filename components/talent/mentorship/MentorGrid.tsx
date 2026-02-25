"use client";

import { MentorCard } from "./MentorCard";

interface Mentor {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  rating?: number;
  totalReviews?: number;
  expertise?: string[];
  company?: string;
  location?: string;
}

interface MentorGridProps {
  mentors: Mentor[];
}

export function MentorGrid({ mentors }: MentorGridProps) {
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="font-inter-tight text-[13px] text-gray-500">
          No mentors found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} {...mentor} />
      ))}
    </div>
  );
}
