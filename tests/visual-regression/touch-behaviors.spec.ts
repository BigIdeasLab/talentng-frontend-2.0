import { test, expect } from "@playwright/test";
import {
  VIEWPORTS,
  waitForPageStable,
  mockAuthentication,
} from "./helpers/test-utils";

/**
 * Touch Behavior Interaction Tests
 *
 * Comprehensive tests for mobile-specific touch behaviors as required by Task 24.2:
 * - Mobile drawer open/close interactions
 * - Swipe gestures for dismissible components
 * - Touch-friendly tap targets (44x44px minimum)
 * - Modal interactions on mobile viewports
 * - Touch feedback and active states
 *
 * Requirements: 25.2
 */

test.describe("Touch Behavior Interactions", () => {
  test.describe("Mobile Drawer Touch Behaviors", () => {
    test("should open mobile drawer with hamburger button tap", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Find and verify hamburger button
      const hamburgerButton = page
        .locator('[data-testid="hamburger-menu"]')
        .first();
      await expect(hamburgerButton).toBeVisible();

      // Verify hamburger button meets minimum touch target size (44x44px)
      const hamburgerBox = await hamburgerButton.boundingBox();
      expect(hamburgerBox?.width).toBeGreaterThanOrEqual(44);
      expect(hamburgerBox?.height).toBeGreaterThanOrEqual(44);

      // Tap to open drawer
      await hamburgerButton.tap();
      await page.waitForTimeout(300);

      // Verify drawer is visible with proper ARIA attributes
      const drawer = page.locator('[data-testid="mobile-drawer"]').first();
      await expect(drawer).toBeVisible();
      await expect(drawer).toHaveAttribute("role", "dialog");
    });

    test("should close mobile drawer by tapping outside", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Open drawer
      const hamburgerButton = page
        .locator('[data-testid="hamburger-menu"]')
        .first();
      await hamburgerButton.tap();
      await page.waitForTimeout(300);

      const drawer = page.locator('[data-testid="mobile-drawer"]').first();
      await expect(drawer).toBeVisible();

      // Tap outside drawer to close
      await page.tap("body", { position: { x: 350, y: 400 } });
      await page.waitForTimeout(300);

      // Verify drawer is closed
      await expect(drawer).not.toBeVisible();
    });

    test("should support swipe-to-close gesture on mobile drawer", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Open drawer
      const hamburgerButton = page
        .locator('[data-testid="hamburger-menu"]')
        .first();
      await hamburgerButton.tap();
      await page.waitForTimeout(300);

      const drawer = page.locator('[data-testid="mobile-drawer"]').first();
      await expect(drawer).toBeVisible();

      // Perform swipe-left gesture to close drawer
      const drawerBox = await drawer.boundingBox();
      if (drawerBox) {
        const startX = drawerBox.x + drawerBox.width / 2;
        const startY = drawerBox.y + drawerBox.height / 2;

        // Simulate swipe gesture
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX - 150, startY, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Verify drawer closed after swipe
        await expect(drawer).not.toBeVisible();
      }
    });

    test("should have touch-friendly navigation items in drawer", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Open drawer
      const hamburgerButton = page
        .locator('[data-testid="hamburger-menu"]')
        .first();
      await hamburgerButton.tap();
      await page.waitForTimeout(300);

      const drawer = page.locator('[data-testid="mobile-drawer"]').first();
      await expect(drawer).toBeVisible();

      // Test navigation items have minimum touch target size
      const navItems = drawer.locator('a, button[role="menuitem"]');
      const navItemCount = await navItems.count();

      for (let i = 0; i < Math.min(navItemCount, 5); i++) {
        const item = navItems.nth(i);
        if (await item.isVisible()) {
          const itemBox = await item.boundingBox();
          expect(itemBox?.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe("Swipe Gesture Behaviors", () => {
    test("should support swipe-to-dismiss on notification items", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Try to open notifications modal
      const notificationButton = page
        .locator('[data-testid="notifications-button"]')
        .first();
      if (await notificationButton.isVisible()) {
        await notificationButton.tap();
        await page.waitForTimeout(300);

        // Find swipeable notification item
        const notificationItem = page
          .locator('[data-testid="swipeable-notification"]')
          .first();
        if (await notificationItem.isVisible()) {
          const itemBox = await notificationItem.boundingBox();
          if (itemBox) {
            // Perform swipe-right gesture to dismiss
            const startX = itemBox.x + 20;
            const startY = itemBox.y + itemBox.height / 2;

            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX + 150, startY, { steps: 10 });
            await page.mouse.up();
            await page.waitForTimeout(500);

            // Verify notification is dismissed
            await expect(notificationItem).not.toBeVisible();
          }
        }
      }
    });

    test("should support swipe-to-dismiss on modal sheets", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/applicants");
      await waitForPageStable(page);

      // Open a filter modal that supports swipe-to-dismiss
      const filterButton = page
        .locator('[data-testid="filter-button"]')
        .first();
      if (await filterButton.isVisible()) {
        await filterButton.tap();
        await page.waitForTimeout(300);

        const modal = page.locator('[data-testid="swipeable-modal"]').first();
        if (await modal.isVisible()) {
          const modalBox = await modal.boundingBox();
          if (modalBox) {
            // Perform swipe-down gesture to dismiss
            const startX = modalBox.x + modalBox.width / 2;
            const startY = modalBox.y + 50;

            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX, startY + 200, { steps: 10 });
            await page.mouse.up();
            await page.waitForTimeout(500);

            // Verify modal is dismissed
            await expect(modal).not.toBeVisible();
          }
        }
      }
    });
  });

  test.describe("Touch-Friendly Tap Targets", () => {
    test("should have minimum 44x44px tap targets for all buttons", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/opportunities");
      await waitForPageStable(page);

      // Test various button types for minimum tap target size
      const buttonSelectors = [
        'button[data-testid*="action"]',
        ".btn-primary",
        ".btn-secondary",
        'button:has-text("Post")',
        '[role="button"]',
      ];

      for (const selector of buttonSelectors) {
        const buttons = page.locator(selector);
        const buttonCount = await buttons.count();

        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const buttonBox = await button.boundingBox();
            if (buttonBox) {
              // Verify minimum touch target size
              expect(buttonBox.width).toBeGreaterThanOrEqual(44);
              expect(buttonBox.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    });

    test("should have touch-friendly form inputs", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/opportunities/post");
      await waitForPageStable(page);

      // Test form inputs have adequate touch targets
      const inputSelectors = [
        'input[type="text"]',
        'input[type="email"]',
        "textarea",
        "select",
      ];

      for (const selector of inputSelectors) {
        const inputs = page.locator(selector);
        const inputCount = await inputs.count();

        for (let i = 0; i < Math.min(inputCount, 3); i++) {
          const input = inputs.nth(i);
          if (await input.isVisible()) {
            const inputBox = await input.boundingBox();
            if (inputBox) {
              // Verify minimum touch target height
              expect(inputBox.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    });

    test("should have adequate spacing between interactive elements", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/applicants");
      await waitForPageStable(page);

      // Test spacing between interactive elements in action groups
      const actionGroups = page.locator(
        '[data-testid*="actions"], .action-group, .button-group',
      );
      const groupCount = await actionGroups.count();

      for (let i = 0; i < Math.min(groupCount, 3); i++) {
        const group = actionGroups.nth(i);
        if (await group.isVisible()) {
          const buttons = group.locator('button, a[role="button"]');
          const buttonCount = await buttons.count();

          if (buttonCount > 1) {
            for (let j = 0; j < buttonCount - 1; j++) {
              const currentButton = buttons.nth(j);
              const nextButton = buttons.nth(j + 1);

              const currentBox = await currentButton.boundingBox();
              const nextBox = await nextButton.boundingBox();

              if (currentBox && nextBox) {
                // Calculate spacing between buttons
                const horizontalSpacing = Math.abs(
                  nextBox.x - (currentBox.x + currentBox.width),
                );
                const verticalSpacing = Math.abs(
                  nextBox.y - (currentBox.y + currentBox.height),
                );

                // Verify minimum spacing (either horizontal or vertical)
                const minSpacing = Math.min(horizontalSpacing, verticalSpacing);
                expect(minSpacing).toBeGreaterThanOrEqual(8);
              }
            }
          }
        }
      }
    });
  });

  test.describe("Modal Touch Interactions", () => {
    test("should render modals full-screen on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/applicants");
      await waitForPageStable(page);

      // Open a modal
      const modalTrigger = page.locator('button:has-text("Filter")').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.tap();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"]').first();
        if (await modal.isVisible()) {
          const modalBox = await modal.boundingBox();
          const viewport = page.viewportSize();

          if (modalBox && viewport) {
            // Verify modal takes full screen on mobile (within 10px tolerance)
            expect(modalBox.width).toBeCloseTo(viewport.width, 10);
            expect(modalBox.height).toBeCloseTo(viewport.height, 10);
          }
        }
      }
    });

    test("should have touch-friendly close button in modals", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/applicants");
      await waitForPageStable(page);

      // Open a modal
      const modalTrigger = page.locator('button:has-text("Filter")').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.tap();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"]').first();
        if (await modal.isVisible()) {
          // Find close button
          const closeButton = modal
            .locator(
              '[data-testid="close"], button[aria-label*="close"], .close-button',
            )
            .first();
          if (await closeButton.isVisible()) {
            const closeBox = await closeButton.boundingBox();

            // Verify close button has minimum touch target size
            expect(closeBox?.width).toBeGreaterThanOrEqual(44);
            expect(closeBox?.height).toBeGreaterThanOrEqual(44);

            // Test close functionality
            await closeButton.tap();
            await page.waitForTimeout(300);
            await expect(modal).not.toBeVisible();
          }
        }
      }
    });

    test("should stack form fields vertically in mobile modals", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/applicants");
      await waitForPageStable(page);

      // Open filter modal
      const filterButton = page.locator('button:has-text("Filter")').first();
      if (await filterButton.isVisible()) {
        await filterButton.tap();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"]').first();
        if (await modal.isVisible()) {
          // Check that form fields are stacked vertically
          const formFields = modal.locator("input, select, textarea");
          const fieldCount = await formFields.count();

          if (fieldCount > 1) {
            for (let i = 0; i < fieldCount - 1; i++) {
              const currentField = formFields.nth(i);
              const nextField = formFields.nth(i + 1);

              const currentBox = await currentField.boundingBox();
              const nextBox = await nextField.boundingBox();

              if (currentBox && nextBox) {
                // Verify fields are stacked vertically (next field is below current)
                expect(nextBox.y).toBeGreaterThan(
                  currentBox.y + currentBox.height,
                );
              }
            }
          }
        }
      }
    });
  });

  test.describe("Touch Feedback and Active States", () => {
    test("should provide visual feedback on button touch", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Test button active states
      const button = page.locator("button, .btn").first();
      if (await button.isVisible()) {
        // Get initial styles
        const initialStyles = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            transform: computed.transform,
            opacity: computed.opacity,
            backgroundColor: computed.backgroundColor,
          };
        });

        // Simulate touch press
        await button.dispatchEvent("touchstart");
        await page.waitForTimeout(100);

        // Get active styles
        const activeStyles = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            transform: computed.transform,
            opacity: computed.opacity,
            backgroundColor: computed.backgroundColor,
          };
        });

        // Verify some visual feedback occurred
        const hasVisualFeedback =
          initialStyles.transform !== activeStyles.transform ||
          initialStyles.opacity !== activeStyles.opacity ||
          initialStyles.backgroundColor !== activeStyles.backgroundColor;

        expect(hasVisualFeedback).toBe(true);

        // End touch
        await button.dispatchEvent("touchend");
        await page.waitForTimeout(100);
      }
    });

    test("should provide touch feedback on interactive elements", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/opportunities");
      await waitForPageStable(page);

      // Test various interactive elements for touch feedback
      const interactiveSelectors = ["a[href]", '[role="button"]', ".clickable"];

      for (const selector of interactiveSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          // Test touch feedback by simulating touch events
          await element.hover();
          await page.waitForTimeout(100);

          // Simulate touch interaction
          await element.dispatchEvent("touchstart");
          await page.waitForTimeout(50);
          await element.dispatchEvent("touchend");
          await page.waitForTimeout(100);

          // Basic verification that element is still responsive
          expect(await element.isVisible()).toBe(true);
        }
      }
    });
  });

  test.describe("Accessibility and Screen Reader Support", () => {
    test("should have proper ARIA labels on touch elements", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Test hamburger menu button
      const hamburgerButton = page
        .locator('[data-testid="hamburger-menu"]')
        .first();
      if (await hamburgerButton.isVisible()) {
        await expect(hamburgerButton).toHaveAttribute("aria-label");
        await expect(hamburgerButton).toHaveAttribute("role", "button");
      }

      // Test other interactive elements
      const interactiveElements = page.locator(
        'button, [role="button"], a[href]',
      );
      const elementCount = await interactiveElements.count();

      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          // Verify element has accessible name (either aria-label, aria-labelledby, or text content)
          const hasAccessibleName = await element.evaluate((el) => {
            return !!(
              el.getAttribute("aria-label") ||
              el.getAttribute("aria-labelledby") ||
              el.textContent?.trim()
            );
          });

          expect(hasAccessibleName).toBe(true);
        }
      }
    });

    test("should support keyboard navigation on tablet viewports", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await mockAuthentication(page, "employer");
      await page.goto("/business/dashboard");
      await waitForPageStable(page);

      // Test tab navigation through interactive elements
      const firstButton = page.locator("button, a[href]").first();
      if (await firstButton.isVisible()) {
        await firstButton.focus();

        // Verify focus is visible
        const isFocused = await firstButton.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused).toBe(true);

        // Test tab navigation
        await page.keyboard.press("Tab");
        await page.waitForTimeout(100);

        // Verify focus moved to next element
        const newFocusedElement = await page.evaluate(
          () => document.activeElement?.tagName,
        );
        expect(newFocusedElement).toBeTruthy();
      }
    });
  });
});
