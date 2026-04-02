# Support System Integration Guide
## For Admin & Talent Frontend Teams

**Date**: April 2, 2026  
**Status**: Backend Complete - Ready for Frontend Integration  
**Audience**: Admin Frontend Team + Talent Frontend Team

---

## 🎯 Executive Summary

The backend support ticket system is now complete with user-facing endpoints. This document provides clear guidance for both frontend teams on what needs to be done.

### Quick Status

| Team | Current State | Work Required | Estimated Time |
|------|---------------|---------------|----------------|
| **Admin Frontend** | ✅ UI Complete | ⚠️ Minor Verification & Fixes | 1-2 days |
| **Talent Frontend** | ⚠️ Mock API | ❌ Full Integration Needed | 3-4 days |

---

## 📋 Backend Endpoints Available

All endpoints are now live at `/api/v1/support/*`:

### User Endpoints (For Talent Frontend)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/support/tickets` | Create a support ticket | ✅ JWT |
| GET | `/api/v1/support/tickets` | List my tickets (paginated) | ✅ JWT |
| GET | `/api/v1/support/tickets/:id` | Get ticket details + conversation | ✅ JWT |
| POST | `/api/v1/support/tickets/:id/reply` | Reply to a ticket | ✅ JWT |
| GET | `/api/v1/support/tickets/count` | Get active ticket count (open + in_progress) | ✅ JWT |

### Admin Endpoints (For Admin Frontend)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/support/tickets/count` | Get open ticket count | ✅ JWT + Admin |
| GET | `/api/v1/admin/support/tickets` | List all tickets (with filters) | ✅ JWT + Admin |
| GET | `/api/v1/admin/support/tickets/:id` | Get ticket details | ✅ JWT + Admin |
| POST | `/api/v1/admin/support/tickets` | Create ticket (on behalf of user) | ✅ JWT + Admin |
| PATCH | `/api/v1/admin/support/tickets/:id` | Update ticket (status, priority, assign) | ✅ JWT + Admin |
| POST | `/api/v1/admin/support/tickets/:id/reply` | Add reply (internal or external) | ✅ JWT + Admin |
| GET | `/api/v1/admin/support/stats` | Get support statistics | ✅ JWT + Admin |

---

## 🎨 For Admin Frontend Team

### Current State
Your admin support page is already well-implemented with a great UI! The backend admin endpoints have been working for a while.

### What You Need to Do

#### 1. Verification Checklist (1 day)

Test all existing functionality to ensure it works correctly:

- [ ] **Ticket List Page**
  - [ ] Tickets load correctly with pagination
  - [ ] Filters work (status, priority, category)
  - [ ] Search functionality works
  - [ ] Sorting works (by date, priority, status)
  - [ ] Open ticket count badge displays correctly

- [ ] **Ticket Detail Page**
  - [ ] Ticket details load correctly
  - [ ] Conversation thread displays properly
  - [ ] Can assign tickets to admins
  - [ ] Can update status (open → in_progress → resolved → closed)
  - [ ] Can update priority (low, medium, high, urgent)
  - [ ] Can add replies (both internal and external)
  - [ ] Internal replies are marked correctly

- [ ] **Statistics Dashboard**
  - [ ] Total tickets count is correct
  - [ ] Open tickets count is correct
  - [ ] Average response time displays correctly
  - [ ] Satisfaction rate displays correctly

#### 2. Known Issues to Fix (1 day)

##### Issue #1: Ticket ID Format Mismatch
**Current**: Admin frontend might be using `#TKT-{id}` format  
**Expected**: Backend generates `TICKET-00001` format

**Fix**: Update the ticket ID display to use the backend-generated `ticketId` field instead of formatting the `id` field.

```typescript
// ❌ Wrong
<span>#{ticket.id}</span>

// ✅ Correct
<span>{ticket.ticketId}</span> // Shows "TICKET-00001"
```

##### Issue #2: Satisfaction Rate Display
**Current**: Might show `0%` for all tickets  
**Expected**: Show `N/A` (satisfaction ratings not yet implemented)

**Fix**: Check if satisfaction rating exists before displaying:

