/**
 * Property-Based Tests - Profile Email UI Components
 * Feature: profile-email-customization
 *
 * Property 7: UI Status Display Accuracy
 * **Validates: Requirements 1.4, 1.5, 5.2, 5.3, 5.6**
 */

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render, screen } from "@testing-library/react";
import { ProfileEmailSection } from "./ProfileEmailSection";
import { StatusIndicator } from "./StatusIndicator";
import type { EmailStatus } from "./types";

// Mock the UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

// Arbitraries
const emailArbitrary = () => fc.emailAddress();
const roleArbitrary = () => fc.constantFrom("talent", "mentor", "recruiter");
const emailStatusArbitrary = () =>
  fc.constantFrom("verified", "pending", "main-email", "rate-limited");
const timestampArbitrary = () =>
  fc
    .integer({ min: 1577836800000, max: 1735689600000 }) // 2020-01-01 to 2025-01-01 in ms
    .map((ms) => new Date(ms).toISOString());

const timestampOrUndefinedArbitrary = () =>
  fc.option(timestampArbitrary(), { nil: undefined });

const roleColorsArbitrary = () =>
  fc.record({
    primary: fc.constant("#3B82F6"),
    primaryHover: fc.constant("#2563EB"),
    dark: fc.constant("#1E40AF"),
    light: fc.constant("#DBEAFE"),
    accent: fc.constant("#60A5FA"),
  });

const profileEmailSectionPropsArbitrary = () =>
  fc.record({
    role: roleArbitrary(),
    currentEmail: fc.option(emailArbitrary(), { nil: undefined }),
    emailVerified: fc.boolean(),
    emailUpdatedAt: fc.option(timestampArbitrary(), { nil: undefined }),
    mainAccountEmail: emailArbitrary(),
    onEmailUpdate: fc.constant(vi.fn()),
    onVerifyEmail: fc.constant(vi.fn()),
    onResendCode: fc.constant(vi.fn()),
    isLoading: fc.option(fc.boolean(), { nil: undefined }),
    rateLimitedUntil: fc.option(timestampArbitrary(), { nil: undefined }),
    roleColors: roleColorsArbitrary(),
  });

