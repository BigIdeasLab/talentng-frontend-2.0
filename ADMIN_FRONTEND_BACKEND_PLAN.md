# Admin Frontend Backend API Plan

## Overview
Backend API requirements for 10 admin frontend pages: Dashboard, Talent, Recruiters, Mentors, Opportunity, Analytics, Broadcast, Logs, Support, Settings.

---

## 1. 📊 DASHBOARD PAGE

### Purpose
Overview of platform health and key metrics at a glance.

### Must-Have Endpoints

#### `GET /api/v1/admin/dashboard/stats`
**Response**:
```json
{
  "users": {
    "total": 15420,
    "talents": 12000,
    "recruiters": 2800,
    "mentors": 620,
    "activeToday": 3200,
    "activeThisWeek": 8500,
    "activeThisMonth": 12000,
    "newThisWeek": 450,
    "newThisMonth": 1800
  },
  "opportunities": {
    "total": 3200,
    "active": 1800,
    "draft": 200,
    "closed": 1200,
    "newThisWeek": 120,
    "newThisMonth": 480
  },
  "applications": {
    "total": 45000,
    "pending": 2400,
    "reviewing": 1200,
    "accepted": 8500,
    "rejected": 32900,
    "newThisWeek": 850,
    "newThisMonth": 3200
  },
  "mentorship": {
    "totalSessions": 5600,
    "upcomingSessions": 240,
    "completedThisWeek": 180,
    "completedThisMonth": 720,
    "avgRating": 4.6
  },
  "reports": {
    "pending": 45,
    "resolved": 320,
    "flaggedContent": 12
  }
}
```

#### `GET /api/v1/admin/dashboard/activity`
**Query Params**: `?period=7d|30d|90d`
**Response**: Recent activity feed
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "user_registered|opportunity_posted|application_submitted",
      "description": "New talent registered",
      "userId": "uuid",
      "userName": "John Doe",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### `GET /api/v1/admin/dashboard/charts`
**Query Params**: `?period=7d|30d|90d&metric=users|opportunities|applications`
**Response**: Time-series data for charts
```json
{
  "labels": ["Jan 1", "Jan 2", "Jan 3"],
  "datasets": [
    {
      "label": "New Users",
      "data": [45, 67, 52]
    }
  ]
}
```

---

## 2. 👤 TALENT PAGE

### Purpose
Manage all talent users, view profiles, suspend/ban, search and filter.

### Must-Have Endpoints

#### `GET /api/v1/admin/talents`
**Query Params**: 
- `q` (search by name/email/username)
- `status` (active|suspended|banned)
- `isVerified` (true|false)
- `limit`, `offset`
- `sortBy` (createdAt|lastActive)
- `sortOrder` (asc|desc)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "profileImageUrl": "https://...",
      "isVerified": true,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastActiveAt": "2024-01-15T10:30:00Z",
      "talentProfile": {
        "category": "Software Engineer",
        "location": "Lagos, Nigeria",
        "experienceLevel": "mid"
      },
      "stats": {
        "applicationsSubmitted": 25,
        "interviewsAttended": 8,
        "offersReceived": 2
      }
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/talents/:id`
**Response**: Detailed talent profile
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "profileImageUrl": "https://...",
  "isVerified": true,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastActiveAt": "2024-01-15T10:30:00Z",
  "talentProfile": {
    "category": "Software Engineer",
    "location": "Lagos, Nigeria",
    "bio": "...",
    "skills": ["React", "Node.js"],
    "experienceLevel": "mid",
    "stack": ["JavaScript", "TypeScript"]
  },
  "applications": [
    {
      "id": "uuid",
      "opportunityTitle": "Senior Developer",
      "company": "TechCorp",
      "status": "pending",
      "appliedAt": "2024-01-10T00:00:00Z"
    }
  ],
  "activityLog": [
    {
      "action": "profile_updated",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```


#### `PATCH /api/v1/admin/talents/:id/status`
**Body**: `{ "status": "active|suspended|banned", "reason": "string" }`
**Response**: Updated user

#### `DELETE /api/v1/admin/talents/:id`
**Response**: 204 No Content (soft delete)

---

## 3. 🏢 RECRUITERS PAGE

### Purpose
Manage recruiter accounts, view companies, monitor job postings, track earnings.

### Must-Have Endpoints

