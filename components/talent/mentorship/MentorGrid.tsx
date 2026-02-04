"use client";

import { MentorCard } from "./MentorCard";

interface Mentor {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  pricePerSession: number;
  sessionsCompleted: number;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 md:gap-2">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} {...mentor} />
      ))}
    </div>
  );
}