describe("Property 7: UI Status Display Accuracy", () => {
  /**
   * Property: Status indicator should display correct status based on email state
   */
  it("should display correct status indicators for all email states", () => {
    fc.assert(
      fc.property(
        emailStatusArbitrary(),
        timestampOrUndefinedArbitrary(),
        (status, nextUpdateTime) => {
          const { container } = render(
            <StatusIndicator status={status} nextUpdateTime={nextUpdateTime} />,
          );

          // Property: Status text should match the status
          switch (status) {
            case "verified":
              expect(container.textContent).toContain("Verified");
              break;
            case "pending":
              expect(container.textContent).toContain("Pending Verification");
              break;
            case "main-email":
              expect(container.textContent).toContain("Using Main Email");
              break;
            case "rate-limited":
              expect(container.textContent).toContain("Rate Limited");
              break;
          }

          // Property: Rate limited status should show next update time
          if (status === "rate-limited" && nextUpdateTime) {
            const futureDate = new Date(nextUpdateTime);
            const now = new Date();
            if (futureDate > now) {
              // Should show some form of time indication
              const hasTimeIndication = /Available|days|tomorrow/.test(
                container.textContent || "",
              );
              expect(hasTimeIndication).toBe(true);
            }
          }
        },
      ),
      { numRuns: 50 },
    );
  });

  /**
   * Property: ProfileEmailSection should show verification UI when email needs verification
   */
  it("should show verification UI when email needs verification", () => {
    fc.assert(
      fc.property(profileEmailSectionPropsArbitrary(), (props) => {
        // Ensure we have an unverified email for this test
        const testProps = {
          ...props,
          currentEmail: "test@example.com",
          emailVerified: false,
          rateLimitedUntil: undefined,
        };

        const { container } = render(<ProfileEmailSection {...testProps} />);

        // Property: Should show verification notice when email is unverified
        expect(container.textContent).toContain("Email verification required");
        expect(container.textContent).toContain("Verify Now");

        // Property: Should show pending status
        expect(container.textContent).toContain("Pending Verification");
      }),
      { numRuns: 20 }, // Reduced runs
    );
  });

  /**
   * Property: ProfileEmailSection should show rate limiting UI when rate limited
   */
  it("should show rate limiting UI when rate limited", () => {
    fc.assert(
      fc.property(profileEmailSectionPropsArbitrary(), (props) => {
        // Set up rate limited state
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3); // 3 days in future

        const testProps = {
          ...props,
          rateLimitedUntil: futureDate.toISOString(),
        };

        const { container } = render(<ProfileEmailSection {...testProps} />);

        // Property: Should show rate limited status
        expect(container.textContent).toContain("Rate Limited");

        // Property: Should show next update time
        expect(container.textContent).toContain(
          "You can update this email again on",
        );

        // Property: Email input should be disabled
        const emailInput = container.querySelector('input[type="email"]');
        expect(emailInput).toBeDisabled();
      }),
      { numRuns: 20 }, // Reduced runs
    );
  });

  /**
   * Property: ProfileEmailSection should show correct current email display
   */
  it("should display correct current email based on verification status", () => {
    fc.assert(
      fc.property(
        roleArbitrary(),
        emailArbitrary(),
        emailArbitrary(),
        fc.boolean(),
        (role, profileEmail, mainEmail, emailVerified) => {
          const props = {
            role,
            currentEmail: profileEmail,
            emailVerified,
            emailUpdatedAt: undefined,
            mainAccountEmail: mainEmail,
            onEmailUpdate: vi.fn(),
            onVerifyEmail: vi.fn(),
            onResendCode: vi.fn(),
            roleColors: {
              primary: "#3B82F6",
              primaryHover: "#2563EB",
              dark: "#1E40AF",
              light: "#DBEAFE",
              accent: "#60A5FA",
            },
          };

          const { container } = render(<ProfileEmailSection {...props} />);

          // Property: Should show verified profile email or main email
          const expectedEmail =
            profileEmail && emailVerified ? profileEmail : mainEmail;
          expect(container.textContent).toContain(expectedEmail);

          // Property: Should show correct role name in title
          const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);
          expect(container.textContent).toContain(
            `${roleDisplayName} Profile Email`,
          );
        },
      ),
      { numRuns: 50 }, // Reduced runs
    );
  });

  /**
   * Property: UI should be responsive and show appropriate button states
   */
  it("should show appropriate button states based on props", () => {
    fc.assert(
      fc.property(
        profileEmailSectionPropsArbitrary(),
        fc.boolean(),
        (props, isLoading) => {
          const testProps = {
            ...props,
            isLoading,
            rateLimitedUntil: undefined, // Ensure not rate limited for this test
          };

          const { container } = render(<ProfileEmailSection {...testProps} />);

          // Property: Update button should exist
          const updateButtons = container.querySelectorAll("button");
          const updateButton = Array.from(updateButtons).find(
            (btn) =>
              btn.textContent?.includes("Update Email") ||
              btn.textContent?.includes("Set Custom Email"),
          );
          expect(updateButton).toBeTruthy();

          // Property: Loading state should disable buttons
          if (isLoading && updateButton) {
            expect(updateButton).toBeDisabled();
          }

          // Property: Should show "Use Main Account Email" button when custom email is set
          if (props.currentEmail) {
            const mainEmailButton = Array.from(updateButtons).find((btn) =>
              btn.textContent?.includes("Use Main Account Email"),
            );
            expect(mainEmailButton).toBeTruthy();
          }
        },
      ),
      { numRuns: 50 }, // Reduced runs for faster testing
    );
  });

  /**
   * Property: Status indicator should have consistent visual styling
   */
  it("should apply consistent visual styling for each status", () => {
    fc.assert(
      fc.property(emailStatusArbitrary(), (status) => {
        const { container } = render(<StatusIndicator status={status} />);

        // Property: Should have status indicator container
        const statusElement = container.querySelector('[class*="inline-flex"]');
        expect(statusElement).toBeInTheDocument();

        // Property: Should have appropriate color classes based on status
        const classList = statusElement?.className || "";
        switch (status) {
          case "verified":
            expect(classList).toMatch(/green/);
            break;
          case "pending":
            expect(classList).toMatch(/amber/);
            break;
          case "main-email":
            expect(classList).toMatch(/blue/);
            break;
          case "rate-limited":
            expect(classList).toMatch(/orange/);
            break;
        }
      }),
      { numRuns: 100 },
    );
  });
});
