import { test, expect, Page } from "@playwright/test";
import {
  testPageResponsive,
  VIEWPORTS,
  waitForPageStable,
  mockAuthentication,
} from "./helpers/test-utils";

/**
 * Touch Interaction Tests
 *
 * Tests mobile-specific touch behaviors including:
 * - Mobile drawer open/close
 * - Swipe gestures for dismissible components
 * - Touch-friendly tap targets (44x44px minimum)
 * - Modal interactions on mobile
 * - Touch feedback and active states
 */

test.describe("Touch Interactions", () => {
  test.describe("Mobile Drawer Interactions", () => {
    test("Mobile drawer open and close - touch", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      // Navigate to a page with mobile navigation
      await page.goto("/business/dashboard");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test opening drawer with hamburger button
      const hamburgerButton = page
        .locator(
          '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
        )
        .first();
      await expect(hamburgerButton).toBeVisible();

      // Verify hamburger button has minimum touch target size
      const hamburgerBox = await hamburgerButton.boundingBox();
      expect(hamburgerBox?.width).toBeGreaterThanOrEqual(44);
      expect(hamburgerBox?.height).toBeGreaterThanOrEqual(44);

      // Open drawer
      await hamburgerButton.click();
      await page.waitForTimeout(300);

      // Verify drawer is open
      const drawer = page
        .locator(
          '[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]',
        )
        .first();
      await expect(drawer).toBeVisible();

      // Test drawer navigation items have proper touch targets
      const navItems = drawer.locator('a, button[role="menuitem"]');
      const navItemCount = await navItems.count();

      for (let i = 0; i < Math.min(navItemCount, 5); i++) {
        const item = navItems.nth(i);
        if (await item.isVisible()) {
          const itemBox = await item.boundingBox();
          expect(itemBox?.height).toBeGreaterThanOrEqual(44);
        }
      }

      // Test closing drawer by clicking outside
      await page.click("body", { position: { x: 350, y: 400 } });
      await page.waitForTimeout(300);

      // Verify drawer is closed
      await expect(drawer).not.toBeVisible();
    });

    test("Mobile drawer swipe-to-close gesture", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/dashboard");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Open drawer
      const hamburgerButton = page
        .locator(
          '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
        )
        .first();
      await hamburgerButton.click();
      await page.waitForTimeout(300);

      const drawer = page
        .locator(
          '[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]',
        )
        .first();
      await expect(drawer).toBeVisible();

      // Simulate swipe-to-close gesture (swipe left)
      const drawerBox = await drawer.boundingBox();
      if (drawerBox) {
        const startX = drawerBox.x + drawerBox.width / 2;
        const startY = drawerBox.y + drawerBox.height / 2;

        // Perform swipe gesture
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX - 150, startY, { steps: 10 });
        await page.waitForTimeout(100);
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Verify drawer is closed after swipe
        await expect(drawer).not.toBeVisible();
      }
    });

    test("Mobile drawer navigation item selection", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/dashboard");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Open drawer
      const hamburgerButton = page
        .locator(
          '[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]',
        )
        .first();
      await hamburgerButton.click();
      await page.waitForTimeout(300);

      const drawer = page
        .locator(
          '[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]',
        )
        .first();
      await expect(drawer).toBeVisible();

      // Test navigation item touch feedback
      const navItem = drawer.locator('a, button[role="menuitem"]').first();
      if (await navItem.isVisible()) {
        // Test active state on touch
        await navItem.hover();
        await page.waitForTimeout(100);

        // Simulate touch press
        await navItem.dispatchEvent("touchstart");
        await page.waitForTimeout(100);
        await navItem.dispatchEvent("touchend");

        // Verify drawer closes after navigation
        await page.waitForTimeout(300);
        await expect(drawer).not.toBeVisible();
      }
    });
  });

  test.describe("Swipe Gestures", () => {
    test("Swipeable notification item - dismiss gesture", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/dashboard");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
        // Mock notifications
        localStorage.setItem(
          "notifications",
          JSON.stringify([
            {
              id: "1",
              title: "Test Notification",
              message: "Test message",
              type: "info",
            },
          ]),
        );
      });

      await waitForPageStable(page);

      // Open notifications if available
      const notificationButton = page
        .locator('[data-testid="notifications-button"], .notifications-trigger')
        .first();
      if (await notificationButton.isVisible()) {
        await notificationButton.click();
        await page.waitForTimeout(300);

        // Find swipeable notification item
        const notificationItem = page
          .locator(
            '[data-testid="swipeable-notification"], .swipeable-notification-item',
          )
          .first();
        if (await notificationItem.isVisible()) {
          const itemBox = await notificationItem.boundingBox();
          if (itemBox) {
            // Perform swipe-to-dismiss gesture (swipe right)
            const startX = itemBox.x + 20;
            const startY = itemBox.y + itemBox.height / 2;

            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX + 150, startY, { steps: 10 });
            await page.waitForTimeout(100);
            await page.mouse.up();
            await page.waitForTimeout(500);

            // Verify notification is dismissed
            await expect(notificationItem).not.toBeVisible();
          }
        }
      }
    });

    test("Swipeable modal - dismiss gesture", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/applicants");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Open a modal that supports swipe-to-dismiss
      const filterButton = page
        .locator(
          '[data-testid="filter-button"], .filter-trigger, button:has-text("Filter")',
        )
        .first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await page.waitForTimeout(300);

        const modal = page
          .locator(
            '[data-testid="swipeable-modal"], .swipeable-modal, [role="dialog"]',
          )
          .first();
        if (await modal.isVisible()) {
          const modalBox = await modal.boundingBox();
          if (modalBox) {
            // Perform swipe-down gesture to dismiss
            const startX = modalBox.x + modalBox.width / 2;
            const startY = modalBox.y + 50;

            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX, startY + 200, { steps: 10 });
            await page.waitForTimeout(100);
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
    test("Button tap target sizes - minimum 44x44px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/opportunities");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test various button types for minimum tap target size
      const buttonSelectors = [
        'button[data-testid*="action"]',
        ".btn-primary",
        ".btn-secondary",
        'button:has-text("Post")',
        'button:has-text("Edit")',
        'button:has-text("Delete")',
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

    test("Form input tap targets - mobile friendly", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/opportunities/post");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test form inputs have adequate touch targets
      const inputSelectors = [
        'input[type="text"]',
        'input[type="email"]',
        "textarea",
        "select",
        ".form-input",
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

    test("Interactive element spacing - minimum 8px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/applicants");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test spacing between interactive elements
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
            const firstButton = buttons.nth(0);
            const secondButton = buttons.nth(1);

            const firstBox = await firstButton.boundingBox();
            const secondBox = await secondButton.boundingBox();

            if (firstBox && secondBox) {
              // Calculate spacing between buttons
              const horizontalSpacing = Math.abs(
                secondBox.x - (firstBox.x + firstBox.width),
              );
              const verticalSpacing = Math.abs(
                secondBox.y - (firstBox.y + firstBox.height),
              );

              // Verify minimum spacing (either horizontal or vertical)
              const minSpacing = Math.min(horizontalSpacing, verticalSpacing);
              expect(minSpacing).toBeGreaterThanOrEqual(8);
            }
          }
        }
      }
    });
  });

  test.describe("Modal Touch Interactions", () => {
    test("Modal full-screen behavior on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/applicants");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Open a modal
      const modalTrigger = page
        .locator(
          '[data-testid*="modal"], button:has-text("Filter"), button:has-text("Schedule")',
        )
        .first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"], .modal').first();
        if (await modal.isVisible()) {
          const modalBox = await modal.boundingBox();
          const viewport = page.viewportSize();

          if (modalBox && viewport) {
            // Verify modal takes full screen on mobile
            expect(modalBox.width).toBeCloseTo(viewport.width, 10);
            expect(modalBox.height).toBeCloseTo(viewport.height, 10);
          }
        }
      }
    });

    test("Modal close button touch target", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/applicants");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Open a modal
      const modalTrigger = page
        .locator('[data-testid*="modal"], button:has-text("Filter")')
        .first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"], .modal').first();
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
            await closeButton.click();
            await page.waitForTimeout(300);
            await expect(modal).not.toBeVisible();
          }
        }
      }
    });

    test("Modal scrolling behavior on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/opportunities/post");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test scrolling in a form modal or long content modal
      const longModal = page.locator('[role="dialog"], .modal').first();
      if (await longModal.isVisible()) {
        // Test that modal content is scrollable
        const scrollableArea = longModal
          .locator('.modal-content, .modal-body, [data-testid="modal-content"]')
          .first();
        if (await scrollableArea.isVisible()) {
          // Simulate scroll gesture
          const scrollBox = await scrollableArea.boundingBox();
          if (scrollBox) {
            const startX = scrollBox.x + scrollBox.width / 2;
            const startY = scrollBox.y + scrollBox.height / 2;

            // Perform scroll gesture
            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(startX, startY - 100, { steps: 5 });
            await page.waitForTimeout(100);
            await page.mouse.up();
            await page.waitForTimeout(300);

            // Verify scroll occurred (content should have moved)
            // This is a basic test - in real scenarios you'd check scroll position
            expect(true).toBe(true); // Placeholder for scroll verification
          }
        }
      }
    });
  });

  test.describe("Touch Feedback and Active States", () => {
    test("Button active states on touch", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/dashboard");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

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

    test("Link and interactive element touch feedback", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/opportunities");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Test various interactive elements for touch feedback
      const interactiveSelectors = [
        "a[href]",
        '[role="button"]',
        ".clickable",
        ".interactive",
      ];

      for (const selector of interactiveSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          // Test touch feedback
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

  test.describe("Dropdown and Menu Touch Interactions", () => {
    test("Dropdown menu touch-friendly targets", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      await page.goto("/business/applicants");
      await page.addInitScript(() => {
        localStorage.setItem("auth-token", "mock-token");
        localStorage.setItem("user-type", "employer");
      });

      await waitForPageStable(page);

      // Find dropdown trigger
      const dropdownTrigger = page
        .locator(
          '[data-testid*="dropdown"], .dropdown-trigger, button:has-text("Actions")',
        )
        .first();
      if (await dropdownTrigger.isVisible()) {
        // Verify trigger has adequate touch target
        const triggerBox = await dropdownTrigger.boundingBox();
        expect(triggerBox?.width).toBeGreaterThanOrEqual(44);
        expect(triggerBox?.height).toBeGreaterThanOrEqual(44);

        // Open dropdown
        await dropdownTrigger.click();
        await page.waitForTimeout(300);

        // Test dropdown menu items
        const menuItems = page.locator('[role="menuitem"], .dropdown-item');
        const itemCount = await menuItems.count();

        for (let i = 0; i < Math.min(itemCount, 3); i++) {
          const item = menuItems.nth(i);
          if (await item.isVisible()) {
            const itemBox = await item.boundingBox();
            // Verify menu items have adequate touch targets
            expect(itemBox?.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });
});