#### `GET /api/v1/admin/recruiters`
**Query Params**: 
- `q` (search by company/email)
- `status` (active|suspended|banned)
- `companySize` (startup|small|medium|large)
- `industry`
- `limit`, `offset`

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "techcorp_hr",
      "email": "hr@techcorp.com",
      "isVerified": true,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "recruiterProfile": {
        "company": "TechCorp",
        "companySize": "medium",
        "industry": "Technology",
        "website": "https://techcorp.com",
        "logo": "https://..."
      },
      "stats": {
        "opportunitiesPosted": 45,
        "activeOpportunities": 12,
        "totalApplications": 850,
        "totalEarnings": 125000
      }
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/recruiters/:id`
**Response**: Detailed recruiter profile with opportunities and earnings

#### `GET /api/v1/admin/recruiters/:id/opportunities`
**Response**: All opportunities posted by recruiter

#### `GET /api/v1/admin/recruiters/:id/earnings`
**Query Params**: `?startDate=2024-01-01&endDate=2024-01-31`
**Response**: Earnings breakdown

#### `PATCH /api/v1/admin/recruiters/:id/status`
**Body**: `{ "status": "active|suspended|banned", "reason": "string" }`

---

## 4. 🎓 MENTORS PAGE

### Purpose
Manage mentors, view sessions, ratings, suspend low-rated mentors.

### Must-Have Endpoints

#### `GET /api/v1/admin/mentors`
**Query Params**: 
- `q` (search by name/expertise)
- `status` (active|suspended|banned)
- `minRating` (1-5)
- `expertise`
- `limit`, `offset`

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "jane_mentor",
      "email": "jane@example.com",
      "fullName": "Jane Smith",
      "profileImageUrl": "https://...",
      "isVerified": true,
      "status": "active",
      "mentorProfile": {
        "expertise": ["Career Coaching", "Tech Leadership"],
        "headline": "Senior Engineering Manager",
        "sessionRate": 50000,
        "sessionCurrency": "NGN"
      },
      "stats": {
        "totalSessions": 120,
        "completedSessions": 115,
        "avgRating": 4.8,
        "totalEarnings": 5750000
      }
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/mentors/:id`
**Response**: Detailed mentor profile

#### `GET /api/v1/admin/mentors/:id/sessions`
**Query Params**: `?status=completed|upcoming|cancelled&limit&offset`
**Response**: Session history with ratings

#### `GET /api/v1/admin/mentors/:id/reviews`
**Response**: All reviews/ratings for mentor

#### `PATCH /api/v1/admin/mentors/:id/visibility`
**Body**: `{ "visibility": "public|private" }`

#### `PATCH /api/v1/admin/mentors/:id/status`
**Body**: `{ "status": "active|suspended|banned", "reason": "string" }`

---

## 5. 💼 OPPORTUNITY PAGE

### Purpose
Manage all job opportunities, approve/reject, flag inappropriate, view applicants.

### Must-Have Endpoints

