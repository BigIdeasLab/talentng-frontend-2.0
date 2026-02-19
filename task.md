Login Page (Backend): Implement POST /auth/login with credentials validation and JWT token generation.

Login Page (Frontend): Build login form with email/password fields, error handling, and redirect to dashboard on success.

Signup Page (Backend): Implement POST /auth/signup with validation, user creation, and email verification token generation.

Signup Page (Frontend): Build signup form with email/password fields, password confirmation, validation feedback, and terms agreement.

Onboarding Page (Backend): Implement PATCH /auth/onboarding to save user role, skills, experience level, and profile setup completion.

Onboarding Page (Frontend): Build multi-step onboarding with role selection, skills input, experience level, and completion tracker.

Verify Email Page (Backend): Implement GET /auth/verify-email/{token} to validate email and mark account as verified.

Verify Email Page (Frontend): Build verification UI with token validation, success/error states, and resend email option.

Confirm Email Page (Backend): Implement GET /auth/confirm-email/{token} and resend verification logic.

Confirm Email Page (Frontend): Build confirmation page with status display and resend functionality.

Recruiter Profile Page Add Services (Backend): Implement POST /recruiter/services for adding new services.

Profile Page Add Services (Frontend): Build Add Service modal with form fields for service title, description, pricing, duration, category, and availability.

Profile Page Add Works(Backend): Implement POST /recruiter/gallery for adding new work items.

Profile Page Add Works (Frontend): Build Add Work modal with form fields for title, description, media upload, tags, and visibility.

Discover Talent Grid (Backend): Build paginated talent listing API.

Discover Talent Grid (Frontend): Build responsive TalentGrid and TalentCard components.

Discover Talent Talent Grid (Backend): Build paginated talent listing API.

Discover Talent Filter Modal (Frontend): Build modal with skills, location, availability, and rate filters.

Discover Talent Filter Modal (Backend): Build backend filtering logic and filter API.

Discover Talent Header & Filter (Frontend): Build header with category dropdown, search bar, and filter modal.

Discover Talent Header & Filter (Backend): Build category + search API endpoints.

Profile Page Edit Profile Details (Frontend): personal details,Professional Details , Work Experience , Education,Portfolio & Social

Profile Page Edit Profile Details (Backend): Implement PATCH /talent/me..

Profile Page Opportunities Tab (Frontend): Build OpportunitiesGrid with cards and empty state.

Profile Page Opportunities Tab (Backend): Implement GET /opportunities with filters.

Sidebar Navigation (Frontend): Build Sidebar with nav menu, user dropdown, and mobile responsive layout.

Sidebar Navigation (Backend): Create GET /users/me for user data.

Profile Page Panel (Frontend): Create left sidebar with profile card, stats, skills, tech stack, and social links.

Profile Page Panel (Backend):Data Fetching Build GET /talent/me and /talent/dashboard.

Profile Page Works Tab (Frontend): Build WorksGrid with cards, delete function, and empty state.

Profile Page Works Tab (Backend): Ensure gallery data in /talent/me, implement DELETE /talent/gallery/{id}.

Profile Page Services Tab (Frontend): Build ServicesGrid with cards, delete function, and empty state.

Profile Page Services Tab (Backend): Implement GET & DELETE /talent/services.

Profile Page Recommendations Tab (Frontend): Build RecommendationsGrid with cards and empty state.

Profile Page Recommendations Tab (Backend): Implement GET /talent/recommendations.

Recruiter Sidebar Navigation (Frontend): Build responsive sidebar with logo, main nav menu (dashboard, discover talent, opportunities, applicants), profile switcher, and help section.

Recruiter Sidebar Navigation (Backend): Ensure GET /users/me returns user profile data and nav permissions for sidebar routing.

Recruiter Profile Page Panel (Frontend): Build profile sidebar with avatar, name, headline, stats (connections, jobs posted), skills, and social links.

Recruiter Profile Page Panel (Backend): Implement GET /recruiter/me returning avatar, name, headline, stats, skills, and social profiles.

Recruiter Profile Page About Tab (Frontend): Build services grid displaying service offerings with title, description, pricing, delete function, and empty state.

Recruiter Profile Page About Tab (Backend): Implement GET /recruiter/services and DELETE /recruiter/services/{id}.

