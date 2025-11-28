# Gallery/Works Tab Implementation Guide

## Overview

The Gallery/Works system enables talent users to upload, display, and manage portfolio images and work samples. The implementation follows the same architectural patterns as Services and Recommendations.

---

## Architecture Flow

```
UI Components → API Functions → Centralized API Client → Backend API
↓
WorksGrid.tsx → uploadGalleryImages() → apiClient.POST("/talent/gallery")
UploadWorksModal.tsx → deleteGalleryItem() → apiClient.DELETE("/talent/gallery/:id")
ProfileLayout.tsx (Orchestrator) → State Management & Refresh Triggers
```

---

## Component Breakdown

### 1. ProfileLayout.tsx (Main Orchestrator)

**Responsibilities:**
- Manages works state: `cachedWorks`, `worksLoading`, `worksRefreshTrigger`
- Renders both visible and hidden `WorksGrid` for caching
- Opens/closes `UploadWorksModal`
- Triggers refresh on upload or delete

**State:**
```typescript
const [isUploadWorksModalOpen, setIsUploadWorksModalOpen] = useState(false);
const [worksRefreshTrigger, setWorksRefreshTrigger] = useState(0);
const [cachedWorks, setCachedWorks] = useState<any[]>([]);
const [worksLoading, setWorksLoading] = useState(true);
```

**Handlers:**
```typescript
const handleAddNewWork = () => {
  setIsUploadWorksModalOpen(true);
};

const handleWorksUploaded = () => {
  // Increment trigger to refetch gallery
  setWorksRefreshTrigger((prev) => prev + 1);
};

const handleWorksDeleted = () => {
  // Increment trigger to refetch gallery
  setWorksRefreshTrigger((prev) => prev + 1);
};
```

**Rendering:**
```tsx
{/* Visible when Works tab is active */}
{activeTab === "works" && (
  <WorksGrid
    items={cachedWorks.length > 0 ? cachedWorks : profileData.gallery || []}
    onAddWork={handleOpenUploadWorksModal}
    onItemDeleted={handleWorksDeleted}
    isLoading={worksLoading && cachedWorks.length === 0}
  />
)}

{/* Hidden component to maintain cache */}
{activeTab !== "works" && (
  <div className="hidden">
    <WorksGrid {...props} />
  </div>
)}
```

---

### 2. WorksGrid.tsx (Display & Delete)

**Props:**
```typescript
interface WorksGridProps {
  items?: GalleryItem[];           // Gallery items to display
  isLoading?: boolean;               // Loading state
  onItemClick?: (item: GalleryItem) => void;  // Item click handler
  onAddWork?: () => void;            // Add work button click
  onItemDeleted?: () => void;        // Called after deletion
}
```

**Features:**
- Displays gallery items in a responsive grid (3 cols on desktop)
- Delete button appears on hover
- Confirmation dialog before deletion
- Error handling for failed deletions
- Empty state when no items exist

**Delete Flow:**
```typescript
const handleDelete = async (e: React.MouseEvent, itemId: string) => {
  e.stopPropagation();
  
  if (!confirm("Are you sure you want to delete this work?")) {
    return;
  }

  setDeletingId(itemId);
  try {
    await deleteGalleryItem(itemId);
    setDisplayItems((prev) => prev.filter((item) => item.id !== itemId));
    onItemDeleted?.();  // Notify parent
  } catch (err) {
    setError("Failed to delete work");
  } finally {
    setDeletingId(null);
  }
};
```

---

### 3. UploadWorksModal.tsx (Upload Interface)

**Props:**
```typescript
interface UploadWorksModalProps {
  isOpen: boolean;           // Modal visibility
  onClose: () => void;       // Close handler
  onSuccess?: (message?: string) => void;  // Success callback
}
```

**Features:**
- Multi-file upload (up to 10 files)
- Support for images, videos, and PDFs
- Drag-and-drop or click to select
- File previews with removal
- Detailed validation and error messages
- Loading state with progress feedback

