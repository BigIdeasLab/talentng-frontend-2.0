export const AVAILABILITY_OPTIONS = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Volunteer",
  "Freelance",
  "Remote",
  "Hybrid",
  "On Site",
] as const;

export type AvailabilityType = (typeof AVAILABILITY_OPTIONS)[number];
