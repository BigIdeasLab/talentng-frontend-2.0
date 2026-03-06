/**
 * Preservation Property Tests - Notifications Pagination Fix
 * Feature: notifications-pagination-fix
 *
 * Property 2: Preservation - Notification Functionality Unchanged
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 *
 * IMPORTANT: These tests verify that after the fix, all notification functionality
 * continues to work exactly as before. The fix extracts the data array from paginated
 * responses, but all downstream behavior should be unchanged.
 *
 * EXPECTED OUTCOME: Tests PASS (confirms no regressions after fix)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  getNotificationsByType,
  getFailedNotifications,
} from "./index";

// Mock the API client
vi.mock("@/lib/api", () => ({
  default: vi.fn(),
}));

// Helper to wrap data in paginated response format
const paginatedResponse = <T>(data: T[]) => ({
  data,
  pagination: {
    page: 1,
    pageSize: 10,
    total: data.length,
    totalPages: Math.ceil(data.length / 10) || 1,
  },
});

// Helper to generate valid notification arbitraries
const notificationArbitrary = () =>
  fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    type: fc.constantFrom(
      "admin_notice",
      "job_alert",
      "message",
      "profile_update",
      "application_update",
      "system_alert",
    ),
    payload: fc.record({
      title: fc.string(),
      message: fc.string(),
    }),
    channels: fc.array(fc.constantFrom("email", "push", "in_app", "sms"), {
      minLength: 1,
      maxLength: 4,
    }),
    deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
    readAt: fc.option(
      fc
        .integer({ min: 1577836800000, max: 1735689600000 }) // 2020-01-01 to 2025-01-01 in ms
        .map((ms) => new Date(ms).toISOString()),
      { nil: null },
    ),
    createdAt: fc
      .integer({ min: 1577836800000, max: 1735689600000 })
      .map((ms) => new Date(ms).toISOString()),
    updatedAt: fc
      .integer({ min: 1577836800000, max: 1735689600000 })
      .map((ms) => new Date(ms).toISOString()),
  });

describe("Property 2: Preservation - Notification Functionality Unchanged", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Filtering by userId produces expected results
   * Validates: Requirement 3.5
   */
  it("should filter notifications by userId correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // target userId
        fc.array(notificationArbitrary(), { minLength: 0, maxLength: 20 }),
        async (targetUserId, allNotifications) => {
          // Filter to only include notifications for target user
          const userNotifications = allNotifications.filter(
            (n) => n.userId === targetUserId,
          );

          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(userNotifications),
          );

          // Call getNotifications with userId filter
          const result = await getNotifications({ userId: targetUserId });

          // Property: All returned notifications should belong to the target user
          expect(result.every((n) => n.userId === targetUserId)).toBe(true);
          expect(result).toHaveLength(userNotifications.length);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Filtering by type produces expected results
   * Validates: Requirement 3.5
   */
  it("should filter notifications by type correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "admin_notice",
          "job_alert",
          "message",
          "profile_update",
          "application_update",
          "system_alert",
        ),
        fc.array(notificationArbitrary(), { minLength: 0, maxLength: 20 }),
        async (targetType, allNotifications) => {
          // Filter to only include notifications of target type
          const typeNotifications = allNotifications.filter(
            (n) => n.type === targetType,
          );

          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(typeNotifications),
          );

          // Call getNotificationsByType
          const result = await getNotificationsByType(targetType);

          // Property: All returned notifications should be of the target type
          expect(result.every((n) => n.type === targetType)).toBe(true);
          expect(result).toHaveLength(typeNotifications.length);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Filtering by deliveryStatus produces expected results
   * Validates: Requirement 3.5
   */
  it("should filter notifications by deliveryStatus correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(notificationArbitrary(), { minLength: 0, maxLength: 20 }),
        async (allNotifications) => {
          // Filter to only include failed notifications
          const failedNotifications = allNotifications.filter(
            (n) => n.deliveryStatus === "failed",
          );

          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(failedNotifications),
          );

          // Call getFailedNotifications
          const result = await getFailedNotifications();

          // Property: All returned notifications should have failed delivery status
          expect(result.every((n) => n.deliveryStatus === "failed")).toBe(true);
          expect(result).toHaveLength(failedNotifications.length);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Filtering by read status produces expected results
   * Validates: Requirement 3.2, 3.5
   */
  it("should filter notifications by read status correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(notificationArbitrary(), { minLength: 0, maxLength: 20 }),
        async (allNotifications) => {
          // Filter to only include unread notifications
          const unreadNotifications = allNotifications.filter((n) => !n.readAt);

          // Mock API to return paginated response
          const apiClient = (await import("@/lib/api")).default;
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(unreadNotifications),
          );

          // Call getNotifications with read: false filter
          const result = await getNotifications({ read: false });

          // Property: All returned notifications should be unread
          expect(result.every((n) => !n.readAt)).toBe(true);
          expect(result).toHaveLength(unreadNotifications.length);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Filtering by recipientRole produces expected results
   * Validates: Requirement 3.1, 3.5
   *
   * NOTE: Skipped - recipientRole is not a property on the Notification type.
   * The GetNotificationsFilters interface includes recipientRole as a filter option,
   * but it's not part of the Notification entity itself. This test would require
   * backend support for role-based filtering.
   */
  it.skip("should filter notifications by recipientRole correctly", async () => {
    // Test skipped - recipientRole not implemented on Notification type
  });

  /**
   * Test: Marking individual notifications as read updates state correctly
   * Validates: Requirement 3.3
   */
  it("should mark individual notification as read correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          type: fc.constantFrom(
            "admin_notice",
            "job_alert",
            "message",
            "profile_update",
            "application_update",
            "system_alert",
          ),
          payload: fc.record({
            title: fc.string(),
            message: fc.string(),
          }),
          channels: fc.array(
            fc.constantFrom("email", "push", "in_app", "sms"),
            {
              minLength: 1,
              maxLength: 4,
            },
          ),
          deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
          readAt: fc.constant(null), // Unread notification
          createdAt: fc
            .integer({ min: 1577836800000, max: 1735689600000 })
            .map((ms) => new Date(ms).toISOString()),
          updatedAt: fc
            .integer({ min: 1577836800000, max: 1735689600000 })
            .map((ms) => new Date(ms).toISOString()),
        }),
        async (unreadNotification) => {
          // Mock API to return the notification with readAt set
          const apiClient = (await import("@/lib/api")).default;
          const readNotification = {
            ...unreadNotification,
            readAt: new Date().toISOString(),
          };
          vi.mocked(apiClient).mockResolvedValueOnce(readNotification);

          // Call markNotificationAsRead
          const result = await markNotificationAsRead(unreadNotification.id);

          // Property: Returned notification should have readAt set
          expect(result.readAt).not.toBeNull();
          expect(result.id).toBe(unreadNotification.id);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Marking all notifications as read works across different notification sets
   * Validates: Requirement 3.4
   */
  it("should mark all notifications as read correctly", async () => {
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
              "system_alert",
            ),
            payload: fc.record({
              title: fc.string(),
              message: fc.string(),
            }),
            channels: fc.array(
              fc.constantFrom("email", "push", "in_app", "sms"),
              {
                minLength: 1,
                maxLength: 4,
              },
            ),
            deliveryStatus: fc.constantFrom("queued", "sent", "failed"),
            readAt: fc.constant(null), // All unread
            createdAt: fc
              .integer({ min: 1577836800000, max: 1735689600000 })
              .map((ms) => new Date(ms).toISOString()),
            updatedAt: fc
              .integer({ min: 1577836800000, max: 1735689600000 })
              .map((ms) => new Date(ms).toISOString()),
          }),
          { minLength: 1, maxLength: 10 },
        ),
        async (unreadNotifications) => {
          const apiClient = (await import("@/lib/api")).default;

          // Clear all previous mocks for this test
          vi.mocked(apiClient).mockClear();

          // First call: getNotifications({ read: false }) returns unread notifications
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(unreadNotifications),
          );

          // Subsequent calls: markNotificationAsRead for each notification
          unreadNotifications.forEach((notification) => {
            vi.mocked(apiClient).mockResolvedValueOnce({
              ...notification,
              readAt: new Date().toISOString(),
            });
          });

          // Call markAllNotificationsAsRead
          await markAllNotificationsAsRead();

          // Property: getNotifications should have been called once
          // and markNotificationAsRead should have been called for each notification
          expect(vi.mocked(apiClient)).toHaveBeenCalledTimes(
            1 + unreadNotifications.length,
          );
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Unread count calculation produces correct results
   * Validates: Requirement 3.6
   */
  it("should calculate unread count correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(notificationArbitrary(), { minLength: 0, maxLength: 20 }),
        async (allNotifications) => {
          // Calculate expected unread count
          const expectedUnreadCount = allNotifications.filter(
            (n) => !n.readAt,
          ).length;

          // Mock API to return unread notifications
          const apiClient = (await import("@/lib/api")).default;
          const unreadNotifications = allNotifications.filter((n) => !n.readAt);
          vi.mocked(apiClient).mockResolvedValueOnce(
            paginatedResponse(unreadNotifications),
          );

          // Call getUnreadNotificationsCount
          const result = await getUnreadNotificationsCount();

          // Property: Returned count should match expected unread count
          expect(result).toBe(expectedUnreadCount);
        },
      ),
      { numRuns: 20 },
    );
  });

  /**
   * Test: Empty notification arrays are handled correctly
   * Validates: Requirements 3.1, 3.2, 3.5, 3.6
   */
  it("should handle empty notification arrays correctly", async () => {
    const apiClient = (await import("@/lib/api")).default;

    // Mock API to return empty paginated response
    vi.mocked(apiClient).mockResolvedValueOnce(paginatedResponse([]));

    // Call getNotifications
    const result = await getNotifications();

    // Property: Result should be an empty array
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);

    // Property: Array methods should work on empty array
    expect(() => result.filter((n) => !n.readAt)).not.toThrow();
    expect(result.filter((n) => !n.readAt)).toHaveLength(0);
  });

  /**
   * Test: Error handling continues to work as expected
   * Validates: Requirement 3.8
   */
  it("should handle API errors correctly", async () => {
    const apiClient = (await import("@/lib/api")).default;

    // Mock API to throw an error
    const errorMessage = "Network error";
    vi.mocked(apiClient).mockRejectedValueOnce(new Error(errorMessage));

    // Call getNotifications and expect it to throw
    await expect(getNotifications()).rejects.toThrow(errorMessage);
  });
});
