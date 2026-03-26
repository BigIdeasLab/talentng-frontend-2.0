# Requirements Document

## Introduction

This feature enables users to set different email addresses for each of their profiles (Talent, Mentor, Recruiter) while maintaining their main account email for login and account management. Each profile-specific email must be verified before becoming active and has rate limiting to prevent abuse.

## Glossary

- **Profile_Email_System**: The system that manages profile-specific email addresses
- **Main_Account_Email**: The primary email address used for login and account management
- **Profile_Email**: A role-specific email address for receiving notifications (Talent, Mentor, or Recruiter)
- **Email_Verification_System**: The system that handles email verification using 6-digit codes
- **Rate_Limiter**: The system that enforces email update frequency restrictions
- **Notification_Router**: The system that determines which email address to use for notifications
- **Settings_UI**: The user interface for managing profile email settings
- **Verification_Code**: A 6-digit numeric code sent to verify email ownership

## Requirements

### Requirement 1: Profile Email Management

**User Story:** As a multi-role platform user, I want to set different email addresses for each of my profiles, so that I can receive role-specific notifications at appropriate email addresses.

#### Acceptance Criteria

1. THE Profile_Email_System SHALL allow users to set unique email addresses for Talent, Mentor, and Recruiter profiles
2. THE Profile_Email_System SHALL maintain the Main_Account_Email separately from Profile_Email addresses
3. WHEN a user updates a Profile_Email, THE Profile_Email_System SHALL mark it as unverified
4. THE Settings_UI SHALL display current Profile_Email status for each role (verified, unverified, or using main account email)
5. THE Settings_UI SHALL clearly indicate which email address will receive notifications for each profile

### Requirement 2: Email Verification

**User Story:** As a platform administrator, I want all profile emails to be verified, so that notifications reach valid email addresses and prevent abuse.

#### Acceptance Criteria

1. WHEN a user sets a new Profile_Email, THE Email_Verification_System SHALL send a Verification_Code to that email address
2. THE Email_Verification_System SHALL generate a 6-digit numeric Verification_Code
3. WHEN a user enters a valid Verification_Code, THE Email_Verification_System SHALL mark the Profile_Email as verified
4. WHEN a user enters an invalid Verification_Code, THE Email_Verification_System SHALL return an error message
5. THE Email_Verification_System SHALL expire Verification_Code after 15 minutes
6. WHILE a Profile_Email is unverified, THE Notification_Router SHALL use the Main_Account_Email for that profile's notifications

### Requirement 3: Rate Limiting

**User Story:** As a platform administrator, I want to limit how frequently users can change their profile emails, so that I can prevent abuse and reduce verification email volume.

#### Acceptance Criteria

1. THE Rate_Limiter SHALL allow Profile_Email updates only once every 7 days per profile
2. WHEN a user attempts to update a Profile_Email before the 7-day period expires, THE Rate_Limiter SHALL return an error with the remaining wait time
3. THE Rate_Limiter SHALL track update timestamps independently for each profile (Talent, Mentor, Recruiter)
4. THE Settings_UI SHALL display the next allowed update time when rate limit is active

### Requirement 4: Notification Routing

**User Story:** As a user, I want my notifications to be sent to the correct email address for each profile, so that I receive relevant communications at the appropriate email.

#### Acceptance Criteria

1. WHEN sending Talent notifications, THE Notification_Router SHALL use the verified Talent Profile_Email if available, otherwise the Main_Account_Email
2. WHEN sending Mentor notifications, THE Notification_Router SHALL use the verified Mentor Profile_Email if available, otherwise the Main_Account_Email
3. WHEN sending Recruiter notifications, THE Notification_Router SHALL use the verified Recruiter Profile_Email if available, otherwise the Main_Account_Email
4. WHEN sending account management notifications, THE Notification_Router SHALL always use the Main_Account_Email
5. THE Notification_Router SHALL log which email address was used for each notification

### Requirement 5: User Interface

**User Story:** As a user, I want an intuitive interface to manage my profile emails, so that I can easily configure and verify my email preferences.

#### Acceptance Criteria

1. THE Settings_UI SHALL provide separate email input fields for Talent, Mentor, and Recruiter profiles
2. THE Settings_UI SHALL display verification status indicators (verified, pending verification, using main email)
3. WHEN a Profile_Email requires verification, THE Settings_UI SHALL show a verification code input field
4. THE Settings_UI SHALL display success and error messages using toast notifications
5. THE Settings_UI SHALL be responsive and functional on mobile devices
6. WHEN rate limiting is active, THE Settings_UI SHALL disable the email input and show the next allowed update time

### Requirement 6: Email Validation and Security

**User Story:** As a platform administrator, I want to ensure email addresses are valid and secure, so that the system maintains data integrity and prevents security issues.

#### Acceptance Criteria

1. THE Profile_Email_System SHALL validate email format before accepting Profile_Email updates
2. THE Profile_Email_System SHALL prevent duplicate Profile_Email addresses across different users
3. THE Profile_Email_System SHALL prevent using the same email address for multiple profiles of the same user
4. WHEN a duplicate email is detected, THE Profile_Email_System SHALL return a descriptive error message
5. THE Profile_Email_System SHALL sanitize email input to prevent injection attacks

### Requirement 7: Fallback and Error Handling

**User Story:** As a user, I want the system to gracefully handle errors and provide fallbacks, so that I continue to receive important notifications even when there are issues.

#### Acceptance Criteria

1. WHEN a Profile_Email becomes invalid or bounces, THE Notification_Router SHALL fall back to the Main_Account_Email
2. WHEN the Email_Verification_System is unavailable, THE Profile_Email_System SHALL queue verification requests for retry
3. IF email delivery fails for both Profile_Email and Main_Account_Email, THEN THE Notification_Router SHALL log the failure for administrative review
4. THE Settings_UI SHALL display appropriate error messages when backend services are unavailable
5. WHEN verification fails multiple times, THE Email_Verification_System SHALL temporarily disable verification attempts for that email

### Requirement 8: Data Persistence and API Integration

**User Story:** As a developer, I want reliable data persistence and API integration, so that profile email settings are maintained consistently across the application.

#### Acceptance Criteria

1. THE Profile_Email_System SHALL persist Profile_Email settings in the user database
2. THE Profile_Email_System SHALL integrate with existing role-based settings endpoints
3. WHEN retrieving user settings, THE Profile_Email_System SHALL return email, emailVerified, and emailUpdatedAt fields for each profile
4. THE Profile_Email_System SHALL use existing verification endpoints (/talent/verify-email, /mentor/verify-email, /recruiter/verify-email)
5. THE Profile_Email_System SHALL maintain backward compatibility with existing notification systems
