# Implementation Plan: Business Verification Integration

## Overview

This implementation plan covers the complete Business Verification Integration feature, enabling business users (employers/recruiters) to verify their business identity through a multi-step verification workflow. The implementation follows existing codebase patterns using Next.js 14, React Query for state management, and TypeScript for type safety.

## Tasks

- [x] 1. Set up API layer and type definitions
  - [x] 1.1 Create verification API types
    - Create `lib/api/verification/types.ts` with all TypeScript interfaces
    - Define `VerificationStatus`, `BusinessVerificationData`, `VerificationApplication`, `VerificationStatusResponse`, `DocumentUploadResponse`, and request types
    - _Requirements: 1.1, 1.2, 2.1, 3.1_

  - [x] 1.2 Implement verification API functions
    - Create `lib/api/verification/index.ts` with API client functions
    - Implement `submitVerification`, `getVerificationStatus`, `resubmitVerification`, and `uploadDocument` functions
    - Use existing `apiClient` pattern from `lib/api/index.ts`
    - Handle FormData for document uploads
    - _Requirements: 1.3, 2.2, 3.2, 4.1_

  - [ ]\* 1.3 Write property test for API type consistency
    - **Property 16: Component Prop Consistency**
    - **Validates: Requirements 10.5**
    - Test that API types match expected structure across all endpoints

- [x] 2. Create React Query hooks for state management
  - [x] 2.1 Implement useBusinessVerification hook
    - Create `hooks/useBusinessVerification.ts` with React Query hooks
    - Implement `useVerificationStatus` with automatic polling for pending status (30s interval)
    - Implement `useSubmitVerification` mutation with cache invalidation
    - Implement `useResubmitVerification` mutation with cache invalidation
    - Implement `useUploadDocument` mutation
    - Define query key constant: `['verification', 'status']`
    - _Requirements: 3.2, 4.1, 8.1, 8.2, 8.5_

  - [ ]\* 2.2 Write property test for polling behavior
    - **Property 8: Polling Activates for Pending Status**
    - **Validates: Requirements 3.2, 8.5**
    - Test that polling activates only for pending status and stops for approved/rejected

  - [ ]\* 2.3 Write property test for cache invalidation
    - **Property 13: Query Invalidation on Status Change**
    - **Validates: Requirements 8.2**
    - Test that mutations properly invalidate verification status query

  - [ ]\* 2.4 Write property test for cache sharing
    - **Property 14: React Query Cache Sharing**
    - **Validates: Requirements 8.3, 8.4**
    - Test that multiple components share cached data within stale time window

- [ ] 3. Checkpoint - Verify API layer and hooks
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Build core verification components
  - [x] 4.1 Create VerificationStatusBanner component
    - Create `components/verification/VerificationStatusBanner.tsx`
    - Accept props: `status`, `rejectionReason?`, `onActionClick`, `className?`
    - Display different messages and colors based on status (not_started, pending, approved, rejected)
    - Show actionable CTA button for pending/rejected states
    - Make dismissible for approved status
    - Implement mobile-responsive layout
    - Add ARIA labels for accessibility
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 9.1_

  - [ ]\* 4.2 Write property test for banner display logic
    - **Property 11: Banner Display Based on Status**
    - **Validates: Requirements 5.1, 5.3, 5.4, 5.5**
    - Test that banner displays correctly for each status with appropriate messaging

  - [x] 4.3 Create VerifiedBadge component
    - Create `components/verification/VerifiedBadge.tsx`
    - Accept props: `size?` ('sm' | 'md' | 'lg'), `showTooltip?`, `className?`
    - Display checkmark icon with "Verified" text
    - Implement tooltip explaining verification
    - Add ARIA labels for accessibility
    - Support multiple size variants
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 9.1_

  - [ ]\* 4.4 Write property test for badge display logic
    - **Property 12: Verified Badge Display**
    - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**
    - Test that badge displays only for approved verification status

  - [x] 4.5 Create StatusTimeline component
    - Create `components/verification/StatusTimeline.tsx`
    - Accept props: `status`, `submittedAt?`, `reviewedAt?`, `rejectionReason?`
    - Display visual progress indicator for verification stages
    - Show timestamps for each stage
    - Display rejection reason if applicable
    - Implement mobile-responsive layout
    - _Requirements: 3.3, 9.1_

  - [ ]\* 4.6 Write property test for status display
    - **Property 7: Status Display Reflects Application State**
    - **Validates: Requirements 3.1, 3.3**
    - Test that timeline displays correct UI elements for each status

