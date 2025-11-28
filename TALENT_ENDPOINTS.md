# Talent Profile API Endpoints

## Overview

This document provides comprehensive documentation for all Talent Profile API endpoints. The Talent module allows users to create, read, update, and manage their professional profiles including work experience, education, portfolio items, and gallery images.

**Base URL:** `/talent`
**Module:** `TalentModule`
**Controller:** `TalentController`

---

## Authentication

Most endpoints require JWT Bearer token authentication. Public endpoints do not require authentication.

### Authentication Header Format

```
Authorization: Bearer <your_jwt_token>
```

### Roles & Permissions

- **Authenticated Users**: Can access their own profile data
- **Admin Users**: Can view all profiles (public and private)
- **Public Users**: Can only view public profiles

---

## Response Format

All endpoints return responses in the following format:

### Success Response (2xx)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "fullName": "string"
  // ... other fields
}
```

### Error Response (4xx/5xx)

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

---

## Endpoints

### 1. Get Current User's Talent Profile

**Endpoint:** `GET /talent/me`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Retrieve the authenticated user's complete talent profile.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "660e8400-e29b-41d4-a716-446655440111",
  "fullName": "Chukwuma Okafor",
  "headline": "Full Stack Developer | React & Node.js Specialist",
  "bio": "Passionate software engineer with 5+ years of experience...",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "stack": [{ "name": "React" }, { "name": "Node.js" }],
  "location": "Lagos, Nigeria",
  "profileImageUrl": "https://storage.example.com/profile.jpg",
  "coverImageUrl": "https://storage.example.com/cover.jpg",
  "visibility": "public",
  "isFeatured": true,
  "featuredUntil": "2025-12-31T23:59:59Z",
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2024-11-28T14:22:50Z",
  "stats": {
    "earnings": "2500000.00",
    "hired": 8,
    "views": 1243,
    "completionPercentage": 85
  },
  "workExperience": [
    {
      "id": "uuid",
      "company": "TechCorp Nigeria",
      "role": "Senior Full Stack Developer",
      "duration": "2021 - Present"
    }
  ],
  "education": [
    {
      "id": "uuid",
      "institution": "University of Lagos",
      "degree": "B.Sc",
      "field": "Computer Science"
    }
  ],
  "portfolioItems": [
    {
      "id": "uuid",
      "key": "portfolio/item-key",
      "url": "https://storage.example.com/portfolio.pdf",
      "mime": "application/pdf",
      "sizeBytes": "1024000",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "gallery": [
    {
      "id": "uuid",
      "key": "gallery/image-key",
      "url": "https://storage.example.com/gallery.jpg",
      "mime": "image/jpeg",
      "sizeBytes": "512000",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "socialLinks": {
    "github": "https://github.com/user",
    "linkedin": "https://linkedin.com/in/user",
    "portfolio": "https://user-portfolio.com",
    "twitter": "https://twitter.com/user"
  }
}
```

**Error Responses:**

| Status | Description                             |
| ------ | --------------------------------------- |
| 401    | Unauthorized - Invalid or missing token |
| 404    | Talent profile not found                |
| 500    | Internal server error                   |

**Example cURL:**

```bash
curl -X GET "http://localhost:3000/talent/me" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json"
```

---

### 2. Update Current User's Talent Profile

**Endpoint:** `PATCH /talent/me`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Update any fields in the authenticated user's talent profile.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:** None

**Request Body:**

```json
{
  "fullName": "Chukwuma Okafor",
  "headline": "Full Stack Developer | React & Node.js Specialist",
  "bio": "Passionate software engineer...",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "stack": ["React", "Node.js", "PostgreSQL"],
  "location": "Lagos, Nigeria",
  "visibility": "public",
  "phoneNumber": "+234-801-234-5678",
  "preferredRole": "Senior Full Stack Developer",
  "availability": "Available for freelance projects",
  "company": "TechCorp Nigeria",
  "duration": "5+ years",
  "description": "Experienced full stack developer...",
  "resumeUrl": "https://storage.example.com/resume.pdf",
  "isFeatured": true,
  "workExperience": [
    {
      "company": "TechCorp Nigeria",
      "role": "Senior Full Stack Developer",
      "duration": "2021 - Present"
    }
  ],
  "education": [
    {
      "institution": "University of Lagos",
      "degree": "B.Sc",
      "field": "Computer Science"
    }
  ],
  "links": {
    "github": "https://github.com/user",
    "linkedin": "https://linkedin.com/in/user",
    "portfolio": "https://user-portfolio.com",
    "twitter": "https://twitter.com/user"
  }
}
```

**All fields are optional. Only include fields you want to update.**

**Response (200 OK):** Returns updated profile object (same structure as GET /talent/me)

**Error Responses:**