Recruiter Profile Page Past Hires Tab (Frontend): Build gallery of past hired candidates with cards showing name, hire date, role, delete function, and empty state.

Recruiter Profile Page Past Hires Tab (Backend): Ensure GET /recruiter/me includes hiring history and implement DELETE /recruiter/hires/{id}.

Recruiter Profile Page Open Opportunities Tab (Frontend): Build opportunities grid showing active job postings with status, location, applicant count, filters, and empty state.

Recruiter Profile Page Open Opportunities Tab (Backend): Implement GET /recruiter/opportunities with filters (status, date range, job type).

Recruiter Profile Page Edit Profile Details (Frontend): personal details,Professional Details , Work Experience , Education,Portfolio & Social

Recruiter Profile Page Edit Profile Details (Backend): Implement PATCH /recruiter/me.

On the Notification page, when I click on Notification, the page opens as a partial overlay while the previous page remains visible instead of displaying the notification page fully.

Talent Opportunities List (Frontend): Talent: Build TalentOpportunitiesHeader, SearchBar with role/level/jobs search, FilterTabs (All/Job/Internship/Part-time/Volunteer/Applied), and OpportunitiesGrid with OpportunityCard display.

Talent Opportunities List (Backend): Talent: Implement GET /opportunities with filters (status=active, type), pagination, and return formatted opportunity cards data.

Talent Opportunities Search & Filter Tabs (Frontend): Talent: Build SearchBar component with real-time filtering and FilterTabs for opportunity type filtering.

Talent Opportunities Search & Filter Tabs (Backend): Talent: Support searchQuery parameter and type parameter filtering in GET /opportunities.

Talent Opportunity Card Display & Interactions (Frontend): Talent: Build OpportunityCard with company info, type, title, skills, rate, Save/Apply buttons, and ApplicationStatusBanner.

Talent Opportunity Card Display & Interactions (Backend): Talent: Return opportunity data in GET /opportunities, implement POST /opportunities/{id}/apply, and POST/GET /favorites/opportunities/{id}.

Talent Opportunity Details & Empty State (Frontend): Talent: Build full opportunity detail page and EmptyState component for no results.

Talent Opportunity Details & Empty State (Backend): Talent: Implement GET /opportunities/{id} returning complete object and return empty array when no filters match.

Recruiter Opportunities List & Management (Frontend): Recruiter: Build OpportunitiesHeader with "Post Opportunity" button, SearchAndFilters, OpportunitiesTabs, and OpportunityCard grid with context-sensitive actions.

Recruiter Opportunities List & Management (Backend): Recruiter: Implement GET /opportunities?postedById={userId} with status filtering, searchQuery, sortBy, and pagination.

Recruiter Post & Edit Opportunity Form (Frontend): Recruiter: Build multi-step form (BasicInfo, Description, BudgetScope) with validation, preview, and ApplicationSettings.

Recruiter Post & Edit Opportunity Form (Backend): Recruiter: Implement POST/PATCH /opportunities with validation, draft support, auto-mapping, and company data fetch.

Recruiter Applicant Management System (Frontend): Recruiter: Build ApplicantsView with progress bar, search/filter/sort, responsive ApplicantsTable, and Hire functionality.

Recruiter Applicant Management System (Backend): Recruiter: Implement GET /opportunities/{id}/applications with search/sort, PATCH for hiring, and include application stats.

Recruiter Opportunity Lifecycle Operations (Frontend): Recruiter: Support delete with confirmation, mark as filled, save as draft, and display auto-close info.

Recruiter Opportunity Lifecycle Operations (Backend): Recruiter: Implement DELETE /opportunities/{id}, status updates to closed, and scheduled auto-close task.

Recruiter Onboarding (Frontend): Build multi-step onboarding form with company details (name, logo, description, industry, size), contact info, specializations/expertise, verification confirmation, and completion summary.

Recruiter Onboarding (Backend): Implement POST /recruiter/onboard for creating recruiter profile, POST /recruiter/verify for verification, and GET /recruiter/onboarding-status to track progress

Recruiter Sidebar ProfileSwitcher (Frontend): Build dropdown menu with profile avatar, display name, role label, Your Profile link, Settings link, Switch Profile options with avatar/name, Add New Role button, Help link, and Log Out button.