- [x] 5. Build document upload functionality
  - [x] 5.1 Create DocumentUploader component
    - Create `components/verification/DocumentUploader.tsx`
    - Accept props: `onUpload`, `onRemove`, `documents`, `maxFiles?`, `maxSizeMB?`
    - Implement drag-and-drop support
    - Validate file type (PDF, JPG, PNG) and size (default 10MB)
    - Display preview thumbnails for uploaded documents
    - Show upload progress indicator
    - Display clear error messages for validation failures
    - Implement mobile-optimized file picker
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1_

  - [ ]\* 5.2 Write property test for file upload validation
    - **Property 4: File Upload Validation**
    - **Validates: Requirements 2.1, 2.3**
    - Test that invalid file types and sizes are rejected with appropriate errors

  - [ ]\* 5.3 Write property test for upload preview
    - **Property 5: Successful Upload Shows Preview**
    - **Validates: Requirements 2.2**
    - Test that valid uploaded files display preview in document list

  - [ ]\* 5.4 Write property test for document list operations
    - **Property 6: Document List Reflects Operations**
    - **Validates: Requirements 2.4, 2.5**
    - Test that document list count matches add/remove operations

- [x] 6. Build multi-step application form
  - [x] 6.1 Create form validation schemas
    - Create Zod schemas in `components/verification/ApplicationForm.tsx`
    - Define `businessInfoSchema` for step 1 (business name, registration number, type, address, city, state, country, website)
    - Define `contactInfoSchema` for step 2 (phone number)
    - Define `documentSchema` for step 3 (documents array)
    - Define `fullVerificationSchema` combining all schemas
    - _Requirements: 1.2, 1.4_

  - [x] 6.2 Implement ApplicationForm component
    - Create `components/verification/ApplicationForm.tsx`
    - Accept props: `initialData?`, `onSubmit`, `isSubmitting`
    - Implement 3-step form: Business Info, Contact Details, Document Upload
    - Add progress indicator showing current step
    - Implement step navigation (next, previous, submit)
    - Preserve data between steps in component state
    - Display validation errors inline for each field
    - Integrate DocumentUploader component in step 3
    - Implement mobile-optimized layout with responsive form fields
    - Add keyboard navigation support
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2_

  - [ ]\* 6.3 Write property test for form validation
    - **Property 1: Form Validation Rejects Invalid Data**
    - **Validates: Requirements 1.2, 1.4**
    - Test that invalid form data is rejected with specific error messages

  - [ ]\* 6.4 Write property test for valid form submission
    - **Property 2: Valid Form Submission Triggers API Call**
    - **Validates: Requirements 1.3**
    - Test that valid form data triggers API call and shows confirmation

  - [ ]\* 6.5 Write property test for step navigation
    - **Property 3: Form Step Navigation Preserves Data**
    - **Validates: Requirements 1.5**
    - Test that navigating between steps preserves all entered data

