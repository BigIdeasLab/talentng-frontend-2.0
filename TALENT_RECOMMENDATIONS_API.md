# Talent Recommendations API

This document outlines all API endpoints for talent recommendations on the Talent.ng backend.

## Base URL

```
http://localhost:3000/api/v1/talent
```

## Endpoints

### 1. Create a Recommendation

**Endpoint:** `POST /talent/:talentUserId/recommendations`

**Authentication:** Required (JWT Bearer Token)

**Description:** Drop a verified recommendation on a talent. Only recruiters who have hired this talent can recommend.

**Parameters:**
- `talentUserId` (URL param): The user ID of the talent being recommended

**Request Body:**
```json
{
  "title": "string",          // Required. Skill/title being recommended (e.g., "UI Design", "Backend Development")
  "comment": "string",        // Optional. Detailed comment about the recommendation
  "rating": number            // Optional. Rating from 1 to 5 stars
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/talent/user-123/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Development",
    "comment": "Excellent developer, very reliable and detail-oriented",
    "rating": 5
  }'
```

**Response (201 Created):**
```json
{
  "id": "rec-123",
  "talentProfileId": "user-123",
  "title": "Full Stack Development",
  "comment": "Excellent developer, very reliable and detail-oriented",
  "rating": 5,
  "isVerified": true,
  "recommendedBy": {
    "id": "recruiter-456",
    "username": "john_recruiter",
    "email": "john@example.com"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Talent profile or user not found
- `403 Forbidden`: Only recruiters who have hired this talent can recommend
- `409 Conflict`: Duplicate recommendation for the same skill

---

### 2. Get All Recommendations for a Talent

**Endpoint:** `GET /talent/:talentUserId/recommendations`

**Authentication:** Not required (Public endpoint)

**Description:** Retrieve all recommendations for a specific talent profile.

**Parameters:**
- `talentUserId` (URL param): The user ID of the talent

**Example Request:**
```bash
curl http://localhost:3000/api/v1/talent/user-123/recommendations
```

**Response (200 OK):**
```json
[
  {
    "id": "rec-123",
    "talentProfileId": "user-123",
    "title": "Full Stack Development",
    "comment": "Excellent developer, very reliable and detail-oriented",
    "rating": 5,
    "isVerified": true,
    "recommendedBy": {
      "id": "recruiter-456",
      "username": "john_recruiter",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "rec-124",
    "talentProfileId": "user-123",
    "title": "UI/UX Design",
    "comment": "Great eye for design, very creative",
    "rating": 4,
    "isVerified": true,
    "recommendedBy": {
      "id": "recruiter-789",
      "username": "jane_recruiter",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-20T14:00:00Z",
    "updatedAt": "2024-01-20T14:00:00Z"
  }
]
```

**Error Responses:**
- `404 Not Found`: Talent profile not found

---

### 3. Get Recommendation Statistics

**Endpoint:** `GET /talent/:talentUserId/recommendations/stats`

**Authentication:** Not required (Public endpoint)

**Description:** Get recommendation statistics for a talent profile including total count, average rating, verified count, and top skills.

**Parameters:**
- `talentUserId` (URL param): The user ID of the talent

**Example Request:**
```bash
curl http://localhost:3000/api/v1/talent/user-123/recommendations/stats
```

**Response (200 OK):**
```json
{
  "totalCount": 10,
  "averageRating": 4.6,
  "verifiedCount": 10,
  "topSkills": [
    "Backend Development",
    "Full Stack Development",
    "Problem Solving"
  ]
}
```

**Error Responses:**
- `404 Not Found`: Talent profile not found

---

### 4. Delete a Recommendation

**Endpoint:** `DELETE /talent/recommendations/:recommendationId`

**Authentication:** Required (JWT Bearer Token)

**Description:** Delete a recommendation you gave. You can only delete your own recommendations.

**Parameters:**
- `recommendationId` (URL param): The ID of the recommendation to delete

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/talent/recommendations/rec-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "Recommendation deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Recommendation not found
- `409 Conflict`: Can only delete your own recommendations

---

## Data Models

### TalentRecommendationDto

```typescript
{
  id: string;                    // Unique identifier
  talentProfileId: string;       // ID of the talent being recommended
  title: string;                 // Skill/title being recommended
  comment?: string;              // Optional comment
  rating?: number;               // Optional rating (1-5)
  isVerified: boolean;           // Whether recommendation is verified
  recommendedBy: {
    id: string;                  // Recommender's user ID
    username?: string;           // Recommender's username
    email: string;               // Recommender's email
  };
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### RecommendationStatsDto

```typescript
{
  totalCount: number;            // Total recommendations
  averageRating?: number;        // Average rating (if ratings exist)
  verifiedCount: number;         // Count of verified recommendations
  topSkills?: string[];          // Top recommended skills by frequency
}
```

### CreateRecommendationDto (Request Body)

```typescript
{
  title: string;                 // Required. Skill being recommended
  comment?: string;              // Optional. Detailed comment
  rating?: number;               // Optional. Rating 1-5
}
```

---

## Authentication

All endpoints that require authentication use **JWT Bearer Token** in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 404 | Not Found - Resource not found |
| 403 | Forbidden - No permission to perform action |
| 409 | Conflict - Operation conflicts with existing data |

---

## Frontend Usage Examples

### React/TypeScript Example

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1/talent';

// Create a recommendation
export const createRecommendation = async (
  talentUserId: string,
  data: {
    title: string;
    comment?: string;
    rating?: number;
  },
  token: string
) => {
  const response = await axios.post(
    `${API_BASE}/${talentUserId}/recommendations`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Get recommendations for a talent
export const getTalentRecommendations = async (talentUserId: string) => {
  const response = await axios.get(
    `${API_BASE}/${talentUserId}/recommendations`
  );
  return response.data;
};

// Get recommendation stats
export const getRecommendationStats = async (talentUserId: string) => {
  const response = await axios.get(
    `${API_BASE}/${talentUserId}/recommendations/stats`
  );
  return response.data;
};

// Delete a recommendation
export const deleteRecommendation = async (
  recommendationId: string,
  token: string
) => {
  const response = await axios.delete(
    `${API_BASE}/recommendations/${recommendationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
```

---

## Notes

- Recommendations are auto-verified when created by recruiters who have hired the talent
- Users can only delete their own recommendations
- A recruiter cannot give duplicate recommendations for the same skill to the same talent
- All timestamps are in UTC format (ISO 8601)