Recruiter Profile Page ProfileSwitcher (Backend): Ensure GET /users/me returns complete user profile data with avatar URLs, display names, and role information for all active user roles.

On the Support page, when I click on Support, it is unresponsive.

Recruiter Reschedule Interview Modal (Frontend): Pre-filled meeting link, new date/time inputs, reschedule message template.

Recruiter Reschedule Interview Modal (Backend): POST /applications/{applicationId}/interviews/{interviewId}/reschedule. Update to "rescheduled" status, trigger notification.

Recruiter Send Talent Invitations (Frontend): Bulk talent selection, confirmation with opportunity details and talent count.

Recruiter Send Talent Invitations (Backend): POST /applications/invitations/send with opportunityId and talentIds array. Create invited applications, trigger notifications.

Recruiter Recommendation Create/Delete/Update Modal (Frontend): Create/edit modes with title input, comment textarea, 1-5 star rating. Validate all fields required.

Recruiter Create/Delete/Update Recommendation (Backend): POST /talent-recommendations with talentUserId, title, comment, rating. Validate hire relationship, prevent duplicates.

Recruiter Complete Interview Action (Frontend): "Mark Complete" button in timeline. Updates interview status to "completed" with toast feedback.

Recruiter Complete Interview Action (Backend): POST /applications/{applicationId}/interviews/{interviewId}/complete. Set interview status "completed".

Recruiter Cancel Interview Modal (Frontend): Warning box, reason textarea (required), "Keep Interview" and red "Cancel Interview" buttons.

Recruiter Cancel Interview Modal (Backend): POST /applications/{applicationId}/interviews/{interviewId}/cancel. Set status "cancelled", revert application to "applied", notify talent.

Recruiter Schedule Interview Modal (Frontend): Date/time pickers, optional meeting link input, message textarea with template. Validation and loading states.

Recruiter Schedule Interview Modal (Backend): POST /applications/{id}/schedule-interview with scheduledDate, message, meetingLink. Create interview, update status to shortlisted, trigger notification.

Recruiter Hired Talent Recommendations Display (Frontend): Green recommendation cards with title, star rating, comment. 3-dot menu for Edit/Delete actions.

Recruiter Talent Recommendations Fetch (Backend): Implement GET /talent-recommendations/user/{userId} returning recommendations with ownership-based edit/delete permissions.

Recruiter Hired Talent Card and deails (Frontend): Clickable profile (avatar/name/role/hired badge), opportunities list with hire dates, location and previous hires text.

Recruiter Hired Talent card and Details (Backend): Implement GET /applications/{id}/hired-details returning hire-specific metadata including hireDate, previousHires, and performance metrics.

Recruiter Applicant Projects Gallery and action buttons (Frontend): Horizontal scroll gallery of talent's project images (210x160px). Show count in heading, render only if projects exist.

Recruiter Applicant Projects Data and action buttons (Backend): Implement GET /talent-projects/user/{userId} returning project images, titles, and metadata for gallery display.

Recruiter Applicant Proposal Section (Frontend): Display applicant.note in gray container with "No proposal provided" fallback.

Recruiter Applicant Proposal Data (Backend): Ensure GET /applications/{id} returns application note with sanitized HTML/content and "No proposal provided" default for empty values.

Recruiter Applicant Interview Timeline (Frontend): Display interview list with date/time, status badge, message, meeting link. Show Reschedule/Cancel/Mark Complete buttons conditionally. Wire modal triggers.

Recruiter Applicant Interviews Data (Backend): Implement GET /applications/{id}/interviews returning chronological interview list with scheduledDate, status, message, meetingLink, and action permissions.

Recruiter Applicant Detail Header (Frontend): Build back navigation to /applicants. Create ProfileCard with avatar, name, headline, and dynamic status badge based on application/interview status.

Recruiter Applicant Detail Page (Backend): Implement GET /applications/{id} returning user.talentProfile, opportunity, interviews array, and galleryIds.

Recruiter Applicants List Page (Frontend): Build ApplicantsHeader with title and "Hired Talents" link with count badge. Implement SearchAndFilters with search input, Filter/Sort dropdowns and Build ApplicantsTable

Recruiter Applicants List Page (Backend): Implement GET /applications with recruiter filtering, searchQuery, sortBy, status filter, and pagination. Return user.talentProfile, opportunity details, and interview status.
