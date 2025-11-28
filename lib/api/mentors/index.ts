/**
 * Mentors API Client
 * Handles all mentor-related API calls
 */

import apiClient from "@/lib/api";
import type { Mentor, MentorAvailability, BookSessionRequest } from "./types";

export const getMentors = async (query?: string): Promise<Mentor[]> => {
  const endpoint = query ? `/mentor?q=${query}` : "/mentor";
  return apiClient<Mentor[]>(endpoint);
};

export const getMentorById = async (id: string): Promise<Mentor> => {
  return apiClient<Mentor>(`/mentor/${id}`);
};

export const getMentorAvailability = async (
  mentorId: string
): Promise<MentorAvailability[]> => {
  return apiClient<MentorAvailability[]>(`/mentor/${mentorId}/availability`);
};

export const bookSession = async (
  mentorId: string,
  startTime: string,
  topic?: string,
  note?: string
): Promise<any> => {
  return apiClient<any>(`/mentor/booking`, {
    method: "POST",
    body: { mentorId, startTime, topic, note },
  });
};

// Export types
export type { Mentor, MentorAvailability, BookSessionRequest };