#### `GET /api/v1/admin/opportunities`
**Query Params**: 
- `q` (search by title/company)
- `status` (active|draft|closed|flagged)
- `type` (job|gig|internship)
- `postedBy` (recruiter ID)
- `limit`, `offset`

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "type": "job",
      "status": "active",
      "location": "Lagos, Nigeria",
      "employmentType": "full-time",
      "postedBy": {
        "id": "uuid",
        "company": "TechCorp",
        "email": "hr@techcorp.com"
      },
      "stats": {
        "views": 1250,
        "applications": 85,
        "interviews": 12
      },
      "createdAt": "2024-01-10T00:00:00Z",
      "isFlagged": false
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/opportunities/:id`
**Response**: Full opportunity details with applicants

#### `PATCH /api/v1/admin/opportunities/:id/status`
**Body**: `{ "status": "active|closed|flagged", "reason": "string" }`

#### `POST /api/v1/admin/opportunities/:id/flag`
**Body**: `{ "reason": "inappropriate|spam|misleading", "notes": "string" }`

#### `DELETE /api/v1/admin/opportunities/:id`
**Response**: 204 No Content (soft delete)

---

## 6. 📈 ANALYTICS PAGE

### Purpose
Platform-wide analytics, trends, growth metrics, export reports.

### Must-Have Endpoints

#### `GET /api/v1/admin/analytics/overview`
**Query Params**: `?startDate=2024-01-01&endDate=2024-01-31`
**Response**:
```json
{
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "userGrowth": {
    "newUsers": 1800,
    "growthRate": 12.5,
    "byRole": {
      "talents": 1400,
      "recruiters": 300,
      "mentors": 100
    }
  },
  "engagement": {
    "dailyActiveUsers": 3200,
    "weeklyActiveUsers": 8500,
    "monthlyActiveUsers": 12000,
    "avgSessionDuration": 1200
  },
  "opportunities": {
    "posted": 480,
    "filled": 120,
    "avgTimeToFill": 14
  },
  "applications": {
    "submitted": 3200,
    "acceptanceRate": 18.5
  },
  "mentorship": {
    "sessionsBooked": 720,
    "completionRate": 95.8,
    "avgRating": 4.6
  },
  "revenue": {
    "total": 15000000,
    "bySource": {
      "opportunities": 12000000,
      "mentorship": 3000000
    }
  }
}
```

#### `GET /api/v1/admin/analytics/trends`
**Query Params**: `?metric=users|opportunities|applications&period=7d|30d|90d`
**Response**: Time-series data for trend charts

#### `GET /api/v1/admin/analytics/retention`
**Response**: User retention cohort analysis

#### `GET /api/v1/admin/analytics/churn`
**Response**: Churn rate and reasons

#### `POST /api/v1/admin/analytics/export`
**Body**: `{ "reportType": "users|opportunities|revenue", "format": "csv|pdf", "startDate": "...", "endDate": "..." }`
**Response**: Download URL or file stream

---

## 7. 📢 BROADCAST PAGE

### Purpose
Send platform-wide or targeted announcements to users.

### Must-Have Endpoints

#### `GET /api/v1/admin/broadcasts`
**Query Params**: `?status=draft|sent|scheduled&limit&offset`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Platform Maintenance Notice",
      "message": "We will be performing maintenance...",
      "targetAudience": "all|talents|recruiters|mentors",
      "channels": ["email", "inapp", "push"],
      "status": "sent",
      "sentAt": "2024-01-15T10:00:00Z",
      "stats": {
        "sent": 15000,
        "delivered": 14850,
        "opened": 8200,
        "clicked": 1200
      }
    }
  ],
  "pagination": { ... }
}
```

#### `POST /api/v1/admin/broadcasts`
**Body**:
```json
{
  "title": "string",
  "message": "string",
  "targetAudience": "all|talents|recruiters|mentors",
  "channels": ["email", "inapp", "push"],
  "scheduledFor": "2024-01-20T10:00:00Z" // optional
}
```

#### `GET /api/v1/admin/broadcasts/:id`
**Response**: Broadcast details with delivery stats

#### `DELETE /api/v1/admin/broadcasts/:id`
**Response**: 204 (only for drafts/scheduled)

---

## 8. 📋 LOGS PAGE

### Purpose
View all admin actions, audit trail, system events.

### Must-Have Endpoints

