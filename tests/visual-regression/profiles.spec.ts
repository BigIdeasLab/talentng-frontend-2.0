import { test } from "@playwright/test";
import { testPageResponsive, VIEWPORTS } from "./helpers/test-utils";

test.describe("Profile Pages - Visual Regression", () => {
  // Test employer profile across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Employer profile - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "employer-profile",
        "/business/profile",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="profile-header"], .profile-header, .profile-content',
          fullPage: true,
        },
      );
    });
  });

  // Test talent profile across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Talent profile - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "talent-profile",
        "/talent/profile",
        viewport,
        {
          mockAuth: true,
          userType: "talent",
          waitForSelector:
            '[data-testid="profile-header"], .profile-header, .profile-content',
          fullPage: true,
        },
      );
    });
  });

  // Test mentor profile across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Mentor profile - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "mentor-profile",
        "/mentor/profile",
        viewport,
        {
          mockAuth: true,
          userType: "mentor",
          waitForSelector:
            '[data-testid="profile-header"], .profile-header, .profile-content',
          fullPage: true,
        },
      );
    });
  });

  // Test talent profile view (public view) across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Talent profile view (public) - ${viewport.name}`, async ({
      page,
    }) => {
      await testPageResponsive(
        page,
        "talent-profile-view-public",
        "/talent/profile/1",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="talent-profile-view"], .talent-profile-view, .profile-header',
          fullPage: true,
        },
      );
    });
  });

  // Test profile edit form across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Profile edit form - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "profile-edit-form",
        "/talent/profile/edit",
        viewport,
        {
          mockAuth: true,
          userType: "talent",
          waitForSelector: 'form, [data-testid="profile-edit-form"]',
          fullPage: true,
        },
      );
    });
  });

  // Test profile navigation tabs on mobile
  test("Profile navigation tabs - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "profile-navigation-tabs-mobile",
      "/talent/profile",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "talent",
        waitForSelector:
          '[data-testid="profile-tabs"], .profile-tabs, .profile-navigation',
        fullPage: true,
      },
    );
  });

  // Test profile stats grid responsiveness
  test("Profile stats grid - mobile vs desktop", async ({ page }) => {
    // Mobile view
    await testPageResponsive(
      page,
      "profile-stats-grid-mobile",
      "/talent/profile",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "talent",
        waitForSelector:
          '[data-testid="profile-stats"], .profile-stats, .stats-grid',
        fullPage: false, // Focus on stats section
      },
    );
  });

  // Test profile with portfolio/works section
  test("Profile with portfolio - tablet", async ({ page }) => {
    await testPageResponsive(
      page,
      "profile-portfolio-tablet",
      "/talent/profile",
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: "talent",
        waitForSelector:
          '[data-testid="portfolio-section"], .portfolio-section, .works-grid',
        interactions: async (page) => {
          // Navigate to portfolio tab if it exists
          const portfolioTab = page
            .locator(
              '[data-testid="portfolio-tab"], button:has-text("Portfolio")',
            )
            .first();
          if (await portfolioTab.isVisible()) {
            await portfolioTab.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      },
    );
  });

  // Test profile image upload on mobile
  test("Profile image upload - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "profile-image-upload-mobile",
      "/talent/profile/edit",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "talent",
        waitForSelector:
          '[data-testid="profile-image-upload"], .profile-image-upload, .avatar-upload',
        interactions: async (page) => {
          // Click on profile image upload area
          const uploadArea = page
            .locator(
              '[data-testid="profile-image-upload"], .profile-image-upload, .avatar-upload',
            )
            .first();
          if (await uploadArea.isVisible()) {
            await uploadArea.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      },
    );
  });

  // Test profile form validation
  test("Profile form validation - mobile", async ({ page }) => {
    await testPageResponsive(
      page,
      "profile-form-validation-mobile",
      "/talent/profile/edit",
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: "talent",
        waitForSelector: "form",
        interactions: async (page) => {
          // Clear required fields and try to submit
          const firstNameInput = page
            .locator('input[name="firstName"], input[placeholder*="First"]')
            .first();
          if (await firstNameInput.isVisible()) {
            await firstNameInput.clear();
          }

          const submitButton = page
            .locator('button[type="submit"], button:has-text("Save")')
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

  // Test discover talent page (talent cards grid)
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Discover talent page - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        "discover-talent-page",
        "/business/discover-talent",
        viewport,
        {
          mockAuth: true,
          userType: "employer",
          waitForSelector:
            '[data-testid="talent-grid"], .talent-grid, .talent-cards',
          fullPage: true,
        },
      );
    });
  });

  // Test talent card hover/interaction states
  test("Talent card interactions - desktop", async ({ page }) => {
    await testPageResponsive(
      page,
      "talent-card-interactions-desktop",
      "/business/discover-talent",
      VIEWPORTS.desktop,
      {
        mockAuth: true,
        userType: "employer",
        waitForSelector: '[data-testid="talent-card"], .talent-card',
        interactions: async (page) => {
          // Hover over first talent card
          const firstCard = page
            .locator('[data-testid="talent-card"], .talent-card')
            .first();
          if (await firstCard.isVisible()) {
            await firstCard.hover();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      },
    );
  });
});
