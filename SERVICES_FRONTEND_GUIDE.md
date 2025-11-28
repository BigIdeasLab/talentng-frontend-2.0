# Services Frontend Integration Guide

## Overview

The Services feature allows talents to showcase and monetize their expertise by creating service offerings. Clients can discover, review, and interact with these services.

## Table of Contents

1. [Authentication](#authentication)
2. [Service Management](#service-management)
3. [Service Discovery](#service-discovery)
4. [Reviews System](#reviews-system)
5. [Implementation Examples](#implementation-examples)
6. [UI/UX Patterns](#uiux-patterns)
7. [Error Handling](#error-handling)

---

## Authentication

All service management endpoints require JWT Bearer token authentication.

**Header:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
```

Service discovery and review viewing are public endpoints (no auth required).

---

## Service Management

### 1. Create a Service

**Endpoint:** `POST /talent/services`

**Authentication:** Required ✓

**Request Body:**
```json
{
  "title": "UI/UX Design",
  "about": "I'll design beautiful and user-friendly interfaces for your app or website. Includes wireframes, mockups, and prototype.",
  "price": "Starting from $500",
  "images": [
    "https://s3.amazonaws.com/images/design-1.jpg",
    "https://s3.amazonaws.com/images/design-2.jpg"
  ],
  "tags": ["UI Design", "Figma", "Responsive Design", "Prototyping"]
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Service name/title |
| about | string | Yes | Detailed service description |
| price | string | No | Price information (e.g., "Starting from $500") |
| images | string[] | No | Array of image URLs showcasing the service |
| tags | string[] | No | Service tags for categorization/search |

**Response (201 Created):**
```json
{
  "id": "service-uuid",
  "talentProfileId": "profile-uuid",
  "title": "UI/UX Design",
  "about": "I'll design beautiful and user-friendly interfaces...",
  "price": "Starting from $500",
  "images": ["https://s3.amazonaws.com/images/design-1.jpg"],
  "tags": ["UI Design", "Figma"],
  "status": "active",
  "averageRating": 0,
  "totalReviews": 0,
  "reviews": [],
  "createdAt": "2025-11-28T10:30:00Z",
  "updatedAt": "2025-11-28T10:30:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `400` - Invalid request data (validation error)
- `401` - Unauthorized (missing/invalid token)

---

### 2. Get My Services

**Endpoint:** `GET /talent/services`

**Authentication:** Required ✓

**Response (200 OK):**
```json
[
  {
    "id": "service-1",
    "talentProfileId": "profile-uuid",
    "title": "UI/UX Design",
    "about": "Beautiful interface design...",
    "price": "Starting from $500",
    "images": ["https://..."],
    "tags": ["UI Design", "Figma"],
    "status": "active",
    "averageRating": 4.5,
    "totalReviews": 8,
    "reviews": [],
    "createdAt": "2025-11-28T10:30:00Z",
    "updatedAt": "2025-11-28T10:30:00Z"
  }
]
```

**Use Case:** Display all services belonging to the authenticated talent in their dashboard

---

### 3. Get Service Details

**Endpoint:** `GET /talent/services/:id`

**Authentication:** Required ✓

**Parameters:**
- `id` (path) - Service ID

**Response (200 OK):**
```json
{
  "id": "service-1",
  "talentProfileId": "profile-uuid",
  "title": "UI/UX Design",
  "about": "Beautiful interface design...",
  "price": "Starting from $500",
  "images": ["https://..."],
  "tags": ["UI Design", "Figma"],
  "status": "active",
  "averageRating": 4.5,
  "totalReviews": 8,
  "reviews": [],
  "createdAt": "2025-11-28T10:30:00Z",
  "updatedAt": "2025-11-28T10:30:00Z"
}
```

**Error Responses:**
- `404` - Service not found
- `401` - Unauthorized
- `403` - Forbidden (can only view own services)

---

### 4. Update Service

**Endpoint:** `PATCH /talent/services/:id`

**Authentication:** Required ✓

**Request Body:**
```json
{
  "title": "UI/UX Design - Updated",
  "about": "Updated description...",
  "price": "Starting from $750",
  "images": ["https://new-image.jpg"],
  "tags": ["UI Design", "Figma", "Mobile Design"]
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "id": "service-1",
  "talentProfileId": "profile-uuid",
  "title": "UI/UX Design - Updated",
  "about": "Updated description...",
  "price": "Starting from $750",
  "images": ["https://new-image.jpg"],
  "tags": ["UI Design", "Figma", "Mobile Design"],
  "status": "active",
  "averageRating": 4.5,
  "totalReviews": 8,
  "createdAt": "2025-11-28T10:30:00Z",
  "updatedAt": "2025-11-28T10:30:00Z"
}
```

**Error Responses:**
- `404` - Service not found
- `401` - Unauthorized
- `403` - Forbidden (not service owner)

---

### 5. Delete Service

**Endpoint:** `DELETE /talent/services/:id`

**Authentication:** Required ✓

**Parameters:**
- `id` (path) - Service ID

**Response (200 OK):**
```json
{
  "message": "Service deleted successfully"
}
```

**Error Responses:**
- `404` - Service not found
- `401` - Unauthorized
- `403` - Forbidden (not service owner)

---

## Service Discovery

### 1. Get Talent's Services (Public)

**Endpoint:** `GET /talent/:talentId/services`

**Authentication:** Not required ✓

**Parameters:**
- `talentId` (path) - The talent's user ID
- `tags` (query, optional) - Filter by tags (comma-separated)

**Example:**
```
GET /talent/user-123/services?tags=UI Design,Figma
```

**Response (200 OK):**
```json
[
  {
    "id": "service-1",
    "talentProfileId": "user-123",
    "title": "UI/UX Design",
    "about": "Beautiful interface design...",
    "price": "Starting from $500",
    "images": ["https://..."],
    "tags": ["UI Design", "Figma"],
    "status": "active",
    "averageRating": 4.5,
    "totalReviews": 8,
    "createdAt": "2025-11-28T10:30:00Z",
    "updatedAt": "2025-11-28T10:30:00Z"
  }
]
```

**Use Case:** Display a talent's services on their public profile

---

### 2. Search Services by Tags (Public)

**Endpoint:** `GET /talent/services/search/tags`

**Authentication:** Not required ✓

**Query Parameters:**
- `tags` (required) - Comma-separated list of tags to search

**Example:**
```
GET /talent/services/search/tags?tags=React,JavaScript,Frontend
```

**Response (200 OK):**
```json
[
  {
    "id": "service-1",
    "talentProfileId": "profile-1",
    "title": "React Development",
    "about": "Expert React development...",
    "tags": ["React", "JavaScript", "Frontend"],
    "status": "active",
    "averageRating": 4.8,
    "totalReviews": 15,
    "createdAt": "2025-11-28T10:30:00Z"
  },
  {
    "id": "service-2",
    "talentProfileId": "profile-2",
    "title": "Frontend Optimization",
    "about": "Performance and optimization...",
    "tags": ["Frontend", "React", "CSS"],
    "status": "active",
    "averageRating": 4.6,
    "totalReviews": 12,
    "createdAt": "2025-11-27T08:15:00Z"
  }
]
```

**Use Case:** Service marketplace search functionality

---

## Reviews System

### 1. Add Review to Service

**Endpoint:** `POST /talent/services/:id/reviews`

**Authentication:** Required ✓

**Parameters:**
- `id` (path) - Service ID

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work! The designer understood my vision perfectly and delivered amazing results."
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rating | number | Yes | Rating from 1-5 stars |
| comment | string | No | Review comment/feedback |

**Response (201 Created):**
```json
{
  "id": "service-1",
  "talentProfileId": "profile-uuid",
  "title": "UI/UX Design",
  "about": "Beautiful interface design...",
  "price": "Starting from $500",
  "images": ["https://..."],
  "tags": ["UI Design", "Figma"],
  "status": "active",
  "averageRating": 4.7,
  "totalReviews": 9,
  "reviews": [
    {
      "id": "review-1",
      "reviewerId": "user-456",
      "rating": 5,
      "comment": "Excellent work! The designer understood my vision...",
      "createdAt": "2025-11-28T12:00:00Z",
      "updatedAt": "2025-11-28T12:00:00Z"
    }
  ],
  "createdAt": "2025-11-28T10:30:00Z",
  "updatedAt": "2025-11-28T12:00:00Z"
}
```

**Error Responses:**
- `404` - Service not found
- `400` - Invalid review data (rating must be 1-5)
- `401` - Unauthorized

---

### 2. Get Service Reviews

**Endpoint:** `GET /talent/services/:id/reviews`

**Authentication:** Not required ✓

**Parameters:**
- `id` (path) - Service ID

**Response (200 OK):**
```json
{
  "id": "service-1",
  "talentProfileId": "profile-uuid",
  "title": "UI/UX Design",
  "about": "Beautiful interface design...",
  "price": "Starting from $500",
  "images": ["https://..."],
  "tags": ["UI Design", "Figma"],
  "status": "active",
  "averageRating": 4.7,
  "totalReviews": 9,
  "reviews": [
    {
      "id": "review-1",
      "reviewerId": "user-456",
      "rating": 5,
      "comment": "Excellent work!",
      "createdAt": "2025-11-28T12:00:00Z",
      "updatedAt": "2025-11-28T12:00:00Z"
    },
    {
      "id": "review-2",
      "reviewerId": "user-789",
      "rating": 4,
      "comment": "Very good, minor improvements",
      "createdAt": "2025-11-27T10:00:00Z",
      "updatedAt": "2025-11-27T10:00:00Z"
    }
  ],
  "createdAt": "2025-11-28T10:30:00Z",
  "updatedAt": "2025-11-28T12:00:00Z"
}
```

**Use Case:** Display all reviews for a service on its public page

---

### 3. Delete Review

**Endpoint:** `DELETE /talent/services/:id/reviews/:reviewId`

**Authentication:** Required ✓

**Parameters:**
- `id` (path) - Service ID
- `reviewId` (path) - Review ID

**Response (200 OK):**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- `404` - Review not found
- `401` - Unauthorized
- `403` - Forbidden (can only delete own review)

---

## Implementation Examples

### Example 1: Creating a Service (React)

```typescript
import axios from 'axios';

const createService = async (token: string) => {
  try {
    const response = await axios.post(
      'https://api.talentng.com/talent/services',
      {
        title: 'Web Design',
        about: 'Professional web design services...',
        price: 'Starting from $1000',
        images: ['https://example.com/image1.jpg'],
        tags: ['Web Design', 'UI', 'UX']
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Service created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error.response?.data);
    throw error;
  }
};
```

### Example 2: Fetching Services for a Talent Profile (React)

```typescript
const fetchTalentServices = async (talentId: string, tags?: string[]) => {
  try {
    const query = tags ? `?tags=${tags.join(',')}` : '';
    const response = await axios.get(
      `https://api.talentng.com/talent/${talentId}/services${query}`
    );

    console.log('Services:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};
```

### Example 3: Submitting a Review (Vue.js)

```vue
<template>
  <div class="review-form">
    <h3>Leave a Review</h3>
    <form @submit.prevent="submitReview">
      <div class="rating">
        <label>Rating:</label>
        <select v-model="rating" required>
          <option value="">Select rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      <div class="comment">
        <label>Comment:</label>
        <textarea v-model="comment" placeholder="Share your experience..."></textarea>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    serviceId: String,
    token: String
  },
  data() {
    return {
      rating: '',
      comment: '',
      loading: false
    };
  },
  methods: {
    async submitReview() {
      this.loading = true;
      try {
        const response = await axios.post(
          `https://api.talentng.com/talent/services/${this.serviceId}/reviews`,
          {
            rating: parseInt(this.rating),
            comment: this.comment
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );

        this.$emit('review-submitted', response.data);
        this.rating = '';
        this.comment = '';
      } catch (error) {
        console.error('Error submitting review:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

### Example 4: Service Search (Angular)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'https://api.talentng.com/talent/services';

  constructor(private http: HttpClient) {}

  searchByTags(tags: string[]): Observable<any[]> {
    const tagString = tags.join(',');
    return this.http.get<any[]>(
      `${this.apiUrl}/search/tags?tags=${tagString}`
    );
  }

  getTalentServices(talentId: string, tags?: string[]): Observable<any[]> {
    const query = tags ? `?tags=${tags.join(',')}` : '';
    return this.http.get<any[]>(
      `https://api.talentng.com/talent/${talentId}/services${query}`
    );
  }
}
```

---

## UI/UX Patterns

### Service Card Component

**Display Elements:**
- Service title
- Talent name/profile picture
- Service image(s)/gallery
- Price information
- Rating (star display + review count)
- Tags
- Action buttons (View Details, Contact, Add to Favorites)

```tsx
<ServiceCard
  service={{
    id: 'service-1',
    title: 'UI/UX Design',
    price: 'Starting from $500',
    averageRating: 4.5,
    totalReviews: 8,
    images: ['https://...'],
    tags: ['UI Design', 'Figma']
  }}
  onViewDetails={handleViewDetails}
  onContact={handleContact}
/>
```

### Service Detail Page

**Sections:**
1. **Header**
   - Service title
   - Talent name & profile link
   - Star rating + review count link

2. **Gallery**
   - Main image/carousel
   - Thumbnail gallery

3. **Service Info**
   - Full description
   - Price
   - Tags

4. **Reviews Section**
   - List of reviews with ratings
   - "Leave a Review" button (if authenticated)
   - Sorting options (newest, highest rated)

5. **Talent Info**
   - Quick talent profile preview
   - "View Profile" link
   - Contact/Hire button

### Service Management Dashboard (Talent)

**Sections:**
1. **Services List**
   - All services with stats (rating, reviews, status)
   - Quick actions (edit, delete, view details)

2. **Add Service Button**
   - Modal/form to create new service

3. **Service Editor**
   - Edit form with live preview
   - Image upload
   - Tag management

---

## Error Handling

### Standard Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed: price must be a string",
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "You can only edit your own services",
  "error": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Service not found",
  "error": "Not Found"
}
```

### Frontend Error Handling

```typescript
async function handleServiceAction(action: () => Promise<any>) {
  try {
    const result = await action();
    showSuccess('Action completed successfully');
    return result;
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirectToLogin();
    } else if (error.response?.status === 403) {
      showError('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      showError('Service not found');
    } else if (error.response?.status === 400) {
      showError(`Validation error: ${error.response.data.message}`);
    } else {
      showError('An error occurred. Please try again.');
    }
  }
}
```

---

## Best Practices

### 1. Service Creation
- Provide helpful placeholders in form fields
- Allow image drag-and-drop
- Show character count for descriptions
- Validate tags before submission
- Provide tag suggestions based on popular tags

### 2. Service Discovery
- Use infinite scroll or pagination for service lists
- Implement tag filtering with multi-select
- Show rating prominently
- Display review count as social proof
- Cache search results for performance

### 3. Reviews
- Prevent duplicate reviews (one per user per service)
- Display reviewer name (if public)
- Sort reviews by most helpful/recent
- Show review date in human-readable format (e.g., "2 weeks ago")
- Allow review filtering by rating

### 4. Performance
- Lazy load service images
- Implement service list pagination
- Cache service data with appropriate TTL
- Debounce search inputs
- Use request cancellation for navigation

---

## Status Values

Service status can be:
- `active` - Service is published and visible
- `inactive` - Service is unpublished/hidden
- `archived` - Service is archived

Display appropriate UI based on status in the talent's dashboard.

---

## Rate Limiting

No specific rate limits documented, but implement exponential backoff for retries:

```typescript
async function apiCallWithRetry(
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      if (error.response?.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Next Steps

1. Integrate service discovery into talent profile pages
2. Build service management dashboard for talents
3. Create service marketplace search page
4. Implement service comparison feature
5. Add service booking/purchase flow
