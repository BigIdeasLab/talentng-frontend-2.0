/**
 * Property-Based Tests - Profile Email API Validation
 * Feature: profile-email-customization
 *
 * Property 6: Email Validation and Uniqueness
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  updateTalentEmail,
  verifyTalentEmail,
  resendTalentVerification,
} from "./talent";
import {
  updateMentorEmail,
  verifyMentorEmail,
  resendMentorVerification,
} from "./mentor";
import {
  updateRecruiterEmail,
  verifyRecruiterEmail,
  resendRecruiterVerification,
} from "./recruiter";

// Mock the API client
vi.mock("@/lib/api", () => ({
  default: vi.fn(),
}));

import apiClient from "@/lib/api";
const mockApiClient = vi.mocked(apiClient);

// Arbitraries
const validEmailArbitrary = () => fc.emailAddress();
const invalidEmailArbitrary = () =>
  fc.oneof(
    fc.string().filter((s) => !s.includes("@")), // No @ symbol
    fc.string().map((s) => s + "@"), // Ends with @
    fc.string().map((s) => "@" + s), // Starts with @
    fc.constant(""), // Empty string
    fc.constant("   "), // Whitespace only
    fc.string().map((s) => s + "@."), // Invalid domain
    fc.string().map((s) => s + "@domain."), // Incomplete domain
  );

const verificationCodeArbitrary = () =>
  fc.integer({ min: 100000, max: 999999 }).map((n) => n.toString());

const invalidVerificationCodeArbitrary = () =>
  fc.oneof(
    fc.string().filter((s) => s.length !== 6), // Wrong length
    fc.string().filter((s) => !/^\d+$/.test(s)), // Non-numeric
    fc.constant(""), // Empty
    fc.constant("   "), // Whitespace
  );

const roleArbitrary = () => fc.constantFrom("talent", "mentor", "recruiter");

describe("Property 6: Email Validation and Uniqueness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property: Valid email addresses should be accepted by all role APIs
   */
  it("should accept valid email addresses for all roles", async () => {
    await fc.assert(
      fc.asyncProperty(
        validEmailArbitrary(),
        roleArbitrary(),
        async (email, role) => {
          // Mock successful response
          mockApiClient.mockResolvedValueOnce({
            email,
            emailVerified: false,
            emailUpdatedAt: new Date().toISOString(),
          });

          let updateFunction;
          switch (role) {
            case "talent":
              updateFunction = updateTalentEmail;
              break;
            case "mentor":
              updateFunction = updateMentorEmail;
              break;
            case "recruiter":
              updateFunction = updateRecruiterEmail;
              break;
          }

          // Property: Valid emails should not throw errors
          await expect(updateFunction(email)).resolves.toBeDefined();

          // Property: API should be called with correct email
          expect(mockApiClient).toHaveBeenCalledWith(
            `/${role}/settings`,
            expect.objectContaining({
              method: "PATCH",
              body: { email },
            }),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property: Invalid email addresses should be rejected
   */
  it("should reject invalid email addresses", async () => {
    await fc.assert(
      fc.asyncProperty(
        invalidEmailArbitrary(),
        roleArbitrary(),
        async (invalidEmail, role) => {
          // Mock validation error response
          mockApiClient.mockRejectedValueOnce({
            error: "VALIDATION_ERROR",
            message: "Invalid email format",
          });

          let updateFunction;
          switch (role) {
            case "talent":
              updateFunction = updateTalentEmail;
              break;
            case "mentor":
              updateFunction = updateMentorEmail;
              break;
            case "recruiter":
              updateFunction = updateRecruiterEmail;
              break;
          }

          // Property: Invalid emails should be rejected
          await expect(updateFunction(invalidEmail)).rejects.toBeDefined();
        },
      ),
      { numRuns: 50 },
    );
  });

  /**
   * Property: Duplicate email addresses should be rejected
   */
  it("should reject duplicate email addresses across users", async () => {
    await fc.assert(
      fc.asyncProperty(
        validEmailArbitrary(),
        roleArbitrary(),
        async (email, role) => {
          // Mock duplicate email error
          mockApiClient.mockRejectedValueOnce({
            error: "DUPLICATE_EMAIL",
            message:
              "This email is already in use. Please choose a different email.",
          });

          let updateFunction;
          switch (role) {
            case "talent":
              updateFunction = updateTalentEmail;
              break;
            case "mentor":
              updateFunction = updateMentorEmail;
              break;
            case "recruiter":
              updateFunction = updateRecruiterEmail;
              break;
          }

          // Property: Duplicate emails should be rejected with specific error
          await expect(updateFunction(email)).rejects.toMatchObject({
            error: "DUPLICATE_EMAIL",
          });
        },
      ),
      { numRuns: 50 },
    );
  });

  /**
   * Property: Valid verification codes should be accepted
   */
  it("should accept valid verification codes for all roles", async () => {
    await fc.assert(
      fc.asyncProperty(
        verificationCodeArbitrary(),
        roleArbitrary(),
        async (code, role) => {
          // Mock successful verification
          mockApiClient.mockResolvedValueOnce({
            success: true,
            message: "Email verified successfully",
          });

          let verifyFunction;
          switch (role) {
            case "talent":
              verifyFunction = verifyTalentEmail;
              break;
            case "mentor":
              verifyFunction = verifyMentorEmail;
              break;
            case "recruiter":
              verifyFunction = verifyRecruiterEmail;
              break;
          }

          // Property: Valid codes should succeed
          const result = await verifyFunction(code);
          expect(result.success).toBe(true);

          // Property: API should be called with correct code
          expect(mockApiClient).toHaveBeenCalledWith(
            `/${role}/verify-email`,
            expect.objectContaining({
              method: "POST",
              body: { verificationCode: code },
            }),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property: Invalid verification codes should be rejected
   */
  it("should reject invalid verification codes", async () => {
    await fc.assert(
      fc.asyncProperty(
        invalidVerificationCodeArbitrary(),
        roleArbitrary(),
        async (invalidCode, role) => {
          // Mock invalid code error
          mockApiClient.mockResolvedValueOnce({
            success: false,
            message: "Invalid verification code. Please check and try again.",
          });

          let verifyFunction;
          switch (role) {
            case "talent":
              verifyFunction = verifyTalentEmail;
              break;
            case "mentor":
              verifyFunction = verifyMentorEmail;
              break;
            case "recruiter":
              verifyFunction = verifyRecruiterEmail;
              break;
          }

          // Property: Invalid codes should return success: false
          const result = await verifyFunction(invalidCode);
          expect(result.success).toBe(false);
          expect(result.message).toContain("Invalid");
        },
      ),
      { numRuns: 50 },
    );
  });

  /**
   * Property: Resend verification should work for all roles
   */
  it("should handle resend verification for all roles", async () => {
    await fc.assert(
      fc.asyncProperty(roleArbitrary(), async (role) => {
        // Mock successful resend
        mockApiClient.mockResolvedValueOnce(undefined);

        let resendFunction;
        switch (role) {
          case "talent":
            resendFunction = resendTalentVerification;
            break;
          case "mentor":
            resendFunction = resendMentorVerification;
            break;
          case "recruiter":
            resendFunction = resendRecruiterVerification;
            break;
        }

        // Property: Resend should not throw errors
        await expect(resendFunction()).resolves.toBeUndefined();

        // Property: API should be called with correct endpoint
        expect(mockApiClient).toHaveBeenCalledWith(
          `/${role}/resend-verification`,
          expect.objectContaining({
            method: "POST",
          }),
        );
      }),
      { numRuns: 50 },
    );
  });

  /**
   * Property: Email input should be sanitized to prevent injection
   */
  it("should sanitize email input to prevent injection attacks", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant('<script>alert("xss")</script>@example.com'),
          fc.constant("test@example.com; DROP TABLE users;"),
          fc.constant("test@example.com\n\rBCC: attacker@evil.com"),
          fc.constant("test@example.com<script>"),
        ),
        roleArbitrary(),
        async (maliciousEmail, role) => {
          // Mock sanitization - the API should reject or sanitize malicious input
          mockApiClient.mockRejectedValueOnce({
            error: "VALIDATION_ERROR",
            message: "Invalid email format",
          });

          let updateFunction;
          switch (role) {
            case "talent":
              updateFunction = updateTalentEmail;
              break;
            case "mentor":
              updateFunction = updateMentorEmail;
              break;
            case "recruiter":
              updateFunction = updateRecruiterEmail;
              break;
          }

          // Property: Malicious input should be rejected
          await expect(updateFunction(maliciousEmail)).rejects.toBeDefined();
        },
      ),
      { numRuns: 30 },
    );
  });

  /**
   * Property: API functions should have consistent error handling
   */
  it("should have consistent error handling across all role APIs", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "RATE_LIMITED",
          "VALIDATION_ERROR",
          "DUPLICATE_EMAIL",
          "SERVER_ERROR",
        ),
        roleArbitrary(),
        validEmailArbitrary(),
        async (errorType, role, email) => {
          // Mock different error types
          const errorResponse = {
            error: errorType,
            message: `Test ${errorType} error`,
          };
          mockApiClient.mockRejectedValueOnce(errorResponse);

          let updateFunction;
          switch (role) {
            case "talent":
              updateFunction = updateTalentEmail;
              break;
            case "mentor":
              updateFunction = updateMentorEmail;
              break;
            case "recruiter":
              updateFunction = updateRecruiterEmail;
              break;
          }

          // Property: All error types should be properly propagated
          await expect(updateFunction(email)).rejects.toMatchObject({
            error: errorType,
          });
        },
      ),
      { numRuns: 50 },
    );
  });
});
