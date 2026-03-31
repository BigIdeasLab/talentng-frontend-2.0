import type { FeatureConfig } from "../types.js";

/**
 * API Endpoint Configurations for TalentNG Platform
 *
 * These endpoints are based on the actual API response structures.
 * Updated to match real backend responses.
 */
export const API_ENDPOINTS: FeatureConfig[] = [
  {
    name: "User Profile",
    endpoints: [
      {
        path: "/users/me",
        method: "GET",
        schema: {
          id: { type: "string", required: true },
          username: { type: "string", required: true },
          email: { type: "string", required: true },
          roles: { type: "array", required: true }, // Note: "roles" not "role"
          status: { type: "string", required: true },
          isVerified: { type: "boolean", required: true },
          createdAt: { type: "string", required: true },
          updatedAt: { type: "string", required: true },
        },
      },
    ],
  },
  {
    name: "Opportunities (Public)",
    endpoints: [
      {
        path: "/opportunities",
        method: "GET",
        schema: {
          data: {
            type: "array",
            required: true,
            arrayItemSchema: {
              id: { type: "string", required: true },
              title: { type: "string", required: true },
              description: { type: "string", required: true },
              type: { type: "string", required: true },
              tags: { type: "array", required: false },
            },
          },
          // Note: API doesn't return total/limit/offset at root level
        },
        detailEndpoints: [
          {
            pathTemplate: "/opportunities/:id",
            idField: "id",
            schema: {
              id: { type: "string", required: true },
              title: { type: "string", required: true },
              description: { type: "string", required: true },
              type: { type: "string", required: true },
              requirements: { type: "array", required: false },
              tags: { type: "array", required: false },
            },
          },
        ],
      },
    ],
  },
  {
    name: "Talent Profile",
    endpoints: [
      {
        path: "/talent/profile",
        method: "GET",
        schema: {
          profile: {
            type: "object",
            required: true,
            objectSchema: {
              id: { type: "string", required: true },
              userId: { type: "string", required: true },
              fullName: { type: "string", required: false },
              headline: { type: "string", required: false },
              bio: { type: "string", required: false },
              skills: { type: "array", required: false },
              profileImageUrl: { type: "string", required: false },
            },
          },
        },
      },
    ],
  },
  {
    name: "Talent Dashboard",
    endpoints: [
      {
        path: "/talent/dashboard",
        method: "GET",
        schema: {
          user: {
            type: "object",
            required: true,
            objectSchema: {
              name: { type: "string", required: true },
              greeting: { type: "string", required: false },
            },
          },
          welcome: {
            type: "object",
            required: false,
            objectSchema: {
              newOpportunities: { type: "number", required: false },
              profileViewsIncreasePercent: { type: "number", required: false },
            },
          },
          stats: {
            type: "object",
            required: false,
          },
        },
      },
    ],
  },
  {
    name: "Talent Opportunities",
    endpoints: [
      {
        path: "/talent/opportunities",
        method: "GET",
        schema: {
          data: {
            type: "array",
            required: true,
            arrayItemSchema: {
              id: { type: "string", required: true },
              title: { type: "string", required: true },
              description: { type: "string", required: true },
              type: { type: "string", required: true },
            },
          },
          // Note: API doesn't return total/limit/offset at root level
        },
      },
    ],
  },
];