**Upload Flow:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (selectedFiles.length === 0) {
    setError("Please select at least one file to upload");
    return;
  }

  setIsLoading(true);
  try {
    // Upload files to backend
    const result = await uploadGalleryImages(selectedFiles);

    // Reset form
    setSelectedFiles([]);
    setPreviewUrls([]);

    // Close modal and notify parent
    onClose();
    onSuccess?.(`Successfully uploaded ${selectedFiles.length} work(s)!`);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to upload works");
  } finally {
    setIsLoading(false);
  }
};
```

---

## API Layer (`lib/api/talent/index.ts`)

### Endpoints

**Upload Gallery Images**
```typescript
export async function uploadGalleryImages(
  files: File[],
): Promise<TalentProfile> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return apiClient<TalentProfile>("/talent/gallery", {
    method: "POST",
    body: formData,
  });
}
```
- **Endpoint:** `POST /talent/gallery`
- **Auth:** Required (JWT Bearer Token)
- **Max Files:** 10 per request
- **Supported Types:** Images, videos, PDFs

**Delete Gallery Item**
```typescript
export async function deleteGalleryItem(
  itemId: string,
): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/gallery/${itemId}`, {
    method: "DELETE",
  });
}
```
- **Endpoint:** `DELETE /talent/gallery/:id`
- **Auth:** Required
- **Response:** Updated TalentProfile with item removed

---

## Data Types

### GalleryItem (from `lib/api/talent/types.ts`)

```typescript
export interface GalleryItem {
  id: string;
  key: string;              // S3 object key
  url: string;              // S3 URL to media
  mime: string;             // MIME type (image/jpeg, etc.)
  sizeBytes: string;        // File size in bytes
  createdAt: string;        // ISO 8601 timestamp
  description?: string;     // Optional caption
}
```

### Backend Response (POST Upload)

```typescript
{
  id: "profile-id",
  userId: "user-id",
  gallery: [
    {
      id: "item-id",
      url: "https://s3.amazonaws.com/...",
      key: "s3-key",
      mime: "image/jpeg",
      sizeBytes: "123456",
      description: null,
      createdAt: "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Integration Points

### 1. ProfileLayout → WorksGrid

**Props Passed:**
```tsx
<WorksGrid
  items={cachedWorks.length > 0 ? cachedWorks : profileData.gallery || []}
  onAddWork={handleOpenUploadWorksModal}
  onItemClick={(item) => console.log("Item clicked:", item)}
  onItemDeleted={handleWorksDeleted}
  isLoading={worksLoading && cachedWorks.length === 0}
/>
```

**Caching Strategy:**
- First load: Use `profileData.gallery` from server
- After upload/delete: Use `cachedWorks` from parent state
- Hidden component maintains cache when tab is inactive

### 2. ProfileLayout → UploadWorksModal

**Props Passed:**
```tsx
<UploadWorksModal
  isOpen={isUploadWorksModalOpen}
  onClose={handleCloseUploadWorksModal}
  onSuccess={handleWorksUploaded}
/>
```

**Success Flow:**
1. `onSuccess()` called with message
2. Parent calls `handleWorksUploaded()`
3. `worksRefreshTrigger` incremented
4. WorksGrid re-fetches fresh data

### 3. ProfileNav Button Handler

```typescript
// ProfileNav automatically handles different tabs
const handleActionClick = () => {
  if (active === "services") {
    onAddService?.();
  } else if (active === "works") {
    // Calls onAddNewWork (same handler for all non-service tabs)
    onAddNewWork?.();
  }
};
```

---

## Error Handling

### Upload Errors

**File Size/Type Validation:**
```typescript
const newFiles = Array.from(files).filter(
  (file) =>
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    file.type === "application/pdf",
);

