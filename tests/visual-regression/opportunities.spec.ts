import { test } from "@playwright/test";
import { testPageResponsive, VIEWPORTS } from "./helpers/test-utils";

test.describe("Opportunities Pages - Visual Regression", () => {
  // Test opportunities list page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Opportunities list - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "opportunities-list",
        "/business/opportunities",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="opportunities-table"], .opportunities-table, .responsive-table',
          fullPage: true,
        },
      );
    });
  });

  // Test opportunity details page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Opportunity details - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "opportunity-details",
        "/business/opportunities/1",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="opportunity-details"], .opportunity-details, .opportunity-header',
          fullPage: true,
        },
      );
    });
  });

  // Test post opportunity form across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Post opportunity form - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "post-opportunity-form",
        "/business/opportunities/post",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector: 'form, [data-testid="post-opportunity-form"]',
          fullPage: true,
        },
      );
    });
  });

  // Test opportunities table mobile card view
  test("Opportunities table mobile cards - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "opportunities-table-mobile-cards",
      "/business/opportunities",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="mobile-table-card"], .mobile-table-card, .opportunity-card',
        fullPage: true,
      },
    );
  });

  // Test opportunities with filters applied
  test("Opportunities with filters - tablet", async ({ page }) => {
    await testPageResponsive(
      page,
      "opportunities-with-filters",
      "/business/opportunities",
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="opportunities-table"], .opportunities-table',
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

  // Test opportunity search functionality
  test("Opportunities search - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "opportunities-search-mobile",
      "/business/opportunities",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="search-input"], input[placeholder*="Search"]',
        interactions: async (page) => {
          // Focus on search input
          const searchInput = page
            .locator(
              '[data-testid="search-input"], input[placeholder*="Search"]',
            )
            .first();
          if (await searchInput.isVisible()) {
            await searchInput.click();
            await searchInput.fill("Software Engineer");
            await page.waitForTimeout(500); // Wait for search results
          }
        },
        fullPage: true,
      },
    );
  });

  // Test opportunity form validation
  test("Post opportunity form validation - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "post-opportunity-form-validation",
      "/business/opportunities/post",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: "form",
        interactions: async (page) => {
          // Try to submit form without required fields
          const submitButton = page
            .locator('button[type="submit"], button:has-text("Post")')
            .first();
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(500); // Wait for validation errors
          }
        },
        fullPage: true,
      },
    );
  });
});
