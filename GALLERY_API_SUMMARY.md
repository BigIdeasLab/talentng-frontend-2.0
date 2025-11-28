# Gallery API Summary

## Overview
The Gallery API allows authenticated talent users to manage gallery images on their profiles. Gallery items now support descriptions/captions.

## Base URL
```
/api/v1/talent/gallery
```

## Authentication
All endpoints require JWT Bearer token authentication.

---

## Endpoints

### 1. Upload Gallery Images
**POST** `/api/v1/talent/gallery`

Upload up to 10 gallery images for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `files`: File[] - Array of image files (up to 10 images)

**Response (201 Created):**
```json
{
  "id": "profile-id",
  "userId": "user-id",
  "gallery": [
    {
      "id": "gallery-item-id",
      "url": "https://s3.amazonaws.com/...",
      "key": "s3-key",
      "mime": "image/jpeg",
      "sizeBytes": "123456",
      "description": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Profile not found
- `400 Bad Request` - Invalid request data

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/talent/gallery \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

---

### 2. Get Gallery Items
**GET** `/api/v1/talent/gallery`

Retrieve all gallery items for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "gallery-item-id-1",
    "url": "https://s3.amazonaws.com/...",
    "key": "s3-key-1",
    "mime": "image/jpeg",
    "sizeBytes": "123456",
    "description": "My portfolio work",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "gallery-item-id-2",
    "url": "https://s3.amazonaws.com/...",
    "key": "s3-key-2",
    "mime": "image/png",
    "sizeBytes": "234567",
    "description": null,
    "createdAt": "2024-01-16T11:45:00Z"
  }
]
```

**Error Responses:**
- `404 Not Found` - Profile not found

**cURL Example:**
```bash
curl http://localhost:3000/api/v1/talent/gallery \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Update Gallery Item
**PATCH** `/api/v1/talent/gallery/:id`

Update the description of a gallery item.

**Parameters:**
- `id` (path) - Gallery item ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "description": "My awesome portfolio piece"
}
```

**Response (200 OK):**
```json
{
  "id": "profile-id",
  "userId": "user-id",
  "gallery": [
    {
      "id": "gallery-item-id",
      "url": "https://s3.amazonaws.com/...",
      "key": "s3-key",
      "mime": "image/jpeg",
      "sizeBytes": "123456",
      "description": "My awesome portfolio piece",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Profile or gallery item not found

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/talent/gallery/item-id \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "My awesome photo"}'
```

---

### 4. Delete Gallery Item
**DELETE** `/api/v1/talent/gallery/:id`

Delete a gallery item for the authenticated user.

**Parameters:**
- `id` (path) - Gallery item ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "The gallery item has been successfully deleted."
}
```

**Error Responses:**
- `404 Not Found` - Profile or gallery item not found

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/talent/gallery/item-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Gallery Item Object

Each gallery item contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the gallery item |
| `url` | string | S3 URL where the image is stored |
| `key` | string | S3 object key |
| `mime` | string | MIME type (e.g., image/jpeg, image/png) |
| `sizeBytes` | string | File size in bytes |
| `description` | string \| null | Optional description/caption for the image |
| `createdAt` | string | ISO 8601 timestamp when item was created |

---

## Integration with Talent Profile

Gallery items are also returned as part of the talent profile:

**GET** `/api/v1/talent/me` or `/api/v1/talent/:userId`

The `gallery` array will include all gallery items with descriptions:

```json
{
  "id": "profile-id",
  "userId": "user-id",
  "gallery": [
    {
      "id": "gallery-item-id",
      "url": "https://s3.amazonaws.com/...",
      "key": "s3-key",
      "mime": "image/jpeg",
      "sizeBytes": "123456",
      "description": "Project screenshot",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found (resource doesn't exist) |
| 409 | Conflict (constraint violation) |

---

## Notes

- Gallery items are stored as JSON within the talent profile
- Descriptions are optional (can be null)
- Files are uploaded to S3 with automatic URL generation
- Descriptions can be updated independently without re-uploading the image
- Maximum 10 images can be uploaded at once
- Deleting a gallery item also removes the file from S3