// Max 10 files check
const totalFiles = selectedFiles.length + newFiles.length;
if (totalFiles > 10) {
  setError("Maximum 10 files allowed");
  return;
}
```

**API Error Handling:**
```typescript
try {
  await uploadGalleryImages(selectedFiles);
} catch (err) {
  const errorMessage =
    err instanceof Error ? err.message : "Failed to upload works";
  setError(errorMessage);
}
```

### Delete Errors

```typescript
try {
  await deleteGalleryItem(itemId);
  setDisplayItems((prev) => prev.filter((item) => item.id !== itemId));
} catch (err) {
  const errorMessage =
    err instanceof Error ? err.message : "Failed to delete work";
  setError(errorMessage);
}
```

---

## Caching Strategy

### Initial Load

```
ProfilePage (Server) → getProfilePageData()
  ↓
  mapAPIToUI(profileRes) → UIProfileData with gallery array
  ↓
  ProfilePageClient → ProfileLayout (props)
  ↓
  WorksGrid receives items from profileData.gallery
```

### After Upload

```
UploadWorksModal.onSuccess()
  ↓
  ProfileLayout.handleWorksUploaded()
  ↓
  setWorksRefreshTrigger(prev => prev + 1)
  ↓
  WorksGrid detects refreshTrigger change
  ↓
  Re-fetch fresh data (API response includes full gallery)
  ↓
  Update cachedWorks in parent
```

### After Delete

```
WorksGrid.handleDelete()
  ↓
  deleteGalleryItem(itemId) → DELETE /talent/gallery/:id
  ↓
  onItemDeleted() callback
  ↓
  ProfileLayout.handleWorksDeleted()
  ↓
  setWorksRefreshTrigger(prev => prev + 1)
  ↓
  Similar re-fetch flow as upload
```

---

## File Structure

```
components/business/Profile/
├── ProfileLayout.tsx           # Main orchestrator
├── WorksGrid.tsx               # Display & delete component
├── UploadWorksModal.tsx        # Upload modal (NEW)
├── ProfileNav.tsx              # Tab navigation
├── ProfilePanel.tsx            # Side panel
├── ServicesGrid.tsx
├── RecommendationsGrid.tsx
├── CreateServiceModal.tsx
└── EmptyState.tsx

lib/api/talent/
├── index.ts                    # uploadGalleryImages(), deleteGalleryItem()
├── types.ts                    # GalleryItem, TalentProfile
└── server.ts

lib/
├── profileMapper.ts            # Maps gallery data API ↔ UI

app/(business)/profile/
├── page.tsx                    # Server component
├── profile-client.tsx          # Client wrapper
└── server-data.ts              # getProfilePageData()
```

---

## Example Usage

### From ProfileLayout

```typescript
// Open modal
const handleAddNewWork = () => {
  setIsUploadWorksModalOpen(true);
};

// Handle upload success
const handleWorksUploaded = () => {
  setWorksRefreshTrigger((prev) => prev + 1);
};

// Handle deletion
const handleWorksDeleted = () => {
  setWorksRefreshTrigger((prev) => prev + 1);
};

// Render with modal
<UploadWorksModal
  isOpen={isUploadWorksModalOpen}
  onClose={handleCloseUploadWorksModal}
  onSuccess={handleWorksUploaded}
/>
```

---

## Key Features Implemented

✅ **Upload Multiple Files** - Up to 10 files per upload  
✅ **File Previews** - Images, videos, and PDF thumbnails  
✅ **Delete Works** - Remove items with confirmation  
✅ **Responsive Grid** - 1 col mobile, 2 cols tablet, 3 cols desktop  
✅ **Caching** - Hidden component maintains cache across tab switches  
✅ **Error Handling** - User-friendly error messages and retry options  
✅ **Loading States** - Spinner during upload/delete operations  
✅ **Empty State** - Guidance when no works exist  
✅ **Confirmation Dialogs** - Prevent accidental deletions  

---

## Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images (up to 10)
- [ ] Try uploading 11+ images (should show error)
- [ ] Delete work item (confirm dialog appears)
- [ ] Cancel deletion (work item remains)
- [ ] Switch tabs without losing works data (caching)
- [ ] Handle 401 auth error on upload
- [ ] Handle network errors gracefully
- [ ] Preview shows correct file types
- [ ] S3 URLs display properly

---

## Backend API Reference

See `GALLERY_API_SUMMARY.md` for complete backend documentation including:
- Endpoint specifications
- Request/response formats
- Error codes
- Authentication requirements
- cURL examples
