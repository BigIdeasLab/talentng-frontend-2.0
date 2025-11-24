'use client';
import React, { useState, useEffect } from "react";
import { MentorCard } from "@/components/mentorship/MentorCard";
import { getMentors } from "@/lib/api";
import { Mentor } from "@/lib/types/mentor";
import BookingModal from "@/components/BookingModal";
import { MentorCardSkeleton } from "./MentorCardSkeleton";

export function OutstandingMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const fetchedMentors = await getMentors();
        setMentors(fetchedMentors);
      } catch (err) {
        setError("Failed to fetch mentors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleBookSession = (mentorId: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    if (mentor) {
      setSelectedMentor(mentor);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2.5">
        <h2 className="text-2xl font-medium text-[#14171F] font-geist">
          Outstanding Mentors
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-base font-normal text-gray-500 font-geist">
            {error
              ? error
              : mentors.length === 0 && !loading
              ? "No mentors found"
              : `Standout Mentors making waves around the web`}
          </p>
          {mentors.length > 0 && !loading && !error && (
            <button className="text-base font-medium text-[#373F51] font-geist underline hover:text-gray-800 transition-colors">
              View more
            </button>
          )}
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => <MentorCardSkeleton key={i} />)
        ) : error ? (
          <div className="col-span-full text-center py-12 w-full">
            <p className="text-lg text-red-500 font-geist">{error}</p>
          </div>
        ) : mentors.length === 0 ? (
          <div className="col-span-full text-center py-12 w-full">
            <p className="text-lg text-gray-500 font-geist">
              No mentors found.
            </p>
          </div>
        ) : (
          mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onBookSession={handleBookSession}
            />
          ))
        )}
      </div>
      {selectedMentor && (
        <BookingModal
          open={isModalOpen}
          onClose={handleCloseModal}
          mentor={selectedMentor}
        />
      )}
    </div>
  );
}