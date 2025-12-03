# Mentor API Endpoints Documentation

## Overview
The Mentor API provides endpoints for managing mentor profiles, mentor availability, mentor bookings, and searching for mentors. Endpoints are categorized into public (no authentication) and protected (JWT authentication required).

---

## Endpoints

### 1. Get All Mentors

**Endpoint:** `GET /mentor`

**Description:** Retrieves a list of all mentors. This is a public endpoint.

**Authentication:** Not Required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Response Status:** 
- `200 OK` - Mentors retrieved successfully

**Response Body (Success):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "username": "promise_mentor",
    "expertise": ["Product Design", "UX Design", "Figma"],
    "mentorshipTopics": ["Career Guidance", "Portfolio Review", "Design Critique"],
    "bio": "Product Designer & UX Consultant passionate about helping others",
    "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/62a092bd6bc517738cffbf8ef4fbcb6b.jpg",
    "links": {
      "linkedIn": "https://linkedin.com/in/promise",
      "website": "https://promiseportfolio.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:22:00Z"
  },
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "223e4567-e89b-12d3-a456-426614174001",
    "username": "john_mentor",
    "expertise": ["Software Development", "Python", "React"],
    "mentorshipTopics": ["Mock Interviews", "Code Review", "Career Path"],
    "bio": "Senior Software Engineer with 10+ years experience",
    "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/another-image.jpg",
    "links": {
      "linkedIn": "https://linkedin.com/in/john"
    },
    "createdAt": "2024-02-10T08:15:00Z",
    "updatedAt": "2024-02-20T16:45:00Z"
  }
]
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/mentor \
  -H "Content-Type: application/json"
```

---

### 2. Search Mentors

**Endpoint:** `GET /mentor/search`

**Description:** Search for mentors using a query string. Returns matching mentor profiles.

**Authentication:** Not Required

**Request Headers:**
```
Content-Type: application/json
```

**Query Parameters:**
- `q` (string, optional) - Search query (searches through expertise, bio, location, name)

**Request Body:** None

**Response Status:**
- `200 OK` - Mentors found

**Response Body (Success):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "username": "promise_mentor",
    "expertise": ["Product Design", "UX Design"],
    "mentorshipTopics": ["Portfolio Review", "Design Critique"],
    "bio": "Product Designer & UX Consultant",
    "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/62a092bd.jpg",
    "links": {"linkedIn": "https://linkedin.com/in/promise"},
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:22:00Z"
  }
]
```

**Example cURL:**
```bash
curl -X GET "http://localhost:3000/mentor/search?q=product%20design" \
  -H "Content-Type: application/json"
```

---

### 3. Get Authenticated User's Mentor Profile

**Endpoint:** `GET /mentor/me`

**Description:** Retrieves the authenticated user's mentor profile.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:** None

**Response Status:**
- `200 OK` - Profile retrieved successfully
- `404 Not Found` - Mentor profile not found

