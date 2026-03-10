import { test } from "@playwright/test";
import { testPageResponsive, VIEWPORTS } from "./helpers/test-utils";

test.describe("Dashboard Pages - Visual Regression", () => {
  // Test employer dashboard across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Employer dashboard - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "employer-dashboard",
        "/business/dashboard",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
          fullPage: true,
        },
      );
    });
  });

  // Test talent dashboard across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Talent dashboard - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "talent-dashboard",
        "/talent/dashboard",
        viewport,
        {
          mockAuth: true,
          userType: "talent",
          waitForSelector:
            '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
          fullPage: true,
        },
      );
    });
  });

  // Test mentor dashboard across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Mentor dashboard - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "mentor-dashboard",
        "/mentor/dashboard",
        viewport,
        {
          mockAuth: true,
          userType: "mentor",
          waitForSelector:
            '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
          fullPage: true,
        },
      );
    });
  });

  // Test dashboard with mobile navigation drawer open
  test("Employer dashboard with mobile navigation - mobile", async ({
    page,
  }) => {
    await testPageResponsive(
      page,
      "employer-dashboard-mobile-nav",
      "/business/dashboard",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
        interactions: async (page) => {
          // Open mobile navigation drawer
          const hamburgerButton = page
            .locator(
              '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
            )
            .first();
          if (await hamburgerButton.isVisible()) {
            await hamburgerButton.click();
            await page.waitForTimeout(300); // Wait for drawer animation
          }
        },
        fullPage: true,
      },
    );
  });

  // Test dashboard charts responsiveness
  test("Dashboard charts - tablet vs desktop", async ({ page }) => {
    // Test tablet view
    await testPageResponsive(
      page,
      "dashboard-charts-tablet",
      "/business/dashboard",
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector:
          '[data-testid="weekly-overview-chart"], .chart-container, .recharts-wrapper',
        fullPage: true,
      },
    );
  });

  // Test dashboard stat cards layout
  test("Dashboard stat cards layout - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "dashboard-stat-cards-mobile",
      "/business/dashboard",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: '[data-testid="stats-card"], .stats-card, .stat-card',
        fullPage: false, // Focus on stats section only
      },
    );
  });
});
