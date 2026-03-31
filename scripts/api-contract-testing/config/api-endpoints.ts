import type { FeatureConfig } from '../types.js';

/**
 * Example API endpoint configurations
 * 
 * This file demonstrates how to configure endpoints for contract testing.
 * Customize this file to match your API structure and expected response schemas.
 */
export const API_ENDPOINTS: FeatureConfig[] = [
  {
    name: 'Profile',
    endpoints: [
      {
        path: '/profile',
        method: 'GET',
        schema: {
          id: { type: 'string', required: true },
          email: { type: 'string', required: true },
          name: { type: 'string', required: true },
          role: { type: 'string', required: true },
          createdAt: { type: 'string', required: false },
        },
      },
    ],
  },
  {
    name: 'Opportunities',
    endpoints: [
      {
        path: '/opportunities',
        method: 'GET',
        schema: {
          id: { type: 'string', required: true },
          title: { type: 'string', required: true },
          description: { type: 'string', required: true },
          budget: { type: 'number', required: false },
          status: { type: 'string', required: true },
        },
        // Example of detail endpoints that will be tested if list returns data
        detailEndpoints: [
          {
            pathTemplate: '/opportunities/:id',
            idField: 'id',
            schema: {
              id: { type: 'string', required: true },
              title: { type: 'string', required: true },
              description: { type: 'string', required: true },
              budget: { type: 'number', required: false },
              status: { type: 'string', required: true },
              applicants: {
                type: 'array',
                required: true,
                arrayItemSchema: {
                  id: { type: 'string', required: true },
                  name: { type: 'string', required: true },
                },
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Users',
    endpoints: [
      {
        path: '/users',
        method: 'GET',
        schema: {
          id: { type: 'string', required: true },
          email: { type: 'string', required: true },
          name: { type: 'string', required: true },
          role: { type: 'string', required: true },
          profile: {
            type: 'object',
            required: false,
            objectSchema: {
              bio: { type: 'string', required: false },
              avatar: { type: 'string', required: false },
            },
          },
        },
      },
    ],
  },
];
