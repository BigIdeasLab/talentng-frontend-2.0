# TalentNG Product Specification Document

## Document Information

| Field               | Value                |
| ------------------- | -------------------- |
| **Product Name**    | TalentNG (Talent.ng) |
| **Version**         | 2.0                  |
| **Document Status** | Final                |
| **Last Updated**    | February 2026        |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Roles & Personas](#3-user-roles--personas)
4. [Core Features](#4-core-features)
5. [User Flows](#5-user-flows)
6. [Technical Architecture](#6-technical-architecture)
7. [Data Models](#7-data-models)
8. [API Integration](#8-api-integration)
9. [Security & Authentication](#9-security--authentication)
10. [UI/UX Guidelines](#10-uiux-guidelines)
11. [Future Roadmap](#11-future-roadmap)

---

## 1. Executive Summary

### 1.1 Product Vision

TalentNG is a comprehensive multi-sided talent marketplace platform designed to connect African professionals with opportunities, mentorship, and employers. The platform serves as a bridge between talented individuals seeking career growth and organizations looking to hire skilled professionals.

### 1.2 Problem Statement

The African talent market, particularly in Nigeria, faces significant challenges:

- **Talents** struggle to find quality opportunities that match their skills
- **Employers** have difficulty discovering and vetting qualified candidates
- **Professionals** lack access to mentorship and career guidance
- **Freelancers** need a platform to showcase their work and offer services

### 1.3 Solution

TalentNG provides a unified platform that:

- Enables talents to create comprehensive profiles, showcase portfolios, and apply for opportunities
- Allows employers to post opportunities, discover talents, and manage hiring pipelines
- Facilitates mentorship connections between experienced professionals and those seeking guidance
- Offers a service marketplace for freelancers to offer their expertise

### 1.4 Target Market

- **Primary**: Nigerian professionals and businesses
- **Secondary**: African talent market (Ghana, Kenya, South Africa, etc.)
- **Tertiary**: Global companies seeking African talent

### 1.5 Key Value Propositions

| User Type    | Value Proposition                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| **Talent**   | Access to curated opportunities, professional profile showcasing, mentorship access, service marketplace |
| **Employer** | Quality talent pool, streamlined hiring process, applicant management, company branding                  |
| **Mentor**   | Platform to share expertise, session management, earning opportunities, professional networking          |

---

## 2. Product Overview

### 2.1 Platform Description

TalentNG is a web-based platform built with modern technologies (Next.js, React, TypeScript) that provides:

1. **Talent Marketplace**: Browse and apply for job opportunities
2. **Service Marketplace**: Offer and purchase professional services
3. **Mentorship Platform**: Book and conduct mentorship sessions
4. **Talent Discovery**: Search and filter professionals by skills, categories, and availability

### 2.2 Platform Access

- **Web Application**: Responsive web app accessible via desktop and mobile browsers
- **URL**: talent.ng (production)

### 2.3 Core Modules

```
┌─────────────────────────────────────────────────────────────┐
│                        TalentNG Platform                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Talent    │  │  Employer   │  │      Mentor         │  │
│  │   Module    │  │   Module    │  │      Module         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Shared Services Layer                   │    │
│  │  • Authentication  • Notifications  • Profile Mgmt   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. User Roles & Personas

### 3.1 Role Overview

TalentNG supports three primary user roles, with users able to hold multiple roles simultaneously:

| Role                   | Description                                 | Primary Actions                                                 |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| **Talent**             | Professionals seeking opportunities         | Create profile, apply for jobs, offer services, book mentorship |
| **Employer/Recruiter** | Companies/individuals hiring                | Post opportunities, discover talents, manage applicants         |
| **Mentor**             | Experienced professionals offering guidance | Set up expertise, manage sessions, provide mentorship           |

### 3.2 Talent Persona

**Name**: Adaora Okonkwo
**Age**: 28
**Occupation**: UI/UX Designer
**Location**: Lagos, Nigeria

**Goals**:

- Find quality design opportunities
- Showcase portfolio to potential employers
- Get mentorship from senior designers
- Offer design services to clients

**Pain Points**:

- Difficulty finding quality job postings
- Limited platforms to showcase African design work
- Lack of mentorship opportunities

**User Journey**:

1. Signs up and selects "Talent" role
2. Completes profile with skills, portfolio, and experience
3. Browses opportunities and applies
4. Books mentorship sessions for career growth
5. Creates service offerings for freelance work

### 3.3 Employer/Recruiter Persona

**Name**: Chukwuemeka Adeyemi
**Age**: 35
**Occupation**: HR Manager at Tech Startup
**Location**: Abuja, Nigeria

**Goals**:

- Find qualified candidates efficiently
- Manage hiring pipeline
- Build company brand
- Access diverse talent pool

**Pain Points**:

- Time-consuming candidate screening
- Limited access to verified professionals
- Difficulty assessing technical skills

**User Journey**:

1. Signs up and selects "Employer" role
2. Sets up company profile
3. Posts job opportunities
4. Reviews applicants and manages hiring
5. Discovers talents through search

### 3.4 Mentor Persona

**Name**: Funke Adebayo
**Age**: 42
**Occupation**: Senior Software Engineer
**Location**: Lagos, Nigeria

**Goals**:

- Share knowledge with upcoming professionals
- Earn from mentorship sessions
- Build professional network
- Give back to the community

**Pain Points**:

- No structured platform for mentorship
- Difficulty managing session schedules
- Limited visibility to potential mentees

**User Journey**:

1. Signs up and selects "Mentor" role
2. Sets up expertise and availability
3. Receives session requests
4. Conducts mentorship sessions
5. Receives reviews and builds reputation

---

## 4. Core Features

### 4.1 Authentication & Onboarding

#### 4.1.1 Registration

**Features**:

- Email-based registration
- Password strength validation
- Email verification
- Social login support (future)

**Registration Flow**:

```
User enters email/password → Validation → Account created →
Email verification → Role selection → Profile setup
```

#### 4.1.2 Role Selection

Users can select one or more roles:

- **Talent**: For professionals seeking opportunities
- **Employer/Recruiter**: For hiring managers and companies
- **Mentor**: For experienced professionals offering guidance

**Multi-role Support**: Users can add additional roles after initial setup through profile switching.

#### 4.1.3 Profile Setup by Role

**Talent Profile Setup**:

1. Personal information (name, location, bio)
2. Professional details (headline, role, category)
3. Skills and tech stack
4. Portfolio links
5. Work experience
6. Education

**Employer Profile Setup**:

1. Company details (name, industry, size)
2. Company description
3. Location
4. Company logo and branding

**Mentor Profile Setup**:

1. Areas of expertise
2. Years of experience
3. Mentorship style
4. Session pricing
5. Availability settings
6. LinkedIn verification

### 4.2 Talent Features

#### 4.2.1 Dashboard

The talent dashboard provides a comprehensive overview:

| Component               | Description                                   |
| ----------------------- | --------------------------------------------- |
| **Welcome Header**      | Personalized greeting with profile stats      |
| **Stat Cards**          | Earnings, hired count, active applications    |
| **Weekly Overview**     | Activity chart and metrics                    |
| **Hiring Pipeline**     | Visual representation of application statuses |
| **Recent Applications** | Latest job applications with status           |
| **Upcoming Interviews** | Scheduled interviews and sessions             |
| **Top Skills**          | Skills based on profile and applications      |
| **Achievements**        | Badges and milestones earned                  |

#### 4.2.2 Profile Management

**Profile Sections**:

1. **Personal Information**
   - Full name
   - Profile photo
   - Location (city, state)
   - Bio

2. **Professional Details**
   - Headline
   - Role/Title
   - Category (e.g., Design, Development, Marketing)
   - Availability status

3. **Skills & Stack**
   - Primary skills
   - Tech stack/tools
   - Skill proficiency levels

4. **Portfolio/Works**
   - Upload work samples
   - Add descriptions
   - Multiple images per work
   - Edit and delete capabilities

5. **Services**
   - Create service offerings
   - Set pricing
   - Define deliverables
   - Service categories

6. **Social Links**
   - LinkedIn
   - Twitter
   - Instagram
   - GitHub
   - Portfolio website

7. **Experience & Education**
   - Work history
   - Educational background
   - Certifications

**Profile Visibility**:

- Public/Private toggle
- Profile completion percentage
- Profile views tracking

#### 4.2.3 Opportunity Discovery

**Browse Opportunities**:

- Search by keywords, skills, or company
- Filter by category, type, location
- Sort by date, budget, relevance

**Opportunity Types**:
| Type | Description |
|------|-------------|
| Job Listing | Full-time employment opportunities |
| Internship | Learning and entry-level positions |
| Volunteer | Non-paid contribution opportunities |
| Part-time | Flexible working arrangements |

**Opportunity Details**:

- Job title and description
- Company information
- Required skills and tools
- Budget/compensation
- Duration and start date
- Location and work type
- Key responsibilities
- Requirements

**Actions**:

- Save opportunity
- Apply with profile
- Attach portfolio projects
- Write proposal

#### 4.2.4 Application Management

**Application Process**:

1. Review opportunity details
2. Write proposal (minimum 10 characters)
3. Attach relevant portfolio projects (max 3)
4. Submit application

**Application Tracking**:

- View all applications
- Status updates (Pending, Reviewed, Shortlisted, Rejected, Hired)
- Application history

#### 4.2.5 Saved Opportunities

- Bookmark opportunities for later
- Quick apply from saved list
- Remove from saved

### 4.3 Employer Features

#### 4.3.1 Dashboard

**Dashboard Components**:

- Active opportunities count
- Total applicants
- Hired talents
- Company profile views

#### 4.3.2 Company Profile

**Profile Elements**:

- Company name and logo
- Industry and company size
- Location
- Company description
- Website and social links

**Profile Tabs**:

- About: Company overview
- Opportunities: Posted job listings
- Past Hires: History of hired talents

#### 4.3.3 Opportunity Management

**Post Opportunity**:

**Step 1: Basic Info**

- Job title
- Job type (Job, Internship, Volunteer, Part-time)
- Category
- Location
- Employment type (Remote, On-site, Hybrid)
- Experience level
- Start date

**Step 2: Description**

- About the role
- Key responsibilities
- Requirements

**Step 3: Budget & Scope**

- Price mode (Fixed or Range)
- Budget amount(s)
- Payment type (Hourly, Weekly, Monthly)
- Duration

**Step 4: Application Settings**

- Required skills/tools
- Application cap
- Closing date

**Opportunity Status**:

- Draft: Saved but not published
- Active: Live and accepting applications
- Closed: No longer accepting applications

#### 4.3.4 Applicant Management

**Applicants View**:

- List of all applicants per opportunity
- Applicant details and profile
- Application date and proposal
- Attached portfolio items

**Applicant Actions**:

- View full profile
- Shortlist candidate
- Reject application
- Hire talent
- Send message

**Applicant Statuses**:
| Status | Description |
|--------|-------------|
| New | Just applied |
| Reviewed | Application viewed |
| Shortlisted | Moved to next stage |
| Interview | Interview scheduled |
| Hired | Successfully hired |
| Rejected | Application declined |

#### 4.3.5 Talent Discovery

**Discover Talent Page**:

- Search talents by name, skills, or services
- Filter by category
- Filter by skills
- Filter by location
- Filter by availability

**Talent Cards Display**:

- Profile photo
- Name and headline
- Skills tags
- Hourly rate
- Availability status
- Quick actions (View profile, Hire)

**Talent Profile View**:

- Full profile details
- Portfolio works
- Services offered
- Reviews and ratings
- Hire button

### 4.4 Mentor Features

#### 4.4.1 Mentor Profile

**Profile Components**:

- Profile photo and name
- Headline and bio
- Areas of expertise
- Industries
- Languages spoken
- Session duration and pricing
- Average rating
- Total sessions completed
- Social links

**Profile Tabs**:

- Overview: Bio and background
- Sessions: Session management
- Reviews: Mentee reviews and ratings

#### 4.4.2 Session Management

**Session Types**:

- One-on-one mentorship
- Career guidance
- Technical consultation
- Portfolio review

**Session Workflow**:

```
Mentee requests session → Mentor reviews → Confirms/Reschedules →
Session conducted → Mark as complete → Review requested
```

**Session Statuses**:
| Status | Description |
|--------|-------------|
| Pending | Awaiting mentor confirmation |
| Confirmed | Scheduled and confirmed |
| Rescheduled | Time changed |
| In Progress | Currently happening |
| Pending Completion | Awaiting mentor to complete |
| Completed | Successfully finished |
| Cancelled | Cancelled by either party |
| Disputed | Issue reported |

**Session Actions**:

- Confirm session
- Reschedule session
- Cancel session
- Complete session
- Add session notes

#### 4.4.3 Availability Management

- Set available days and times
- Block out unavailable periods
- Set session duration options
- Manage booking lead time

#### 4.4.4 Reviews

- Mentees can rate sessions (1-5 stars)
- Written feedback
- Reviews displayed on mentor profile
- Average rating calculation

### 4.5 Mentorship (For Mentees)

#### 4.5.1 Find Mentors

- Browse mentor directory
- Filter by expertise
- Filter by industry
- Filter by rating
- Filter by price range

#### 4.5.2 Book Session

1. Select mentor
2. Choose available time slot
3. Add session topic/note
4. Confirm booking
5. Receive confirmation

#### 4.5.3 Session Participation

- Join session (video call link)
- Session reminders
- Provide feedback after session

### 4.6 Notifications

#### 4.6.1 Notification Types

| Type    | Description         | Example                                |
| ------- | ------------------- | -------------------------------------- |
| Success | Positive outcomes   | "Application accepted"                 |
| Info    | General information | "New opportunity matches your profile" |
| Warning | Attention needed    | "Profile incomplete"                   |
| Error   | Problems/issues     | "Payment failed"                       |

#### 4.6.2 Notification Channels

- In-app notifications
- Role-specific notifications (Talent, Employer, Mentor)
- General notifications

#### 4.6.3 Notification Actions

- Click to navigate to relevant page
- Mark as read
- Action buttons (e.g., "View Application", "Respond")

### 4.7 Profile Switching

Users with multiple roles can switch between profiles:

- Active role indicator in sidebar
- Role-specific dashboards
- Role-specific navigation
- Persistent role selection via cookies

---

## 5. User Flows

### 5.1 Registration & Onboarding Flow

```
┌─────────────┐
│   Sign Up   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Verify    │
│    Email    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Select    │
│    Role     │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Talent    │   │  Employer   │   │   Mentor    │
│   Setup     │   │   Setup     │   │   Setup     │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       └─────────────────┴─────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Dashboard  │
                  └─────────────┘
```

### 5.2 Job Application Flow (Talent)

```
┌─────────────────┐
│ Browse/Search   │
│  Opportunities  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Details   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Save or Apply  │────▶│     Save        │
└────────┬────────┘     └─────────────────┘
         │ Apply
         ▼
┌─────────────────┐
│ Write Proposal  │
│ Attach Projects │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Submit       │
│  Application    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Track in     │
│  Applications   │
└─────────────────┘
```

### 5.3 Hiring Flow (Employer)

```
┌─────────────────┐
│     Post        │
│  Opportunity    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Receive      │
│   Applicants    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Review       │
│   Applications  │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐   ┌─────────────┐
│   Shortlist     │ │   Reject    │   │    Hire     │
└─────────────────┘ └─────────────┘   └─────────────┘
```

### 5.4 Mentorship Booking Flow

```
┌─────────────────┐
│    Browse       │
│    Mentors      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Select Mentor  │
│  View Profile   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Choose Time    │
│     Slot        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add Topic/Note │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Confirm      │
│    Booking      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Attend and    │
│ Complete Session│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Leave Review   │
└─────────────────┘
```

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer                 | Technology           |
| --------------------- | -------------------- |
| **Framework**         | Next.js 16.1.6       |
| **Language**          | TypeScript 5.9       |
| **UI Library**        | React 18.3           |
| **Styling**           | Tailwind CSS 3.4     |
| **Component Library** | Radix UI             |
| **State Management**  | TanStack Query 5.84  |
| **Form Handling**     | React Hook Form 7.66 |
| **Validation**        | Zod 3.25             |
| **Charts**            | Recharts 2.12        |
| **Animations**        | Framer Motion 12.23  |
| **Date Handling**     | date-fns 4.1         |
| **Icons**             | Lucide React         |

### 6.2 Project Structure

```
talentng-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── confirm-email/
│   │   ├── onboarding/
│   │   └── redirect/
│   ├── (business)/               # Main application routes
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── opportunities/
│   │   ├── applicants/
│   │   ├── applications/
│   │   ├── discover-talent/
│   │   ├── mentorship/
│   │   ├── sessions/
│   │   ├── availability/
│   │   ├── settings/
│   │   └── support/
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── layouts/                  # Layout components
│   ├── talent/                   # Talent-specific components
│   ├── employer/                 # Employer-specific components
│   ├── mentor/                   # Mentor-specific components
│   ├── onboarding/               # Onboarding components
│   ├── DiscoverTalent/           # Talent discovery components
│   └── forms/                    # Form components
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities and helpers
│   ├── api/                      # API client and services
│   ├── auth/                     # Authentication utilities
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── constants/                # Application constants
│   ├── data/                     # Static data
│   ├── filters/                  # Filter utilities
│   ├── mappers/                  # Data mappers
│   ├── services/                 # Business logic services
│   ├── theme/                    # Theme configuration
│   └── validations/              # Validation schemas
├── types/                        # Global TypeScript types
└── public/                       # Static assets
```

### 6.3 Component Architecture

**Component Categories**:

1. **UI Components** (`/components/ui/`)
   - Button, Input, Select, Modal, Toast, etc.
   - Reusable, generic components
   - Styled with Tailwind CSS

2. **Layout Components** (`/components/layouts/`)
   - Sidebars (Talent, Employer, Mentor)
   - Navigation
   - Profile Switcher
   - Loading States

3. **Feature Components** (`/components/{role}/`)
   - Role-specific components
   - Dashboard widgets
   - Profile sections
   - Feature-specific modals

### 6.4 State Management

**TanStack Query** for server state:

- Query caching and invalidation
- Optimistic updates
- Background refetching
- Pagination support

**React Context** for global state:

- User authentication state
- Active role/profile
- Theme preferences

### 6.5 Routing Structure

| Route                            | Description             | Access         |
| -------------------------------- | ----------------------- | -------------- |
| `/login`                         | User login              | Public         |
| `/signup`                        | User registration       | Public         |
| `/onboarding`                    | Profile setup           | Authenticated  |
| `/dashboard`                     | Role-specific dashboard | Authenticated  |
| `/profile`                       | User profile            | Authenticated  |
| `/profile/edit`                  | Edit profile            | Authenticated  |
| `/opportunities`                 | Browse opportunities    | Talent, Mentor |
| `/opportunities/post`            | Post opportunity        | Employer       |
| `/opportunities/[id]`            | Opportunity details     | All            |
| `/opportunities/[id]/applicants` | View applicants         | Employer       |
| `/applicants`                    | All applicants          | Employer       |
| `/applicants/[id]`               | Applicant details       | Employer       |
| `/applicants/hired-talents`      | Hired talents           | Employer       |
| `/discover-talent`               | Talent search           | Employer       |
| `/discover-talent/[userId]`      | Talent profile          | Employer       |
| `/mentorship`                    | Browse mentors          | Talent         |
| `/mentorship/[id]`               | Mentor profile          | All            |
| `/sessions`                      | Session management      | Mentor         |
| `/applications`                  | My applications         | Talent         |
| `/availability`                  | Set availability        | Mentor         |
| `/settings`                      | Account settings        | Authenticated  |
| `/support`                       | Support center          | Authenticated  |

---

## 7. Data Models

### 7.1 User Model

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  profileImageUrl?: string;
  roles: ("talent" | "recruiter" | "mentor")[];
  createdAt: string;
  updatedAt: string;
}
```

### 7.2 Talent Profile Model

```typescript
interface TalentProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  bio?: string;
  city?: string;
  state?: string;
  profileImageUrl?: string;

  // Professional Information
  headline?: string;
  role?: string;
  category?: string;
  skills: string[];
  stack: string[];
  availability?: "available" | "busy" | "not-looking";

  // Portfolio
  gallery: GalleryItem[];
  experience: Experience[];
  education: Education[];

  // Social Links
  links: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };

  // Settings
  visibility: "public" | "private";
  views: number;
}
```

### 7.3 Employer Profile Model

```typescript
interface EmployerProfile {
  // Company Information
  companyName: string;
  companyLogo?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  bio?: string;

  // Contact
  website?: string;
  email?: string;

  // Social Links
  links: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  // Stats
  totalOpportunities: number;
  totalHires: number;
}
```

### 7.4 Mentor Profile Model

```typescript
interface MentorProfile {
  // Personal Information
  fullName: string;
  headline?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;

  // Expertise
  expertise: string[];
  industries: string[];
  languages: string[];
  experience: string;
  mentorshipStyle?: string;

  // Session Settings
  sessionDuration: number; // in minutes
  sessionPrice?: number;
  defaultMeetingLink?: string;

  // Stats
  totalSessions: number;
  avgRating?: number;
  views: number;

  // Social Links
  links: {
    twitter?: string;
    instagram?: string;
    linkedIn?: string;
    website?: string;
  };

  // Settings
  visibility: "public" | "private";
}
```

### 7.5 Opportunity Model

```typescript
interface Opportunity {
  id: string;
  title: string;
  description?: string;
  type: "Job" | "Internship" | "Volunteer" | "PartTime";
  category?: string;

  // Company Info
  company: string;
  logo?: string;
  postedBy?: {
    id: string;
    recruiterProfile?: {
      company?: string;
      profileImageUrl?: string;
    };
  };

  // Requirements
  skills: string[];
  tools: string[];
  keyResponsibilities: string[];
  requirements: string[];

  // Compensation
  priceMode: "range" | "fixed";
  minBudget?: number;
  maxBudget?: number;
  price?: number;
  paymentType?: "hourly" | "weekly" | "monthly";
  duration?: string;

  // Details
  employmentType?: string;
  experienceLevel?: string;
  location?: string;
  startDate?: string;

  // Application Settings
  applicationCap?: number;
  closingDate?: string;

  // Status
  status: "active" | "closed" | "draft";

  // Metadata
  createdAt: string;
  updatedAt: string;

  // User-specific (computed)
  appliedAs?: ("talent" | "mentor")[];
  saved?: boolean;
}
```

### 7.6 Application Model

```typescript
interface Application {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  applicantId: string;
  applicant?: TalentProfile | MentorProfile;
  profileType: "talent" | "mentor";

  // Application Content
  note?: string;
  galleryIds: string[];

  // Status
  status: "pending" | "reviewed" | "shortlisted" | "hired" | "rejected";

  // Timestamps
  appliedAt: string;
  updatedAt: string;
}
```

### 7.7 Session Model

```typescript
interface MentorshipSession {
  id: string;
  mentorId: string;
  mentor?: MentorProfile;
  menteeId: string;
  mentee?: User;

  // Session Details
  topic: string;
  note?: string;
  scheduledAt: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  location?: string;
  meetingLink?: string;

  // Status
  status:
    | "pending"
    | "confirmed"
    | "rescheduled"
    | "in_progress"
    | "pending_completion"
    | "completed"
    | "cancelled"
    | "disputed";

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### 7.8 Notification Model

```typescript
interface Notification {
  id: string;
  userId: string;
  type: string;
  channel: "talent" | "recruiter" | "mentor" | "general";

  // Content
  payload: {
    title: string;
    message: string;
    type: "success" | "info" | "warning" | "error";
    icon?: string;
    image?: string;
    action?: {
      label: string;
      route?: string;
      actionType?: string;
      id?: string;
    };
    metadata?: Record<string, any>;
  };

  // Delivery
  deliveryStatus: "pending" | "sent" | "failed";
  readAt?: string;

  // Timestamps
  createdAt: string;
}
```

### 7.9 Service Model

```typescript
interface Service {
  id: string;
  talentId: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  deliveryTime?: string;
  revisions?: number;
  features?: string[];
  images?: string[];
  status: "active" | "paused";
  views: number;
  createdAt: string;
}
```

### 7.10 Gallery/Work Model

```typescript
interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  images: string[];
  tags?: string[];
  category?: string;
  createdAt: string;
}
```

---

## 8. API Integration

### 8.1 API Client Configuration

**Base URL**: Configured via `NEXT_PUBLIC_TALENTNG_API_URL` environment variable

**Default**: `http://localhost:3001`

### 8.2 Authentication Headers

All authenticated requests include:

```
Authorization: Bearer {accessToken}
```

### 8.3 API Modules

| Module          | Purpose                | Key Endpoints                    |
| --------------- | ---------------------- | -------------------------------- |
| `auth`          | Authentication         | login, register, refresh, logout |
| `opportunities` | Job management         | CRUD, search, apply              |
| `applications`  | Application management | submit, track, update            |
| `talent`        | Talent profiles        | profile CRUD, gallery, services  |
| `mentor`        | Mentor profiles        | profile CRUD, availability       |
| `mentorship`    | Sessions               | booking, management              |
| `notifications` | User notifications     | list, mark read                  |
| `users`         | User management        | profile, settings                |

### 8.4 Error Handling

**Standard Error Response**:

```typescript
interface ApiError {
  message: string;
  status: number;
  data?: any;
}
```

**Error Handling Strategy**:

1. Display user-friendly error messages
2. Log errors for debugging
3. Handle specific status codes:
   - 401: Token refresh or redirect to login
   - 403: Access denied message
   - 404: Not found handling
   - 500: Server error message

### 8.5 Token Refresh Flow

```
Request fails with 401 → Check for refresh token →
If exists, call refresh endpoint → Store new tokens →
Retry original request → If refresh fails, redirect to login
```

---

## 9. Security & Authentication

### 9.1 Authentication Flow

```
┌─────────────────┐
│     Login       │
│  (Email/Pass)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validate &    │
│   Generate JWT  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Store Tokens   │
│  (localStorage) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fetch User     │
│    Profile      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Redirect to   │
│    Dashboard    │
└─────────────────┘
```

### 9.2 Token Storage

- **Access Token**: Stored in localStorage for API requests
- **Refresh Token**: Stored in localStorage for token renewal
- **HTTP-Only Cookies**: Alternative secure storage (backend managed)

### 9.3 Protected Routes

Routes protected by middleware:

- All routes under `/(business)` require authentication
- Role-specific routes require appropriate role

### 9.4 Role-Based Access Control

```typescript
// Route protection example
const hasAccess = useRequireRole(["mentor"]); // Only mentors can access
```

**Protected Actions**:

- Posting opportunities: Employer only
- Viewing applicants: Employer only
- Managing sessions: Mentor only
- Applying to jobs: Talent/Mentor only

### 9.5 Data Validation

**Client-Side Validation**:

- Zod schemas for form validation
- Input sanitization
- File type/size validation for uploads

**Validation Schemas**:

- Login credentials
- Registration data
- Profile updates
- Opportunity creation
- Application submission

---

## 10. UI/UX Guidelines

### 10.1 Design System

**Colors**:

| Role     | Primary Color | Hex Code  |
| -------- | ------------- | --------- |
| Talent   | Purple        | `#5C30FF` |
| Employer | Purple        | `#5C30FF` |
| Mentor   | Purple        | `#5C30FF` |

**Status Colors**:

- Success: `#22C55E` (Green)
- Warning: `#F6BC3F` (Yellow)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

**Neutral Colors**:

- Primary Text: `#000000`
- Secondary Text: `#525866`
- Placeholder: `#99A0AE`
- Border: `#E1E4EA`
- Background: `#FFFFFF`
- Secondary Background: `#F5F5F5`

### 10.2 Typography

**Font Family**: Inter Tight

**Font Sizes**:
| Size | Usage |
|------|-------|
| 10px | Small labels, timestamps |
| 11px | Secondary text |
| 12px | Body small |
| 13px | Body default |
| 14px | Body large |
| 15px | Subheadings |
| 16px | Headings |
| 17px | Page titles |

### 10.3 Spacing

**Standard Spacing Scale**:

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px

### 10.4 Component Styling

**Border Radius**:

- Small: 8px
- Medium: 10px
- Large: 16px
- Full: 9999px (pills)

**Shadows**:

- Card: `0 0 15px 0 rgba(0,0,0,0.15)`
- Modal: `0 0 15px 0 rgba(0,0,0,0.15)`

### 10.5 Responsive Design

**Breakpoints**:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Adaptations**:

- Collapsible sidebars
- Stacked layouts
- Touch-friendly buttons
- Simplified navigation

### 10.6 Loading States

**Skeleton Screens**:

- Dashboard skeleton
- Card skeletons
- List skeletons
- Profile skeletons

**Loading Indicators**:

- Spinner for buttons
- Progress bars for uploads
- Skeleton for content

### 10.7 Error States

**Error Displays**:

- Inline form errors
- Toast notifications
- Error pages (404, 500)
- Empty states with actions

---

## 11. Future Roadmap

### 11.1 Short-term (Q1-Q2 2026)

- [ ] Mobile application (React Native)
- [ ] Real-time chat messaging
- [ ] Video call integration
- [ ] Payment integration for services
- [ ] Enhanced search with AI recommendations

### 11.2 Medium-term (Q3-Q4 2026)

- [ ] Team collaboration features
- [ ] Project management tools
- [ ] Skills assessment tests
- [ ] Certification programs
- [ ] Employer branding tools

### 11.3 Long-term (2027+)

- [ ] AI-powered talent matching
- [ ] Blockchain credential verification
- [ ] Marketplace for digital products
- [ ] Enterprise solutions
- [ ] Pan-African expansion

### 11.4 Feature Backlog

| Feature                          | Priority | Status  |
| -------------------------------- | -------- | ------- |
| Two-factor authentication        | High     | Planned |
| Email notifications              | High     | Planned |
| Calendar integration             | Medium   | Planned |
| Invoice generation               | Medium   | Planned |
| Analytics dashboard              | Medium   | Planned |
| API for third-party integrations | Low      | Future  |
| White-label solutions            | Low      | Future  |

---

## Appendix A: Glossary

| Term            | Definition                                                |
| --------------- | --------------------------------------------------------- |
| **Talent**      | A professional seeking opportunities or offering services |
| **Employer**    | A company or individual hiring talents                    |
| **Mentor**      | An experienced professional offering guidance             |
| **Opportunity** | A job posting, internship, or gig                         |
| **Service**     | A freelance offering by a talent                          |
| **Session**     | A mentorship meeting between mentor and mentee            |
| **Application** | A talent's submission for an opportunity                  |
| **Stack**       | Technologies and tools a talent uses                      |

---

## Appendix B: Contact & Support

**Product Team**: [Contact via internal channels]

**Technical Support**: Available through the platform's support center

**Documentation**: This document serves as the primary product specification

---

_Document Version: 1.0_
_Last Updated: February 2026_
_Classification: Internal_
