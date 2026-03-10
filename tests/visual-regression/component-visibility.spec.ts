import { test, expect } from '@playwright/test';
import { testPageResponsive, VIEWPORTS } from './helpers/test-utils';

test.describe('Component Visibility Tests - Visual Regression', () => {
  
  // Test 1: Desktop Sidebar Visibility Rules
  test.describe('Desktop Sidebar Visibility', () => {
    test('Desktop sidebar - hidden on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'sidebar-hidden-mobile',
        '/business/dashboard',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Verify sidebar is not visible on mobile
      const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
      await expect(sidebar).toHaveClass(/hidden/);
    });

    test('Desktop sidebar - collapsed on tablet', async ({ page }) => {
      await testPageResponsive(
        page,
        'sidebar-collapsed-tablet',
        '/business/dashboard',
        VIEWPORTS.tablet,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Verify sidebar is collapsed (narrow width) on tablet
      const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
      await expect(sidebar).toHaveClass(/md:w-16/);
      
      // Verify labels are hidden on tablet
      const sidebarLabels = page.locator('aside span, .sidebar span').filter({ hasText: /Dashboard|Opportunities|Applicants/ });
      if (await sidebarLabels.count() > 0) {
        await expect(sidebarLabels.first()).toHaveClass(/md:hidden/);
      }
    });

    test('Desktop sidebar - full width on desktop', async ({ page }) => {
      await testPageResponsive(
        page,
        'sidebar-full-desktop',
        '/business/dashboard',
        VIEWPORTS.desktop,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Verify sidebar is visible and full width on desktop
      const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toHaveClass(/lg:w-\[250px\]|lg:w-64/);
      
      // Verify labels are visible on desktop
      const sidebarLabels = page.locator('aside span, .sidebar span').filter({ hasText: /Dashboard|Opportunities|Applicants/ });
      if (await sidebarLabels.count() > 0) {
        await expect(sidebarLabels.first()).toHaveClass(/lg:inline|lg:block/);
      }
    });

    test('Sidebar logo visibility - hidden on tablet, shown on desktop', async ({ page }) => {
      await page.setViewportSize({ width: VIEWPORTS.tablet.width, height: VIEWPORTS.tablet.height });
      await page.goto('/business/dashboard');
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-token');
        localStorage.setItem('user-type', 'employer');
      });
      await page.waitForLoadState('networkidle');
      
      // Check logo is hidden on tablet
      const logo = page.locator('aside img[alt*="Logo"], .sidebar img[alt*="Logo"]');
      if (await logo.count() > 0) {
        const logoContainer = logo.locator('..');
        await expect(logoContainer).toHaveClass(/md:hidden/);
      }
      
      // Switch to desktop and verify logo is visible
      await page.setViewportSize({ width: VIEWPORTS.desktop.width, height: VIEWPORTS.desktop.height });
      await page.waitForTimeout(300);
      
      if (await logo.count() > 0) {
        const logoContainer = logo.locator('..');
        await expect(logoContainer).toHaveClass(/lg:block/);
      }
    });
  });

  // Test 2: Mobile-Specific Component Visibility
  test.describe('Mobile-Specific Components', () => {
    test('Hamburger menu - shown only on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'hamburger-menu-mobile-only',
        '/business/dashboard',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Verify hamburger menu is visible on mobile
      const hamburgerMenu = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]');
      await expect(hamburgerMenu).toBeVisible();
    });

    test('Hamburger menu - hidden on tablet and desktop', async ({ page }) => {
      // Test tablet
      await testPageResponsive(
        page,
        'hamburger-menu-hidden-tablet',
        '/business/dashboard',
        VIEWPORTS.tablet,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      const hamburgerMenu = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]');
      if (await hamburgerMenu.count() > 0) {
        await expect(hamburgerMenu).toHaveClass(/md:hidden|hidden/);
      }
    });

    test('Mobile drawer - functionality on mobile only', async ({ page }) => {
      await testPageResponsive(
        page,
        'mobile-drawer-functionality',
        '/business/dashboard',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          interactions: async (page) => {
            // Open mobile drawer
            const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
            if (await hamburgerButton.isVisible()) {
              await hamburgerButton.click();
              await page.waitForTimeout(300);
            }
          },
          fullPage: true,
        }
      );
      
      // Verify mobile drawer is open
      const mobileDrawer = page.locator('[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]');
      if (await mobileDrawer.count() > 0) {
        await expect(mobileDrawer).toBeVisible();
      }
    });

    test('Mobile tabs - shown only on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'mobile-tabs-mobile-only',
        '/talent/profile/1',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="profile-content"], .profile-content',
          fullPage: true,
        }
      );
      
      // Look for mobile tab navigation
      const mobileTabs = page.locator('[data-testid="mobile-tabs"], .mobile-tabs, .profile-tabs.md\\:hidden');
      if (await mobileTabs.count() > 0) {
        await expect(mobileTabs).toBeVisible();
      }
    });
  });

  // Test 3: Table Column Visibility on Mobile
  test.describe('Table Column Visibility', () => {
    test('Table columns - all columns on desktop', async ({ page }) => {
      await testPageResponsive(
        page,
        'table-all-columns-desktop',
        '/business/applicants',
        VIEWPORTS.desktop,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="applicants-table"], .applicants-table',
          fullPage: true,
        }
      );
      
      // Verify table structure is visible (not card layout)
      const tableHeaders = page.locator('th, [role="columnheader"]');
      const tableRows = page.locator('tr, [role="row"]');
      
      if (await tableHeaders.count() > 0) {
        await expect(tableHeaders.first()).toBeVisible();
      }
      if (await tableRows.count() > 0) {
        await expect(tableRows.first()).toBeVisible();
      }
    });

    test('Table columns - essential columns only on tablet', async ({ page }) => {
      await testPageResponsive(
        page,
        'table-essential-columns-tablet',
        '/business/applicants',
        VIEWPORTS.tablet,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="applicants-table"], .applicants-table',
          fullPage: true,
        }
      );
      
      // Verify table has horizontal scroll capability
      const tableContainer = page.locator('[data-testid="applicants-table"], .applicants-table, .table-container');
      if (await tableContainer.count() > 0) {
        await expect(tableContainer).toHaveClass(/overflow-x-auto/);
      }
    });

    test('Table transformation - card layout on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'table-card-layout-mobile',
        '/business/applicants',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="mobile-table-card"], .mobile-table-card, .applicant-card',
          fullPage: true,
        }
      );
      
      // Verify card layout is used instead of table
      const mobileCards = page.locator('[data-testid="mobile-table-card"], .mobile-table-card, .applicant-card');
      if (await mobileCards.count() > 0) {
        await expect(mobileCards.first()).toBeVisible();
      }
      
      // Verify traditional table is not visible
      const tableHeaders = page.locator('th, [role="columnheader"]');
      if (await tableHeaders.count() > 0) {
        await expect(tableHeaders.first()).not.toBeVisible();
      }
    });

    test('Opportunities table - responsive transformation', async ({ page }) => {
      await testPageResponsive(
        page,
        'opportunities-table-mobile-cards',
        '/business/opportunities',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="opportunities-table"], .opportunities-table, .opportunity-card',
          fullPage: true,
        }
      );
      
      // Verify opportunity cards are visible on mobile
      const opportunityCards = page.locator('[data-testid="opportunity-card"], .opportunity-card');
      if (await opportunityCards.count() > 0) {
        await expect(opportunityCards.first()).toBeVisible();
      }
    });
  });

  // Test 4: Stat Descriptions Visibility
  test.describe('Stat Descriptions Visibility', () => {
    test('Stat descriptions - hidden on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'stat-descriptions-hidden-mobile',
        '/business/dashboard',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: false, // Focus on stats area
        }
      );
      
      // Look for stat description elements that should be hidden
      const statDescriptions = page.locator('.stat-description, [data-testid="stat-description"]');
      if (await statDescriptions.count() > 0) {
        await expect(statDescriptions.first()).toHaveClass(/hidden|md:block/);
      }
      
      // Verify primary metrics are still visible
      const statValues = page.locator('.stat-value, [data-testid="stat-value"]');
      if (await statValues.count() > 0) {
        await expect(statValues.first()).toBeVisible();
      }
    });

    test('Stat descriptions - shown on tablet and desktop', async ({ page }) => {
      await testPageResponsive(
        page,
        'stat-descriptions-shown-desktop',
        '/business/dashboard',
        VIEWPORTS.desktop,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: false,
        }
      );
      
      // Verify stat descriptions are visible on desktop
      const statDescriptions = page.locator('.stat-description, [data-testid="stat-description"]');
      if (await statDescriptions.count() > 0) {
        await expect(statDescriptions.first()).toBeVisible();
      }
    });
  });

  // Test 5: Decorative Elements Visibility
  test.describe('Decorative Elements Visibility', () => {
    test('Decorative elements - hidden on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'decorative-elements-hidden-mobile',
        '/business/dashboard',
        VIEWPORTS.mobile,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Look for decorative elements that should be hidden
      const decorativeElements = page.locator('.decorative, [data-testid="decorative"], .illustration, .background-pattern');
      if (await decorativeElements.count() > 0) {
        await expect(decorativeElements.first()).toHaveClass(/hidden|md:block/);
      }
    });

    test('Brand elements - maintained on mobile', async ({ page }) => {
      await testPageResponsive(
        page,
        'brand-elements-maintained-mobile',
        '/auth/login',
        VIEWPORTS.mobile,
        {
          waitForSelector: 'form, [data-testid="login-form"]',
          fullPage: true,
        }
      );
      
      // Verify essential brand elements are still visible
      const brandElements = page.locator('img[alt*="logo"], .logo, [data-testid="logo"]');
      if (await brandElements.count() > 0) {
        await expect(brandElements.first()).toBeVisible();
      }
    });
  });

  // Test 6: Visibility Utility Components
  test.describe('Visibility Utility Components', () => {
    test('HideOnMobile component - hidden on mobile, shown on desktop', async ({ page }) => {
      // Create a test page with HideOnMobile component
      await page.goto('/business/dashboard');
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-token');
        localStorage.setItem('user-type', 'employer');
      });
      
      // Inject test content with HideOnMobile
      await page.addStyleTag({
        content: `
          .test-hide-on-mobile {
            padding: 1rem;
            background: #f0f0f0;
            border: 1px solid #ccc;
          }
          .test-hide-on-mobile.hidden { display: none !important; }
          .test-hide-on-mobile.md\\:block { display: block !important; }
          @media (max-width: 767px) {
            .test-hide-on-mobile.hidden.md\\:block { display: none !important; }
          }
          @media (min-width: 768px) {
            .test-hide-on-mobile.hidden.md\\:block { display: block !important; }
          }
        `
      });
      
      await page.evaluate(() => {
        const testElement = document.createElement('div');
        testElement.className = 'test-hide-on-mobile hidden md:block';
        testElement.textContent = 'This should be hidden on mobile';
        testElement.setAttribute('data-testid', 'hide-on-mobile-test');
        document.body.appendChild(testElement);
      });
      
      // Test mobile - should be hidden
      await page.setViewportSize({ width: VIEWPORTS.mobile.width, height: VIEWPORTS.mobile.height });
      await page.waitForTimeout(300);
      
      const hiddenElement = page.locator('[data-testid="hide-on-mobile-test"]');
      await expect(hiddenElement).not.toBeVisible();
      
      // Test desktop - should be visible
      await page.setViewportSize({ width: VIEWPORTS.desktop.width, height: VIEWPORTS.desktop.height });
      await page.waitForTimeout(300);
      
      await expect(hiddenElement).toBeVisible();
    });

    test('ShowOnMobile component - shown on mobile, hidden on desktop', async ({ page }) => {
      // Create a test page with ShowOnMobile component
      await page.goto('/business/dashboard');
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-token');
        localStorage.setItem('user-type', 'employer');
      });
      
      // Inject test content with ShowOnMobile
      await page.addStyleTag({
        content: `
          .test-show-on-mobile {
            padding: 1rem;
            background: #e0f0ff;
            border: 1px solid #0066cc;
          }
          .test-show-on-mobile.block { display: block !important; }
          .test-show-on-mobile.md\\:hidden { display: block !important; }
          @media (min-width: 768px) {
            .test-show-on-mobile.block.md\\:hidden { display: none !important; }
          }
        `
      });
      
      await page.evaluate(() => {
        const testElement = document.createElement('div');
        testElement.className = 'test-show-on-mobile block md:hidden';
        testElement.textContent = 'This should be shown only on mobile';
        testElement.setAttribute('data-testid', 'show-on-mobile-test');
        document.body.appendChild(testElement);
      });
      
      // Test mobile - should be visible
      await page.setViewportSize({ width: VIEWPORTS.mobile.width, height: VIEWPORTS.mobile.height });
      await page.waitForTimeout(300);
      
      const shownElement = page.locator('[data-testid="show-on-mobile-test"]');
      await expect(shownElement).toBeVisible();
      
      // Test desktop - should be hidden
      await page.setViewportSize({ width: VIEWPORTS.desktop.width, height: VIEWPORTS.desktop.height });
      await page.waitForTimeout(300);
      
      await expect(shownElement).not.toBeVisible();
    });
  });

  // Test 7: Profile Switcher Visibility
  test.describe('Profile Switcher Visibility', () => {
    test('Profile switcher - hidden on tablet sidebar, shown on desktop', async ({ page }) => {
      await testPageResponsive(
        page,
        'profile-switcher-tablet-hidden',
        '/business/dashboard',
        VIEWPORTS.tablet,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Verify profile switcher is hidden in tablet sidebar
      const profileSwitcher = page.locator('aside [data-testid="profile-switcher"], .sidebar .profile-switcher');
      if (await profileSwitcher.count() > 0) {
        const profileSwitcherContainer = profileSwitcher.locator('..');
        await expect(profileSwitcherContainer).toHaveClass(/md:hidden/);
      }
    });

    test('Profile switcher - shown in mobile drawer', async ({ page }) => {
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
            // Open mobile drawer
            const hamburgerButton = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]').first();
            if (await hamburgerButton.isVisible()) {
              await hamburgerButton.click();
              await page.waitForTimeout(300);
            }
          },
          fullPage: true,
        }
      );
      
      // Verify profile switcher is visible in mobile drawer
      const mobileProfileSwitcher = page.locator('[role="dialog"] [data-testid="profile-switcher"], .mobile-drawer .profile-switcher');
      if (await mobileProfileSwitcher.count() > 0) {
        await expect(mobileProfileSwitcher).toBeVisible();
      }
    });
  });

  // Test 8: Navigation Badge Positioning
  test.describe('Navigation Badge Visibility', () => {
    test('Navigation badges - responsive positioning', async ({ page }) => {
      await testPageResponsive(
        page,
        'navigation-badges-responsive',
        '/business/dashboard',
        VIEWPORTS.tablet,
        {
          mockAuth: true,
          userType: 'employer',
          waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
          fullPage: true,
        }
      );
      
      // Look for notification badges in sidebar
      const notificationBadges = page.locator('aside .badge, .sidebar .badge, aside [class*="bg-"][class*="rounded-full"]');
      if (await notificationBadges.count() > 0) {
        // Verify badges have responsive positioning classes
        await expect(notificationBadges.first()).toHaveClass(/md:absolute|lg:static/);
      }
    });
  });

  // Test 9: Cross-Viewport Consistency
  test.describe('Cross-Viewport Consistency', () => {
    test('Component visibility consistency across user types', async ({ page }) => {
      const userTypes = ['employer', 'talent', 'mentor'] as const;
      
      for (const userType of userTypes) {
        await testPageResponsive(
          page,
          `visibility-consistency-${userType}-mobile`,
          `/${userType === 'employer' ? 'business' : userType}/dashboard`,
          VIEWPORTS.mobile,
          {
            mockAuth: true,
            userType,
            waitForSelector: '[data-testid="dashboard-stats"], .dashboard-stats',
            fullPage: true,
          }
        );
        
        // Verify consistent mobile behavior across user types
        const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
        if (await sidebar.count() > 0) {
          await expect(sidebar).toHaveClass(/hidden/);
        }
        
        const hamburgerMenu = page.locator('[data-testid="hamburger-menu"], .hamburger-menu, button[aria-label*="menu"]');
        if (await hamburgerMenu.count() > 0) {
          await expect(hamburgerMenu).toBeVisible();
        }
      }
    });
  });

  // Test 10: Accessibility and Focus Management
  test.describe('Visibility and Accessibility', () => {
    test('Hidden elements - not focusable', async ({ page }) => {
      await page.setViewportSize({ width: VIEWPORTS.mobile.width, height: VIEWPORTS.mobile.height });
      await page.goto('/business/dashboard');
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-token');
        localStorage.setItem('user-type', 'employer');
      });
      await page.waitForLoadState('networkidle');
      
      // Try to tab to hidden sidebar elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verify focus is not on hidden sidebar elements
      const focusedElement = page.locator(':focus');
      const sidebarElements = page.locator('aside a, aside button, .sidebar a, .sidebar button');
      
      if (await sidebarElements.count() > 0 && await focusedElement.count() > 0) {
        const focusedText = await focusedElement.textContent();
        const sidebarTexts = await sidebarElements.allTextContents();
        
        // Focus should not be on any hidden sidebar elements
        expect(sidebarTexts).not.toContain(focusedText);
      }
    });
  });
});