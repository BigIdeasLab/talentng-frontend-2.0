# Recommendations & Services Data Flow

## Architecture Overview

```
UI Components → API Hooks/Functions → Centralized API Client → Backend API
```

---

## 1. SERVICES FLOW

### Component Layer
**`ProfileLayout.tsx`** (Main Orchestrator)
- Manages state: `cachedServices`, `servicesLoading`, `serviceRefreshTrigger`
- Renders both visible and hidden `ServicesGrid` components for caching
- Triggers refresh via `handleServiceCreated()` which increments `serviceRefreshTrigger`

**`ServicesGrid.tsx`** (Display Component)
- Props received from `ProfileLayout`:
  - `refreshTrigger`: Triggers re-fetch when incremented
  - `cachedServices`: Cached data from parent
  - `onServicesLoaded`: Callback to store fetched services in parent
  - `isLoading`/`onLoadingChange`: Loading state management
- On mount/refresh: Calls `getMyServices()` API function
- Handles errors with specific HTTP status codes (401, 403, 404)

**`CreateServiceModal.tsx`** (Create Service)
- Form collects: `title`, `about`, `price`, `images[]`, `tags[]`
- On submit: Calls `createService()` API function
- Success callback triggers parent refresh via `onSuccess()`

### API Layer (`lib/api/talent/index.ts`)

**Service Endpoints:**

| Operation | Endpoint | Method | Function |
|-----------|----------|--------|----------|
| Create | `POST /talent/services` | POST | `createService(data)` |
| List My Services | `GET /talent/services` | GET | `getMyServices()` |
| Get One | `GET /talent/services/:id` | GET | `getServiceById(id)` |
| Update | `PATCH /talent/services/:id` | PATCH | `updateService(id, data)` |
| Delete | `DELETE /talent/services/:id` | DELETE | `deleteService(id)` |
| Get Public Services | `GET /talent/:talentId/services` | GET | `getTalentServices(talentId, tags?)` |
| Search by Tags | `GET /talent/services/search/tags` | GET | `searchServicesByTags(tags)` |
| Add Review | `POST /talent/services/:id/reviews` | POST | `addServiceReview(serviceId, data)` |
| Get Reviews | `GET /talent/services/:id/reviews` | GET | `getServiceReviews(serviceId)` |
| Delete Review | `DELETE /talent/services/:id/reviews/:reviewId` | DELETE | `deleteServiceReview(serviceId, reviewId)` |

**Request Payload:**
```typescript
CreateServiceInput {
  title: string;          // Required, max 100 chars
  about: string;          // Required, max 2000 chars
  price?: string;         // Optional, e.g., "Starting from $500"
  images?: string[];      // Optional, max 5 images (base64)
  tags?: string[];        // Optional, predefined or custom
}
```

**Response:**
```typescript
Service {
  id: string;
  talentProfileId: string;
  title: string;
  about: string;
  price?: string;
  images?: string[];
  tags?: string[];
  status: "active" | "inactive" | "archived";
  averageRating: number;
  totalReviews: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
```

### Centralized API Client (`lib/api/index.ts`)

All API calls route through a single client that handles:
- **Base URL**: `process.env.NEXT_PUBLIC_TALENTNG_API_URL` or `/api/v1`
- **Authentication**: Adds `Authorization: Bearer {token}` header
- **Token Refresh**: Automatically refreshes 401 responses
- **Error Handling**: Extracts and formats error messages
- **FormData Support**: Automatically removes `Content-Type` for file uploads

```typescript
const apiClient = async <T>(
  endpoint: string,
  options: {
    headers?: Record<string, string>;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    credentials?: RequestCredentials;
  }
): Promise<T>
```

---

## 2. RECOMMENDATIONS FLOW

### Component Layer
**`ProfileLayout.tsx`** (Main Orchestrator)
- Manages state: `cachedRecommendations`, `recommendationsLoading`
- Renders both visible and hidden `RecommendationsGrid` for caching
- Note: Currently loads **all talent's recommendations** without filtering by current user

