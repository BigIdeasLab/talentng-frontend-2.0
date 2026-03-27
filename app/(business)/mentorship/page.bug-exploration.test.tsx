/**
 * Bug Condition Exploration Test for Mobile Scroll Progressive Header Fix
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3**
 *
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 *
 * This test encodes the EXPECTED behavior (single smooth scroll container).
 * When it FAILS on unfixed code, it proves the bug exists (nested scroll containers).
 * When it PASSES after the fix, it confirms the bug is resolved.
 *
 * Bug Condition: Mobile mentorship page uses MobileProgressiveHeader which creates
 * nested scroll containers, causing janky scroll behavior and pagination accessibility issues.
 *
 * Expected Behavior: Mobile mentorship page should have a single smooth scroll container
 * without nesting, making pagination controls fully accessible.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MentorshipPage from "./page";

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => {
    // Simulate mobile viewport (< md breakpoint)
    const isMobile = query.includes("(min-width: 768px)") ? false : true;
    return {
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
});

// Mock requestIdleCallback
if (!("requestIdleCallback" in window)) {
  Object.defineProperty(window, "requestIdleCallback", {
    writable: true,
    value: vi.fn().mockImplementation((cb: () => void) => setTimeout(cb, 0)),
  });
}

// Mock dependencies
vi.mock("@/hooks/useRequireRole", () => ({
  useRequireRole: () => true,
}));

vi.mock("@/lib/api/mentorship", () => ({
  listMentors: vi.fn().mockResolvedValue({
    data: [
      {
        id: "1",
        fullName: "John Doe",
        headline: "Senior Engineer",
        profileImageUrl: "/default.png",
        avgRating: 4.5,
        totalReviews: 10,
        expertise: ["JavaScript", "React"],
        company: "Tech Corp",
        location: "San Francisco",
        category: "Engineering",
      },
    ],
    meta: {
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  }),
}));

describe("Bug Condition Exploration: Mobile Scroll Nested Container Detection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("EXPECTED TO FAIL ON UNFIXED CODE: should have single scroll container without MobileProgressiveHeader nesting", async () => {
    const { container } = render(<MentorshipPage />);

    // Wait for content to load (use getAllByText since both desktop and mobile render)
    await screen.findAllByText("Mentorship");

    // TEST 1: Check for nested scroll containers
    // Expected behavior: Only ONE element with overflow-y-auto in the mobile layout
    // Bug behavior: TWO elements with overflow-y-auto (page container + MobileProgressiveHeader)

    const mobileContainer = container.querySelector(".md\\:hidden");
    // The mobile container itself should be the single scroll container
    expect(mobileContainer?.className).toContain("overflow-y-auto");
    // No nested scroll containers inside (exclude responsive variants like md:overflow-y-auto)
    const nestedScrollables = Array.from(
      mobileContainer!.querySelectorAll('[class*="overflow-y-auto"]'),
    ).filter((el) => el.classList.contains("overflow-y-auto"));

    // On UNFIXED code: This will find nested scrollable elements inside
    // On FIXED code: No nested scroll containers (the mobile container itself is the scroll container)
    expect(nestedScrollables.length).toBe(0);

    // TEST 2: Verify MobileProgressiveHeader is NOT used (it creates nested scroll)
    // Expected behavior: Mobile layout uses simple div with overflow-y-auto
    // Bug behavior: Mobile layout uses MobileProgressiveHeader component

    // Check that the mobile section does NOT have the MobileProgressiveHeader structure
    // MobileProgressiveHeader has a specific class pattern: "h-full overflow-y-auto scrollbar-styled"
    const mobileProgressiveHeader = container.querySelector(
      ".h-full.overflow-y-auto.scrollbar-styled",
    );

    // On UNFIXED code: This will find the MobileProgressiveHeader element
    // On FIXED code: This should be null (no MobileProgressiveHeader)
    expect(mobileProgressiveHeader).toBeNull();

    // TEST 3: Verify single scroll container structure
    // Expected behavior: Mobile container has flex-1 overflow-y-auto directly
    // Bug behavior: Mobile container has MobileProgressiveHeader wrapper with its own scroll

    // mobileContainer already queried above — reuse it
    expect(mobileContainer).toBeTruthy();

    // The mobile container itself is the scroll container (flex-1 overflow-y-auto)
    // so there's no separate direct child with overflow-y-auto
    expect(mobileContainer?.className).toContain("overflow-y-auto");
    expect(mobileContainer?.className).toContain("flex-1");

    // TEST 4: Verify sticky tabs are positioned correctly (not inside nested scroll)
    // Expected behavior: Tabs have position: sticky and are in the single scroll container
    // Bug behavior: Tabs are inside MobileProgressiveHeader's nested scroll container

    const stickyTabs = container.querySelector(".sticky.top-0");

    // On UNFIXED code: Tabs exist but are inside MobileProgressiveHeader's scroll container
    // On FIXED code: Tabs exist and are in the single scroll container with proper sticky positioning
    expect(stickyTabs).toBeTruthy();

    // Verify tabs are NOT inside a nested scroll container (MobileProgressiveHeader)
    const tabsParentScroll = stickyTabs?.closest(
      ".h-full.overflow-y-auto.scrollbar-styled",
    );

    // On UNFIXED code: This will find MobileProgressiveHeader as parent
    // On FIXED code: This should be null (tabs are in single scroll container, not MobileProgressiveHeader)
    expect(tabsParentScroll).toBeNull();
  });

  it("EXPECTED TO FAIL ON UNFIXED CODE: should make pagination controls fully accessible without nested scroll interference", async () => {
    const { container } = render(<MentorshipPage />);

    // Wait for content to load (use getAllByText since both desktop and mobile render)
    await screen.findAllByText("Mentorship");

    // TEST: Verify pagination controls are in a single scroll container
    // Expected behavior: Pagination is in the same scroll context as content
    // Bug behavior: Pagination is inside MobileProgressiveHeader's nested scroll, requiring "pull up extra"

    // Find the mobile container
    const mobileContainer = container.querySelector(".md\\:hidden");
    expect(mobileContainer).toBeTruthy();

    // Check that there's no MobileProgressiveHeader wrapper creating nested scroll
    const nestedScrollWrapper = mobileContainer?.querySelector(
      ".h-full.overflow-y-auto.scrollbar-styled",
    );

    // On UNFIXED code: This will find MobileProgressiveHeader creating nested scroll
    // On FIXED code: This should be null (no nested scroll wrapper)
    expect(nestedScrollWrapper).toBeNull();

    // Verify the scroll container structure allows natural scrolling to bottom content
    // The mobile container itself should have overflow-y-auto, not nested scrolls
    expect(mobileContainer?.className).toContain("overflow-y-auto");
    const nestedScrollContainers = Array.from(
      mobileContainer!.querySelectorAll('[class*="overflow-y-auto"]'),
    ).filter((el) => el.classList.contains("overflow-y-auto"));

    // On UNFIXED code: Multiple nested scroll containers
    // On FIXED code: No nested scroll containers (the mobile container itself is the scroll container)
    expect(nestedScrollContainers.length).toBe(0);
  });

  it("EXPECTED TO FAIL ON UNFIXED CODE: should provide consistent scroll experience matching opportunities page pattern", async () => {
    const { container } = render(<MentorshipPage />);

    // Wait for content to load (use getAllByText since both desktop and mobile render)
    await screen.findAllByText("Mentorship");

    // TEST: Verify mobile layout follows the same pattern as the fixed opportunities page
    // Expected behavior: Simple structure with overflow-y-auto, sticky tabs, no MobileProgressiveHeader
    // Bug behavior: Uses MobileProgressiveHeader component creating different scroll pattern

    const mobileSection = container.querySelector(".md\\:hidden");
    expect(mobileSection).toBeTruthy();

    // Check for the opportunities page pattern: flex-1 overflow-y-auto on the mobile section itself
    // NOT the MobileProgressiveHeader pattern: h-full overflow-y-auto scrollbar-styled
    const hasOpportunitiesPattern =
      mobileSection?.classList.contains("flex-1") &&
      mobileSection?.classList.contains("overflow-y-auto");
    const hasMobileProgressiveHeaderPattern = mobileSection?.querySelector(
      ".h-full.overflow-y-auto.scrollbar-styled",
    );

    // On UNFIXED code: hasMobileProgressiveHeaderPattern will be truthy (uses old pattern)
    // On FIXED code: hasOpportunitiesPattern will be truthy, hasMobileProgressiveHeaderPattern will be null
    expect(hasOpportunitiesPattern).toBeTruthy();
    expect(hasMobileProgressiveHeaderPattern).toBeNull();

    // Verify header scrolls with content (not in a separate scroll container)
    const header = screen.getAllByText("Mentorship")[0].closest("div");
    const headerInNestedScroll = header?.closest(
      ".h-full.overflow-y-auto.scrollbar-styled",
    );

    // On UNFIXED code: Header is inside MobileProgressiveHeader's scroll container
    // On FIXED code: Header is in the single scroll container, scrolls naturally with content
    expect(headerInNestedScroll).toBeNull();
  });
});