```typescript
// ✅ Correct
{ticket.satisfactionRating 
  ? `${ticket.satisfactionRating}%` 
  : 'N/A'}
```

##### Issue #3: Response Time Calculation
**Current**: Might be showing incorrect units  
**Expected**: Show response time in hours

**Fix**: Verify the calculation uses hours:

```typescript
// ✅ Correct
const responseTimeHours = Math.round(
  (new Date(ticket.firstReplyAt) - new Date(ticket.createdAt)) / (1000 * 60 * 60)
);
```

#### 3. Testing Script

Use this cURL command to test the admin endpoints:

```bash
# Get all tickets
curl -X GET "http://localhost:3000/api/v1/admin/support/tickets?limit=20&offset=0" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get ticket details
curl -X GET "http://localhost:3000/api/v1/admin/support/tickets/TICKET_ID" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Update ticket status
curl -X PATCH "http://localhost:3000/api/v1/admin/support/tickets/TICKET_ID" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# Add reply
curl -X POST "http://localhost:3000/api/v1/admin/support/tickets/TICKET_ID/reply" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "We are looking into this", "internal": false}'
```

#### 4. Success Criteria

- ✅ All existing features work correctly
- ✅ Ticket IDs display in `TICKET-00001` format
- ✅ Satisfaction rate shows "N/A" instead of 0%
- ✅ Response time calculations are correct
- ✅ No console errors
- ✅ All API calls succeed

---

## 💼 For Talent Frontend Team

### Current State
You have a contact form UI that currently uses a mock API. You need to integrate the real backend endpoints and build ticket management pages.

### What You Need to Do

#### 1. Update Contact Form (Day 1)

Replace the mock API with the real backend endpoint.

**Current File**: Likely `src/services/support.ts` or similar

```typescript
// ❌ Remove mock API
const mockCreateTicket = async (data) => {
  return { success: true, ticketId: 'MOCK-001' };
};

// ✅ Add real API call
import { apiClient } from './api-client';

export const createSupportTicket = async (data: {
  subject: string;
  message: string;
  category: 'account' | 'payment' | 'technical' | 'other';
}) => {
  const response = await apiClient.post('/support/tickets', data);
  return response.data;
};
```

**API Request**:
```typescript
POST /api/v1/support/tickets
Headers: {
  Authorization: Bearer {token}
  Content-Type: application/json
}
Body: {
  subject: string,
  message: string,
  category: 'account' | 'payment' | 'technical' | 'other'
}
```

**API Response**:
```typescript
{
  id: string,
  ticketId: string,        // "TICKET-00001"
  subject: string,
  category: string,
  priority: string,        // "medium" (default)
  status: string,          // "open" (default)
  createdAt: string
}
```

#### 2. Create Ticket List Page (Day 2)

**Route**: `/support/tickets` or `/tickets`

**Features**:
- Display list of user's tickets
- Show ticket status badges (open, in_progress, resolved, closed)
- Show priority badges (low, medium, high, urgent)
- Show last reply time
- Pagination controls
- Filter by status (optional)
- Click ticket to view details

**API Call**:
```typescript
export const getUserTickets = async (params?: {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  limit?: number;
  offset?: number;
}) => {
  const response = await apiClient.get('/support/tickets', { params });
  return response.data;
};
```

**API Response**:
```typescript
{
  data: [
    {
      id: string,
      ticketId: string,
      subject: string,
      category: string,
      priority: string,
      status: string,
      replyCount: number,
      lastReplyAt: string | null,
      createdAt: string,
      updatedAt: string
    }
  ],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    currentPage: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

**UI Components Needed**:
- Ticket list item component
- Status badge component
- Priority badge component
- Pagination component
- Empty state (no tickets)
- Loading state

#### 3. Create Ticket Detail Page (Day 3)

**Route**: `/support/tickets/[id]` or `/tickets/[id]`

**Features**:
- Display ticket details (subject, description, status, priority, category)
- Show conversation thread (user messages + admin replies)
- Reply form at the bottom
- Show who replied (user vs admin)
- Show timestamps
- Assigned admin info (if any)

**API Call**:
```typescript
export const getTicketById = async (ticketId: string) => {
  const response = await apiClient.get(`/support/tickets/${ticketId}`);
  return response.data;
};

