# Public Listing Pages - API Integration

## Overview

This document describes the API integration completed for all public listing/browse pages. All pages now fetch real data from the backend API instead of using hardcoded mock data.

## Completed Pages

### 1. Talents Listing (`/talents`)

**File:** `app/talents/page.tsx`

**API Integration:**

- Uses `browseTalents()` from `lib/api/public/talents.ts`
- Fetches on mount and when category filter changes
- Transforms API response to `TalentData` interface

**Features:**

- Category filtering (All, Designer, Developer, Writer, etc.)
- Loading spinner during fetch
- Error message on failure
- Empty state when no results
- Grid layout with TalentCard components

**Data Transformation:**

```typescript
const transformedData: TalentData[] = data.map((talent) => ({
  id: parseInt(talent.id) || 0,
  userId: talent.userId,
  fullName: talent.fullName,
  headline: talent.headline,
  location: talent.location,
  timesHired: 0, // Not available in API
  earnings: 0, // Not available in API
  avatar: talent.profileImageUrl || "/default.png",
  gallery: talent.coverImageUrl ? [talent.coverImageUrl] : [],
  skills: talent.skills,
  stack: talent.stack,
  availability: talent.availability,
  category: talent.category,
  createdAt: talent.createdAt,
}));
```

### 2. Mentors Listing (`/mentors`)

**File:** `app/mentors/page.tsx`

**API Integration:**

- Uses `browseMentors()` from `lib/api/public/mentors.ts`
- Fetches on mount and when category filter changes
- Transforms API response to `MentorCardData` interface

**Features:**

- Category filtering (All, Design, Engineering, Product, etc.)
- Loading spinner during fetch
- Error message on failure
- Empty state when no results
- Grid layout with MentorCard components

**Data Transformation:**

```typescript
const transformedData: MentorCardData[] = data.map((mentor) => ({
  id: mentor.id,
  name: mentor.fullName,
  title: mentor.headline || "Mentor",
  company: mentor.company || "",
  location: mentor.location,
  rating: mentor.rating,
  totalReviews: mentor.totalReviews,
  expertise: mentor.expertise,
  imageUrl: mentor.profileImageUrl || "/default.png",
}));
```

### 3. Recruiters Listing (`/recruiters`)

**File:** `app/recruiters/page.tsx`

**API Integration:**

- Uses `browseRecruiters()` from `lib/api/public/recruiters.ts`
- Fetches on mount and when category filter changes
- Transforms API response to `RecruiterData` interface

**Features:**

- Category filtering (All, Technology, Finance, Healthcare, etc.)
- Loading spinner during fetch
- Error message on failure
- Empty state when no results
- Grid layout with RecruiterCard components

**Data Transformation:**

```typescript
const transformedData: RecruiterData[] = data.map((recruiter) => {
  // Generate initials from company name
  const initials = recruiter.companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a color based on company name
  const colors = [
    "#3359DF",
    "#F5A623",
    "#00C3F7",
    "#5C30FF",
    "#0066F5",
    "#ED1C24",
  ];
  const colorIndex = recruiter.companyName.length % colors.length;

  return {
    id: parseInt(recruiter.id) || 0,
    companyName: recruiter.companyName,
    industry: recruiter.industry,
    location: recruiter.location,
    jobsPosted: recruiter.jobsPosted,
    talentsHired: recruiter.talentsHired,
    description: recruiter.description,
    hiringFor: recruiter.hiringFor,
    logoBg: colors[colorIndex],
    initials: initials,
  };
});
```

### 4. Opportunities Listing (`/opportunities-public`)

**File:** `app/opportunities-public/page.tsx`

**API Integration:**

- Uses `browseOpportunities()` from `lib/api/public/opportunities.ts`
- Fetches on mount and when category filter changes
- Transforms API response to `PublicOpportunity` interface

**Features:**

- Category filtering (All, Design, Development, Writing, etc.)
- Loading spinner during fetch
- Error message on failure
- Empty state when no results
- Grid layout with OpportunityCardPublic components

**Data Transformation:**

```typescript
const transformedData: PublicOpportunity[] = data.map((opp) => {
  // Generate initials from company name
  const initials = opp.companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a color based on company name
  const colors = [
    "#3359DF",
    "#F5A623",
    "#00C3F7",
    "#5C30FF",
    "#0066F5",
    "#ED1C24",
  ];
  const colorIndex = opp.companyName.length % colors.length;

  // Calculate relative date
  const createdDate = new Date(opp.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let dateStr = "";
  if (diffDays === 0) dateStr = "Today";
  else if (diffDays === 1) dateStr = "1 day ago";
  else if (diffDays < 7) dateStr = `${diffDays} days ago`;
  else if (diffDays < 14) dateStr = "1 week ago";
  else if (diffDays < 30) dateStr = `${Math.floor(diffDays / 7)} weeks ago`;
  else dateStr = `${Math.floor(diffDays / 30)} months ago`;

  return {
    id: opp.id,
    companyName: opp.companyName,
    companyLogo: opp.companyLogo || "",
    companyLogoBg: colors[colorIndex],
    companyInitials: initials,
    date: dateStr,
    type: opp.type,
    title: opp.title,
    location: opp.location,
    experienceLevel: opp.experienceLevel,
    category: opp.category,
    skills: opp.skills,
    priceMode: opp.priceMode,
    minBudget: opp.minBudget,
    maxBudget: opp.maxBudget,
    price: opp.price,
    paymentType: opp.paymentType,
  };
});
```

