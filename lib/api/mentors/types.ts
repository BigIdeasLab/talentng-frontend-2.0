export interface Mentor {
  id: string;
  name: string;
  bio?: string;
  expertise?: string[];
  availability?: { startTime: string; endTime: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorAvailability {
  startTime: string;
  endTime: string;
}

export interface BookSessionRequest {
  mentorId: string;
  startTime: string;
  topic?: string;
  note?: string;
}