**Response Body (Success):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "username": "promise_mentor",
  "expertise": ["Product Design", "UX Design", "Figma"],
  "mentorshipTopics": ["Career Guidance", "Portfolio Review", "Design Critique"],
  "bio": "Product Designer & UX Consultant passionate about helping others",
  "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/62a092bd6bc517738cffbf8ef4fbcb6b.jpg",
  "links": {
    "linkedIn": "https://linkedin.com/in/promise",
    "website": "https://promiseportfolio.com"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z"
}
```

**Response Body (Error 404):**
```json
{
  "statusCode": 404,
  "message": "Mentor profile not found",
  "error": "Not Found"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/mentor/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### 4. Update Authenticated User's Mentor Profile

**Endpoint:** `PATCH /mentor/me`

**Description:** Updates the authenticated user's mentor profile.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body Schema:**
```typescript
{
  expertise?: string[];                    // Optional - Areas of expertise
  mentorshipTopics?: string[];            // Optional - Topics mentor can teach
  bio?: string;                           // Optional - Biography
  profileImageUrl?: string;               // Optional - Profile image URL
  links?: any;                            // Optional - Social media and website links
  fullName?: string;                      // Optional - Full name
  company?: string;                       // Optional - Current company
  description?: string;                   // Optional - Short description
  headline?: string;                      // Optional - Professional headline
  location?: string;                      // Optional - Location
}
```

**Request Body Example:**
```json
{
  "expertise": ["Product Design", "UX Design", "Figma", "Prototyping"],
  "mentorshipTopics": ["Career Guidance", "Portfolio Review", "Design Critique"],
  "bio": "Product Designer & UX Consultant passionate about helping others grow in design",
  "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/new-image.jpg",
  "fullName": "Promise Olaifa",
  "company": "ConnectNigeria",
  "description": "Product Designer specializing in user-centered design",
  "headline": "Product Designer & UX Consultant",
  "location": "Lagos, Nigeria 🇳🇬",
  "links": {
    "linkedIn": "https://linkedin.com/in/promise",
    "website": "https://promiseportfolio.com",
    "twitter": "https://twitter.com/promise"
  }
}
```

**Response Status:**
- `200 OK` - Profile updated successfully
- `404 Not Found` - Mentor profile or user not found

**Response Body (Success):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "username": "promise_mentor",
  "expertise": ["Product Design", "UX Design", "Figma", "Prototyping"],
  "mentorshipTopics": ["Career Guidance", "Portfolio Review", "Design Critique"],
  "bio": "Product Designer & UX Consultant passionate about helping others grow in design",
  "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/new-image.jpg",
  "links": {
    "linkedIn": "https://linkedin.com/in/promise",
    "website": "https://promiseportfolio.com",
    "twitter": "https://twitter.com/promise"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

**Example cURL:**
```bash
curl -X PATCH http://localhost:3000/mentor/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "expertise": ["Product Design", "UX Design"],
    "mentorshipTopics": ["Career Guidance", "Portfolio Review"],
    "bio": "Product Designer passionate about helping others",
    "location": "Lagos, Nigeria"
  }'
```

---

### 5. Get Mentor Profile by ID

**Endpoint:** `GET /mentor/:id`

**Description:** Retrieves a public mentor profile by ID. No authentication required.

**Authentication:** Not Required

**Request Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - The mentor profile ID

**Request Body:** None

**Response Status:**
- `200 OK` - Profile retrieved successfully
- `404 Not Found` - Mentor profile not found

**Response Body (Success):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "username": "promise_mentor",
  "expertise": ["Product Design", "UX Design", "Figma"],
  "mentorshipTopics": ["Career Guidance", "Portfolio Review", "Design Critique"],
  "bio": "Product Designer & UX Consultant passionate about helping others",
  "profileImageUrl": "https://api.builder.io/api/v1/image/assets/TEMP/62a092bd.jpg",
  "links": {"linkedIn": "https://linkedin.com/in/promise"},
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/mentor/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

---

### 6. Set Mentor Availability

**Endpoint:** `PUT /mentor/availability`

**Description:** Sets the mentor's available time slots for bookings. Replaces all existing availability slots.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body Schema:**
```typescript
{
  slots: Array<{
    startTime: string;    // ISO 8601 datetime string
    endTime: string;      // ISO 8601 datetime string
  }>
}
```

**Request Body Example:**
```json
{
  "slots": [
    {
      "startTime": "2025-12-01T09:00:00.000Z",
      "endTime": "2025-12-01T10:00:00.000Z"
    },
    {
      "startTime": "2025-12-01T14:00:00.000Z",
      "endTime": "2025-12-01T15:30:00.000Z"
    },
    {
      "startTime": "2025-12-02T09:00:00.000Z",
      "endTime": "2025-12-02T12:00:00.000Z"
    }
  ]
}
```

**Response Status:**
- `200 OK` - Availability set successfully
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - User is not a mentor

**Response Body (Success):**
```json
[
  {
    "id": "avail-001",
    "mentorId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2025-12-01T09:00:00.000Z",
    "endTime": "2025-12-01T10:00:00.000Z",
    "isRecurring": false
  },
  {
    "id": "avail-002",
    "mentorId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2025-12-01T14:00:00.000Z",
    "endTime": "2025-12-01T15:30:00.000Z",
    "isRecurring": false
  }
]
```

**Example cURL:**
```bash
curl -X PUT http://localhost:3000/mentor/availability \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "slots": [
      {
        "startTime": "2025-12-01T09:00:00.000Z",
        "endTime": "2025-12-01T10:00:00.000Z"
      },
      {
        "startTime": "2025-12-01T14:00:00.000Z",
        "endTime": "2025-12-01T15:30:00.000Z"
      }
    ]
  }'
```

---

### 7. Get Mentor's Available Slots

**Endpoint:** `GET /mentor/:id/availability`

**Description:** Retrieves available time slots for a specific mentor. Filters out booked slots and rounds to 30-minute intervals.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - The mentor profile ID

**Request Body:** None

**Response Status:**
- `200 OK` - Available slots retrieved
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Mentor not found

**Response Body (Success):**
```json
[
  {
    "startTime": "2025-12-01T09:00:00.000Z",
    "endTime": "2025-12-01T09:30:00.000Z"
  },
  {
    "startTime": "2025-12-01T09:30:00.000Z",
    "endTime": "2025-12-01T10:00:00.000Z"
  },
  {
    "startTime": "2025-12-01T14:00:00.000Z",
    "endTime": "2025-12-01T14:30:00.000Z"
  },
  {
    "startTime": "2025-12-01T14:30:00.000Z",
    "endTime": "2025-12-01T15:00:00.000Z"
  }
]
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/mentor/550e8400-e29b-41d4-a716-446655440000/availability \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### 8. Create Booking with Mentor

**Endpoint:** `POST /mentor/booking`

**Description:** Books a mentoring session with a mentor. Creates a booking for a 30-minute slot and sends notifications to both mentor and mentee.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body Schema:**
```typescript
{
  mentorId: string;    // UUID of the mentor profile
  startTime: string;   // ISO 8601 datetime string (must be on an available slot)
  topic?: string;      // Optional - Topic of discussion
  note?: string;       // Optional - Additional notes
}
```

**Request Body Example:**
```json
{
  "mentorId": "550e8400-e29b-41d4-a716-446655440000",
  "startTime": "2025-12-01T09:00:00.000Z",
  "topic": "Portfolio Review",
  "note": "I'd like feedback on my recent UX case study"
}
```

**Response Status:**
- `201 Created` - Booking created successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Mentor not found
- `409 Conflict` - Time slot is no longer available or overlapping booking exists

**Response Body (Success):**
```json
{
  "id": "booking-001",
  "menteeId": "456e7890-e89b-12d3-a456-426614174555",
  "mentorId": "550e8400-e29b-41d4-a716-446655440000",
  "startTime": "2025-12-01T09:00:00.000Z",
  "endTime": "2025-12-01T09:30:00.000Z",
  "status": "confirmed",
  "topic": "Portfolio Review",
  "note": "I'd like feedback on my recent UX case study"
}
```

**Response Body (Error 409):**
```json
{
  "statusCode": 409,
  "message": "This time slot is no longer available.",
  "error": "Conflict"
}
```

**Notifications Sent:**
- **Mentee:** `booking_confirmed` - Email + In-app notification
- **Mentor:** `booking_confirmed` - Email + In-app notification

**Example cURL:**
```bash
curl -X POST http://localhost:3000/mentor/booking \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "mentorId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2025-12-01T09:00:00.000Z",
    "topic": "Portfolio Review",
    "note": "I would like feedback on my case study"
  }'
```

---

## Data Models

### MentorProfile DTO

**Response Model (MentorProfileDto):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier of the mentor profile |
| `userId` | string (UUID) | Yes | User ID associated with the profile |
| `username` | string | Yes | Username of the user |
| `expertise` | string[] | No | Areas of expertise (e.g., "Product Design", "UX") |
| `mentorshipTopics` | string[] | No | Topics the mentor can teach |
| `bio` | string \| null | No | Biography of the mentor |
| `profileImageUrl` | string \| null | No | URL of the mentor's profile image |
| `links` | object \| null | No | Social media and website links (JSON) |
| `createdAt` | Date (ISO 8601) | Yes | Timestamp when the profile was created |
| `updatedAt` | Date (ISO 8601) | Yes | Timestamp when the profile was last updated |

---

### Update Mentor Profile DTO

**Request Model (UpdateMentorProfileDto):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `expertise` | string[] | No | Areas of expertise (e.g., "Mentoring", "Resume feedback") |
| `mentorshipTopics` | string[] | No | Topics mentor can provide guidance on |
| `bio` | string | No | Biography/description of the mentor |
| `profileImageUrl` | string (URL) | No | URL of profile image (must be valid URL) |
| `links` | object | No | Social links and website URLs (JSON object) |
| `fullName` | string | No | Full name of the mentor |
| `company` | string | No | Current company/organization |
| `description` | string | No | Short description of mentor |
| `headline` | string | No | Professional headline (e.g., "Product Designer") |
| `location` | string | No | Geographic location (e.g., "Lagos, Nigeria") |

---

### Set Availability DTO

**Request Model (SetAvailabilityDto):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slots` | AvailabilitySlot[] | Yes | Array of availability slots |
| `slots[].startTime` | string (ISO 8601) | Yes | Start time of the slot |
| `slots[].endTime` | string (ISO 8601) | Yes | End time of the slot |

**Example:**
```json
{
  "slots": [
    {
      "startTime": "2025-12-01T09:00:00.000Z",
      "endTime": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

---

### Create Booking DTO

**Request Model (CreateBookingDto):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mentorId` | string (UUID) | Yes | ID of the mentor profile |
| `startTime` | string (ISO 8601) | Yes | Start time of the booking (must be in available slot) |
| `topic` | string | No | Topic of discussion for the session |
| `note` | string | No | Additional notes or context |

---

## Database Schema

### MentorProfile Model

```prisma
model MentorProfile {
  id                 String               @id @default(uuid())
  userId             String               @unique
  fullName           String?
  headline           String?
  bio                String?
  expertise          String[]             // Array of expertise areas
  experience         Json[]               // Array of experience records
  location           String?
  links              Json?                // JSON object for social links
  visibility         Visibility           @default(public)
  isFeatured         Boolean              @default(false)
  featuredUntil      DateTime?
  views              Int                  @default(0)
  coverImageUrl      String?
  profileImageUrl    String?              // Default profile image URL
  company            String?
  description        String?
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  deletedAt          DateTime?
  mentorshipTopics   String[]
  bookings           Booking[]            // One-to-many relation
  mentorAvailability MentorAvailability[] // One-to-many relation
  user               User                 // One-to-one relation
}
```

### MentorAvailability Model

```prisma
model MentorAvailability {
  id          String        @id @default(uuid())
  mentorId    String
  startTime   DateTime
  endTime     DateTime
  isRecurring Boolean       @default(false)
  dayOfWeek   Int?          // 0-6 for recurring slots
  mentor      MentorProfile @relation(fields: [mentorId], references: [id], onDelete: Cascade)

  @@index([mentorId])
}
```

### Booking Model

```prisma
model Booking {
  id        String        @id @default(uuid())
  menteeId  String
  mentorId  String
  startTime DateTime
  endTime   DateTime
  status    BookingStatus @default(confirmed) // confirmed, cancelled, completed
  note      String?
  topic     String?
  mentee    User          @relation("MenteeBookings", fields: [menteeId], references: [id], onDelete: Cascade)
  mentor    MentorProfile @relation("MentorBookings", fields: [mentorId], references: [id], onDelete: Cascade)
}
```

---

## Authentication

### JWT Token Requirements

All authenticated endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Token Payload Structure:**
```json
{
  "id": "user-uuid",
  "roles": ["mentor"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Guard Used:** `JwtAuthGuard`

**Decorator Used:** `@CurrentUser()` or `@Request()` - Extracts the current user's ID and roles from the JWT token

---

## Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 404,
  "message": "Error message",
  "error": "Error type"
}
```

### Common Error Codes

| Status Code | Error | Description |
|---|---|---|
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User is not authorized for this action |
| 404 | Not Found | Mentor profile, user, or booking not found |
| 409 | Conflict | Time slot is already booked or overlapping |
| 500 | Internal Server Error | Server-side error |

---

## Audit Logging

When a mentor profile is updated via the `PATCH /mentor/me` endpoint, an audit log entry is created with:

- **Action:** `user.update_profile`
- **Entity:** `mentor_profiles`
- **EntityId:** Profile ID
- **UserId:** User ID performing the update
- **Timestamp:** Automatically recorded

---

## Notification System

### Booking Notifications

When a booking is created, the system automatically sends notifications to both the mentee and mentor:

**Mentee Notification:**
- **Type:** `booking_confirmed`
- **Channels:** In-app + Email
- **Message:** `Your booking with mentor {mentorName} is confirmed for {dateTime}`
- **Payload:** `{ message, bookingId }`

**Mentor Notification:**
- **Type:** `booking_confirmed`
- **Channels:** In-app + Email
- **Message:** `You have a new booking with a mentee for {dateTime}`
- **Payload:** `{ message, bookingId }`

---

## Service Methods

### Search Service

**Method:** `search(query: string)`

Searches for mentors using full-text search on expertise, bio, location, and name fields.

**Parameters:**
- `query` (string): Search query

**Returns:** Array of MentorProfileDto

---

### Create Mentor Profile

**Method:** `createMentorProfile(userId, data, tx?)`

Creates or updates a mentor profile.

**Parameters:**
- `userId` (string): The ID of the user
- `data` (object):
  - `expertise` (string): Primary expertise
  - `experience` (string): Experience description
  - `mentorshipStyle` (string): Teaching style/description
  - `linkedIn` (string): LinkedIn URL
  - `fullName` (string): Full name
  - `bio` (string): Biography
  - `location` (string): Location
- `tx?` (PrismaClient): Optional transaction client

**Returns:** Created/updated MentorProfile record

---

### Get Mentor Profile

**Method:** `getMentorProfile(userId: string)`

Retrieves a mentor profile by user ID.

**Parameters:**
- `userId` (string): The ID of the user

**Returns:** `MentorProfileDto | null`

---

### Get Mentor Profile by ID

**Method:** `getMentorProfileById(id: string)`

Retrieves a mentor profile by profile ID.

**Parameters:**
- `id` (string): The ID of the mentor profile

**Returns:** `MentorProfileDto | null`

---

### Update Mentor Profile

**Method:** `updateMentorProfile(userId, data)`

Updates a mentor profile and creates an audit log entry.

**Parameters:**
- `userId` (string): The ID of the user
- `data` (UpdateMentorProfileDto): Update payload

**Returns:** `MentorProfileDto`

**Throws:** `NotFoundException` if user doesn't exist

---

### Find All Mentors

**Method:** `findAll()`

Retrieves all mentor profiles.

**Returns:** Array of `MentorProfileDto`

---

### Set Availability

**Method:** `setAvailability(userId, availabilityData)`

Sets mentor availability slots. Deletes all existing slots and creates new ones.

**Parameters:**
- `userId` (string): The ID of the mentor user
- `availabilityData` (SetAvailabilityDto): Availability slot data

**Returns:** Array of created MentorAvailability records

**Throws:** `NotFoundException` if mentor profile not found

---

### Get Available Slots

**Method:** `getAvailableSlots(mentorId: string)`

Gets available 30-minute time slots for a mentor. Automatically:
- Filters out booked slots
- Rounds times to nearest 30 minutes
- Only includes future bookings

**Parameters:**
- `mentorId` (string): The ID of the mentor profile

**Returns:** Array of `{ startTime, endTime }` objects

**Throws:** `NotFoundException` if mentor not found

---

### Create Booking

**Method:** `createBooking(menteeId, createBookingDto)`

Creates a booking with a mentor. Automatically creates a 30-minute slot and sends notifications.

**Parameters:**
- `menteeId` (string): The ID of the mentee/user booking
- `createBookingDto` (CreateBookingDto):
  - `mentorId` (string): Target mentor ID
  - `startTime` (string): ISO 8601 datetime
  - `topic?` (string): Discussion topic
  - `note?` (string): Additional notes

**Returns:** Created Booking record

**Throws:**
- `NotFoundException` if mentor not found
- `ConflictException` if time slot is already booked or overlapping

**Side Effects:**
- Creates booking in database
- Sends notifications to mentor and mentee
- Updates mentor availability calendar

---

## Implementation Details

### Module Structure

```
src/modules/mentor/
├── mentor.controller.ts         # Endpoint handlers
├── mentor.service.ts            # Business logic
├── mentor.module.ts             # Module configuration
└── dto/
    ├── mentor-profile.dto.ts            # Response DTO
    ├── update-mentor-profile.dto.ts     # Update request DTO
    ├── set-availability.dto.ts          # Availability request DTO
    ├── create-booking.dto.ts            # Booking request DTO
    ├── create-mentor-profile.dto.ts     # Create request DTO (empty)
    └── index.ts                          # DTO exports
```

### Key Features

1. **JWT Authentication** - Protected endpoints require valid JWT tokens
2. **Full-Text Search** - Search mentors by expertise, location, name
3. **Availability Management** - Mentors set availability, system calculates 30-minute slots
4. **Smart Booking** - Automatic conflict detection and 30-minute slot assignment
5. **Audit Logging** - All profile updates are logged
6. **Notifications** - Automatic email and in-app notifications for bookings
7. **Profile Visibility** - Profiles can be marked as public/private
8. **Featured Profiles** - Support for featuring mentors with expiration dates
9. **View Tracking** - Tracks number of times a profile is viewed
10. **Soft Deletes** - Logical deletion via `deletedAt` field

---

## Integration Points

The Mentor module integrates with:

1. **User Module** - For user onboarding and profile creation
2. **Audit Log Module** - For tracking profile updates
3. **Search Module** - For full-text search indexing
4. **Notification Module** - For sending booking confirmations
5. **JWT Auth Guard** - For authentication on protected endpoints
6. **Prisma Service** - For database operations

---

## Example Workflow

### Complete Mentor Booking Flow

```bash
# 1. Mentor logs in and receives JWT token
# TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Mentor gets their profile
curl -X GET http://localhost:3000/mentor/me \
  -H "Authorization: Bearer TOKEN"

# 3. Mentor updates their profile
curl -X PATCH http://localhost:3000/mentor/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "expertise": ["Product Design", "UX"],
    "bio": "10+ years in design",
    "location": "Lagos, Nigeria"
  }'

# 4. Mentor sets availability
curl -X PUT http://localhost:3000/mentor/availability \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slots": [
      {
        "startTime": "2025-12-01T09:00:00Z",
        "endTime": "2025-12-01T12:00:00Z"
      }
    ]
  }'

# 5. Client searches for mentors
curl -X GET "http://localhost:3000/mentor/search?q=product%20design"

# 6. Client views mentor profile
curl -X GET http://localhost:3000/mentor/550e8400-e29b-41d4-a716-446655440000

# 7. Client gets available slots
curl -X GET http://localhost:3000/mentor/550e8400-e29b-41d4-a716-446655440000/availability \
  -H "Authorization: Bearer CLIENT_TOKEN"

# 8. Client books a slot
curl -X POST http://localhost:3000/mentor/booking \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mentorId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2025-12-01T09:00:00Z",
    "topic": "Portfolio Review"
  }'

# Both mentor and client receive notifications about the confirmed booking
```

---

## Configuration

The Mentor module is registered in the main application module:

```typescript
// src/app.module.ts
@Module({
  imports: [
    MentorModule,
    // ... other modules
  ],
})
export class AppModule {}
```

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone (Z suffix)
- UUIDs are used for all ID fields
- Booking slots are automatically set to 30 minutes
- Availability times are rounded to nearest 30 minutes when calculating available slots
- The `links` field in the database is a JSON object supporting arbitrary social media links
- Profiles support soft deletes but are still returned in queries (check `deletedAt` field)
- Search is case-insensitive and full-text
- Booking conflicts are automatically detected and prevented
- Default profile image URL is provided automatically
- Maximum of 100 available slots are calculated per mentor
- Past bookings and availability are automatically filtered out
