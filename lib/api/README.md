# API Module Structure

This directory contains all API client modules organized by feature/domain. Each module is self-contained with its own types and API functions.

## Directory Structure

```
lib/api/
├── api.ts                      # Centralized API client (request handling, auth, errors)
├── types/                      # Shared types for all modules
│   ├── index.ts               # Main type exports
│   ├── opportunity.ts
│   ├── application.ts
│   ├── mentor.ts
│   ├── notification.ts
│   ├── learning.ts
│   └── talent.ts
├── auth/                       # Authentication APIs
│   ├── index.ts               # Auth functions (login, register, etc.)
│   └── types.ts               # Auth types
├── opportunities/              # Opportunity APIs
│   ├── index.ts               # Opportunity functions
│   └── types.ts               # Opportunity types
├── applications/               # Application APIs
│   ├── index.ts               # Application functions
│   └── types.ts               # Application types
├── mentors/                    # Mentor APIs
│   ├── index.ts               # Mentor functions
│   └── types.ts               # Mentor types
├── notifications/              # Notification APIs
│   ├── index.ts               # Notification functions
│   └── types.ts               # Notification types
├── learning-resources/         # Learning Resource APIs
│   ├── index.ts               # Learning resource functions
│   └── types.ts               # Learning resource types
├── users/                      # User APIs
│   ├── index.ts               # User functions
│   └── types.ts               # User types
└── talent/                     # Talent Profile APIs
    ├── index.ts               # Talent functions
    └── types.ts               # Talent types
```

## Usage

All API functions and types can be imported directly from `@/lib/api`:

```typescript
// Import specific module functions
import { login, register } from "@/lib/api";
import { getDashboardStats, updateProfile } from "@/lib/api";
import { getOpportunities } from "@/lib/api";

// Import types
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";
import type { Mentor } from "@/lib/api/mentors/types";
import type { Application } from "@/lib/api/applications/types";

// Import the base client
import apiClient from "@/lib/api";
```

## Module Organization

Each module folder contains:

- **types.ts**: Type definitions for that module
- **index.ts**: API functions that use the centralized `apiClient`

Example module structure (auth):

```typescript
// lib/api/auth/types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

// lib/api/auth/index.ts
import apiClient from "@/lib/api";
import type { LoginCredentials } from "./types";

export const login = async (email: string, password: string) => {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
};
```

## Adding a New Module

1. Create a new folder: `lib/api/[module-name]/`
2. Create `types.ts` with your type definitions
3. Create `index.ts` with your API functions
4. Add re-exports to `lib/api.ts`

Example:

```typescript
// lib/api/my-module/types.ts
export interface MyType {
  id: string;
  name: string;
}

// lib/api/my-module/index.ts
import apiClient from "@/lib/api";
import type { MyType } from "./types";

export const getMyData = async () => {
  return apiClient<MyType[]>("/my-endpoint");
};
```

Then add to `lib/api.ts`:

```typescript
export * from "./api/my-module";
```

## Central API Client Features

The centralized `api.ts` provides:

- **Request handling**: Automatic header configuration, JSON serialization
- **Authentication**: Bearer token management
- **Token refresh**: Automatic 401 handling with token refresh
- **Error handling**: User-friendly error messages with status codes
- **FormData support**: Automatic Content-Type handling for file uploads

## Best Practices

1. **Keep modules focused**: Each module should handle one domain
2. **Type everything**: Always define clear interfaces in types.ts
3. **Re-export types**: Export types from index.ts for easier imports
4. **Use apiClient**: Never bypass the centralized client
5. **Document parameters**: Add JSDoc comments for complex functions
6. **Handle errors**: Let the centralized client handle errors consistently
