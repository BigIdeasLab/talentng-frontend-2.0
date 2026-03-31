/**
 * Business Verification API Types
 * Types for business verification requests and responses
 */

export type VerificationStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected";

export interface BusinessVerificationData {
  businessName: string;
  registrationNumber: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  phoneNumber: string;
  documents: File[]; // Actual File objects, not IDs
}

export interface VerificationApplication {
  id: string;
  userId: string;
  status: VerificationStatus;
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  data: BusinessVerificationData;
}

export interface VerificationStatusResponse {
  status: VerificationStatus;
  application?: VerificationApplication;
}

export interface DocumentUploadResponse {
  documentId: string;
  url: string;
  filename: string;
}

export interface SubmitVerificationRequest {
  type: "business";
  businessName: string;
  registrationNumber: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  phoneNumber: string;
  documents: File[]; // Actual File objects
}

export interface ResubmitVerificationRequest {
  type: "business";
  businessName: string;
  registrationNumber: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  phoneNumber: string;
  documents: File[]; // Actual File objects
}