- [ ] 7. Checkpoint - Verify core components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Build main verification dashboard
  - [x] 8.1 Create VerificationDashboard component
    - Create `components/verification/VerificationDashboard.tsx`
    - Use `useVerificationStatus` hook to fetch current status
    - Display VerificationStatusBanner at top
    - Show ApplicationForm for new submissions (status: not_started)
    - Show ApplicationForm with pre-filled data for resubmissions (status: rejected)
    - Display StatusTimeline showing verification progress
    - Show document list for submitted applications
    - Handle loading and error states
    - Implement mobile-responsive layout
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 9.1_

  - [ ]\* 8.2 Write property test for resubmission pre-fill
    - **Property 9: Resubmission Pre-fills Previous Data**
    - **Validates: Requirements 4.2, 4.3**
    - Test that rejected applications pre-fill form with previous data

  - [ ]\* 8.3 Write property test for resubmission status transition
    - **Property 10: Resubmission Transitions to Pending**
    - **Validates: Requirements 4.4**
    - Test that successful resubmission changes status to pending

  - [ ]\* 8.4 Write unit tests for VerificationDashboard
    - Test component rendering for each status
    - Test form submission flow
    - Test error handling
    - Test loading states

- [x] 9. Create verification page route
  - [x] 9.1 Create verification page
    - Create `app/(business)/verification/page.tsx`
    - Use `useRequireRole('recruiter')` to restrict access
    - Render VerificationDashboard component
    - Add page title and container layout
    - Implement mobile-responsive padding and spacing
    - _Requirements: 6.1, 6.2, 9.1_

  - [ ]\* 9.2 Write unit test for page access control
    - Test that page requires recruiter role
    - Test that non-recruiters are redirected

- [x] 10. Integrate verification into dashboard
  - [x] 10.1 Add banner to EmployerDashboard
    - Locate `components/employer/dashboard/EmployerDashboard.tsx`
    - Import `VerificationStatusBanner` and `useVerificationStatus`
    - Fetch verification status using hook
    - Render banner at top of dashboard if status is not 'approved'
    - Pass `onActionClick` handler to navigate to `/verification`
    - Add margin bottom for spacing
    - _Requirements: 5.1, 5.2, 8.1_

  - [ ]\* 10.2 Write unit test for dashboard banner integration
    - Test that banner displays for non-approved statuses
    - Test that banner is hidden for approved status
    - Test navigation on action click

- [x] 11. Integrate verification into navigation
  - [x] 11.1 Add verification to sidebar navigation
    - Locate `components/layouts/RecruiterSidebar.tsx` or equivalent sidebar component
    - Add verification menu item with ShieldCheck icon
    - Set href to `/verification`
    - Position appropriately in menu order
    - _Requirements: 6.1, 6.3_

  - [x] 11.2 Add verification to mobile navigation
    - Locate `components/navigation/MobileNavigation.tsx`
    - Add verification menu item following existing pattern
    - Use ShieldCheck icon
    - Set href to `/verification`
    - _Requirements: 6.1, 6.3, 9.1_

  - [ ]\* 11.3 Write unit tests for navigation integration
    - Test that verification menu item appears in sidebar
    - Test that verification menu item appears in mobile nav
    - Test navigation to verification page

- [x] 12. Integrate verified badge into profiles
  - [x] 12.1 Add badge to employer profile panel
    - Locate `components/employer/profile/EmployerProfilePanel.tsx` or equivalent
    - Import `VerifiedBadge` and `useVerificationStatus`
    - Fetch verification status
    - Render badge next to employer name if status is 'approved'
    - Use medium size with tooltip enabled
    - _Requirements: 7.1, 7.3, 8.1_

  - [x] 12.2 Add badge to opportunity listings
    - Locate opportunity card/list components (e.g., `components/employer/opportunities/OpportunityCard.tsx`)
    - Import `VerifiedBadge`
    - Accept `isVerified` prop from parent
    - Render badge next to employer name if verified
    - Use small size for compact display
    - _Requirements: 7.2, 7.3_

  - [x] 12.3 Add badge to employer cards in talent views
    - Locate employer card components in talent views (e.g., discover talent, applications)
    - Import `VerifiedBadge`
    - Accept `isVerified` prop from parent
    - Render badge next to employer name if verified
    - Use small size for compact display
    - _Requirements: 7.4, 7.5_

  - [ ]\* 12.4 Write unit tests for badge integration
    - Test badge displays on employer profiles when verified
    - Test badge displays on opportunity listings when verified
    - Test badge displays on employer cards when verified
    - Test badge is hidden when not verified