## Implementation Pattern

All listing pages follow a consistent pattern:

### 1. State Management

```typescript
const [activeCategory, setActiveCategory] = useState("All");
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 2. Data Fetching

```typescript
useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const data = await browseAPI({
        category: activeCategory === "All" ? undefined : activeCategory,
        limit: 50,
      });
      const transformedData = transformAPIResponse(data);
      setData(transformedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [activeCategory]);
```

### 3. UI States

```typescript
{/* Loading state */}
{loading && (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C30FF]"></div>
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
)}

{/* Error state */}
{error && (
  <div className="text-center py-12">
    <p className="text-red-600">{error}</p>
  </div>
)}

{/* Data grid */}
{!loading && !error && (
  <>
    {data.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-600">No results found.</p>
      </div>
    ) : (
      <div className="grid ...">
        {data.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    )}
  </>
)}
```

## API Endpoints Used

| Page                    | API Function            | Endpoint                    |
| ----------------------- | ----------------------- | --------------------------- |
| `/talents`              | `browseTalents()`       | `GET /api/v1/talents`       |
| `/mentors`              | `browseMentors()`       | `GET /api/v1/mentors`       |
| `/recruiters`           | `browseRecruiters()`    | `GET /api/v1/recruiters`    |
| `/opportunities-public` | `browseOpportunities()` | `GET /api/v1/opportunities` |

## Query Parameters

All browse endpoints support these common parameters:

- `category` - Filter by category (optional)
- `limit` - Number of results to return (default: 50)
- `offset` - Pagination offset (optional)
- `search` - Search query (optional, not yet implemented in UI)

## Error Handling

All pages implement consistent error handling:

1. **Network Errors**: Caught in try/catch, displayed to user
2. **Empty Results**: Shows "No results found" message
3. **Loading States**: Shows spinner during fetch
4. **Console Logging**: Errors logged for debugging

### API Response Format Fix

The backend API returns data wrapped in an object with `data` and `pagination` properties:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

All API client functions have been updated to extract the `data` property from this response.

### Object-to-String Extraction

The API may return array fields containing objects instead of strings (e.g., `{name: "Full-time"}` instead of `"Full-time"`). All listing pages now include an `extractStrings()` helper function that:

1. Checks if the field is an array
2. Maps each item to extract string values:
   - If item is already a string, use it as-is
   - If item is an object with a `name` property, extract `item.name`
   - Otherwise, convert to string using `String(item)`

This ensures all array fields contain only strings, preventing React rendering errors like "Objects are not valid as a React child".

**Fields Using Object-to-String Extraction:**

- **Talents**: `skills`, `stack`, `availability`
- **Mentors**: `expertise`
- **Recruiters**: `hiringFor`
- **Opportunities**: `skills`

**Implementation Example:**

```typescript
const extractStrings = (arr: any): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null && "name" in item)
      return item.name;
    return String(item);
  });
};
```

## TypeScript Interfaces

Each page defines interfaces for the transformed data:

- `TalentData` - Talent card data
- `MentorCardData` - Mentor card data
- `RecruiterData` - Recruiter card data
- `PublicOpportunity` - Opportunity card data

## Files Modified

```
app/talents/page.tsx              # Added API integration
app/mentors/page.tsx              # Added API integration
app/recruiters/page.tsx           # Added API integration
app/opportunities-public/page.tsx # Added API integration
```

## Testing Status

### TypeScript Validation

✅ All files pass TypeScript compilation with no errors

### Manual Testing Required

- [ ] Test each listing page with real backend
- [ ] Verify category filtering works
- [ ] Test loading states
- [ ] Test error handling
- [ ] Verify empty states
- [ ] Check pagination (if implemented)

## Migration Notes

### Mock Data Removed

The following hardcoded data arrays were removed:

- `talents` array in `/talents` page
- `mentors` array in `/mentors` page
- `recruiters` array in `/recruiters` page
- `opportunities` array in `/opportunities-public` page

### Component Compatibility

All existing card components remain unchanged:

- `TalentCard` from `@/components/DiscoverTalent/TalentCard`
- `MentorCard` from `@/components/talent/mentorship/MentorCard`
- `RecruiterCard` (inline component)
- `OpportunityCardPublic` (inline component)

## Performance Considerations

1. **Client-Side Rendering**: All pages use "use client" directive for interactivity
2. **Fetch on Mount**: Data fetched when page loads
3. **Category Changes**: New fetch triggered when category filter changes
4. **No Caching**: Currently no client-side caching (can be added later)

## Future Enhancements

1. **Pagination**: Add pagination for large result sets
2. **Search**: Implement search functionality
3. **Filters**: Add more filter options (location, skills, etc.)
4. **Caching**: Add client-side caching to reduce API calls
5. **Infinite Scroll**: Replace pagination with infinite scroll
6. **Loading Skeletons**: Replace spinner with skeleton screens

## Related Documentation

- [PUBLIC_DISCOVERY_APIS.md](./PUBLIC_DISCOVERY_APIS.md) - API documentation
- [PUBLIC_DETAIL_PAGES_API_INTEGRATION.md](./PUBLIC_DETAIL_PAGES_API_INTEGRATION.md) - Detail pages integration
- [PUBLIC_DETAIL_PAGES_IMPLEMENTATION_SUMMARY.md](./PUBLIC_DETAIL_PAGES_IMPLEMENTATION_SUMMARY.md) - Overall summary

---

**Implementation Date:** April 6, 2026
**Status:** ✅ Complete - Ready for Testing
