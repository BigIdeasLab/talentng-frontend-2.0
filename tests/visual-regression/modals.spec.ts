import { test } from '@playwright/test';
import { testPageResponsive, VIEWPORTS } from './helpers/test-utils';

test.describe('Modal Components - Visual Regression', () => {
  // Test notifications modal across breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Notifications modal - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        'notifications-modal',
        '/business/dashboard',
        viewport,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          interactions: async (page) => {
            // Open notifications modal
            const notificationsButton = page.locator('[data-testid="notifications-button"], button[aria-label*="notification"]').first();
            if (await notificationsButton.isVisible()) {
              await notificationsButton.click();
              await page.waitForTimeout(300); // Wait for modal animation
            }
          },
          fullPage: true,
        }
      );
    });
  });

  // Test confirmation modal across breakpoints
  test('Confirmation modal - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'confirmation-modal-mobile',
      '/business/opportunities',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="opportunities-table"], .opportunities-table',
        interactions: async (page) => {
          // Try to delete an opportunity to trigger confirmation modal
          const deleteButton = page.locator('[data-testid="delete-opportunity"], button:has-text("Delete")').first();
          if (await deleteButton.isVisible()) {
            await deleteButton.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      }
    );
  });

  // Test responsive modal sizing
  test('Modal sizing comparison - mobile vs desktop', async ({ page }) => {
    // Test mobile full-screen modal
    await testPageResponsive(
      page,
      'modal-fullscreen-mobile',
      '/business/opportunities/post',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: 'form',
        fullPage: true,
      }
    );
  });

  // Test modal with form fields stacking
  test('Modal form fields stacking - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'modal-form-stacking-mobile',
      '/business/applicants',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="applicants-table"], .applicants-table',
        interactions: async (page) => {
          // Open filter modal to see form field stacking
          const filterButton = page.locator('[data-testid="filter-button"], button:has-text("Filter")').first();
          if (await filterButton.isVisible()) {
            await filterButton.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      }
    );
  });

  // Test modal action buttons stacking
  test('Modal action buttons - mobile vs desktop', async ({ page }) => {
    await testPageResponsive(
      page,
      'modal-action-buttons-mobile',
      '/business/applicants/1',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="applicant-profile"], .applicant-profile',
        interactions: async (page) => {
          // Open schedule interview modal to see button stacking
          const scheduleButton = page.locator('[data-testid="schedule-interview"], button:has-text("Schedule")').first();
          if (await scheduleButton.isVisible()) {
            await scheduleButton.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      }
    );
  });

  // Test notification detail panel
  test('Notification detail panel - tablet', async ({ page }) => {
    await testPageResponsive(
      page,
      'notification-detail-panel-tablet',
      '/business/dashboard',
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
        interactions: async (page) => {
          // Open notifications and then detail panel
          const notificationsButton = page.locator('[data-testid="notifications-button"], button[aria-label*="notification"]').first();
          if (await notificationsButton.isVisible()) {
            await notificationsButton.click();
            await page.waitForTimeout(300);
            
            // Click on first notification to open detail panel
            const firstNotification = page.locator('[data-testid="notification-item"], .notification-item').first();
            if (await firstNotification.isVisible()) {
              await firstNotification.click();
              await page.waitForTimeout(300);
            }
          }
        },
        fullPage: true,
      }
    );
  });

  // Test modal scrolling behavior
  test('Modal scrolling - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'modal-scrolling-mobile',
      '/business/opportunities/post',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: 'form',
        interactions: async (page) => {
          // Scroll within the modal to test scrollable content
          await page.evaluate(() => {
            const modal = document.querySelector('[role="dialog"], .modal-content');
            if (modal) {
              modal.scrollTop = 200;
            }
          });
          await page.waitForTimeout(300);
        },
        fullPage: true,
      }
    );
  });

  // Test modal close button positioning
  test('Modal close button - touch friendly', async ({ page }) => {
    await testPageResponsive(
      page,
      'modal-close-button-mobile',
      '/business/applicants',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="applicants-table"], .applicants-table',
        interactions: async (page) => {
          // Open any modal to test close button
          const filterButton = page.locator('[data-testid="filter-button"], button:has-text("Filter")').first();
          if (await filterButton.isVisible()) {
            await filterButton.click();
            await page.waitForTimeout(300);
          }
        },
        fullPage: true,
      }
    );
  });
});