| Status | Description                             |
| ------ | --------------------------------------- |
| 400    | Bad request - Invalid data format       |
| 401    | Unauthorized - Invalid or missing token |
| 404    | Talent profile not found                |
| 422    | Unprocessable entity - Validation error |
| 500    | Internal server error                   |

**Example cURL:**

```bash
curl -X PATCH "http://localhost:3000/talent/me" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Chukwuma Okafor",
    "headline": "Full Stack Developer",
    "skills": ["JavaScript", "TypeScript", "React"]
  }'
```

---

### 3. Get Dashboard Statistics

**Endpoint:** `GET /talent/dashboard`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Retrieve dashboard statistics for the authenticated user's talent profile.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**

```json
{
  "profileCompletion": 85,
  "applicationsSubmitted": 5,
  "interviewsScheduled": 2,
  "profileViews": 1243,
  "hired": 8,
  "earnings": "2500000"
}
```

**Response Fields:**

- `profileCompletion` (integer 0-100) - Profile completeness percentage
- `applicationsSubmitted` (integer) - Total applications submitted
- `interviewsScheduled` (integer) - Applications with shortlisted status
- `profileViews` (integer) - Total times profile has been viewed
- `hired` (integer) - Total number of jobs where status is 'hired'
- `earnings` (string) - Total earnings calculated from hired job compensations (numeric string)

**Error Responses:**

| Status | Description                             |
| ------ | --------------------------------------- |
| 401    | Unauthorized - Invalid or missing token |
| 404    | Profile not found                       |
| 500    | Internal server error                   |

**Example cURL:**

```bash
curl -X GET "http://localhost:3000/talent/dashboard" \
  -H "Authorization: Bearer your_token_here"
```

---

### 4. Update Profile Image

**Endpoint:** `PATCH /talent/profile-image`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Upload or update the user's profile image. Only one image at a time.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Query Parameters:** None

**Request Body:** (multipart/form-data)

```
file: <binary file>
```

**Supported File Types:** JPEG, PNG, GIF, WebP
**Max File Size:** (Usually 5-10 MB, check server config)

**Response (200 OK):**
Returns the entire updated TalentProfile object with the new profile image URL. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                                 |
| ------ | ------------------------------------------- |
| 400    | Bad request - Invalid file format           |
| 401    | Unauthorized - Invalid or missing token     |
| 404    | Profile not found                           |
| 413    | Payload too large - File exceeds size limit |
| 500    | Internal server error                       |

**Example cURL:**

```bash
curl -X PATCH "http://localhost:3000/talent/profile-image" \
  -H "Authorization: Bearer your_token_here" \
  -F "file=@/path/to/image.jpg"
```

---

### 5. Update Cover Image

**Endpoint:** `PATCH /talent/cover-image`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Upload or update the user's cover/banner image. Only one image at a time.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Query Parameters:** None

**Request Body:** (multipart/form-data)

```
file: <binary file>
```

**Supported File Types:** JPEG, PNG, GIF, WebP
**Max File Size:** (Usually 5-10 MB, check server config)

**Response (200 OK):**
Returns the entire updated TalentProfile object with the new cover image URL. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                                 |
| ------ | ------------------------------------------- |
| 400    | Bad request - Invalid file format           |
| 401    | Unauthorized - Invalid or missing token     |
| 404    | Profile not found                           |
| 413    | Payload too large - File exceeds size limit |
| 500    | Internal server error                       |

**Example cURL:**

```bash
curl -X PATCH "http://localhost:3000/talent/cover-image" \
  -H "Authorization: Bearer your_token_here" \
  -F "file=@/path/to/cover.jpg"
```

---

### 6. Upload Portfolio Item

**Endpoint:** `POST /talent/portfolio`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Upload a single portfolio item (document, image, or other file).

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Query Parameters:** None

**Request Body:** (multipart/form-data)

```
file: <binary file>
```

**Supported File Types:** PDF, DOC, DOCX, PPT, PPTX, images (JPEG, PNG, GIF, WebP)
**Max File Size:** (Usually 10-50 MB, check server config)

**Response (201 Created):**
Returns the entire updated TalentProfile object with the new portfolio item added to the `portfolioItems` array. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                                 |
| ------ | ------------------------------------------- |
| 400    | Bad request - Invalid file format           |
| 401    | Unauthorized - Invalid or missing token     |
| 404    | Profile not found                           |
| 413    | Payload too large - File exceeds size limit |
| 500    | Internal server error                       |

**Example cURL:**

```bash
curl -X POST "http://localhost:3000/talent/portfolio" \
  -H "Authorization: Bearer your_token_here" \
  -F "file=@/path/to/portfolio-item.pdf"
```

---

### 7. Delete Portfolio Item

