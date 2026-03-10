import { test } from '@playwright/test';
import { testPageResponsive, VIEWPORTS } from './helpers/test-utils';

test.describe('Navigation Components - Visual Regression', () => {
  // Test desktop sidebar across breakpoints
  Object.values(VIEWPORTS).forEach((viewport) => {
    test(`Desktop sidebar - ${viewport.name}`, async ({ page }) => {
      await testPageResponsive(
        page,
        'desktop-sidebar',
        '/business/dashboard',
        viewport,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="sidebar"], .sidebar, nav',
          fullPage: true,
        }
      );
    });
  });

  // Test mobile navigation drawer
  test('Mobile navigation drawer - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'mobile-navigation-drawer',
      '/business/dashboard',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
        interactions: async (page) => {
          // Open mobile navigation drawer
          const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
          if (await hamburgerButton.isVisible()) {
            await hamburgerButton.click();
            await page.waitForTimeout(300); // Wait for drawer animation
          }
        },
        fullPage: true,
      }
    );
  });

  // Test hamburger menu button states
  test('Hamburger menu button states - mobile', async ({ page }) => {
    await page.setViewportSize({ width: VIEWPORTS.mobile.width, height: VIEWPORTS.mobile.height });
    
    await page.goto('/business/dashboard');
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-token');
      localStorage.setItem('user-type', 'employer');
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Test closed state
    await page.screenshot({ path: 'test-results/hamburger-closed-mobile.png', fullPage: true });
    
    // Test open state
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'test-results/hamburger-open-mobile.png', fullPage: true });
    }
  });

  // Test tablet collapsed sidebar
  test('Tablet collapsed sidebar - tablet', async ({ page }) => {
    await testPageResponsive(
      page,
      'tablet-collapsed-sidebar',
      '/business/dashboard',
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="sidebar"], .sidebar, nav',
        fullPage: true,
      }
    );
  });

  // Test navigation with different user types
  Object.values(['employer', 'talent', 'mentor'] as const).forEach((userType) => {
    test(`Navigation for ${userType} - mobile`, async ({ page }) => {
      await testPageResponsive(
        page,
        `navigation-${userType}`,
        `/${userType === 'employer' ? 'business' : userType}/dashboard`,
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType,
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          interactions: async (page) => {
            // Open mobile navigation
            const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
            if (await hamburgerButton.isVisible()) {
              await hamburgerButton.click();
              await page.waitForTimeout(300);
            }
          },
          fullPage: true,
        }
      );
    });
  });

  // Test profile switcher in mobile drawer
  test('Profile switcher in mobile drawer - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'profile-switcher-mobile-drawer',
      '/business/dashboard',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
        interactions: async (page) => {
          // Open mobile navigation
          const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
          if (await hamburgerButton.isVisible()) {
            await hamburgerButton.click();
            await page.waitForTimeout(300);
            
            // Click on profile switcher if visible
            const profileSwitcher = page.locator('[data-testid="profile-switcher"], .profile-switcher').first();
            if (await profileSwitcher.isVisible()) {
              await profileSwitcher.click();
              await page.waitForTimeout(300);
            }
          }
        },
        fullPage: true,
      }
    );
  });

  // Test navigation badges and notifications
  test('Navigation badges - desktop vs mobile', async ({ page }) => {
    // Desktop view
    await testPageResponsive(
      page,
      'navigation-badges-desktop',
      '/business/dashboard',
      VIEWPORTS.desktop,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="sidebar"], .sidebar, nav',
        fullPage: true,
      }
    );
  });

  // Test navigation item active states
  test('Navigation active states - tablet', async ({ page }) => {
    await testPageResponsive(
      page,
      'navigation-active-states-tablet',
      '/business/opportunities',
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="opportunities-table"], .opportunities-table',
        fullPage: true,
      }
    );
  });

  // Test navigation drawer swipe gesture area
  test('Navigation drawer swipe area - mobile', async ({ page }) => {
    await testPageResponsive(
      page,
      'navigation-drawer-swipe-area',
      '/business/dashboard',
      VIEWPORTS.mobile,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
        interactions: async (page) => {
          // Open drawer
          const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
          if (await hamburgerButton.isVisible()) {
            await hamburgerButton.click();
            await page.waitForTimeout(300);
          }
          
          // Simulate swipe gesture (partial close)
          await page.mouse.move(200, 400);
          await page.mouse.down();
          await page.mouse.move(100, 400);
          await page.waitForTimeout(100);
          await page.mouse.up();
          await page.waitForTimeout(300);
        },
        fullPage: true,
      }
    );
  });

  // Test navigation accessibility focus states
  test('Navigation focus states - tablet', async ({ page }) => {
    await testPageResponsive(
      page,
      'navigation-focus-states-tablet',
      '/business/dashboard',
      VIEWPORTS.tablet,
      {
        mockAuth: true,
        userType: 'employer',
        waitForSelector: '[data-testid="sidebar"], .sidebar, nav',
        interactions: async (page) => {
          // Tab through navigation items to show focus states
          await page.keyboard.press('Tab');
          await page.waitForTimeout(200);
          await page.keyboard.press('Tab');
          await page.waitForTimeout(200);
          await page.keyboard.press('Tab');
          await page.waitForTimeout(200);
        },
        fullPage: true,
      }
    );
  });
});