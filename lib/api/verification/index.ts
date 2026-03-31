/**
 * Business Verification API Client
 * Handles all verification-related API calls
 */

import apiClient from '@/lib/api';
import type {
  VerificationStatusResponse,
  SubmitVerificationRequest,
  ResubmitVerificationRequest,
  DocumentUploadResponse,
  VerificationApplication,
} from './types';

/**
 * Submit a new verification application
 * POST /verification-requests/business
 */
export async function submitVerification(
  request: SubmitVerificationRequest
): Promise<VerificationApplication> {
  const formData = new FormData();
  
  // Add all text fields
  formData.append('type', request.type);
  formData.append('businessName', request.businessName);
  formData.append('registrationNumber', request.registrationNumber);
  formData.append('businessType', request.businessType);
  formData.append('address', request.address);
  formData.append('city', request.city);
  formData.append('state', request.state);
  formData.append('country', request.country);
  formData.append('phoneNumber', request.phoneNumber);
  
  if (request.website) {
    formData.append('website', request.website);
  }
  
  // Add all document files
  request.documents.forEach((file) => {
    formData.append('documents', file);
  });
  
  return apiClient<VerificationApplication>('/verification-requests/business', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Get current verification status
 * GET /recruiter/verification/status
 */
export async function getVerificationStatus(): Promise<VerificationStatusResponse> {
  return apiClient<VerificationStatusResponse>('/recruiter/verification/status', {
    method: 'GET',
  });
}

/**
 * Resubmit a rejected verification
 * POST /verification-requests/business
 */
export async function resubmitVerification(
  request: ResubmitVerificationRequest
): Promise<VerificationApplication> {
  const formData = new FormData();
  
  // Add all text fields
  formData.append('type', request.type);
  formData.append('businessName', request.businessName);
  formData.append('registrationNumber', request.registrationNumber);
  formData.append('businessType', request.businessType);
  formData.append('address', request.address);
  formData.append('city', request.city);
  formData.append('state', request.state);
  formData.append('country', request.country);
  formData.append('phoneNumber', request.phoneNumber);
  
  if (request.website) {
    formData.append('website', request.website);
  }
  
  // Add all document files
  request.documents.forEach((file) => {
    formData.append('documents', file);
  });
  
  return apiClient<VerificationApplication>('/verification-requests/business', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Upload a verification document
 * POST /verification-requests/upload-document
 * @deprecated - Documents are now uploaded directly with the verification request
 */
export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('document', file);
  
  return apiClient<DocumentUploadResponse>('/verification-requests/upload-document', {
    method: 'POST',
    body: formData,
  });
}

// Export types for convenience
export type {
  VerificationStatus,
  BusinessVerificationData,
  VerificationApplication,
  VerificationStatusResponse,
  DocumentUploadResponse,
  SubmitVerificationRequest,
  ResubmitVerificationRequest,
} from './types';
