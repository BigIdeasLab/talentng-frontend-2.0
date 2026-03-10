import { test, expect } from "@playwright/test";
import { waitForPageStable, hideDynamicContent } from "./helpers/test-utils";

test.describe("Core Orientation Change Tests", () => {
  test("should handle basic orientation change from portrait to landscape", async ({
    page,
  }) => {
    // Navigate to a simple page
    await page.goto("/login");
    await waitForPageStable(page);

    // Start in portrait mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await waitForPageStable(page);
    await hideDynamicContent(page);

    // Verify page loads correctly in portrait
    await expect(page.locator("form")).toBeVisible();
    await expect(page).toHaveScreenshot("login-portrait-initial.png");

    // Change to landscape mobile
    await page.setViewportSize({ width: 812, height: 375 });
    await waitForPageStable(page);
    await hideDynamicContent(page);

    // Verify page adapts to landscape
    await expect(page.locator("form")).toBeVisible();
    await expect(page).toHaveScreenshot("login-landscape-adapted.png");

    // Verify form elements are still accessible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should preserve form data during orientation change", async ({
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

    await hideDynamicContent(page);
    await expect(page).toHaveScreenshot("login-form-data-preserved.png");
  });

  test("should maintain touch-friendly targets in both orientations", async ({
    page,
  }) => {
    await page.goto("/login");
    await waitForPageStable(page);

    const testTouchTargets = async (orientation: string) => {
      // Test button touch targets
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        const boundingBox = await submitButton.boundingBox();
        if (boundingBox) {
          expect(
            boundingBox.height,
            `Submit button height in ${orientation}`,
          ).toBeGreaterThanOrEqual(40);
          expect(
            boundingBox.width,
            `Submit button width in ${orientation}`,
          ).toBeGreaterThanOrEqual(40);
        }
      }

      // Test input field touch targets
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        const boundingBox = await emailInput.boundingBox();
        if (boundingBox) {
          expect(
            boundingBox.height,
            `Email input height in ${orientation}`,
          ).toBeGreaterThanOrEqual(40);
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

  test("should handle rapid orientation changes gracefully", async ({
    page,
  }) => {
    await page.goto("/login");
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
      await page.waitForTimeout(50); // Brief pause between changes
    }

    await waitForPageStable(page);

    // Verify page is still functional after rapid changes
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    await hideDynamicContent(page);
    await expect(page).toHaveScreenshot("login-after-rapid-changes.png");
  });
});
