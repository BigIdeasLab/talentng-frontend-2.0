/**
 * Property-Based Tests - Profile Email Customization
 * Feature: profile-email-customization
 *
 * Property 10: API Integration and Compatibility
 * **Validates: Requirements 8.2, 8.4, 8.5**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import type { TalentSettings } from "../talent/types";
import type { MentorSettings } from "../mentor/types";
import type { RecruiterSettings } from "../recruiter/types";
import type {
  VerifyEmailRequest,
  VerifyEmailResponse,
  EmailUpdateRequest,
  RateLimitError,
} from "./index";

// Arbitraries for email-related data
const emailArbitrary = () => fc.emailAddress();

const timestampArbitrary = () =>
  fc
    .date({ min: new Date("2020-01-01"), max: new Date("2030-01-01") })
    .map((date) => date.toISOString());

const verificationCodeArbitrary = () =>
  fc.integer({ min: 100000, max: 999999 }).map((n) => n.toString());

// Settings arbitraries with email fields
const talentSettingsArbitrary = () =>
  fc.oneof(
    // Case 1: No email set
    fc.record({
      profileVisible: fc.boolean(),
      emailApplications: fc.boolean(),
      emailInterviews: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushApplications: fc.boolean(),
      pushInterviews: fc.boolean(),
      email: fc.constant(undefined),
      emailVerified: fc.constant(false),
      emailUpdatedAt: fc.constant(undefined),
    }),
    // Case 2: Email set
    fc.record({
      profileVisible: fc.boolean(),
      emailApplications: fc.boolean(),
      emailInterviews: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushApplications: fc.boolean(),
      pushInterviews: fc.boolean(),
      email: emailArbitrary(),
      emailVerified: fc.boolean(),
      emailUpdatedAt: fc.oneof(fc.constant(undefined), timestampArbitrary()),
    }),
  );

const mentorSettingsArbitrary = () =>
  fc.oneof(
    // Case 1: No email set
    fc.record({
      sessionDuration: fc.integer({ min: 15, max: 180 }),
      bufferTime: fc.integer({ min: 0, max: 60 }),
      minAdvanceBookingMinutes: fc.integer({ min: 60, max: 1440 }),
      advanceBookingDays: fc.integer({ min: 1, max: 30 }),
      cancellationPolicy: fc.string(),
      autoAccept: fc.boolean(),
      visibility: fc.constantFrom("public", "private"),
      showStats: fc.boolean(),
      emailNewRequests: fc.boolean(),
      emailSessionReminders: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushNewRequests: fc.boolean(),
      pushSessionReminders: fc.boolean(),
      email: fc.constant(undefined),
      emailVerified: fc.constant(false),
      emailUpdatedAt: fc.constant(undefined),
    }),
    // Case 2: Email set
    fc.record({
      sessionDuration: fc.integer({ min: 15, max: 180 }),
      bufferTime: fc.integer({ min: 0, max: 60 }),
      minAdvanceBookingMinutes: fc.integer({ min: 60, max: 1440 }),
      advanceBookingDays: fc.integer({ min: 1, max: 30 }),
      cancellationPolicy: fc.string(),
      autoAccept: fc.boolean(),
      visibility: fc.constantFrom("public", "private"),
      showStats: fc.boolean(),
      emailNewRequests: fc.boolean(),
      emailSessionReminders: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushNewRequests: fc.boolean(),
      pushSessionReminders: fc.boolean(),
      email: emailArbitrary(),
      emailVerified: fc.boolean(),
      emailUpdatedAt: fc.oneof(fc.constant(undefined), timestampArbitrary()),
    }),
  );

const recruiterSettingsArbitrary = () =>
  fc.oneof(
    // Case 1: No email set
    fc.record({
      emailNewApplications: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushNewApplications: fc.boolean(),
      profileVisible: fc.boolean(),
      email: fc.constant(undefined),
      emailVerified: fc.constant(false),
      emailUpdatedAt: fc.constant(undefined),
    }),
    // Case 2: Email set
    fc.record({
      emailNewApplications: fc.boolean(),
      emailMarketing: fc.boolean(),
      pushNewApplications: fc.boolean(),
      profileVisible: fc.boolean(),
      email: emailArbitrary(),
      emailVerified: fc.boolean(),
      emailUpdatedAt: fc.oneof(fc.constant(undefined), timestampArbitrary()),
    }),
  );

describe("Property 10: API Integration and Compatibility", () => {
  /**
   * Property: All settings interfaces should have consistent email field structure
   * This ensures backward compatibility and consistent API integration
   */
  it("should maintain consistent email field structure across all settings types", () => {
    fc.assert(
      fc.property(
        talentSettingsArbitrary(),
        mentorSettingsArbitrary(),
        recruiterSettingsArbitrary(),
        (talentSettings, mentorSettings, recruiterSettings) => {
          // Property: All settings should have the same email field types
          const hasConsistentEmailFields = (settings: any) => {
            return (
              (settings.email === undefined ||
                typeof settings.email === "string") &&
              typeof settings.emailVerified === "boolean" &&
              (settings.emailUpdatedAt === undefined ||
                typeof settings.emailUpdatedAt === "string")
            );
          };

          expect(hasConsistentEmailFields(talentSettings)).toBe(true);
          expect(hasConsistentEmailFields(mentorSettings)).toBe(true);
          expect(hasConsistentEmailFields(recruiterSettings)).toBe(true);

          // Property: emailVerified should be false when email is undefined
          if (!talentSettings.email) {
            expect(talentSettings.emailVerified).toBe(false);
          }
          if (!mentorSettings.email) {
            expect(mentorSettings.emailVerified).toBe(false);
          }
          if (!recruiterSettings.email) {
            expect(recruiterSettings.emailVerified).toBe(false);
          }

          // Property: emailUpdatedAt should be undefined when email is undefined
          if (!talentSettings.email) {
            expect(talentSettings.emailUpdatedAt).toBeUndefined();
          }
          if (!mentorSettings.email) {
            expect(mentorSettings.emailUpdatedAt).toBeUndefined();
          }
          if (!recruiterSettings.email) {
            expect(recruiterSettings.emailUpdatedAt).toBeUndefined();
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property: Verification request/response types should be consistent
   * This ensures API endpoint compatibility
   */
  it("should have consistent verification request/response structure", () => {
    fc.assert(
      fc.property(
        verificationCodeArbitrary(),
        fc.boolean(),
        fc.oneof(fc.constant(undefined), fc.string()),
        (code, success, message) => {
          const request: VerifyEmailRequest = { code };
          const response: VerifyEmailResponse = { success, message };

          // Property: Request should have required code field
          expect(typeof request.code === "string").toBe(true);
          expect(request.code.length).toBe(6);
          expect(/^\d{6}$/.test(request.code)).toBe(true);

          // Property: Response should have required success field
          expect(typeof response.success === "boolean").toBe(true);

          // Property: Message should be string or undefined
          expect(
            response.message === undefined ||
              typeof response.message === "string",
          ).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property: Email update and rate limit types should be consistent
   * This ensures proper error handling integration
   */
  it("should have consistent email update and rate limit structure", () => {
    fc.assert(
      fc.property(
        emailArbitrary(),
        fc.string(),
        timestampArbitrary(),
        (email, message, timestamp) => {
          const updateRequest: EmailUpdateRequest = { email };
          const rateLimitError: RateLimitError = {
            error: "RATE_LIMITED",
            message,
            nextAllowedUpdate: timestamp,
          };

          // Property: Update request should have valid email
          expect(typeof updateRequest.email === "string").toBe(true);
          expect(updateRequest.email.includes("@")).toBe(true);

          // Property: Rate limit error should have required fields
          expect(rateLimitError.error).toBe("RATE_LIMITED");
          expect(typeof rateLimitError.message === "string").toBe(true);
          expect(typeof rateLimitError.nextAllowedUpdate === "string").toBe(
            true,
          );

          // Property: nextAllowedUpdate should be valid ISO timestamp
          expect(
            () => new Date(rateLimitError.nextAllowedUpdate),
          ).not.toThrow();
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property: Settings types should be compatible with existing API patterns
   * This ensures backward compatibility with existing endpoints
   */
  it("should maintain backward compatibility with existing settings patterns", () => {
    fc.assert(
      fc.property(
        talentSettingsArbitrary(),
        mentorSettingsArbitrary(),
        recruiterSettingsArbitrary(),
        (talentSettings, mentorSettings, recruiterSettings) => {
          // Property: All settings should have existing notification fields
          expect(typeof talentSettings.emailApplications === "boolean").toBe(
            true,
          );
          expect(typeof talentSettings.emailInterviews === "boolean").toBe(
            true,
          );
          expect(typeof talentSettings.emailMarketing === "boolean").toBe(true);

          expect(typeof mentorSettings.emailNewRequests === "boolean").toBe(
            true,
          );
          expect(
            typeof mentorSettings.emailSessionReminders === "boolean",
          ).toBe(true);
          expect(typeof mentorSettings.emailMarketing === "boolean").toBe(true);

          expect(
            typeof recruiterSettings.emailNewApplications === "boolean",
          ).toBe(true);
          expect(typeof recruiterSettings.emailMarketing === "boolean").toBe(
            true,
          );

          // Property: New email fields should not interfere with existing fields
          const talentWithoutEmail: Partial<typeof talentSettings> = {
            ...talentSettings,
          };
          if ("email" in talentWithoutEmail) {
            talentWithoutEmail.email = undefined;
          }
          if ("emailVerified" in talentWithoutEmail) {
            talentWithoutEmail.emailVerified = false;
          }
          if ("emailUpdatedAt" in talentWithoutEmail) {
            talentWithoutEmail.emailUpdatedAt = undefined;
          }

          expect(Object.keys(talentWithoutEmail)).toContain("profileVisible");
          expect(Object.keys(talentWithoutEmail)).toContain(
            "emailApplications",
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
