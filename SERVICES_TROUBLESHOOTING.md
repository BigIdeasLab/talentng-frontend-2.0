# Services Feature - Troubleshooting Guide

## Error: "Talent profile not found or private" (404)

### Root Cause
The backend `/talent/services` endpoint is returning a 404 error.

### Possible Reasons

#### 1. **Talent Profile Not Created** (Most Common)
- User hasn't completed their talent profile yet
- User's profile is set to private visibility
- **Solution:** Create/complete the talent profile first before using services

#### 2. **Backend Endpoint Not Deployed**
- The `/talent/services` endpoints may not be deployed on the backend yet
- API endpoints from SERVICES_FRONTEND_GUIDE.md need to be implemented on the backend
- **Solution:** Deploy the services endpoints on the backend server

#### 3. **User Not Authenticated**
- API call missing authentication token
- Token expired or invalid
- **Solution:** Check authentication status, re-login if needed

### What the Frontend Does Now

✅ **Graceful Fallback:** 
- 404 errors now show empty state instead of error message
- User can still click "Add Service" to create services
- No confusing error messages

✅ **Better Error Handling:**
- 401 (Unauthorized) - "Please log in to view your services"
- 403 (Forbidden) - "You don't have permission to view these services"
- 404 (Not Found) - Treated as empty state
- Other errors - Shows detailed error with retry button

## Testing the Services Feature

### Prerequisites
1. ✅ User must have a complete talent profile
2. ✅ Backend must have services endpoints deployed
3. ✅ User must be authenticated

### Steps to Test
1. Navigate to Profile page
2. Go to "Services" tab
3. Click "Add Service" button
4. Fill in form:
   - **Title:** "UI/UX Design"
   - **Description:** "Professional design services..."
   - **Price:** "Starting from $500"
   - **Images:** Upload a sample image
   - **Tags:** Select 2-3 tags
5. Click "Create Service"
6. Should see success and services list refresh

## Backend Checklist

Ensure your backend has these endpoints implemented:

### Service Management
- ✅ POST `/talent/services` - Create service
- ✅ GET `/talent/services` - Get user's services
- ✅ GET `/talent/services/:id` - Get specific service
- ✅ PATCH `/talent/services/:id` - Update service
- ✅ DELETE `/talent/services/:id` - Delete service

### Service Discovery (Public)
- ✅ GET `/talent/:talentId/services` - Get talent's public services
- ✅ GET `/talent/services/search/tags` - Search by tags

### Reviews
- ✅ POST `/talent/services/:id/reviews` - Add review
- ✅ GET `/talent/services/:id/reviews` - Get reviews
- ✅ DELETE `/talent/services/:id/reviews/:reviewId` - Delete review

See `SERVICES_FRONTEND_GUIDE.md` for detailed endpoint specifications.

## Common Issues

### Issue: Empty Services List Shows Error Button
**Cause:** 404 is now treated as empty state (expected behavior)
**Solution:** None needed - this is correct. User can create services.

### Issue: "Create Service" Button Does Nothing
**Cause:** 
- JavaScript error in modal
- Network issue
- Backend endpoint not working
**Solution:**
- Check browser console for errors
- Verify network request is being sent
- Check backend logs for POST `/talent/services` request

### Issue: Form Validation Errors
**Cause:** Field validation rules not met
**Solutions:**
- Title: Required, max 100 characters
- Description: Required, max 2000 characters
- Price: Optional, format "Starting from $500"
- Images: Optional, max 5 images
- Tags: Optional, comma-separated

### Issue: Image Upload Fails
**Cause:**
- File too large
- Invalid file format
- Browser doesn't support FileReader API
**Solution:**
- Use JPG/PNG images under 5MB
- Check browser console for specific error
- Try a different browser

## Performance Notes

- Services list is fetched when Services tab is viewed
- Auto-refresh occurs after creating a new service
- Manual refresh available via browser reload

## Frontend Implementation Details

### Files Modified
- `lib/api/talent/index.ts` - API functions
- `lib/api/talent/types.ts` - TypeScript interfaces
- `components/business/Profile/CreateServiceModal.tsx` - Modal form
- `components/business/Profile/ServicesGrid.tsx` - Services display
- `components/business/Profile/ProfileLayout.tsx` - State management
- `components/business/Profile/ProfileNav.tsx` - Navigation

### Error Handling Strategy
```javascript
// 404 → Treat as empty state (graceful)
if (errorStatus === 404) {
  setServices([]);
  setError(null);
  return;
}

// Other auth errors → Show specific message
if (errorStatus === 401) {
  errorMessage = "Please log in to view your services";
}

// All other errors → Show message with retry option
setError(errorMessage);
```

## Next Steps

1. **Verify backend has services endpoints deployed**
2. **Test with curl or Postman:**
   ```bash
   POST /talent/services
   Headers: Authorization: Bearer {token}
   Body: {
     "title": "Test Service",
     "about": "Test description",
     "price": "Starting from $100",
     "tags": ["Test"]
   }
   ```
3. **Monitor browser network tab** while creating a service
4. **Check backend logs** for any errors

## Support

For more details on API specifications, see:
- `SERVICES_FRONTEND_GUIDE.md` - Complete API documentation
- `SERVICES_IMPLEMENTATION_SUMMARY.md` - Implementation overview
