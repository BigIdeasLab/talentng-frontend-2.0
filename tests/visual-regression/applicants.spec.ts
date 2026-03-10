import { test } from "@playwright/test";
import { testPageResponsive, VIEWPORTS } from "./helpers/test-utils";

test.describe("Applicants Pages - Visual Regression", () => {
  // Test applicants list page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Applicants list - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "applicants-list",
        "/business/applicants",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="applicants-table"], .applicants-table, .responsive-table',
          fullPage: true,
        },
      );
    });
  });

  // Test applicant profile view across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Applicant profile view - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "applicant-profile-view",
        "/business/applicants/1",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="applicant-profile"], .applicant-profile, .profile-header',
          fullPage: true,
        },
      );
    });
  });

  // Test hired talent page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Hired talent list - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "hired-talent-list",
        "/business/hired-talent",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="hired-talent-table"], .hired-talent-table, .responsive-table',
          fullPage: true,
        },
      );
    });
  });

  // Test applicants table mobile card view
  test("Applicants table mobile cards - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "applicants-table-mobile-cards",
      "/business/applicants",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="mobile-table-card"], .mobile-table-card, .applicant-card',
        fullPage: true,
      },
    );
  });

  // Test applicant actions dropdown on mobile
  test("Applicant actions dropdown - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "applicant-actions-dropdown-mobile",
      "/business/applicants",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="mobile-table-card"], .mobile-table-card',
        interactions: async (page) => {
          // Open actions dropdown on first applicant card
          const actionsButton = page
            .locator(
              '[data-testid="actions-dropdown"], button:has-text("Actions"), .actions-menu-trigger',
            )
            .first();
          if (await actionsButton.isVisible()) {
            await actionsButton.click();
            await page.waitForTimeout(300); // Wait for dropdown animation
          }
        },
        fullPage: true,
      },
    );
  });

  // Test applicant filter modal
  test("Applicant filter modal - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "applicant-filter-modal-mobile",
      "/business/applicants",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: '[data-testid="applicants-table"], .applicants-table',
        interactions: async (page) => {
          // Open filter modal
          const filterButton = page
            .locator('[data-testid="filter-button"], button:has-text("Filter")')
            .first();
          if (await filterButton.isVisible()) {
            await filterButton.click();
            await page.waitForTimeout(300); // Wait for modal animation
          }
        },
        fullPage: true,
      },
    );
  });

  // Test schedule interview modal
  test("Schedule interview modal - tablet", async ({ page }) => {
    await testPageResponsive(
      page,
      "schedule-interview-modal-tablet",
      "/business/applicants/1",
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="applicant-profile"], .applicant-profile',
        interactions: async (page) => {
          // Open schedule interview modal
          const scheduleButton = page
            .locator(
              '[data-testid="schedule-interview"], button:has-text("Schedule")',
            )
            .first();
          if (await scheduleButton.isVisible()) {
            await scheduleButton.click();
            await page.waitForTimeout(300); // Wait for modal animation
          }
        },
        fullPage: true,
      },
    );
  });

  // Test hire application modal
  test("Hire application modal - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "hire-application-modal-mobile",
      "/business/applicants/1",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="applicant-profile"], .applicant-profile',
        interactions: async (page) => {
          // Open hire modal
          const hireButton = page
            .locator('[data-testid="hire-applicant"], button:has-text("Hire")')
            .first();
          if (await hireButton.isVisible()) {
            await hireButton.click();
            await page.waitForTimeout(300); // Wait for modal animation
          }
        },
        fullPage: true,
      },
    );
  });

  // Test applicants with search and filters
  test("Applicants with search - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "applicants-search-mobile",
      "/business/applicants",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="search-input"], input[placeholder*="Search"]',
        interactions: async (page) => {
          // Focus on search input and type
          const searchInput = page
            .locator(
              '[data-testid="search-input"], input[placeholder*="Search"]',
            )
            .first();
          if (await searchInput.isVisible()) {
            await searchInput.click();
            await searchInput.fill("React Developer");
            await page.waitForTimeout(500); // Wait for search results
          }
        },
        fullPage: true,
      },
    );
  });
});
