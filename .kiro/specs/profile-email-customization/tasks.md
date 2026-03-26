# Implementation Plan: Profile Email Customization

## Overview

This implementation extends existing role-based settings pages to support profile-specific email addresses with verification and rate limiting. The approach integrates new email management components into the current settings architecture while maintaining backward compatibility.

## Tasks

- [ ] 1. Extend type definitions and API interfaces
  - [ ] 1.1 Update settings type definitions
    - Add email, emailVerified, and emailUpdatedAt fields to TalentSettings, MentorSettings, and RecruiterSettings interfaces
    - Create verification request/response types
    - _Requirements: 1.1, 1.2, 8.1, 8.3_

  - [ ] 1.2 Create profile email component prop interfaces
    - Define ProfileEmailSectionProps, VerificationModalProps, and StatusIndicatorProps interfaces
    - Include error handling and loading state types
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 1.3 Write property test for type consistency
    - **Property 10: API Integration and Compatibility**
    - **Validates: Requirements 8.2, 8.4, 8.5**

- [ ] 2. Implement core UI components
  - [ ] 2.1 Create ProfileEmailSection component
    - Build reusable component for email input, status display, and verification UI
    - Include responsive design for mobile devices
    - Implement rate limiting UI states and error handling
    - _Requirements: 5.1, 5.2, 5.5, 5.6_

  - [ ] 2.2 Create VerificationModal component
    - Build modal for 6-digit verification code entry
    - Include auto-focus, resend functionality, and error display
    - Implement mobile-friendly touch interactions
    - _Requirements: 2.2, 5.3, 5.5_

  - [ ] 2.3 Create StatusIndicator component
    - Build visual indicators for verified, pending, main-email, and rate-limited states
    - Include next update time display for rate limiting
    - _Requirements: 1.4, 1.5, 3.4, 5.2_

  - [ ]* 2.4 Write property test for UI status display
    - **Property 7: UI Status Display Accuracy**
    - **Validates: Requirements 1.4, 1.5, 5.2, 5.3, 5.6**

- [ ] 3. Extend API service functions
  - [ ] 3.1 Add email management functions to talent API
    - Implement updateTalentEmail, verifyTalentEmail, and resendTalentVerification functions
    - Include proper error handling and type safety
    - _Requirements: 1.1, 2.1, 2.3, 8.2_

  - [ ] 3.2 Add email management functions to mentor API
    - Implement updateMentorEmail, verifyMentorEmail, and resendMentorVerification functions
    - Include proper error handling and type safety
    - _Requirements: 1.1, 2.1, 2.3, 8.2_

  - [ ] 3.3 Add email management functions to recruiter API
    - Implement updateRecruiterEmail, verifyRecruiterEmail, and resendRecruiterVerification functions
    - Include proper error handling and type safety
    - _Requirements: 1.1, 2.1, 2.3, 8.2_

  - [ ]* 3.4 Write property test for email validation and uniqueness
    - **Property 6: Email Validation and Uniqueness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [ ] 4. Checkpoint - Ensure core components work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Integrate email sections into existing settings pages
  - [ ] 5.1 Update TalentSettings component
    - Add ProfileEmailSection to existing TalentSettings page
    - Wire up API calls and state management with React Query
    - Maintain existing layout and styling patterns
    - _Requirements: 1.1, 5.1, 8.2_

  - [ ] 5.2 Update MentorSettings component
    - Add ProfileEmailSection to existing MentorSettings page
    - Wire up API calls and state management with React Query
    - Maintain existing layout and styling patterns
    - _Requirements: 1.1, 5.1, 8.2_

  - [ ] 5.3 Update EmployerSettings component
    - Add ProfileEmailSection to existing EmployerSettings page
    - Wire up API calls and state management with React Query
    - Maintain existing layout and styling patterns
    - _Requirements: 1.1, 5.1, 8.2_

  - [ ]* 5.4 Write property test for profile email storage and retrieval
    - **Property 1: Profile Email Storage and Retrieval**
    - **Validates: Requirements 1.1, 1.2, 8.1, 8.3**

- [ ] 6. Implement verification and rate limiting logic
  - [ ] 6.1 Add verification state management
    - Implement verification code input handling and validation
    - Add automatic verification modal display when needed
    - Include resend code functionality with proper timing
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 6.2 Add rate limiting UI logic
    - Implement cooldown period display and input disabling
    - Show next allowed update time when rate limited
    - Handle rate limit errors from API responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 6.3 Write property test for email update verification reset
    - **Property 2: Email Update Verification Reset**
    - **Validates: Requirements 1.3, 2.1**

  - [ ]* 6.4 Write property test for verification code generation and validation
    - **Property 3: Verification Code Generation and Validation**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

  - [ ]* 6.5 Write property test for rate limiting enforcement
    - **Property 4: Rate Limiting Enforcement**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ] 7. Implement comprehensive error handling
  - [ ] 7.1 Add client-side error handling
    - Implement network error handling with retry logic
    - Add validation error display with specific messages
    - Include fallback UI states for service unavailability
    - _Requirements: 6.4, 7.1, 7.2, 7.4_

  - [ ] 7.2 Add toast notification system integration
    - Implement success notifications for email updates and verification
    - Add error notifications with appropriate messaging
    - Include loading states and user feedback
    - _Requirements: 5.4, 7.4_

  - [ ]* 7.3 Write property test for error handling and fallback behavior
    - **Property 8: Error Handling and Fallback Behavior**
    - **Validates: Requirements 6.4, 7.1, 7.2, 7.3, 7.4**

  - [ ]* 7.4 Write property test for toast notification feedback
    - **Property 11: Toast Notification Feedback**
    - **Validates: Requirements 5.4, 7.4**

- [ ] 8. Checkpoint - Ensure error handling works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Add comprehensive property-based tests
  - [ ]* 9.1 Write property test for notification routing logic
    - **Property 5: Notification Routing Logic**
    - **Validates: Requirements 2.6, 4.1, 4.2, 4.3, 4.4**

  - [ ]* 9.2 Write property test for verification attempt rate limiting
    - **Property 9: Verification Attempt Rate Limiting**
    - **Validates: Requirements 7.5**

  - [ ]* 9.3 Write property test for notification logging
    - **Property 12: Notification Logging**
    - **Validates: Requirements 4.5, 7.3**

- [ ] 10. Final integration and testing
  - [ ] 10.1 Wire all components together
    - Ensure ProfileEmailSection components work in all three settings pages
    - Verify API integration and state management across all roles
    - Test responsive behavior and mobile compatibility
    - _Requirements: 1.1, 5.1, 5.5, 8.2_

  - [ ] 10.2 Add integration tests
    - Test complete email update and verification flow
    - Verify cross-role independence and rate limiting
    - Test error scenarios and fallback behavior
    - _Requirements: 1.1, 2.1, 3.1, 7.1_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check with minimum 100 iterations
- Integration maintains backward compatibility with existing settings pages
- All components follow existing UI patterns and responsive design principles
- Error handling includes comprehensive fallback strategies and user feedback