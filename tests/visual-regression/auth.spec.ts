import { test } from '@playwright/test';
import { testPageResponsive, VIEWPORTS } from './helpers/test-utils';

test.describe('Authentication Pages - Visual Regression', () => {
  // Test login page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Login page - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        'login-page',
        '/login',
        viewport,
        {
          waitForSelector: 'form',
          fullPage: true,
        }
      );
    });
  });

  // Test signup page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Signup page - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        'signup-page',
        '/signup',
        viewport,
        {
          waitForSelector: 'form',
          fullPage: true,
        }
      );
    });
  });

  // Test forgot password page across all breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Forgot password page - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        'forgot-password-page',
        '/forgot-password',
        viewport,
        {
          waitForSelector: 'form',
          fullPage: true,
        }
      );
    });
  });

  // Test login page with form interactions on mobile
  test('Login page with form focus - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'login-page-form-focus',
      '/login',
      VIEWPORTS.mobile,
      {
        waitForSelector: 'form',
        interactions: async (page) => {
          // Focus on email input to show mobile keyboard behavior
          await page.click('input[type="email"]');
        },
        fullPage: true,
      }
    );
  });

  // Test signup page with validation errors
  test('Signup page with validation errors - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'signup-page-validation-errors',
      '/signup',
      VIEWPORTS.mobile,
      {
        waitForSelector: 'form',
        interactions: async (page) => {
          // Try to submit form without filling required fields
          await page.click('button[type="submit"]');
          // Wait for validation errors to appear
          await page.waitForTimeout(500);
        },
        fullPage: true,
      }
    );
  });
});