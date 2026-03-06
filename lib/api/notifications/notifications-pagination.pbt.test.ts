/**
 * Bug Condition Exploration Test - Notifications Pagination Fix
 * Feature: notifications-pagination-fix
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * Property 1: Fault Condition - Extract Data Array from Paginated Response
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 * 
 * This test verifies that when the API returns a paginated response {data: Notification[], pagination: {...}},
 * the client-side code correctly extracts and returns only the data array, ensuring all downstream
 * code receives the expected Notification[] type.
 * 
 * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS with "filter is not a function" or similar
 * This failure proves the bug exists - the API returns an object but the code expects an array.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { getNotifications } from "./index";
import { getServerNotifications } from "./server";
import type { Notification } from "@/lib/types/notification";

// Mock the API clients
vi.mock("@/lib/api", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/api/server-client", () => ({
  default: vi.fn(),
}));

describe("Property 1: Fault Condition - Extract Data Array from Paginated Response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test that getNotifications() returns an array when API returns paginated response
   * 
   * Scoped PBT: Generate paginated responses and verify the result is an array
   * that supports array methods like .filter(), .map()
   */
  it("getNotifications should return an array from paginated response", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of notifications
        fc.array(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            type: fc.constantFrom(
              "admin_notice",
              "job_alert",
              "message",
              "profile_update",
              "application_update",
              "system_alert"
            ),
            payload: fc.record({
              title: fc.string(),
              message: fc.string(),
            }),
            channels: fc.array(
              fc.constantFrom("email", "push", "in_app", "sms"),
              { minLength: 1, maxLength: 4 }
            ),
            deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
            readAt: fc.option(
              fc
                .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
                .map((timestamp) => new Date(timestamp).toISOString()),
              { nil: null }
            ),
            createdAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
            updatedAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (notifications) => {
          // Mock API to return paginated response (the bug condition)
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce({
            data: notifications,
            pagination: {
              page: 1,
              pageSize: 10,
              total: notifications.length,
              totalPages: 1,
            },
          });

          // Call getNotifications
          const result = await getNotifications();

          // Property: Result MUST be an array
          expect(Array.isArray(result)).toBe(true);

          // Property: Array methods MUST work on the result
          expect(() => result.filter((n) => !n.readAt)).not.toThrow();
          expect(() => result.map((n) => n.id)).not.toThrow();

          // Property: Result should contain the same notifications
          expect(result).toHaveLength(notifications.length);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that getServerNotifications() returns an array when API returns paginated response
   */
  it("getServerNotifications should return an array from paginated response", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // userId
        fc.array(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            type: fc.constantFrom(
              "admin_notice",
              "job_alert",
              "message",
              "profile_update",
              "application_update",
              "system_alert"
            ),
            payload: fc.record({
              title: fc.string(),
              message: fc.string(),
            }),
            channels: fc.array(
              fc.constantFrom("email", "push", "in_app", "sms"),
              { minLength: 1, maxLength: 4 }
            ),
            deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
            readAt: fc.option(
              fc
                .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
                .map((timestamp) => new Date(timestamp).toISOString()),
              { nil: null }
            ),
            createdAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
            updatedAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (userId, notifications) => {
          // Mock server API to return paginated response (the bug condition)
          const serverApiClient = (await import("@/lib/api/server-client"))
            .default;
          vi.mocked(serverApiClient).mockResolvedValueOnce({
            data: notifications,
            pagination: {
              page: 1,
              pageSize: 10,
              total: notifications.length,
              totalPages: 1,
            },
          });

          // Call getServerNotifications
          const result = await getServerNotifications(userId);

          // Property: Result MUST be an array
          expect(Array.isArray(result)).toBe(true);

          // Property: Array methods MUST work on the result
          expect(() => result.filter((n) => !n.readAt)).not.toThrow();
          expect(() => result.map((n) => n.id)).not.toThrow();

          // Property: Result should contain the same notifications
          expect(result).toHaveLength(notifications.length);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that markAllNotificationsAsRead can iterate over the result
   * This simulates the bug in markAllNotificationsAsRead() which calls notifications.map()
   */
  it("getNotifications result should support iteration for markAllNotificationsAsRead", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            type: fc.constantFrom(
              "admin_notice",
              "job_alert",
              "message",
              "profile_update",
              "application_update",
              "system_alert"
            ),
            payload: fc.record({
              title: fc.string(),
              message: fc.string(),
            }),
            channels: fc.array(
              fc.constantFrom("email", "push", "in_app", "sms"),
              { minLength: 1, maxLength: 4 }
            ),
            deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
            readAt: fc.constant(null), // Unread notifications
            createdAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
            updatedAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (unreadNotifications) => {
          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce({
            data: unreadNotifications,
            pagination: {
              page: 1,
              pageSize: 10,
              total: unreadNotifications.length,
              totalPages: 1,
            },
          });

          // Call getNotifications with read: false filter
          const result = await getNotifications({ read: false });

          // Property: Result MUST support .map() for iteration
          expect(() => {
            const ids = result.map((notification) => notification.id);
            expect(ids).toHaveLength(unreadNotifications.length);
          }).not.toThrow();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that unread count calculation works (simulates useNotifications hook line 116)
   * This is the exact bug: notifications.filter((n) => !n.readAt) crashes
   */
  it("getNotifications result should support filter for unread count calculation", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            type: fc.constantFrom(
              "admin_notice",
              "job_alert",
              "message",
              "profile_update",
              "application_update",
              "system_alert"
            ),
            payload: fc.record({
              title: fc.string(),
              message: fc.string(),
            }),
            channels: fc.array(
              fc.constantFrom("email", "push", "in_app", "sms"),
              { minLength: 1, maxLength: 4 }
            ),
            deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
            readAt: fc.option(
              fc
                .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
                .map((timestamp) => new Date(timestamp).toISOString()),
              { nil: null }
            ),
            createdAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
            updatedAt: fc
              .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2025-12-31").getTime() })
              .map((timestamp) => new Date(timestamp).toISOString()),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (notifications) => {
          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce({
            data: notifications,
            pagination: {
              page: 1,
              pageSize: 10,
              total: notifications.length,
              totalPages: 1,
            },
          });

          // Call getNotifications
          const result = await getNotifications();

          // Property: This is the exact line that crashes in useNotifications hook (line 116)
          // notifications.filter((n) => !n.readAt).length
          expect(() => {
            const unreadCount = result.filter((n) => !n.readAt).length;
            const expectedUnreadCount = notifications.filter(
              (n) => !n.readAt
            ).length;
            expect(unreadCount).toBe(expectedUnreadCount);
          }).not.toThrow();
        }
      ),
      { numRuns: 20 }
    );
  });
});