**Endpoint:** `DELETE /talent/portfolio/:id`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Delete a specific portfolio item by ID.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Portfolio item ID |

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
Returns the entire updated TalentProfile object with the portfolio item removed from the `portfolioItems` array. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                             |
| ------ | --------------------------------------- |
| 401    | Unauthorized - Invalid or missing token |
| 404    | Profile or portfolio item not found     |
| 500    | Internal server error                   |

**Example cURL:**

```bash
curl -X DELETE "http://localhost:3000/talent/portfolio/item-uuid-here" \
  -H "Authorization: Bearer your_token_here"
```

---

### 8. Upload Gallery Images

**Endpoint:** `POST /talent/gallery`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Upload multiple gallery images in a single request. Maximum 10 images per request.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Query Parameters:** None

**Request Body:** (multipart/form-data)

```
files: <binary files> (array of up to 10 files)
```

**Supported File Types:** JPEG, PNG, GIF, WebP
**Max Images Per Request:** 10
**Max File Size Per Image:** (Usually 5-10 MB)

**Response (201 Created):**
Returns the entire updated TalentProfile object with the new gallery items added to the `gallery` array. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                                         |
| ------ | --------------------------------------------------- |
| 400    | Bad request - Invalid file format or too many files |
| 401    | Unauthorized - Invalid or missing token             |
| 404    | Profile not found                                   |
| 413    | Payload too large - File exceeds size limit         |
| 500    | Internal server error                               |

**Example cURL:**

```bash
curl -X POST "http://localhost:3000/talent/gallery" \
  -H "Authorization: Bearer your_token_here" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
```

---

### 9. Delete Gallery Item

**Endpoint:** `DELETE /talent/gallery/:id`

**Authentication:** ✅ Required (JWT Bearer)

**Description:** Delete a specific gallery item by ID.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Gallery item ID |

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
Returns the entire updated TalentProfile object with the gallery item removed from the `gallery` array. See the full TalentProfile response structure above (same as GET /talent/me).

**Error Responses:**

| Status | Description                             |
| ------ | --------------------------------------- |
| 401    | Unauthorized - Invalid or missing token |
| 404    | Profile or gallery item not found       |
| 500    | Internal server error                   |

**Example cURL:**

```bash
curl -X DELETE "http://localhost:3000/talent/gallery/item-uuid-here" \
  -H "Authorization: Bearer your_token_here"
```

---

### 10. List All Talent Profiles

**Endpoint:** `GET /talent`

**Authentication:** ❌ Not Required (Public endpoint)

**Description:** Retrieve a list of talent profiles. Non-admin users only see public profiles. Admin users can see all profiles.

**Headers:**

```
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| headline | string | No | - | Filter by headline text |
| bio | string | No | - | Filter by bio text |
| skills | string | No | - | Filter by skills (comma-separated) |
| location | string | No | - | Filter by location |
| visibility | enum | No | - | Filter by visibility: `public` or `private` |
| isFeatured | boolean | No | - | Filter by featured status |

**Request Body:** None

**Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "660e8400-e29b-41d4-a716-446655440111",
    "fullName": "Chukwuma Okafor",
    "headline": "Full Stack Developer | React & Node.js Specialist",
    "bio": "Passionate software engineer with 5+ years of experience...",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
    "location": "Lagos, Nigeria",
    "profileImageUrl": "https://storage.example.com/profile.jpg",
    "visibility": "public",
    "isFeatured": true,
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2024-11-28T14:22:50Z"
  }
  // ... more profiles
]
```

**Error Responses:**

| Status | Description           |
| ------ | --------------------- |
| 500    | Internal server error |

**Example cURL:**

```bash
# Get all public profiles
curl -X GET "http://localhost:3000/talent"

# Filter by location
curl -X GET "http://localhost:3000/talent?location=Lagos"

# Filter by multiple criteria
curl -X GET "http://localhost:3000/talent?location=Lagos&isFeatured=true&visibility=public"

# Filter by skills
curl -X GET "http://localhost:3000/talent?skills=JavaScript,React"
```

---

### 11. Get Talent Profile by User ID

**Endpoint:** `GET /talent/:userId`

**Authentication:** ❌ Not Required (Public endpoint - for public profiles only)

**Description:** Retrieve a specific talent profile by user ID. Only returns public profiles; private profiles return 404.

**Headers:**

```
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ID (UUID format) |

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "660e8400-e29b-41d4-a716-446655440111",
  "fullName": "Chukwuma Okafor",
  "headline": "Full Stack Developer | React & Node.js Specialist",
  "bio": "Passionate software engineer with 5+ years of experience...",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "stack": [{ "name": "React" }, { "name": "Node.js" }],
  "location": "Lagos, Nigeria",
  "profileImageUrl": "https://storage.example.com/profile.jpg",
  "coverImageUrl": "https://storage.example.com/cover.jpg",
  "visibility": "public",
  "isFeatured": true,
  "views": 1243,
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2024-11-28T14:22:50Z"
}
```

