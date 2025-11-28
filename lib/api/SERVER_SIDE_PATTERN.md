# Server-side API Pattern

This document outlines the pattern for server-side API calls using `serverApiClient` in Next.js Server Components and Server Actions.

## Overview

- **Client-side API calls** (`lib/api/*/index.ts`): Use `apiClient` from centralized client with token refresh logic
- **Server-side API calls** (`lib/api/*/server.ts`): Use `serverApiClient` which retrieves tokens from cookies

## Why Use Server-side APIs?

1. **Security**: Tokens are stored in httpOnly cookies and never exposed to client
2. **Performance**: Initial data loads don't require client-side network requests
3. **User Experience**: Pages render with data immediately (no loading states for initial load)
4. **Simplified Client Code**: No useEffect for initial data fetching

## Pattern

### 1. Create Server API Module

Create `lib/api/{module}/server.ts` for each API module that needs server-side calls:

```typescript
/**
 * Server-side {Module} API Client
 * Used only in Next.js Server Components and Server Actions
 */

import serverApiClient from "@/lib/api/server-client";
import type { YourType } from "./types";

/**
 * Brief description of what this endpoint does
 * GET /endpoint
 */
export async function getServerYourFunction(): Promise<YourType> {
  return serverApiClient<YourType>("/endpoint");
}
```

### 2. Server Data Fetching (Optional but Recommended)

Create `app/(business)/{page}/server-data.ts` for page-level data fetching:

```typescript
/**
 * Server-side data fetching for {page}
 */

import { getServerYourFunction } from "@/lib/api/{module}/server";

export async function getPageData() {
  try {
    const data = await getServerYourFunction();
    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error loading data on server:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to load data",
    };
  }
}
```

### 3. Update Page Component

Convert page to async Server Component, fetch data, pass to Client Component:

```typescript
// page.tsx (Server Component)
import { getPageData } from "./server-data";
import { PageClient } from "./page-client";

export default async function Page() {
  const { data, error } = await getPageData();

  return <PageClient initialData={data} initialError={error} />;
}
```

```typescript
// page-client.tsx (Client Component)
"use client";

import { useState } from "react";

interface PageClientProps {
  initialData: YourType | null;
  initialError: string | null;
}

export function PageClient({ initialData, initialError }: PageClientProps) {
  const [data, setData] = useState(initialData);

  return (
    <div>
      {/* Render with initial data */}
    </div>
  );
}
```

## Key Rules

1. **Server API files must be in `lib/api/*/server.ts`** - Clear naming convention
2. **Never use `"use client"` in server API files** - They're only for server-side execution
3. **Only fetch data that's safe on the server** - Don't fetch user-specific real-time data on initial load
4. **Handle errors gracefully** - Always return { data: null, error: message }
5. **Keep client components small** - They should only handle interactivity, not data fetching

## When to Use Server-side APIs

✅ Initial data loads for pages
✅ Protected data that requires authentication
✅ Data that's heavy to compute on client
✅ SEO-critical data

❌ Real-time user actions (click handlers, form submissions)
❌ Browser APIs (localStorage, window, etc.)
❌ Frequently updated data

## Available Server API Modules

- `lib/api/talent/server.ts` - Talent profile and dashboard data
- `lib/api/users/server.ts` - User account and onboarding data
- `lib/api/applications/server.ts` - User applications list
- `lib/api/notifications/server.ts` - Notifications and alerts
- *More can be added as needed*

## Example: Profile Page

See `app/(business)/profile/page.tsx` and related files for a complete implementation.