**`RecommendationsGrid.tsx`** (Display Component)
- Props received:
  - `talentUserId`: User whose recommendations to fetch
  - `cachedRecommendations`: Parent cached data
  - `onRecommendationsLoaded`: Callback to store fetched data
  - `isLoading`/`onLoadingChange`: Loading state
- Includes **mapping function** `mapApiRecommendationToUI()`:
  - Converts API response to UI format
  - Extracts recommender name from `username` or `email`
  - Formats date from ISO to "MMM DD, YYYY"
  - Uses initials as avatar fallback
  - Creates comment text from `comment` or `title`

### API Layer (`lib/api/talent/index.ts`)

**Recommendation Endpoints:**

| Operation | Endpoint | Method | Function | Auth |
|-----------|----------|--------|----------|------|
| Create | `POST /talent/:talentUserId/recommendations` | POST | `createRecommendation(talentUserId, data)` | Required |
| Get All | `GET /talent/:talentUserId/recommendations` | GET | `getTalentRecommendations(talentUserId)` | Not required |
| Get Stats | `GET /talent/:talentUserId/recommendations/stats` | GET | `getRecommendationStats(talentUserId)` | Not required |
| Delete | `DELETE /talent/recommendations/:recommendationId` | DELETE | `deleteRecommendation(recommendationId)` | Required |

**Request Payload:**
```typescript
CreateRecommendationDto {
  title: string;        // Required
  comment?: string;     // Optional
  rating?: number;      // Optional
}
```

**Response:**
```typescript
TalentRecommendationDto {
  id: string;
  talentProfileId: string;
  title: string;
  comment?: string;
  rating?: number;
  isVerified: boolean;
  recommendedBy: {
    id: string;
    username?: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Stats Response
RecommendationStatsDto {
  totalCount: number;
  averageRating?: number;
  verifiedCount: number;
  topSkills?: string[];
}
```

---

## 3. DATA FLOW DIAGRAMS

### Create Service Flow
```
CreateServiceModal.tsx
  ↓ handleSubmit()
  ↓ createService(formData)
  ↓ lib/api/talent/index.ts
  ↓ apiClient.POST("/talent/services")
  ↓ lib/api/index.ts (centralized)
  ↓ fetch() with auth headers
  ↓ Backend API
  ↓ Success: onSuccess() callback
  ↓ ProfileLayout: handleServiceCreated()
  ↓ Increment serviceRefreshTrigger
  ↓ ServicesGrid: Re-fetch via getMyServices()
```

### Fetch Services Flow
```
ProfileLayout.tsx mounts/activeTab changes
  ↓ ServicesGrid renders
  ↓ useEffect triggered (cached → no fetch)
  ↓ OR no cache → getMyServices()
  ↓ lib/api/talent/index.ts
  ↓ apiClient.GET("/talent/services")
  ↓ lib/api/index.ts (centralized)
  ↓ fetch() with auth headers + token refresh logic
  ↓ Backend API
  ↓ Response: Service[]
  ↓ ServicesGrid: setState(services)
  ↓ onServicesLoaded(services) callback
  ↓ ProfileLayout: setCachedServices(services)
```

### Fetch Recommendations Flow
```
ProfileLayout.tsx mounts/activeTab changes
  ↓ RecommendationsGrid renders
  ↓ useEffect triggered (cached → no fetch)
  ↓ OR no cache + talentUserId → getTalentRecommendations(talentUserId)
  ↓ lib/api/talent/index.ts
  ↓ apiClient.GET("/talent/:talentUserId/recommendations")
  ↓ lib/api/index.ts (centralized)
  ↓ fetch() (no auth required, public endpoint)
  ↓ Backend API
  ↓ Response: TalentRecommendationDto[]
  ↓ mapApiRecommendationToUI() transformation
  ↓ RecommendationsGrid: setState(recommendations)
  ↓ onRecommendationsLoaded(recommendations) callback
  ↓ ProfileLayout: setCachedRecommendations(recommendations)
```

---

## 4. Error Handling