**Note:** The view count is automatically incremented when this endpoint is called.

**Error Responses:**

| Status | Description                            |
| ------ | -------------------------------------- |
| 404    | Talent profile not found or is private |
| 500    | Internal server error                  |

**Example cURL:**

```bash
curl -X GET "http://localhost:3000/talent/660e8400-e29b-41d4-a716-446655440111"
```

---

## Data Types & Models

### TalentProfileDto

Complete talent profile object structure:

```json
{
  "id": "string (uuid)",
  "userId": "string (uuid)",
  "fullName": "string | null",
  "headline": "string | null",
  "bio": "string | null",
  "profileImageUrl": "string | null",
  "coverImageUrl": "string | null",
  "skills": ["string"],
  "stack": [
    {
      "name": "string"
    }
  ],
  "location": "string | null",
  "availability": "string | null",
  "phoneNumber": "string | null",
  "preferredRole": "string | null",
  "company": "string | null",
  "duration": "string | null",
  "description": "string | null",
  "resumeUrl": "string | null",
  "visibility": "public | private",
  "isFeatured": "boolean",
  "featuredUntil": "DateTime | null",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "views": "integer",
  "stats": {
    "earnings": "Decimal",
    "hired": "integer",
    "views": "integer",
    "completionPercentage": "integer"
  },
  "workExperience": [
    {
      "id": "string",
      "company": "string",
      "role": "string",
      "duration": "string"
    }
  ],
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "field": "string"
    }
  ],
  "portfolioItems": [
    {
      "id": "string",
      "key": "string",
      "url": "string",
      "mime": "string",
      "sizeBytes": "string",
      "createdAt": "DateTime"
    }
  ],
  "gallery": [
    {
      "id": "string",
      "key": "string",
      "url": "string",
      "mime": "string",
      "sizeBytes": "string",
      "createdAt": "DateTime"
    }
  ],
  "socialLinks": {
    "github": "string | null",
    "linkedin": "string | null",
    "twitter": "string | null",
    "instagram": "string | null",
    "telegram": "string | null",
    "dribbble": "string | null",
    "portfolio": "string | null"
  }
}
```

### Visibility Enum

```typescript
enum Visibility {
  public = "public", // Profile is visible to everyone
  private = "private", // Profile is only visible to the owner
}
```

---

## Common Errors

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Cause:** Missing or invalid JWT token

**Solution:** Ensure you're including a valid Bearer token in the Authorization header

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Talent profile not found",
  "error": "Not Found"
}
```

**Cause:** Profile doesn't exist or is private (when accessing as non-owner)

**Solution:** Verify the user ID is correct and the profile is public

### 422 Unprocessable Entity

```json
{
  "statusCode": 422,
  "message": ["skills must be an array", "location must be a string"],
  "error": "Unprocessable Entity"
}
```

**Cause:** Invalid data format in request body

**Solution:** Check that all fields match the expected data types

### 413 Payload Too Large

```json
{
  "statusCode": 413,
  "message": "Payload too large",
  "error": "Payload Too Large"
}
```

**Cause:** File size exceeds the server limit

**Solution:** Use a smaller file (typically max 5-10 MB per image)

---

## Important Notes

- **File Operations Return Full Profile**: All file upload/delete endpoints (portfolio, gallery, profile image, cover image) return the entire updated TalentProfile object, not just a success message
- **Unincluded User Field**: The TalentProfileDto may include an optional `user` field containing user information (email, roles, verification status, etc.), though it's omitted from the example for brevity
- **twoFactorEnabled**: This field is currently referenced in the code but does not exist in the User model schema and should not be relied upon
- **socialLinks vs links**: Request bodies use `links` (object), but responses use `socialLinks` with specific social media properties (github, linkedin, twitter, etc.)

---

## Best Practices

1. **Batch File Uploads**: Use the gallery endpoint to upload multiple images at once (up to 10)
2. **Field Validation**: Always validate data on the client side before sending
3. **File Size**: Compress images before uploading to improve performance
4. **Rate Limiting**: Be aware of rate limits if implemented
5. **Profile Visibility**: Set visibility to `private` if you don't want your profile indexed publicly
6. **Resume Format**: Use PDF format for resumes for maximum compatibility
7. **Image Formats**: Use JPEG or PNG for best compatibility
8. **Skill Tags**: Keep skills to single words or short phrases for better filtering
9. **Links Validation**: Ensure URLs are complete and valid (include https://)
10. **Featured Duration**: Use ISO 8601 datetime format for `featuredUntil`

---

## Rate Limits

Rate limits are typically applied as follows (check with your admin):

- **File Uploads**: 100 MB per hour
- **API Requests**: 1000 requests per hour per user

---

## Changelog

### v1.0.0 (Current)

- Initial API release
- All 11 endpoints operational
- File upload support for images and documents
- Profile filtering and search capabilities