- [x] 13. Checkpoint - Verify all integrations
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement error handling and edge cases
  - [x] 14.1 Add comprehensive error handling
    - Implement error handling in all API functions
    - Add error boundaries for verification components
    - Display user-friendly error messages using toast notifications
    - Handle network errors with retry mechanisms
    - Handle validation errors with field-specific messages
    - Handle API error responses (400, 401, 403, 404, 429, 500)
    - Preserve form data on errors for retry
    - _Requirements: 9.3, 9.4_

  - [x] 14.2 Handle edge cases
    - Handle empty states (no verification application)
    - Handle loading states with skeletons
    - Handle rapid status changes during polling
    - Handle multiple simultaneous document uploads
    - Handle file upload failures with retry
    - Handle network timeout scenarios
    - _Requirements: 9.3, 9.4_

  - [ ]\* 14.3 Write property test for error handling consistency
    - **Property 15: API Error Handling Consistency**
    - **Validates: Requirements 9.4**
    - Test that all API errors are handled gracefully without crashes

  - [ ]\* 14.4 Write unit tests for error scenarios
    - Test form validation error display
    - Test file upload error messages
    - Test network error handling
    - Test API error responses
    - Test error recovery mechanisms

- [x] 15. Add accessibility and mobile optimizations
  - [x] 15.1 Implement accessibility features
    - Add ARIA labels to all interactive elements
    - Add ARIA live regions for status updates
    - Implement keyboard navigation for form
    - Add focus management (focus first error on validation failure)
    - Ensure high contrast mode support
    - Add descriptive button labels
    - Test with screen readers
    - _Requirements: 9.1, 9.2_

  - [x] 15.2 Optimize for mobile devices
    - Ensure all components are mobile-responsive
    - Implement larger touch targets (min 44x44px)
    - Optimize file upload for mobile (native picker, camera integration)
    - Test on various screen sizes
    - Optimize bundle size with lazy loading
    - _Requirements: 9.1_

  - [ ]\* 15.3 Write unit tests for accessibility
    - Test keyboard navigation
    - Test ARIA labels presence
    - Test focus management
    - Test screen reader compatibility

- [x] 16. Performance optimizations
  - [x] 16.1 Implement lazy loading
    - Lazy load DocumentUploader component
    - Lazy load StatusTimeline component
    - Code-split verification page
    - _Requirements: 10.1_

  - [x] 16.2 Optimize caching and polling
    - Configure React Query stale time (5 minutes)
    - Implement conditional polling (only for pending status)
    - Optimize cache invalidation strategy
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [x] 16.3 Optimize document handling
    - Compress document previews
    - Use thumbnails for display
    - Lazy load preview images
    - _Requirements: 2.2, 10.1_

- [x] 17. Final checkpoint and documentation
  - [x] 17.1 Run all tests and verify functionality
    - Run all unit tests
    - Run all property-based tests
    - Verify all integration points
    - Test end-to-end verification flow
    - Test on multiple browsers and devices

  - [x] 17.2 Create component documentation
    - Document all component props and usage
    - Add JSDoc comments to API functions
    - Document hook usage patterns
    - Add inline code comments for complex logic
    - _Requirements: 10.5_

  - [x] 17.3 Final verification
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows existing codebase patterns (Next.js 14, React Query, TypeScript)
- All components are mobile-responsive and accessibility-compliant
- The feature uses polling for real-time status updates during pending verification
- Document uploads use FormData and support drag-and-drop
- The verification status is displayed across multiple touchpoints (dashboard, navigation, profiles, opportunities)