### Services Grid Error Handling
```javascript
// lib/api/index.ts throws error with status attached
const error = new Error(errorMessage);
(error as any).status = response.status;

// ServicesGrid catches and handles by status:
if (errorStatus === 404) {
  // Empty state (endpoint may not exist yet)
  setError(null);
} else if (errorStatus === 401) {
  setError("Please log in to view your services");
} else if (errorStatus === 403) {
  setError("You don't have permission to view these services");
} else {
  setError(err.message);
}
```

### API Client Error Handling
```javascript
// Auto-refreshes on 401
if (response.status === 401) {
  // Fetch /auth/refresh
  // Update auth cookie
  // Retry original request
  // On failure: redirect to /login
}

// Friendly error messages for common issues
if (errorMessage.includes("Transaction already closed")) {
  errorMessage = "The request took too long...";
} else if (response.status === 500) {
  errorMessage = "Server error. Please try again later.";
}
```

---

## 5. Caching Strategy

### Profile Layout Caching
```typescript
// Services
const [cachedServices, setCachedServices] = useState<any[]>([]);
const [serviceRefreshTrigger, setServiceRefreshTrigger] = useState(0);

// Recommendations
const [cachedRecommendations, setCachedRecommendations] = useState<any[]>([]);

// Keep components hidden but rendered to maintain cache
{activeTab !== "services" && (
  <div className="hidden">
    <ServicesGrid
      cachedServices={cachedServices}
      onServicesLoaded={setCachedServices}
      refreshTrigger={serviceRefreshTrigger}
    />
  </div>
)}
```

### Child Component Caching
```typescript
// ServicesGrid/RecommendationsGrid
useEffect(() => {
  // If cached data exists, use it immediately (no loading state)
  if (cachedServices.length > 0) {
    setServices(cachedServices);
    setIsLoading(false);
    return;
  }

  // Otherwise fetch fresh data
  const data = await getMyServices();
  setServices(data || []);
  onServicesLoaded?.(data); // Update parent cache
}, [refreshTrigger, cachedServices.length]);
```

---

## 6. Key Files Reference

| File | Purpose |
|------|---------|
| `components/business/Profile/ProfileLayout.tsx` | Main orchestrator, state management |
| `components/business/Profile/ServicesGrid.tsx` | Displays services, triggers fetches |
| `components/business/Profile/RecommendationsGrid.tsx` | Displays recommendations, API mapping |
| `components/business/Profile/CreateServiceModal.tsx` | Form to create new services |
| `lib/api/talent/index.ts` | All talent-related API functions (20+ endpoints) |
| `lib/api/talent/types.ts` | TypeScript interfaces for services/recommendations |
| `lib/api/index.ts` | Centralized API client with auth & token refresh |
| `lib/api/talent/server.ts` | Server-side API helpers |

---

## 7. Common Issues & Solutions

### Issue: Services not loading
**Cause**: 404 error (endpoint may not exist)
**Solution**: Handled gracefully as empty state in ServicesGrid

### Issue: Stale data after create
**Solution**: `serviceRefreshTrigger` increments on success, triggering fresh fetch

### Issue: Multiple requests on tab switch
**Solution**: Hidden `<div className="hidden">` keeps components mounted for caching

### Issue: Token expired mid-request
**Solution**: API client automatically refreshes token and retries

### Issue: Recommendations loaded but no avatar
**Solution**: Component displays initials as fallback when `recommendation.avatar` is empty

---

## 8. API Base URL Configuration

```typescript
// lib/api/index.ts
const baseUrl = process.env.NEXT_PUBLIC_TALENTNG_API_URL || "/api/v1";

// Usage in .env.local
NEXT_PUBLIC_TALENTNG_API_URL=https://api.talentng.com/api/v1
```

All service/recommendation endpoints are prefixed with this base URL.

---

## 9. Type Safety

All functions are fully typed:
```typescript
export async function getMyServices(): Promise<Service[]>
export async function createService(data: CreateServiceInput): Promise<Service>
export async function getTalentRecommendations(talentUserId: string): Promise<TalentRecommendationDto[]>
```

Request/response types are exported from `lib/api/talent/types.ts` for reuse in components.
