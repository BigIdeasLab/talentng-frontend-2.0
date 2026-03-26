export type { Opportunity } from "./opportunity";
export type { Application } from "./application";
export type { Mentor } from "./mentor";
export type { Notification } from "./notification";
export type { LearningResource } from "./learning";
export type { Talent } from "./talent";

// Profile Email Verification Types
export interface VerifyEmailRequest {
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

export interface EmailUpdateRequest {
  email: string;
}

export interface RateLimitError {
  error: "RATE_LIMITED";
  message: string;
  nextAllowedUpdate: string; // ISO timestamp
}
