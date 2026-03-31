# Business Verification - Frontend Implementation Guide

## Overview

Business Verification allows **recruiters** to verify their business/organization on the platform by submitting official documents (CAC certificates, tax documents, etc.). **Admins** review, approve, or reject these applications. Upon approval, the business receives a verified badge and elevated trust status.

---

## Table of Contents

1. [Recruiter (User) Frontend](#1-recruiter-user-frontend)
   - [Feature Description](#11-feature-description)
   - [Pages & UI Components](#12-pages--ui-components)
   - [API Endpoints](#13-api-endpoints)
   - [Request/Response Examples](#14-requestresponse-examples)
   - [State Management & UX Flows](#15-state-management--ux-flows)
2. [Admin Frontend](#2-admin-frontend)
   - [Feature Description](#21-feature-description)
   - [Pages & UI Components](#22-pages--ui-components)
   - [API Endpoints](#23-api-endpoints)
   - [Request/Response Examples](#24-requestresponse-examples)
   - [State Management & UX Flows](#25-state-management--ux-flows)
3. [Shared Types & Enums](#3-shared-types--enums)
4. [Notification Handling](#4-notification-handling)
5. [Error Handling Reference](#5-error-handling-reference)

---

## 1. Recruiter (User) Frontend

### 1.1 Feature Description

Recruiters can:
- Submit a business verification application with supporting documents
- Upload multiple documents (CAC certificate required, plus optional tax/incorporation docs)
- View the status of their application (pending, approved, rejected)
- See rejection reasons and resubmit with corrected documents
- Receive in-app and email notifications when their application is reviewed
- Display a "Verified Business" badge once approved

### 1.2 Pages & UI Components

#### Page: Business Verification Dashboard (`/dashboard/verification`)

| Component | Description |
|-----------|-------------|
| **VerificationStatusBanner** | Shows current verification status at the top of the page. States: `not_started`, `pending`, `approved`, `rejected` |
| **ApplicationForm** | Multi-step form for submitting a new verification application |
| **DocumentUploader** | Drag-and-drop file upload component for business documents |
| **DocumentList** | Displays uploaded documents with type labels, file size, and preview links |
| **RejectionNotice** | Alert component shown when application was rejected, displays the admin's rejection reason and a "Resubmit" button |
| **VerifiedBadge** | Badge/icon shown on the recruiter profile after approval |
| **ApplicationTimeline** | Timeline showing submission date, review date, and status changes |

#### Suggested Page States

```
┌─────────────────────────────────────────────────────────────┐
│  STATE: not_started                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🏢 Verify Your Business                             │  │
│  │  Get a verified badge and increase trust with talent  │  │
│  │  [Start Verification →]                               │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  STATE: pending                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ⏳ Verification In Progress                          │  │
│  │  Submitted: March 30, 2026                            │  │
│  │  Your application is being reviewed by our team.      │  │
│  │  Documents: 2 files submitted                         │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  STATE: approved                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✅ Business Verified                                 │  │
│  │  Approved: March 31, 2026                             │  │
│  │  Your business is verified. Badge is live.            │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  STATE: rejected                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ❌ Verification Rejected                             │  │
│  │  Reason: "The CAC document provided is not clear..."  │  │
│  │  [Resubmit Application →]                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 API Endpoints

All endpoints require **Bearer Token** authentication.

#### Submit Business Verification

```
POST /api/v1/verification-requests/business
```

**Role Required:** `recruiter`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | Yes | Must be `"business"` |
| `documents` | `DocumentDto[]` | Yes | Array of documents (min 1, must include at least one `cac` type) |

**DocumentDto fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `url` | `string` | Yes | Must be a valid URL | URL of the uploaded document (from your file storage) |
| `filename` | `string` | Yes | - | Original filename |
| `fileType` | `string` | Yes | `application/pdf`, `image/jpeg`, `image/jpg`, `image/png` | MIME type |
| `fileSize` | `number` | Yes | Max `10485760` (10MB) | File size in bytes |
| `documentType` | `string` | Yes | `cac`, `tax_certificate`, `incorporation`, `other` | Type of business document |

#### List My Verification Requests

```
GET /api/v1/verification-requests
```

Non-admin users automatically see only their own requests.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | `string` | - | Search query |
| `type` | `enum` | - | Filter by type: `kyc`, `org`, `business` |
| `status` | `enum` | - | Filter by status: `pending`, `approved`, `rejected` |
| `limit` | `number` | `20` | Items per page |
| `offset` | `number` | `0` | Items to skip |
| `sortBy` | `string` | `createdAt` | Sort field |
| `sortOrder` | `string` | `desc` | `asc` or `desc` |

#### Get Single Verification Request

```
GET /api/v1/verification-requests/:id
```

Returns the verification request if the user owns it (or is admin).

### 1.4 Request/Response Examples

#### Submit Application

```javascript
// POST /api/v1/verification-requests/business
// Headers: { Authorization: "Bearer <token>" }

// Request
{
  "type": "business",
  "documents": [
    {
      "url": "https://storage.talentng.com/docs/cac-cert-abc123.pdf",
      "filename": "TechCorp-CAC-Certificate.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "documentType": "cac"
    },
    {
      "url": "https://storage.talentng.com/docs/tax-cert-def456.pdf",
      "filename": "TechCorp-Tax-Certificate-2025.pdf",
      "fileType": "application/pdf",
      "fileSize": 1524800,
      "documentType": "tax_certificate"
    }
  ]
}

// Response (201 Created)
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
  "type": "business",
  "documents": [
    {
      "url": "https://storage.talentng.com/docs/cac-cert-abc123.pdf",
      "filename": "TechCorp-CAC-Certificate.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "documentType": "cac"
    },
    {
      "url": "https://storage.talentng.com/docs/tax-cert-def456.pdf",
      "filename": "TechCorp-Tax-Certificate-2025.pdf",
      "fileType": "application/pdf",
      "fileSize": 1524800,
      "documentType": "tax_certificate"
    }
  ],
  "status": "pending",
  "reviewNotes": null,
  "reviewedById": null,
  "reviewedAt": null,
  "createdAt": "2026-03-30T14:30:00.000Z",
  "updatedAt": "2026-03-30T14:30:00.000Z"
}
```

#### List My Requests

```javascript
// GET /api/v1/verification-requests?type=business&status=pending
// Headers: { Authorization: "Bearer <token>" }

// Response (200 OK)
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
      "type": "business",
      "documents": [...],
      "status": "pending",
      "reviewNotes": null,
      "reviewedById": null,
      "reviewedAt": null,
      "createdAt": "2026-03-30T14:30:00.000Z",
      "updatedAt": "2026-03-30T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### Rejected Request (shows reason)

```javascript
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
  "type": "business",
  "documents": [...],
  "status": "rejected",
  "reviewNotes": "The CAC document provided is not clear enough to verify. Please upload a higher quality scan or photo.",
  "reviewedById": "admin-uuid-here",
  "reviewedAt": "2026-03-31T10:00:00.000Z",
  "createdAt": "2026-03-30T14:30:00.000Z",
  "updatedAt": "2026-03-31T10:00:00.000Z"
}
```

### 1.5 State Management & UX Flows

#### Flow: First-Time Submission

```
1. User navigates to /dashboard/verification
2. Frontend calls GET /api/v1/verification-requests?type=business
3. If no results → show "not_started" state with CTA
4. User clicks "Start Verification"
5. Show ApplicationForm:
   a. User uploads documents via your file storage service
   b. After upload completes, collect the returned URL, filename, fileType, fileSize
   c. User selects documentType for each file (cac, tax_certificate, incorporation, other)
   d. Frontend validates: at least 1 document, at least 1 CAC document, all files ≤ 10MB
   e. User clicks "Submit"
6. Frontend calls POST /api/v1/verification-requests/business
7. On success → show "pending" state
8. On 409 → show "You already have a pending application"
```

#### Flow: Resubmission After Rejection

```
1. User sees rejected state with reviewNotes displayed
2. User clicks "Resubmit Application"
3. Same flow as first-time submission (a new request is created)
4. The old rejected request remains in history
```

#### Flow: Checking Status (Polling / Notification)

```
Option A - Polling:
  - On verification dashboard load, call GET /api/v1/verification-requests?type=business&sortOrder=desc&limit=1
  - Use the most recent request's status to determine the current state

Option B - Real-time Notifications:
  - Listen for notification types: "verification_approved", "verification_rejected"
  - On receiving notification, refresh the verification status
```

#### Frontend Validation Rules (Before API Call)

| Rule | Error Message |
|------|---------------|
| At least 1 document uploaded | "At least one document is required" |
| At least 1 CAC document in the list | "A CAC certificate is required for business verification" |
| Each file ≤ 10MB | "File size must not exceed 10MB" |
| File type must be PDF, JPEG, JPG, or PNG | "Only PDF and image files (JPEG, PNG) are accepted" |
| No pending application already exists | "You already have a pending verification application" |

---

## 2. Admin Frontend

### 2.1 Feature Description

Admins can:
- View all verification applications across the platform with filters and pagination
- Review individual applications with full business details and submitted documents
- Approve legitimate applications (auto-updates user verification status and sends notifications)
- Reject applications with a mandatory reason (10–500 characters)
- Track all verification actions via audit logs
- Filter applications by type, status, and sort by date

### 2.2 Pages & UI Components

#### Page: Verification Applications List (`/admin/verifications`)

| Component | Description |
|-----------|-------------|
| **VerificationTable** | Paginated data table listing all verification applications |
| **StatusFilter** | Dropdown filter: All, Pending, Approved, Rejected |
| **TypeFilter** | Dropdown filter: All, Business, KYC, Org |
| **SortControls** | Sort by: Created Date, Updated Date (asc/desc) |
| **StatusBadge** | Color-coded badge: 🟡 Pending, 🟢 Approved, 🔴 Rejected |
| **PaginationControls** | Page navigation with item count |

**Table columns:**

| Column | Source Field | Description |
|--------|-------------|-------------|
| Business Name | `user.recruiterProfile.company` | Company name from recruiter profile |
| Applicant | `user.username` or `user.email` | Who submitted |
| Type | `type` | Verification type (business, kyc, org) |
| Status | `status` | Current status with colored badge |
| Documents | `documents.length` | Number of documents submitted |
| Submitted | `createdAt` | Submission date |
| Reviewed | `reviewedAt` | Review date (if reviewed) |
| Actions | - | "View" button linking to detail page |

#### Page: Verification Application Detail (`/admin/verifications/:id`)

| Component | Description |
|-----------|-------------|
| **ApplicationHeader** | Shows business name, applicant, status badge, submission date |
| **BusinessInfoCard** | Company name, industry, applicant email from `user.recruiterProfile` |
| **DocumentViewer** | List of submitted documents with download links, file type icons, and document type labels |
| **DocumentPreview** | In-page PDF/image preview for each document |
| **ReviewActions** | Approve / Reject action buttons (only shown for `pending` applications) |
| **RejectionModal** | Modal with textarea for rejection reason (10–500 chars) + confirm button |
| **ReviewHistory** | Shows who reviewed and when, with review notes if rejected |

```
┌─────────────────────────────────────────────────────────────┐
│  Application Detail - TechCorp Ltd                          │
│  Status: 🟡 Pending  |  Submitted: March 30, 2026          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Business Information                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Company:   TechCorp Ltd                              │  │
│  │  Industry:  Technology                                │  │
│  │  Applicant: john_doe (john@techcorp.com)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  📄 Submitted Documents (2)                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  📎 TechCorp-CAC-Certificate.pdf                      │  │
│  │     Type: CAC  |  Size: 2.0 MB  |  [View] [Download]  │  │
│  │                                                       │  │
│  │  📎 TechCorp-Tax-Certificate-2025.pdf                 │  │
│  │     Type: Tax Certificate  |  Size: 1.5 MB            │  │
│  │     [View] [Download]                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ ✅ Approve   │  │ ❌ Reject    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 API Endpoints

All endpoints require **Bearer Token** + **admin role**.

#### List All Verification Applications

```
GET /api/v1/admin/verifications
```

**Query Parameters:**

| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `type` | `enum` | - | `kyc`, `org`, `business` | Filter by verification type |
| `status` | `enum` | - | `pending`, `approved`, `rejected` | Filter by status |
| `limit` | `number` | `20` | min: 1 | Items per page |
| `offset` | `number` | `0` | min: 0 | Items to skip |
| `sortBy` | `enum` | `createdAt` | `createdAt`, `updatedAt` | Field to sort by |
| `sortOrder` | `enum` | `desc` | `asc`, `desc` | Sort direction |

#### Get Single Verification Application

```
GET /api/v1/admin/verifications/:id
```

Returns the application with user details and recruiter profile.

#### Approve Verification

```
PATCH /api/v1/admin/verifications/:id/approve
```

No request body needed. The admin's user ID is taken from the auth token.

**Side effects on approval:**
- Sets `status` to `approved`, `reviewedById` to admin ID, `reviewedAt` to now
- Sets the user's `isVerified = true` and `verificationLevel = "org"`
- Creates an audit log entry
- Sends in-app notification + email to the business owner

#### Reject Verification

```
PATCH /api/v1/admin/verifications/:id/reject
```

**Request Body:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `reviewNotes` | `string` | Yes | 10–500 characters | Reason for rejection |

**Side effects on rejection:**
- Sets `status` to `rejected`, `reviewNotes`, `reviewedById`, `reviewedAt`
- Creates an audit log entry
- Sends in-app notification + email to the business owner with the rejection reason

### 2.4 Request/Response Examples

#### List Applications (with filters)

```javascript
// GET /api/v1/admin/verifications?status=pending&sortBy=createdAt&sortOrder=desc&limit=20&offset=0
// Headers: { Authorization: "Bearer <admin_token>" }

// Response (200 OK)
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
      "type": "business",
      "documents": [
        {
          "url": "https://storage.talentng.com/docs/cac-cert-abc123.pdf",
          "filename": "TechCorp-CAC-Certificate.pdf",
          "fileType": "application/pdf",
          "fileSize": 2048576,
          "documentType": "cac"
        }
      ],
      "status": "pending",
      "reviewNotes": null,
      "reviewedById": null,
      "reviewedAt": null,
      "createdAt": "2026-03-30T14:30:00.000Z",
      "updatedAt": "2026-03-30T14:30:00.000Z",
      "user": {
        "id": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
        "username": "john_doe",
        "email": "john@techcorp.com",
        "recruiterProfile": {
          "company": "TechCorp Ltd",
          "industry": "Technology"
        }
      }
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### Get Single Application

```javascript
// GET /api/v1/admin/verifications/a1b2c3d4-e5f6-7890-1234-567890abcdef
// Headers: { Authorization: "Bearer <admin_token>" }

// Response (200 OK)
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
  "type": "business",
  "documents": [
    {
      "url": "https://storage.talentng.com/docs/cac-cert-abc123.pdf",
      "filename": "TechCorp-CAC-Certificate.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "documentType": "cac"
    },
    {
      "url": "https://storage.talentng.com/docs/tax-cert-def456.pdf",
      "filename": "TechCorp-Tax-Certificate-2025.pdf",
      "fileType": "application/pdf",
      "fileSize": 1524800,
      "documentType": "tax_certificate"
    }
  ],
  "status": "pending",
  "reviewNotes": null,
  "reviewedById": null,
  "reviewedAt": null,
  "createdAt": "2026-03-30T14:30:00.000Z",
  "updatedAt": "2026-03-30T14:30:00.000Z",
  "user": {
    "id": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
    "username": "john_doe",
    "email": "john@techcorp.com",
    "recruiterProfile": {
      "company": "TechCorp Ltd",
      "industry": "Technology"
    }
  }
}
```

#### Approve Application

```javascript
// PATCH /api/v1/admin/verifications/a1b2c3d4-e5f6-7890-1234-567890abcdef/approve
// Headers: { Authorization: "Bearer <admin_token>" }
// No request body

// Response (200 OK)
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
  "type": "business",
  "documents": [...],
  "status": "approved",
  "reviewNotes": null,
  "reviewedById": "admin-uuid-here",
  "reviewedAt": "2026-03-31T10:00:00.000Z",
  "createdAt": "2026-03-30T14:30:00.000Z",
  "updatedAt": "2026-03-31T10:00:00.000Z"
}
```

#### Reject Application

```javascript
// PATCH /api/v1/admin/verifications/a1b2c3d4-e5f6-7890-1234-567890abcdef/reject
// Headers: { Authorization: "Bearer <admin_token>" }

// Request
{
  "reviewNotes": "The CAC document provided is not clear enough to verify. Please upload a higher quality scan or photo of the original certificate."
}

// Response (200 OK)
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "u1a2b3c4-d5e6-f789-0123-456789abcdef",
  "type": "business",
  "documents": [...],
  "status": "rejected",
  "reviewNotes": "The CAC document provided is not clear enough to verify. Please upload a higher quality scan or photo of the original certificate.",
  "reviewedById": "admin-uuid-here",
  "reviewedAt": "2026-03-31T10:00:00.000Z",
  "createdAt": "2026-03-30T14:30:00.000Z",
  "updatedAt": "2026-03-31T10:00:00.000Z"
}
```

### 2.5 State Management & UX Flows

#### Flow: Reviewing an Application

```
1. Admin navigates to /admin/verifications
2. Frontend calls GET /api/v1/admin/verifications?status=pending
3. Table renders with pending applications
4. Admin clicks "View" on a row
5. Frontend calls GET /api/v1/admin/verifications/:id
6. Detail page renders with documents and business info
7. Admin reviews documents (view/download each one)
8. Admin clicks either:
   a. "Approve" → Confirm dialog → PATCH .../approve → Refresh → Show success toast
   b. "Reject"  → RejectionModal opens → Admin types reason (10-500 chars) → Confirm → PATCH .../reject → Refresh → Show success toast
9. After action, redirect back to list or show updated status
```

#### Flow: Filtering & Sorting

```
1. Admin uses StatusFilter dropdown → updates ?status= query param
2. Admin uses TypeFilter dropdown → updates ?type= query param
3. Admin clicks column header → updates ?sortBy= and ?sortOrder= params
4. On any filter change, call GET /api/v1/admin/verifications with updated params
5. Pagination: use offset = (page - 1) * limit
```

#### Admin Dashboard Integration

Consider adding a **verification widget** to the admin dashboard:
```
┌──────────────────────────┐
│  📋 Pending Verifications │
│  ────────────────────────│
│  15 pending applications  │
│  [View All →]             │
└──────────────────────────┘
```

Fetch count via: `GET /api/v1/admin/verifications?status=pending&limit=1` and use `pagination.total`.

---

## 3. Shared Types & Enums

### TypeScript Interfaces

```typescript
// Verification Types
type VerificationType = 'kyc' | 'org' | 'business';
type VerificationStatus = 'pending' | 'approved' | 'rejected';

// Document
interface DocumentDto {
  url: string;
  filename: string;
  fileType: 'application/pdf' | 'image/jpeg' | 'image/jpg' | 'image/png';
  fileSize: number;        // max 10485760 (10MB)
  documentType: 'cac' | 'tax_certificate' | 'incorporation' | 'other';
}

// Submit request body
interface CreateBusinessVerificationRequest {
  type: 'business';
  documents: DocumentDto[];  // min 1, must include at least one 'cac'
}

// Verification request (API response)
interface VerificationRequest {
  id: string;
  userId: string;
  type: VerificationType;
  documents: DocumentDto[];
  status: VerificationStatus;
  reviewNotes: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;    // ISO 8601
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}

// Admin response (includes user data)
interface VerificationRequestWithUser extends VerificationRequest {
  user: {
    id: string;
    username: string | null;
    email: string;
    recruiterProfile?: {
      company?: string | null;
      industry?: string | null;
    } | null;
  };
}

// Reject request body
interface RejectVerificationRequest {
  reviewNotes: string;   // 10-500 characters
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Admin list filters
interface AdminVerificationFilters {
  type?: VerificationType;
  status?: VerificationStatus;
  limit?: number;           // default: 20, min: 1
  offset?: number;          // default: 0, min: 0
  sortBy?: 'createdAt' | 'updatedAt';   // default: 'createdAt'
  sortOrder?: 'asc' | 'desc';           // default: 'desc'
}
```

### Document Type Display Labels

```typescript
const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  cac: 'CAC Certificate',
  tax_certificate: 'Tax Certificate',
  incorporation: 'Incorporation Document',
  other: 'Other Document',
};
```

### Status Display Config

```typescript
const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; icon: string }> = {
  pending:  { label: 'Pending Review', color: '#F59E0B', icon: '⏳' },
  approved: { label: 'Approved',       color: '#10B981', icon: '✅' },
  rejected: { label: 'Rejected',       color: '#EF4444', icon: '❌' },
};
```

---

## 4. Notification Handling

Both the recruiter and admin receive notifications at various stages.

### Recruiter Notifications

| Event | Notification Type | Channels | Content |
|-------|------------------|----------|---------|
| Application approved | `verification_approved` | In-app, Email | "Your business verification has been approved" |
| Application rejected | `verification_rejected` | In-app, Email | "Your business verification has been rejected. Reason: ..." |

### Admin Notifications

| Event | Notification Type | Channels | Content |
|-------|------------------|----------|---------|
| New application submitted | `verification_submitted` | In-app, Email | "[username] has submitted a business verification application" |

### Notification Payload Structures

```typescript
// Approval notification payload (for recruiter)
{
  title: "Business Verification Approved",
  message: "Your business verification application has been approved. You now have access to verified business features.",
  approvedAt: "2026-03-31T10:00:00.000Z",
  benefits: [
    "Verified badge on your profile",
    "Increased trust with talent",
    "Priority in search results",
    "Access to premium features"
  ]
}

// Rejection notification payload (for recruiter)
{
  title: "Business Verification Rejected",
  message: "Your business verification application has been rejected. Reason: ...",
  rejectedAt: "2026-03-31T10:00:00.000Z",
  rejectionReason: "The CAC document provided is not clear enough...",
  reapplicationGuidance: "Please review the rejection reason and submit a new application with the required corrections."
}

// New submission notification payload (for admins)
{
  title: "New Business Verification Application",
  message: "john_doe has submitted a business verification application",
  businessOwnerName: "john_doe",
  applicationId: "a1b2c3d4-...",
  submittedAt: "2026-03-30T14:30:00.000Z",
  dashboardLink: "/admin/verifications/a1b2c3d4-..."
}
```

---

## 5. Error Handling Reference

### Recruiter Endpoints

| Status | Code | Scenario | Frontend Action |
|--------|------|----------|-----------------|
| `400` | Bad Request | Missing/invalid fields (e.g., no documents, invalid file type) | Show field-level validation errors |
| `403` | Forbidden | Non-recruiter tries to submit | Show "Only recruiters can submit business verification" |
| `403` | Forbidden | Missing CAC document | Show "A CAC certificate is required" |
| `409` | Conflict | User already has a pending application | Show "You already have a pending application" and link to it |
| `401` | Unauthorized | Token expired / missing | Redirect to login |

### Admin Endpoints

| Status | Code | Scenario | Frontend Action |
|--------|------|----------|-----------------|
| `400` | Bad Request | Application not found or not pending | Show error toast |
| `400` | Bad Request | Rejection reason < 10 or > 500 chars | Show validation error on textarea |
| `404` | Not Found | Application ID doesn't exist | Show "Application not found" page |
| `401` | Unauthorized | Token expired | Redirect to login |
| `403` | Forbidden | Non-admin tries to access | Redirect to unauthorized page |

---

## API Endpoint Summary

### Recruiter Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/verification-requests/business` | Submit business verification application |
| `GET` | `/api/v1/verification-requests` | List own verification requests |
| `GET` | `/api/v1/verification-requests/:id` | Get single verification request |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/verifications` | List all verification applications |
| `GET` | `/api/v1/admin/verifications/:id` | Get verification application detail |
| `PATCH` | `/api/v1/admin/verifications/:id/approve` | Approve application |
| `PATCH` | `/api/v1/admin/verifications/:id/reject` | Reject application with reason |

---

## File Upload Notes

The backend expects **pre-uploaded document URLs**. The frontend must:

1. Upload files to your storage service (e.g., Cloudinary, AWS S3, Firebase Storage) first
2. Get back the file URL
3. Include the URL in the `documents` array when calling the API

The backend does **not** handle file uploads directly — it only stores and validates the metadata.

**Accepted file types:** PDF, JPEG, JPG, PNG  
**Maximum file size:** 10MB per file  
**Minimum documents:** 1 (must include at least one CAC document)