export const addTicketReply = async (ticketId: string, message: string) => {
  const response = await apiClient.post(`/support/tickets/${ticketId}/reply`, {
    message
  });
  return response.data;
};
```

**API Response (Get Ticket)**:
```typescript
{
  id: string,
  ticketId: string,
  subject: string,
  description: string,
  category: string,
  priority: string,
  status: string,
  assignedTo: {
    id: string,
    username: string,
    email: string
  } | null,
  conversation: [
    {
      id: string,
      message: string,
      author: {
        id: string,
        username: string,
        email: string
      },
      isAdmin: boolean,
      createdAt: string
    }
  ],
  createdAt: string,
  updatedAt: string
}
```

**UI Components Needed**:
- Ticket header component (shows ticket info)
- Conversation thread component
- Message bubble component (different styles for user vs admin)
- Reply form component
- Loading states
- Error handling

#### 4. Add Navigation (Day 4)

**Update Navigation Menu**:
- Add "Support" or "Help" link to main navigation
- Add ticket count badge (optional)

**Update Contact Form**:
- After successful ticket creation, show success message with ticket ID
- Add link to view ticket: "View your ticket: TICKET-00001"
- Optionally redirect to ticket detail page

#### 5. Testing Checklist

- [ ] **Contact Form**
  - [ ] Can create ticket successfully
  - [ ] Shows success message with ticket ID
  - [ ] Validation works (required fields)
  - [ ] Error handling works (network errors)

- [ ] **Ticket List Page**
  - [ ] Tickets load correctly
  - [ ] Pagination works
  - [ ] Status filter works (if implemented)
  - [ ] Can click ticket to view details
  - [ ] Empty state shows when no tickets
  - [ ] Loading state shows while fetching

- [ ] **Ticket Detail Page**
  - [ ] Ticket details load correctly
  - [ ] Conversation thread displays properly
  - [ ] Can add reply successfully
  - [ ] Reply appears in conversation immediately
  - [ ] Shows who replied (user vs admin)
  - [ ] Timestamps display correctly
  - [ ] Error handling works

- [ ] **Navigation**
  - [ ] Support link appears in menu
  - [ ] Link navigates to ticket list page
  - [ ] Ticket count badge updates (if implemented)

#### 6. Code Examples

**API Service** (`src/services/support.ts`):
```typescript
import { apiClient } from './api-client';

export interface CreateTicketDto {
  subject: string;
  message: string;
  category: 'account' | 'payment' | 'technical' | 'other';
}

export interface TicketFilters {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  limit?: number;
  offset?: number;
}

export const supportService = {
  createTicket: async (data: CreateTicketDto) => {
    const response = await apiClient.post('/support/tickets', data);
    return response.data;
  },

  getMyTickets: async (filters?: TicketFilters) => {
    const response = await apiClient.get('/support/tickets', {
      params: filters
    });
    return response.data;
  },

  getTicketById: async (ticketId: string) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}`);
    return response.data;
  },

  addReply: async (ticketId: string, message: string) => {
    const response = await apiClient.post(
      `/support/tickets/${ticketId}/reply`,
      { message }
    );
    return response.data;
  },

  getTicketCount: async () => {
    const response = await apiClient.get('/support/tickets/count');
    return response.data;
  }
};
```

**React Hook Example** (`src/hooks/useTickets.ts`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../services/support';

export const useTickets = (filters?: TicketFilters) => {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => supportService.getMyTickets(filters)
  });
};

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => supportService.getTicketById(ticketId),
    enabled: !!ticketId
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: supportService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });
};

export const useAddReply = (ticketId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (message: string) => 
      supportService.addReply(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticketCount'] });
    }
  });
};

