import { test, expect } from "@playwright/test";
import {
  testPageResponsive,
  VIEWPORTS,
  waitForPageStable,
  hideDynamicContent,
  mockAuthentication,
} from "./helpers/test-utils";

test.describe("Orientation Change Tests", () => {
  test.describe("Orientation Change Event Handling", () => {
    test("should handle orientation change from portrait to landscape on mobile", async ({
      page,
    }) => {
      // Start in portrait mobile
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/login");
      await waitForPageStable(page);

      // Take initial portrait screenshot
      await expect(page).toHaveScreenshot("orientation-portrait-initial.png");

      // Change to landscape mobile
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);

      // Take landscape screenshot
      await expect(page).toHaveScreenshot(
        "orientation-landscape-after-change.png",
      );

      // Verify page is still functional
      await expect(page.locator("form")).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test("should handle rapid orientation changes without breaking", async ({
      page,
    }) => {
      await page.goto("/business/dashboard");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Perform rapid orientation changes
      const orientations = [
        { width: 375, height: 812 }, // Portrait
        { width: 812, height: 375 }, // Landscape
        { width: 375, height: 812 }, // Portrait
        { width: 812, height: 375 }, // Landscape
        { width: 375, height: 812 }, // Portrait
      ];

      for (const orientation of orientations) {
        await page.setViewportSize(orientation);
        await page.waitForTimeout(100); // Brief pause between changes
      }

      await waitForPageStable(page);

      // Verify page is still functional after rapid changes
      await expect(
        page.locator(
          '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
        ),
      ).toBeVisible();
      await expect(page).toHaveScreenshot(
        "orientation-rapid-changes-final.png",
      );
    });

    test("should preserve page functionality during orientation transitions", async ({
      page,
    }) => {
      await page.goto("/business/opportunities");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Start in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      // Interact with page elements
      const searchInput = page
        .locator(
          'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]',
        )
        .first();
      if (await searchInput.isVisible()) {
        await searchInput.fill("test search");
      }

      // Change to landscape
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);

      // Verify search input still has value and is functional
      if (await searchInput.isVisible()) {
        await expect(searchInput).toHaveValue("test search");
        await searchInput.clear();
        await searchInput.fill("landscape search");
        await expect(searchInput).toHaveValue("landscape search");
      }

      await expect(page).toHaveScreenshot(
        "orientation-functionality-preserved.png",
      );
    });
  });

  test.describe("State Preservation During Orientation Changes", () => {
    test("should preserve form data during orientation changes", async ({
      page,
    }) => {
      await page.goto("/login");
      await waitForPageStable(page);

      // Start in portrait and fill form
      await page.setViewportSize({ width: 375, height: 812 });
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");

      // Verify form data is present
      await expect(page.locator('input[type="email"]')).toHaveValue(
        "test@example.com",
      );
      await expect(page.locator('input[type="password"]')).toHaveValue(
        "password123",
      );

      // Change to landscape
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);

      // Verify form data is preserved
      await expect(page.locator('input[type="email"]')).toHaveValue(
        "test@example.com",
      );
      await expect(page.locator('input[type="password"]')).toHaveValue(
        "password123",
      );

      await expect(page).toHaveScreenshot(
        "orientation-form-data-preserved.png",
      );
    });

    test("should preserve scroll position during orientation changes", async ({
      page,
    }) => {
      await page.goto("/business/opportunities");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Start in portrait and scroll down
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(100);

      // Get current scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      expect(initialScrollY).toBeGreaterThan(400);

      // Change to landscape
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);

      // Check if scroll position is approximately preserved
      // Note: Some variation is expected due to layout changes
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(200); // Should still be scrolled down

      await expect(page).toHaveScreenshot("orientation-scroll-preserved.png");
    });

    test("should preserve modal state during orientation changes", async ({
      page,
    }) => {
      await page.goto("/business/applicants");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Start in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      // Open a filter modal if available
      const filterButton = page
        .locator(
          'button:has-text("Filter"), button[aria-label*="filter"], [data-testid="filter-button"]',
        )
        .first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await waitForPageStable(page);

        // Verify modal is open
        const modal = page
          .locator('[role="dialog"], .modal, [data-testid*="modal"]')
          .first();
        await expect(modal).toBeVisible();

        // Change to landscape
        await page.setViewportSize({ width: 812, height: 375 });
        await waitForPageStable(page);

        // Verify modal is still open and functional
        await expect(modal).toBeVisible();

        await expect(page).toHaveScreenshot(
          "orientation-modal-state-preserved.png",
        );
      }
    });
  });

  test.describe("Layout Adaptation in Landscape Mode", () => {
    test("should adapt dashboard layout for landscape mobile", async ({
      page,
    }) => {
      await page.goto("/business/dashboard");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Test portrait first
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("dashboard-portrait-mobile.png");

      // Switch to landscape mobile
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("dashboard-landscape-mobile.png");

      // Verify tablet-like behavior in landscape
      const statsGrid = page
        .locator(
          '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
        )
        .first();
      if (await statsGrid.isVisible()) {
        const boundingBox = await statsGrid.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(600); // Should use more horizontal space
      }
    });

    test("should adapt data tables for landscape mobile", async ({ page }) => {
      await page.goto("/business/applicants");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Portrait mobile - should show card layout
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot(
        "applicants-table-portrait-mobile.png",
      );

      // Landscape mobile - should show more tablet-like layout
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot(
        "applicants-table-landscape-mobile.png",
      );

      // Verify table/card layout adaptation
      const tableContainer = page
        .locator(
          'table, [data-testid*="table"], .table-container, .responsive-table',
        )
        .first();
      if (await tableContainer.isVisible()) {
        const boundingBox = await tableContainer.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(600);
      }
    });

    test("should adapt calendar layout for landscape mobile", async ({
      page,
    }) => {
      await page.goto("/business/calendar");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Portrait mobile - should show day/list view
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("calendar-portrait-mobile.png");

      // Landscape mobile - should show week view
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("calendar-landscape-mobile.png");

      // Verify calendar grid adaptation
      const calendarGrid = page
        .locator(
          '.calendar-grid, [data-testid="calendar-grid"], .calendar-container',
        )
        .first();
      if (await calendarGrid.isVisible()) {
        const boundingBox = await calendarGrid.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(600);
      }
    });

    test("should adapt form layouts for landscape mobile", async ({ page }) => {
      await page.goto("/business/opportunities/new");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Portrait mobile - single column form
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("form-portrait-mobile.png");

      // Landscape mobile - should use more horizontal space
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);
      await hideDynamicContent(page);
      await expect(page).toHaveScreenshot("form-landscape-mobile.png");

      // Verify form fields are still accessible
      const formInputs = page.locator("input, textarea, select");
      const inputCount = await formInputs.count();
      expect(inputCount).toBeGreaterThan(0);

      // Check that inputs are properly sized for touch
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = formInputs.nth(i);
        if (await input.isVisible()) {
          const boundingBox = await input.boundingBox();
          expect(boundingBox?.height).toBeGreaterThanOrEqual(40); // Touch-friendly height
        }
      }
    });
  });

  test.describe("Cross-Page Orientation Testing", () => {
    const testPages = [
      { path: "/login", name: "login", waitFor: "form" },
      { path: "/signup", name: "signup", waitFor: "form" },
      {
        path: "/business/dashboard",
        name: "dashboard",
        waitFor:
          '[data-testid="dashboard-stats"], .dashboard-stats, .stats-grid',
        auth: true,
      },
      {
        path: "/business/opportunities",
        name: "opportunities",
        waitFor: "main, .main-content",
        auth: true,
      },
      {
        path: "/business/applicants",
        name: "applicants",
        waitFor: "main, .main-content",
        auth: true,
      },
      {
        path: "/business/profile",
        name: "profile",
        waitFor: "main, .main-content",
        auth: true,
      },
    ];

    testPages.forEach(({ path, name, waitFor, auth }) => {
      test(`should handle orientation changes on ${name} page`, async ({
        page,
      }) => {
        if (auth) {
          await mockAuthentication(page, "employer");
        }

        await page.goto(path);
        if (auth) {
          await page.reload();
        }
        await waitForPageStable(page);

        // Test portrait to landscape transition
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForSelector(waitFor);
        await waitForPageStable(page);
        await hideDynamicContent(page);

        await expect(page).toHaveScreenshot(
          `${name}-portrait-before-change.png`,
        );

        // Change to landscape
        await page.setViewportSize({ width: 812, height: 375 });
        await waitForPageStable(page);
        await hideDynamicContent(page);

        await expect(page).toHaveScreenshot(
          `${name}-landscape-after-change.png`,
        );

        // Verify page is still functional
        await expect(page.locator(waitFor)).toBeVisible();

        // Test landscape to portrait transition
        await page.setViewportSize({ width: 375, height: 812 });
        await waitForPageStable(page);
        await hideDynamicContent(page);

        await expect(page).toHaveScreenshot(
          `${name}-portrait-after-landscape.png`,
        );

        // Verify page is still functional
        await expect(page.locator(waitFor)).toBeVisible();
      });
    });
  });

  test.describe("Navigation During Orientation Changes", () => {
    test("should maintain mobile navigation functionality across orientations", async ({
      page,
    }) => {
      await page.goto("/business/dashboard");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Start in portrait mobile
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      // Open mobile navigation
      const hamburgerButton = page
        .locator(
          '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
        )
        .first();
      if (await hamburgerButton.isVisible()) {
        await hamburgerButton.click();
        await waitForPageStable(page);

        // Verify drawer is open
        const drawer = page
          .locator(
            '[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]',
          )
          .first();
        await expect(drawer).toBeVisible();

        // Change to landscape while drawer is open
        await page.setViewportSize({ width: 812, height: 375 });
        await waitForPageStable(page);

        // Drawer should still be functional
        await expect(drawer).toBeVisible();

        // Close drawer
        const closeButton = page
          .locator('[data-testid="close-drawer"], button[aria-label*="close"]')
          .first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        } else {
          // Try clicking outside the drawer
          await page.click("body", { position: { x: 10, y: 10 } });
        }

        await waitForPageStable(page);
        await expect(page).toHaveScreenshot(
          "navigation-landscape-after-close.png",
        );
      }
    });

    test("should adapt navigation drawer size for landscape", async ({
      page,
    }) => {
      await page.goto("/business/dashboard");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Test drawer in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      const hamburgerButton = page
        .locator(
          '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
        )
        .first();
      if (await hamburgerButton.isVisible()) {
        await hamburgerButton.click();
        await waitForPageStable(page);

        const drawer = page
          .locator(
            '[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]',
          )
          .first();
        if (await drawer.isVisible()) {
          const portraitBounds = await drawer.boundingBox();

          // Change to landscape
          await page.setViewportSize({ width: 812, height: 375 });
          await waitForPageStable(page);

          const landscapeBounds = await drawer.boundingBox();

          // Drawer should adapt its size for landscape
          if (portraitBounds && landscapeBounds) {
            // In landscape, drawer should not take up as much of the screen width
            const portraitRatio = portraitBounds.width / 375;
            const landscapeRatio = landscapeBounds.width / 812;
            expect(landscapeRatio).toBeLessThan(portraitRatio);
          }

          await expect(page).toHaveScreenshot(
            "navigation-drawer-landscape-adapted.png",
          );
        }
      }
    });
  });

  test.describe("Modal Behavior During Orientation Changes", () => {
    test("should adapt modal sizing for orientation changes", async ({
      page,
    }) => {
      await page.goto("/business/applicants");
      await mockAuthentication(page, "employer");
      await page.reload();
      await waitForPageStable(page);

      // Start in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);

      // Open a modal (filter modal)
      const filterButton = page
        .locator(
          'button:has-text("Filter"), button[aria-label*="filter"], [data-testid="filter-button"]',
        )
        .first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await waitForPageStable(page);

        const modal = page
          .locator('[role="dialog"], .modal, [data-testid*="modal"]')
          .first();
        if (await modal.isVisible()) {
          // Modal should be full-screen in portrait mobile
          const portraitBounds = await modal.boundingBox();
          expect(portraitBounds?.width).toBeGreaterThan(350);
          expect(portraitBounds?.height).toBeGreaterThan(700);

          await expect(page).toHaveScreenshot("modal-portrait-fullscreen.png");

          // Change to landscape
          await page.setViewportSize({ width: 812, height: 375 });
          await waitForPageStable(page);

          // Modal should adapt to landscape (tablet-like sizing)
          const landscapeBounds = await modal.boundingBox();
          if (landscapeBounds) {
            // Should not be full width in landscape
            expect(landscapeBounds.width).toBeLessThan(800);
            expect(landscapeBounds.height).toBeLessThan(350);
          }

          await expect(page).toHaveScreenshot("modal-landscape-adapted.png");
        }
      }
    });
  });

  test.describe("Touch Target Consistency", () => {
    test("should maintain touch-friendly targets across orientations", async ({
      page,
    }) => {
      await page.goto("/login");
      await waitForPageStable(page);

      const testTouchTargets = async (orientation: string) => {
        const buttons = page.locator(
          'button, input[type="submit"], a[role="button"]',
        );
        const buttonCount = await buttons.count();

        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const boundingBox = await button.boundingBox();
            if (boundingBox) {
              // Touch targets should be at least 44x44px
              expect(
                boundingBox.height,
                `Button ${i} height in ${orientation}`,
              ).toBeGreaterThanOrEqual(40);
              expect(
                boundingBox.width,
                `Button ${i} width in ${orientation}`,
              ).toBeGreaterThanOrEqual(40);
            }
          }
        }

        // Test input fields
        const inputs = page.locator(
          'input[type="email"], input[type="password"], input[type="text"]',
        );
        const inputCount = await inputs.count();

        for (let i = 0; i < Math.min(inputCount, 3); i++) {
          const input = inputs.nth(i);
          if (await input.isVisible()) {
            const boundingBox = await input.boundingBox();
            if (boundingBox) {
              expect(
                boundingBox.height,
                `Input ${i} height in ${orientation}`,
              ).toBeGreaterThanOrEqual(40);
            }
          }
        }
      };

      // Test in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForPageStable(page);
      await testTouchTargets("portrait");

      // Test in landscape
      await page.setViewportSize({ width: 812, height: 375 });
      await waitForPageStable(page);
      await testTouchTargets("landscape");
    });
  });
});
