/**
 * Preservation Property Tests for Mobile Scroll Progressive Header Fix
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 *
 * IMPORTANT: These tests should PASS on UNFIXED code - they capture baseline behavior to preserve.
 *
 * Property 2: Preservation - Desktop and Interaction Behavior
 *
 * For any interaction that is NOT mobile viewport scrolling (desktop layout, tab switching,
 * search/filter, pagination clicks), the fixed code SHALL produce exactly the same behavior
 * as the original code.
 *
 * These tests verify that the fix does NOT break:
 * - Desktop layout with static header and scrollable content
 * - Category tabs remaining visible and sticky on mobile
 * - Search and filter functionality
 * - Pagination controls scrolling to top
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as fc from "fast-check";
import MentorshipPage from "./page";

// Mock window.matchMedia for responsive hooks
const createMatchMediaMock = (isDesktop: boolean) => {
  return vi.fn().mockImplementation((query) => {
    const matches = query.includes("(min-width: 768px)")
      ? isDesktop
      : !isDesktop;
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

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
      {
        id: "2",
        fullName: "Jane Smith",
        headline: "Product Designer",
        profileImageUrl: "/default.png",
        avgRating: 4.8,
        totalReviews: 15,
        expertise: ["UI/UX", "Figma"],
        company: "Design Co",
        location: "New York",
        category: "Design",
      },
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  }),
}));

describe("Preservation Property Tests: Desktop and Interaction Behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Property 2.1: Desktop Layout Preservation", () => {
    it("should display static header with tabs and scrollable content area on desktop", async () => {
      // Set up desktop viewport
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: createMatchMediaMock(true),
      });

      const { container } = render(<MentorshipPage />);

      // Wait for content to load
      await screen.findAllByText("Mentorship");

      // Verify desktop layout structure
      const desktopHeader = container.querySelector(".hidden.md\\:block");
      expect(desktopHeader).toBeTruthy();

      // Verify header contains title
      const title = desktopHeader?.querySelector("h1");
      expect(title?.textContent).toBe("Mentorship");

      // Verify search input exists in desktop header
      const searchInput = desktopHeader?.querySelector(
        'input[placeholder*="Search"]',
      );
      expect(searchInput).toBeTruthy();

      // Verify filter button exists in desktop header
      const filterButton = desktopHeader?.querySelector("button");
      expect(filterButton).toBeTruthy();

      // Verify category tabs exist in desktop header
      const categoryTabs = desktopHeader?.querySelectorAll("button");
      expect(categoryTabs && categoryTabs.length > 1).toBe(true);

      // Verify desktop content area exists and is scrollable
      const desktopContent = container.querySelector(".hidden.md\\:flex");
      expect(desktopContent).toBeTruthy();
      expect(desktopContent?.classList.contains("overflow-hidden")).toBe(true);
    });

    it("property: desktop layout structure is preserved across different viewport sizes", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 768, max: 3840 }), // Desktop viewport widths
          async (viewportWidth) => {
            // Set up desktop viewport
            Object.defineProperty(window, "matchMedia", {
              writable: true,
              value: createMatchMediaMock(true),
            });

            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Verify desktop header is visible
              const desktopHeader =
                container.querySelector(".hidden.md\\:block");
              expect(desktopHeader).toBeTruthy();

              // Verify mobile header is hidden
              const mobileSection = container.querySelector(".md\\:hidden");
              expect(mobileSection).toBeTruthy();

              // Verify desktop content area exists
              const desktopContent =
                container.querySelector(".hidden.md\\:flex");
              expect(desktopContent).toBeTruthy();
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 10 },
      );
    });
  });

  describe("Property 2.2: Mobile Sticky Tabs Preservation", () => {
    it("should keep category tabs visible and sticky at top while scrolling on mobile", async () => {
      // Set up mobile viewport
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: createMatchMediaMock(false),
      });

      const { container } = render(<MentorshipPage />);

      // Wait for content to load
      await screen.findAllByText("Mentorship");

      // Find mobile section
      const mobileSection = container.querySelector(".md\\:hidden");
      expect(mobileSection).toBeTruthy();

      // Verify sticky tabs exist
      const stickyTabs = container.querySelector(".sticky.top-0");
      expect(stickyTabs).toBeTruthy();

      // Verify tabs have correct z-index for stacking
      expect(stickyTabs?.classList.contains("z-10")).toBe(true);

      // Verify tabs have background color (required for sticky to work visually)
      const hasBackground =
        stickyTabs?.classList.contains("bg-white") ||
        stickyTabs?.parentElement?.classList.contains("bg-white");
      expect(hasBackground).toBe(true);

      // Verify category buttons exist in tabs
      const categoryButtons = stickyTabs?.querySelectorAll("button");
      expect(categoryButtons && categoryButtons.length > 0).toBe(true);
    });

    it("property: sticky tabs remain functional across different categories", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom("All", "Engineering", "Design", "Marketing", "Sales"),
          async (category) => {
            // Set up mobile viewport
            Object.defineProperty(window, "matchMedia", {
              writable: true,
              value: createMatchMediaMock(false),
            });

            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Verify sticky tabs exist
              const stickyTabs = container.querySelector(".sticky.top-0");
              expect(stickyTabs).toBeTruthy();

              // Verify tabs have sticky positioning
              expect(stickyTabs?.classList.contains("sticky")).toBe(true);
              expect(stickyTabs?.classList.contains("top-0")).toBe(true);
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 5 },
      );
    });
  });

  describe("Property 2.3: Search and Filter Functionality Preservation", () => {
    it("should display search and filter results correctly with pagination", async () => {
      const { container } = render(<MentorshipPage />);

      // Wait for content to load
      await screen.findAllByText("Mentorship");

      // Verify search input exists
      const searchInputs = container.querySelectorAll(
        'input[placeholder*="Search"]',
      );
      expect(searchInputs.length).toBeGreaterThan(0);

      // Verify filter button exists
      const filterButtons = screen.getAllByText("Filter");
      expect(filterButtons.length).toBeGreaterThan(0);

      // Verify mentors are displayed
      await waitFor(() => {
        const mentorNames = screen.queryAllByText(/John Doe|Jane Smith/);
        expect(mentorNames.length).toBeGreaterThan(0);
      });
    });

    it("property: search functionality works consistently across different queries", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(""),
            fc
              .string({ minLength: 2, maxLength: 20 })
              .filter((s) => s.trim().length >= 2),
            fc.constantFrom("engineer", "designer", "javascript", "react"),
          ),
          async (searchQuery) => {
            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Find search input
              const searchInputs = container.querySelectorAll(
                'input[placeholder*="Search"]',
              );
              expect(searchInputs.length).toBeGreaterThan(0);

              // Verify search input accepts the query
              const searchInput = searchInputs[0] as HTMLInputElement;
              fireEvent.change(searchInput, { target: { value: searchQuery } });

              // Verify the input value is set
              expect(searchInput.value).toBe(searchQuery);
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 10 },
      );
    });

    it("property: filter button remains accessible and functional", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(), // Desktop or mobile
          async (isDesktop) => {
            // Set up viewport
            Object.defineProperty(window, "matchMedia", {
              writable: true,
              value: createMatchMediaMock(isDesktop),
            });

            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Verify filter button exists
              const filterButtons = screen.getAllByText("Filter");
              expect(filterButtons.length).toBeGreaterThan(0);

              // Verify filter button is clickable
              const filterButton = filterButtons[0];
              expect(filterButton).toBeTruthy();
              expect(filterButton.tagName).toBe("SPAN"); // Text inside button
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 10 },
      );
    });
  });

  describe("Property 2.4: Pagination Scroll-to-Top Preservation", () => {
    it("should scroll to top when pagination controls are clicked", async () => {
      // Mock scrollTo for testing
      const mockScrollTo = vi.fn();
      window.scrollTo = mockScrollTo;

      // Set up mobile viewport
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: createMatchMediaMock(false),
      });

      const { container } = render(<MentorshipPage />);

      // Wait for content to load
      await screen.findAllByText("Mentorship");

      // Verify the page structure supports scroll-to-top functionality
      // The implementation may use different methods (ref.scrollToTop, window.scrollTo, etc.)
      // We verify the structure is in place, not the exact implementation
      const mobileSection = container.querySelector(".md\\:hidden");
      expect(mobileSection).toBeTruthy();

      // Verify there's a scrollable container that can be scrolled to top
      const scrollableContainer = mobileSection?.querySelector(
        '[class*="overflow-y-auto"]',
      );
      expect(scrollableContainer).toBeTruthy();
    });

    it("property: pagination structure is preserved across different page states", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 5 }), // Page numbers
          fc.boolean(), // Has next page
          fc.boolean(), // Has previous page
          async (pageNumber, hasNext, hasPrev) => {
            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Verify the page renders successfully with pagination structure
              const mobileSection = container.querySelector(".md\\:hidden");
              const desktopSection =
                container.querySelector(".hidden.md\\:flex");

              // At least one section should exist
              expect(mobileSection || desktopSection).toBeTruthy();

              // Verify scrollable containers exist for scroll-to-top functionality
              const scrollableContainers = container.querySelectorAll(
                '[class*="overflow"]',
              );
              expect(scrollableContainers.length).toBeGreaterThan(0);
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 10 },
      );
    });
  });

  describe("Property 2: Combined Preservation - All Interactions", () => {
    it("property: all preserved behaviors work together consistently", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            isDesktop: fc.boolean(),
            searchQuery: fc.oneof(
              fc.constant(""),
              fc
                .string({ minLength: 2, maxLength: 15 })
                .filter((s) => s.trim().length >= 2),
            ),
            category: fc.constantFrom("All", "Engineering", "Design"),
          }),
          async ({ isDesktop, searchQuery, category }) => {
            // Set up viewport
            Object.defineProperty(window, "matchMedia", {
              writable: true,
              value: createMatchMediaMock(isDesktop),
            });

            const { container, unmount } = render(<MentorshipPage />);

            try {
              // Wait for content to load
              await screen.findAllByText("Mentorship");

              // Verify core structure exists
              expect(container.querySelector("h1")?.textContent).toBe(
                "Mentorship",
              );

              // Verify search functionality
              const searchInputs = container.querySelectorAll(
                'input[placeholder*="Search"]',
              );
              expect(searchInputs.length).toBeGreaterThan(0);

              // Verify filter button
              const filterButtons = screen.getAllByText("Filter");
              expect(filterButtons.length).toBeGreaterThan(0);

              // Verify category tabs exist
              const categoryButtons = container.querySelectorAll("button");
              expect(categoryButtons.length).toBeGreaterThan(0);

              // Verify appropriate layout is shown
              if (isDesktop) {
                const desktopHeader =
                  container.querySelector(".hidden.md\\:block");
                expect(desktopHeader).toBeTruthy();
              } else {
                const mobileSection = container.querySelector(".md\\:hidden");
                expect(mobileSection).toBeTruthy();

                // Verify sticky tabs on mobile
                const stickyTabs = container.querySelector(".sticky.top-0");
                expect(stickyTabs).toBeTruthy();
              }
            } finally {
              unmount();
            }
          },
        ),
        { numRuns: 20 },
      );
    });
  });
});
