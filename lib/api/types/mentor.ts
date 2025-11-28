export interface Mentor {
  id: string;
  name: string;
  bio?: string;
  expertise?: string[];
  availability?: { startTime: string; endTime: string }[];
  createdAt?: string;
  updatedAt?: string;
}