export const useTicketCount = () => {
  return useQuery({
    queryKey: ['ticketCount'],
    queryFn: () => supportService.getTicketCount()
  });
};
```

#### 7. Success Criteria

- ✅ Contact form creates real tickets (not mock)
- ✅ Users can view their ticket history
- ✅ Users can view ticket details and conversation
- ✅ Users can reply to tickets
- ✅ UI is responsive (mobile + desktop)
- ✅ Loading states work correctly
- ✅ Error handling works correctly
- ✅ No console errors
- ✅ All API calls succeed

---

## 🔒 Security & Access Control

### User Endpoints (Talent Frontend)
- ✅ Users can only view their own tickets
- ✅ Users can only reply to their own tickets
- ✅ Returns 403 Forbidden if user tries to access another user's ticket
- ✅ Internal admin replies are hidden from users

### Admin Endpoints (Admin Frontend)
- ✅ Admins can view all tickets
- ✅ Admins can update any ticket
- ✅ Admins can reply to any ticket
- ✅ Admins can mark replies as internal (hidden from users)
- ✅ Admins can assign tickets to other admins

---

## 📧 Email Notifications

The backend automatically sends email notifications:

### For Users (Talent)
- ✅ Confirmation email when ticket is created
- ✅ Email when admin replies to their ticket

### For Admins
- ✅ Email when user creates a new ticket (if assigned)
- ✅ Email when user replies to their ticket (if assigned)

---

## 🧪 Testing the Backend

### Manual Testing with cURL

**Create Ticket (User)**:
```bash
curl -X POST http://localhost:3000/api/v1/support/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket",
    "message": "This is a test message",
    "category": "account"
  }'
```

**List Tickets (User)**:
```bash
curl -X GET "http://localhost:3000/api/v1/support/tickets?limit=20&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Ticket Details (User)**:
```bash
curl -X GET "http://localhost:3000/api/v1/support/tickets/TICKET_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Reply to Ticket (User)**:
```bash
curl -X POST "http://localhost:3000/api/v1/support/tickets/TICKET_ID/reply" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "This is my reply"}'
```

---

## 📅 Timeline

### Admin Frontend Team
- **Day 1**: Test existing functionality, identify issues
- **Day 2**: Fix identified issues, final testing
- **Total**: 1-2 days

### Talent Frontend Team
- **Day 1**: Update contact form with real API
- **Day 2**: Create ticket list page
- **Day 3**: Create ticket detail page with reply functionality
- **Day 4**: Add navigation, final testing
- **Total**: 3-4 days

### Combined Timeline
- **Total**: 7-10 days (teams can work in parallel)
- **Target Completion**: April 12, 2026

---

## 📚 Additional Resources

### For Both Teams
- **Master Plan**: `docs/FRONTEND_BACKEND_SYNC_PLAN.md`
- **Backend Implementation**: `docs/SUPPORT_BACKEND_IMPLEMENTATION_COMPLETE.md`
- **Summary**: `docs/SUPPORT_SYSTEM_SYNC_SUMMARY.md`

### For Admin Frontend
- **Verification Guide**: `docs/ADMIN_FRONTEND_VERIFICATION_GUIDE.md`

### For Talent Frontend
- **Implementation Guide**: `docs/FRONTEND_SUPPORT_IMPLEMENTATION_GUIDE.md`

---

## ❓ Questions or Issues?

### Backend Questions
Contact the backend team lead for:
- API endpoint questions
- Integration issues
- Authentication/authorization questions
- Email notification setup

### Frontend Questions
- Admin Frontend: Check existing implementation for reference
- Talent Frontend: Refer to the implementation guide and code examples

---

## ✅ Deployment Checklist

Before deploying to production:

### Backend
- [x] All endpoints implemented
- [x] Tests passing
- [x] Email notifications configured
- [x] Documentation complete

### Admin Frontend
- [ ] All existing features verified
- [ ] Known issues fixed
- [ ] Testing complete
- [ ] No console errors

### Talent Frontend
- [ ] Contact form integrated
- [ ] Ticket list page complete
- [ ] Ticket detail page complete
- [ ] Navigation updated
- [ ] Testing complete
- [ ] Responsive design verified
- [ ] No console errors

---

## 🎉 Conclusion

The backend is ready! Both teams can now proceed with their respective tasks:

- **Admin Frontend**: Quick verification and minor fixes (1-2 days)
- **Talent Frontend**: Full integration and new pages (3-4 days)

All the endpoints are live and tested. Let's get this done! 🚀