#### `GET /api/v1/admin/audit-logs`
**Query Params**: 
- `action` (user.suspend|opportunity.delete|etc)
- `performedBy` (admin ID)
- `entityType` (users|opportunities|applications)
- `startDate`, `endDate`
- `limit`, `offset`

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "action": "user.suspend",
      "performedBy": {
        "id": "uuid",
        "username": "admin_john",
        "email": "john@admin.com"
      },
      "entity": {
        "type": "users",
        "id": "uuid",
        "name": "Jane Doe"
      },
      "details": {
        "reason": "Violation of terms",
        "previousStatus": "active",
        "newStatus": "suspended"
      },
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/audit-logs/export`
**Query Params**: Same as above + `format=csv|pdf`
**Response**: Download file

---

## 9. 🎫 SUPPORT PAGE

### Purpose
Manage user support tickets, assign, resolve issues.

### Must-Have Endpoints

#### `GET /api/v1/admin/support/tickets`
**Query Params**: 
- `status` (open|in_progress|resolved|closed)
- `priority` (low|medium|high|urgent)
- `assignedTo` (admin ID)
- `category` (account|payment|technical|other)
- `limit`, `offset`

**Response**:
```json
{
  "data": [
    {
      "id": "TICKET-12345",
      "subject": "Cannot login to account",
      "category": "account",
      "priority": "high",
      "status": "open",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedTo": {
        "id": "uuid",
        "name": "Admin Sarah"
      },
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "responseTime": 90 // minutes
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/admin/support/tickets/:id`
**Response**: Full ticket details with conversation history

#### `POST /api/v1/admin/support/tickets`
**Body**: Create ticket on behalf of user
```json
{
  "userId": "uuid",
  "subject": "string",
  "description": "string",
  "category": "account|payment|technical|other",
  "priority": "low|medium|high|urgent"
}
```

#### `PATCH /api/v1/admin/support/tickets/:id`
**Body**: Update ticket
```json
{
  "status": "open|in_progress|resolved|closed",
  "priority": "low|medium|high|urgent",
  "assignedTo": "admin-uuid"
}
```

#### `POST /api/v1/admin/support/tickets/:id/reply`
**Body**: Add reply to ticket
```json
{
  "message": "string",
  "internal": false // internal note vs user-visible reply
}
```

#### `GET /api/v1/admin/support/stats`
**Response**: Support metrics
```json
{
  "openTickets": 45,
  "avgResponseTime": 120, // minutes
  "avgResolutionTime": 1440, // minutes
  "satisfactionRate": 92.5,
  "ticketsByCategory": {
    "account": 20,
    "payment": 10,
    "technical": 15
  }
}
```

---

## 10. ⚙️ SETTINGS PAGE

### Purpose
Platform configuration, admin user management, system settings.

### Must-Have Endpoints

#### `GET /api/v1/admin/settings/admins`
**Response**: List of all admin users
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "admin_john",
      "email": "john@admin.com",
      "roles": ["admin"],
      "permissions": ["users.manage", "opportunities.manage"],
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/v1/admin/settings/admins`
**Body**: Create new admin
```json
{
  "email": "string",
  "username": "string",
  "password": "string",
  "roles": ["admin"],
  "permissions": ["users.manage"]
}
```

#### `PATCH /api/v1/admin/settings/admins/:id`
**Body**: Update admin permissions/status

#### `DELETE /api/v1/admin/settings/admins/:id`
**Response**: 204 (cannot delete self)

#### `GET /api/v1/admin/settings/platform`
**Response**: Platform configuration
```json
{
  "maintenance": {
    "enabled": false,
    "message": "We are performing maintenance..."
  },
  "features": {
    "userRegistration": true,
    "opportunityPosting": true,
    "mentorshipBooking": true
  },
  "limits": {
    "maxOpportunitiesPerRecruiter": 50,
    "maxApplicationsPerTalent": 100
  }
}
```

#### `PATCH /api/v1/admin/settings/platform`
**Body**: Update platform settings

---

## 📊 IMPLEMENTATION PRIORITY

### Phase 1: Core Operations (Week 1-2)
1. ✅ Dashboard stats endpoint
2. ✅ Talent management (list, view, suspend)
3. ✅ Recruiter management (list, view, suspend)
4. ✅ Opportunity management (list, view, flag, delete)
5. ✅ Audit logs (view only)

### Phase 2: Advanced Features (Week 3-4)
6. ✅ Mentor management
7. ✅ Analytics overview
8. ✅ Support ticketing system
9. ✅ Broadcast system

### Phase 3: Polish & Optimization (Week 5)
10. ✅ Settings & admin management
11. ✅ Export functionality
12. ✅ Advanced analytics
13. ✅ Performance optimization

---

## 🔑 KEY TECHNICAL REQUIREMENTS

### All Endpoints Must Have:
- ✅ JWT authentication with admin role check
- ✅ Pagination (limit, offset, total, currentPage, totalPages, hasNextPage, hasPreviousPage)
- ✅ Audit logging for all write operations
- ✅ Error handling with proper status codes
- ✅ Input validation
- ✅ Rate limiting

### Performance Considerations:
- Dashboard stats should be cached (5-minute TTL)
- Analytics queries should use database indexes
- Large exports should be async with download links
- Real-time data should use WebSockets or polling

### Security:
- All endpoints require admin role
- Sensitive operations (delete, ban) require additional confirmation
- Audit logs are immutable
- Admin actions are logged with IP address

---

## 📝 NEXT STEPS

1. Review this plan with frontend team
2. Prioritize endpoints based on frontend development schedule
3. Create API documentation (Swagger/OpenAPI)
4. Begin Phase 1 implementation
5. Set up monitoring and logging


---

## 📋 IMPLEMENTATION TASKS

### 0. Infrastructure & Shared Components

1. Authentication & Authorization: Implement JWT middleware, admin role guards, session management (backend) + login page, token refresh, protected routes (frontend).
2. Core UI Infrastructure: Build AdminLayout with navigation, error boundary, toast notifications, loading states, pagination, API client with interceptors, and global error handling.

### 1. Dashboard Page

3. Dashboard Backend: Implement GET /stats, GET /activity, GET /charts endpoints with metrics, activity feed, and time-series data.
4. Dashboard Frontend: Build DashboardStats with metric cards, ActivityFeed with timeline, and interactive charts with period selectors.

### 2. Talent Management

5. Talent List & Details Backend: Implement GET /api/v1/admin/talents (list with search/filters/pagination) and GET /talents/:id (full profile with history).
6. Talent List & Details Frontend: Build TalentTable with search/filters and TalentDetailModal with profile info, stats, applications, activity log.
7. Talent Actions Backend: Implement PATCH /talents/:id/status (status updates with audit logging) and DELETE /talents/:id (soft delete).
8. Talent Actions Frontend: Build StatusUpdateModal with dropdown/reason/confirmation and delete confirmation dialog.

### 3. Recruiter Management

9. Recruiter List & Details Backend: Implement GET /api/v1/admin/recruiters (list with filters), GET /recruiters/:id, GET /recruiters/:id/opportunities, GET /recruiters/:id/earnings.
10. Recruiter List & Details Frontend: Build RecruiterTable with company logos/filters and RecruiterDetailModal with tabs for profile, opportunities, earnings charts.
11. Recruiter Actions Backend: Implement PATCH /recruiters/:id/status with audit logging.
12. Recruiter Actions Frontend: Build status update modal with reason input and confirmation.

### 4. Mentor Management

13. Mentor List & Details Backend: Implement GET /api/v1/admin/mentors (list with filters), GET /mentors/:id, GET /mentors/:id/sessions, GET /mentors/:id/reviews.
14. Mentor List & Details Frontend: Build MentorTable with ratings/expertise tags and MentorDetailModal with tabs for profile, sessions, reviews.
15. Mentor Actions Backend: Implement PATCH /mentors/:id/visibility and PATCH /mentors/:id/status with validation.
16. Mentor Actions Frontend: Build visibility toggle and status update modal with confirmation.

### 5. Opportunity Management

17. Opportunity List & Details Backend: Implement GET /api/v1/admin/opportunities (list with filters) and GET /opportunities/:id (details with applicants).
18. Opportunity List & Details Frontend: Build OpportunityTable with company info/status badges/stats and OpportunityDetailModal with job details/applicants tab.
19. Opportunity Actions Backend: Implement PATCH /opportunities/:id/status, POST /opportunities/:id/flag, DELETE /opportunities/:id.
20. Opportunity Actions Frontend: Build status modal, flag modal with reason categories, and delete dialog.

### 6. Analytics & Reporting

21. Analytics Backend: Implement GET /api/v1/admin/analytics/overview, GET /analytics/trends, GET /analytics/retention, GET /analytics/churn, POST /analytics/export.
22. Analytics Frontend: Build AnalyticsOverview with date picker/metric cards, TrendsChart, RetentionTable, ChurnAnalysis, and ExportModal.

### 7. Broadcast System

23. Broadcast Backend: Implement GET /api/v1/admin/broadcasts (list), POST /broadcasts (create with scheduling), GET /broadcasts/:id (details), DELETE /broadcasts/:id.
24. Broadcast Frontend: Build BroadcastTable with status badges/stats, CreateBroadcastModal with audience/channels/scheduling, and BroadcastDetailModal with delivery stats.

### 8. Audit Logs

25. Audit Logs Backend: Implement GET /api/v1/admin/audit-logs (list with filters) and GET /audit-logs/export (CSV/PDF generation).
26. Audit Logs Frontend: Build AuditLogsTable with filters/search/date picker and export button with format selector.

### 9. Support Ticketing

27. Support Backend: Implement GET /api/v1/admin/support/tickets (list with filters), GET /tickets/:id, POST /tickets, PATCH /tickets/:id, POST /tickets/:id/reply, GET /support/stats.
28. Support Frontend: Build TicketsTable with priority badges/filters, TicketDetailModal with conversation/reply form, CreateTicketModal, update form, and SupportStats component.

### 10. Settings & Configuration

29. Settings Backend: Implement GET /api/v1/admin/settings/admins, POST /admins, PATCH /admins/:id, DELETE /admins/:id, GET /settings/platform, PATCH /settings/platform.
30. Settings Frontend: Build AdminUsersTable, CreateAdminModal, EditAdminModal, delete dialog, and PlatformSettings component with maintenance mode/feature toggles/limits.

