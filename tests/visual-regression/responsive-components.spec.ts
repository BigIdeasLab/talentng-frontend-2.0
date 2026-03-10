import { test } from "@playwright/test";
import { testPageResponsive, VIEWPORTS } from "./helpers/test-utils";

test.describe("Responsive Components - Visual Regression", () => {
  // Test responsive table transformations
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive table - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-table",
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

  // Test responsive grid layouts
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive grid - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-grid",
        "/business/discover-talent",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="talent-grid"], .talent-grid, .responsive-grid',
          fullPage: true,
        },
      );
    });
  });

  // Test mobile table cards vs desktop table
  test("Table transformation - mobile cards", async ({ page }) => {
    await testPageResponsive(
      page,
      "table-mobile-cards",
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

  // Test tablet horizontal scrolling table
  test("Table horizontal scroll - tablet", async ({ page }) => {
    await testPageResponsive(
      page,
      "table-horizontal-scroll-tablet",
      "/business/applicants",
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: '[data-testid="applicants-table"], .applicants-table',
        interactions: async (page) => {
          // Scroll horizontally in the table
          const table = page
            .locator(
              '[data-testid="applicants-table"], .applicants-table, table',
            )
            .first();
          if (await table.isVisible()) {
            await table.evaluate((el) => {
              el.scrollLeft = 100;
            });
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      },
    );
  });

  // Test responsive form layouts
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive form layout - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-form-layout",
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

  // Test responsive button groups
  test("Responsive button groups - mobile vs desktop", async ({ page }) => {
    // Mobile stacked buttons
    await testPageResponsive(
      page,
      "button-groups-mobile-stacked",
      "/business/opportunities/post",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="form-buttons"], .form-buttons, .button-group',
        fullPage: false, // Focus on button area
      },
    );
  });

  // Test responsive stat cards
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive stat cards - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-stat-cards",
        "/business/dashboard",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="stats-grid"], .stats-grid, .dashboard-stats',
          fullPage: false, // Focus on stats section
        },
      );
    });
  });

  // Test responsive charts
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive charts - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-charts",
        "/business/dashboard",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="weekly-overview-chart"], .chart-container, .recharts-wrapper',
          fullPage: false, // Focus on chart area
        },
      );
    });
  });

  // Test responsive search and filters
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive search filters - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-search-filters",
        "/business/discover-talent",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="search-filters"], .search-filters, .filters-container',
          fullPage: false, // Focus on search/filter area
        },
      );
    });
  });

  // Test responsive image galleries
  test("Responsive image gallery - mobile vs desktop", async ({ page }) => {
    await testPageResponsive(
      page,
      "responsive-image-gallery-mobile",
      "/talent/profile/1",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="portfolio-gallery"], .portfolio-gallery, .works-grid',
        fullPage: true,
      },
    );
  });

  // Test responsive typography scaling
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive typography - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-typography",
        "/business/opportunities/1",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="opportunity-details"], .opportunity-details',
          fullPage: true,
        },
      );
    });
  });

  // Test component visibility rules
  test("Component visibility - mobile vs desktop", async ({ page }) => {
    // Test what's hidden on mobile
    await testPageResponsive(
      page,
      "component-visibility-mobile",
      "/business/dashboard",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
        fullPage: true,
      },
    );
  });

  // Test touch-friendly interactions
  test("Touch-friendly interactions - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "touch-friendly-interactions",
      "/business/applicants",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="mobile-table-card"], .mobile-table-card',
        interactions: async (page) => {
          // Test touch target sizes by hovering/clicking
          const actionButton = page
            .locator('[data-testid="actions-dropdown"], .actions-menu-trigger')
            .first();
          if (await actionButton.isVisible()) {
            await actionButton.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      },
    );
  });

  // Test responsive spacing and padding
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive spacing - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-spacing",
        "/talent/profile/edit",
        viewport,
        {
          mockAuth: true,
          userType: "talent",
          waitForSelector: "form",
          fullPage: true,
        },
      );
    });
  });

  // Test responsive modal sizing
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Responsive modal sizing - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "responsive-modal-sizing",
        "/business/applicants",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="applicants-table"], .applicants-table',
          interactions: async (page) => {
            // Open filter modal to test responsive sizing
            const filterButton = page
              .locator(
                '[data-testid="filter-button"], button:has-text("Filter")',
              )
              .first();
            if (await filterButton.isVisible()) {
              await filterButton.click();
              await page.waitForTimeout(300);
            }
          },
          fullPage: true,
        },
      );
    });
  });
});
