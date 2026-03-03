# Frontend Search & Filter Mapping for Backend Review

This document lists all search, filter, and sort functionalities currently implemented in the frontend. The backend team should review this list to confirm that all parameters are supported by the corresponding API endpoints.

## 1. Recruitment & Hiring (Employer)

### 1.1 Applicants View
- **View**: [ApplicantsView.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/employer/opportunities/ApplicantsView.tsx)
- **API Call**: `getRecruiterApplications({ opportunityId })`
- **Processing**: **Currently 100% Frontend-side** (Client filters the returned list).
- **Frontend Parameters**:
  - `searchQuery`: Matches name or username.
  - `status`: `applied`, `shortlisted`, `invited`, `hired`, `rejected`.
  - `location`: Exact match for talent profile location.
  - `skills`: Checks if talent profile skills include any of selected.
  - `dateRange`: `today` (0 days), `week` (7 days), `month` (30 days).
  - `sortBy`: `newest`, `oldest`.

### 1.2 Recruiter Upcoming (Interviews)
- **View**: [RecruiterUpcoming.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/employer/upcoming/RecruiterUpcoming.tsx)
- **API Call**: `getRecruiterApplications({})`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Matches candidate name or opportunity title.
  - `dateRange`: `today`, `week`, `month` (Filters future interviews).

### 1.3 Past Hires
- **View**: [PastHiresTab.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/employer/profile/tabs/PastHiresTab.tsx)
- **API Call**: `getRecruiterApplications({ status: "hired" })`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Matches name, role, or skills.
  - `location`: Exact match.
  - `skills`: Partial match.

### 1.4 Employer Opportunities Management
- **View**: [EmployerOpportunities.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/employer/opportunities/EmployerOpportunities.tsx)
- **API Call**: `useRecruiterOpportunitiesQuery()`
- **Processing**: **Currently 100% Frontend-side** (except tab-based status which might be supported by some endpoints, but here it filters in JS).
- **Frontend Parameters**:
  - `searchQuery`: Matches title or skills.
  - `status` (Tabs): `active`, `closed`, `draft`.
  - `types`: Array (matches `opp.type`).
  - `skills`: Array match.
  - `sortBy`: `newest`, `oldest`, `rate-high`, `rate-low`.

### 1.5 Applicants (Main List)
- **View**: [app/(business)/applicants/page.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/applicants/page.tsx)
- **API Call**: `useRecruiterApplicationsQuery({})`
- **Processing**: **100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Matches name or role.
  - `activeTab`: `all`, `applied`, `shortlisted`, `hired`, `rejected`.
  - `filters` (modal): `status`, `location`, `skills`, `dateRange`.
  - `sortBy`: `newest`, `oldest`, `name-asc`, `name-desc`.

### 1.6 Hired Talents (Main List)
- **View**: [app/(business)/applicants/hired-talents/page.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/applicants/hired-talents/page.tsx)
- **API Call**: `useRecruiterApplicationsQuery({ status: "hired" })`
- **Processing**: **100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Matches name, role, or opportunity title.

---

## 2. Applications & Events (Talent)

### 2.1 My Applications
- **View**: [TalentMyApplications.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/talent/applications/TalentMyApplications.tsx)
- **API Calls**: `getTalentApplications()`, `getTalentMentorshipRequests({})`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Job title/Company or Topic/Mentor name.
  - `status` (Tabs): Job stats or Mentorship stats.
  - `dateRange`: `today`, `week`, `month`.
  - `type` (Jobs only): Internship, Volunteer, etc.

### 2.2 Talent Upcoming (Events)
- **View**: [app/(business)/upcoming/page.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/upcoming/page.tsx)
- **API Calls**: Same as My Applications + Interviews from `getTalentApplications`.
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Position/Company/Mentor.
  - `dateRange`: `today`, `week`, `month`.
  - `type`: `interviews`, `sessions`.

---

## 3. Mentorship (Mentor)

### 3.1 Mentor Applications
- **View**: [app/(business)/applications/page.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/applications/page.tsx)
- **API Call**: `getMentorMentorshipRequests({})`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Mentee name or topic.
  - `status` (Tabs): `pending`, `accepted`, `rejected`.
  - `dateRange`: `today`, `week`, `month`.

### 3.2 Mentor Sessions
- **View**: [app/(business)/sessions/page.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/sessions/page.tsx)
- **API Call**: `getSessions({ role: "mentor" })`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Mentee name or topic.
  - `status` (Tabs): `upcoming`, `completed`, `cancelled`.
  - `dateRange`: `today`, `week`, `month`.

### 3.3 Mentor Upcoming
- **View**: [components/mentor/upcoming/MentorUpcoming.tsx](file:///c:/Users/hecan/Documents/talentng-frontend/components/mentor/upcoming/MentorUpcoming.tsx)
- **API Call**: `getSessions({ role: "mentor" })`
- **Processing**: **Currently 100% Frontend-side**.
- **Frontend Parameters**:
  - `searchQuery`: Mentee name or topic.
  - `dateRange`: `today`, `week`, `month`.

---

## 4. Discovery Views (Server-Side Supported)

### 4.1 Discover Talent
- **View**: [DiscoverTalentClient](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/discover-talent/discover-talent-client.tsx#19-184)
- **API Parameters (Backend MUST Support)**:
  - `searchQuery`: string
  - `category`: string
  - `skills`: string[]
  - `location`: string
  - `availability`: CSV string (e.g. "FullTime,PartTime")
  - `sort`: `newest`, `oldest`
  - `limit`, `offset`: Pagination

### 4.2 Mentorship Discovery
- **View**: [MentorshipPage](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/mentorship/page.tsx#50-311)
- **API Parameters (Backend MUST Support)**:
  - `q`: string (Search query)
  - `category`: string
  - `expertise`: CSV string
  - `industries`: CSV string
  - `stack`: CSV string
  - `location`: string
  - `sortBy`: string
  - `limit`, `offset`: Pagination

### 4.3 Opportunities Discovery (Talent)
- **View**: [OpportunitiesClient](file:///c:/Users/hecan/Documents/talentng-frontend/app/%28business%29/opportunities/opportunities-client.tsx#41-260)
- **API Parameters (Backend MUST Support)**:
  - `searchQuery`: string
  - `type`: `Job`, `Internship`, `Volunteer`, `PartTime`
  - `category`: CSV string
  - `tags`: CSV string (Skills)
  - `location`: string
  - `experienceLevel`: CSV string
  - `limit`, `offset`: Pagination
