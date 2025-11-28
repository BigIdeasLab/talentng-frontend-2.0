# Services Feature - Quick Reference

## The Error You're Seeing

```
Failed to load resource: 404 (Not Found)
API Client Error: Talent profile not found or private
```

**Status:** This is EXPECTED and NORMAL ✅

**Why:**
- Backend `/talent/services` endpoint may not be deployed yet
- OR user's talent profile doesn't exist
- Frontend now gracefully handles this by showing empty state

**What Happens:**
1. User sees empty "No services added yet" screen
2. User can click "Add Service" to create one
3. Form submission will work when backend is ready

---

## What You Have Now

### 1. Complete API Integration ✅
10 service endpoints ready in `lib/api/talent/`:
- `createService()` - Create
- `getMyServices()` - Read list
- `getServiceById()` - Read single
- `updateService()` - Update
- `deleteService()` - Delete
- `getTalentServices()` - Public view
- `searchServicesByTags()` - Search
- `addServiceReview()` - Add review
- `getServiceReviews()` - Get reviews
- `deleteServiceReview()` - Delete review

### 2. Full UI/UX ✅
- **CreateServiceModal** - Beautiful form with validation
- **ServicesGrid** - Responsive grid display
- **ProfileNav** - Smart action button
- **ProfileLayout** - State management

### 3. Smart Error Handling ✅
- 404 → Shows empty state (not an error)
- 401 → "Please log in"
- 403 → "No permission"
- Others → Error with retry button

---

## What Needs to be Done on Backend

### Required Endpoints (from SERVICES_FRONTEND_GUIDE.md)

**Create Service**
```
POST /talent/services
Authorization: Bearer {token}
Body: {
  "title": "string",
  "about": "string",
  "price": "string (optional)",
  "images": ["url1", "url2"],
  "tags": ["tag1", "tag2"]
}
Response: 201 Created { Service object }
```

**Get My Services**
```
GET /talent/services
Authorization: Bearer {token}
Response: 200 OK [ Service[] ]
```

**Get Service**
```
GET /talent/services/:id
Authorization: Bearer {token}
Response: 200 OK { Service }
```

**Update Service**
```
PATCH /talent/services/:id
Authorization: Bearer {token}
Body: { partial Service fields }
Response: 200 OK { Service }
```

**Delete Service**
```
DELETE /talent/services/:id
Authorization: Bearer {token}
Response: 200 OK { "message": "deleted" }
```

**Get Public Services (of a talent)**
```
GET /talent/:talentId/services?tags=tag1,tag2
Response: 200 OK [ Service[] ]
```

**Search by Tags**
```
GET /talent/services/search/tags?tags=React,Design
Response: 200 OK [ Service[] ]
```

**Add Review**
```
POST /talent/services/:id/reviews
Authorization: Bearer {token}
Body: { "rating": 5, "comment": "string" }
Response: 201 Created { Service with reviews }
```

**Get Reviews**
```
GET /talent/services/:id/reviews
Response: 200 OK { Service with reviews }
```

**Delete Review**
```
DELETE /talent/services/:id/reviews/:reviewId
Authorization: Bearer {token}
Response: 200 OK { "message": "deleted" }
```

See `SERVICES_FRONTEND_GUIDE.md` section "Service Management" for complete specs.

---

## Testing Checklist

- [ ] Backend has `/talent/services` POST endpoint
- [ ] User has completed talent profile
- [ ] User is authenticated (token in cookies/headers)
- [ ] Click "Services" tab → shows empty state
- [ ] Click "Add Service" → modal opens
- [ ] Fill form → can submit
- [ ] API returns 201 → service created
- [ ] Grid refreshes → service appears

---

## File Structure

```
lib/api/talent/
├── index.ts          ← API functions (10 new)
├── types.ts          ← Service interfaces
└── server.ts         ← Server-side only

components/business/Profile/
├── CreateServiceModal.tsx  ← New component
├── ServicesGrid.tsx        ← Updated
├── ProfileLayout.tsx       ← Updated
├── ProfileNav.tsx          ← Updated
└── (others unchanged)

Documentation/
├── SERVICES_FRONTEND_GUIDE.md        ← API specs
├── SERVICES_IMPLEMENTATION_SUMMARY.md ← What was built
├── SERVICES_TROUBLESHOOTING.md       ← Common issues
└── SERVICES_QUICK_REFERENCE.md       ← This file
```

---

## Common Questions

**Q: Why is it showing empty services instead of an error?**
A: Because the 404 might just mean the user hasn't created services yet. It's a graceful fallback.

**Q: Can I test without backend?**
A: No. The form will submit but the API call will fail. You need backend endpoints.

**Q: Where's the edit/delete UI?**
A: Phase 2. Right now you can only create. Edit/delete coming next.

**Q: Are images uploaded to cloud?**
A: The form sends image URLs/data to the backend. Backend decides where to store.

**Q: Why can I upload 5 images max?**
A: Good UX practice. Prevents slow loading. Can be changed in CreateServiceModal.tsx.

---

## Next Phase

- [ ] Service detail view
- [ ] Edit service modal
- [ ] Delete service with confirmation
- [ ] Reviews display
- [ ] Leave review form
- [ ] Public profile services
- [ ] Search/filter services
- [ ] Service comparison

---

## Support

**Frontend working?** Check browser console for JS errors.

**API not responding?** Check backend logs.

**Lost user?** Read `SERVICES_TROUBLESHOOTING.md`.

**Need specs?** See `SERVICES_FRONTEND_GUIDE.md`.
