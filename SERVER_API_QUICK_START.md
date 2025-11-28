# Server-side API Quick Start

## What Was Set Up

We've implemented a server-side API pattern for Next.js that uses `serverApiClient` to make secure, authenticated API calls directly from the server.

### Files Created

1. **Server API Modules** - Duplicate endpoints for server-side use:
   - `lib/api/talent/server.ts` - Profile & dashboard data
   - `lib/api/users/server.ts` - User info
   - `lib/api/applications/server.ts` - Applications list
   - `lib/api/notifications/server.ts` - Notifications

2. **Profile Page Refactored** - Example implementation:
   - `app/(business)/profile/page.tsx` - Now an async Server Component
   - `app/(business)/profile/profile-client.tsx` - Client wrapper component
   - `app/(business)/profile/server-data.ts` - Server-side data fetching

3. **Documentation**:
   - `lib/api/SERVER_SIDE_PATTERN.md` - Full pattern documentation

## How It Works

```typescript
// 1. Server Component (page.tsx)
export default async function Page() {
  const { data } = await getPageData(); // Server-side fetch
  return <PageClient initialData={data} />;
}

// 2. Server Data Fetching (server-data.ts)
export async function getPageData() {
  const data = await getServerYourFunction(); // Uses serverApiClient
  return { data, error: null };
}

// 3. Client Wrapper (page-client.tsx)
"use client";
export function PageClient({ initialData }) {
  const [data, setData] = useState(initialData);
  return <div>{/* Interactive UI */}</div>;
}
```

## Benefits

- ✅ No loading state for initial data (renders immediately)
- ✅ Token is secure (never exposed to client)
- ✅ Simpler client components (no useEffect for data fetching)
- ✅ Better performance (no waterfall requests)
- ✅ SEO friendly (data available for static generation)

## To Add Server-side Calls for More Endpoints

1. Create `lib/api/{module}/server.ts`:
   ```typescript
   import serverApiClient from "@/lib/api/server-client";
   
   export async function getServerMyData() {
     return serverApiClient("/endpoint");
   }
   ```

2. Use in Server Components:
   ```typescript
   import { getServerMyData } from "@/lib/api/module/server";
   
   const data = await getServerMyData();
   ```

That's it! No more complex useEffect setups for initial data loads.

## Reference

- Full pattern docs: `lib/api/SERVER_SIDE_PATTERN.md`
- Example: `app/(business)/profile/` directory
- Server client: `lib/api/server-client.ts`
