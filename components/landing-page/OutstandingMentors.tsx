"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MentorCard, MentorCardSkeleton } from "@/components/mentorship";
import { Mentor } from "@/lib/types/mentor";

interface OutstandingMentorsProps {
  initialMentors: Mentor[];
  isLoading?: boolean;
}

export function OutstandingMentors({
  initialMentors,
  isLoading,
}: OutstandingMentorsProps) {
  const router = useRouter();

  const handleBookSession = (mentorId: string) => {
    router.push(`/talent/mentorship/${mentorId}`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2.5">
        <h2 className="text-2xl font-medium text-[#14171F] font-geist">
          Outstanding Mentors
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-base font-normal text-gray-500 font-geist">
            Standout Mentors making waves around the web
          </p>
          {initialMentors.length > 0 && (
            <button className="text-base font-medium text-[#373F51] font-geist underline hover:text-gray-800 transition-colors">
              View more
            </button>
          )}
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <MentorCardSkeleton key={index} />
            ))
          : initialMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookSession={handleBookSession}
                basePath="/mentorship"
              />
            ))}
      </div>
    </div>
  );
}
