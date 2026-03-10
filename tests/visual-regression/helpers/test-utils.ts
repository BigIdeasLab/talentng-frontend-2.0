import { Page, expect } from "@playwright/test";

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

export const VIEWPORTS: Record<string, ViewportConfig> = {
  mobile: { name: "mobile", width: 375, height: 812 },
  tablet: { name: "tablet", width: 768, height: 1024 },
  desktop: { name: "desktop", width: 1280, height: 720 },
};

/**
 * Wait for page to be fully loaded and stable
 */
export async function waitForPageStable(page: Page) {
  // Wait for network to be idle
  await page.waitForLoadState("networkidle");

  // Wait for any animations to complete
  await page.waitForTimeout(500);

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Hide dynamic content that changes between test runs
 */
export async function hideDynamicContent(page: Page) {
  await page.addStyleTag({
    content: `
      /* Hide elements that change between test runs */
      [data-testid="current-time"],
      [data-testid="timestamp"],
      .timestamp,
      .relative-time,
      .loading-spinner,
      .skeleton {
        visibility: hidden !important;
      }
      
      /* Disable animations for consistent screenshots */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Mock authentication for test pages
 */
export async function mockAuthentication(
  page: Page,
  userType: "employer" | "talent" | "mentor" = "employer",
) {
  await page.addInitScript((userType) => {
    // Mock localStorage auth data
    localStorage.setItem("auth-token", "mock-token");
    localStorage.setItem("user-type", userType);
    localStorage.setItem("user-id", "mock-user-id");

    // Mock user data
    const mockUser = {
      id: "mock-user-id",
      email: "test@example.com",
      name: "Test User",
      type: userType,
      profile: {
        firstName: "Test",
        lastName: "User",
        avatar: "/placeholder-avatar.jpg",
      },
    };

    localStorage.setItem("user-data", JSON.stringify(mockUser));
  }, userType);
}

/**
 * Take a full page screenshot with consistent naming
 */
export async function takeResponsiveScreenshot(
  page: Page,
  testName: string,
  viewport: ViewportConfig,
  options?: {
    fullPage?: boolean;
    clip?: { x: number; y: number; width: number; height: number };
  },
) {
  const screenshotName = `${testName}-${viewport.name}.png`;

  await expect(page).toHaveScreenshot(screenshotName, {
    fullPage: options?.fullPage ?? true,
    clip: options?.clip,
    // Ensure consistent screenshot comparison
    threshold: 0.2,
    maxDiffPixels: 100,
  });
}

/**
 * Navigate to a page and prepare it for screenshot
 */
export async function navigateAndPrepare(
  page: Page,
  url: string,
  options?: {
    waitForSelector?: string;
    mockAuth?: boolean;
    userType?: "employer" | "talent" | "mentor";
  },
) {
  if (options?.mockAuth) {
    await mockAuthentication(page, options.userType);
  }

  await page.goto(url);

  if (options?.waitForSelector) {
    await page.waitForSelector(options.waitForSelector);
  }

  await waitForPageStable(page);
  await hideDynamicContent(page);
}

/**
 * Test a page across all responsive breakpoints
 */
export async function testPageResponsive(
  page: Page,
  testName: string,
  url: string,
  viewport: ViewportConfig,
  options?: {
    waitForSelector?: string;
    mockAuth?: boolean;
    userType?: "employer" | "talent" | "mentor";
    fullPage?: boolean;
    interactions?: (page: Page) => Promise<void>;
  },
) {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });

  await navigateAndPrepare(page, url, {
    waitForSelector: options?.waitForSelector,
    mockAuth: options?.mockAuth,
    userType: options?.userType,
  });

  // Perform any custom interactions
  if (options?.interactions) {
    await options.interactions(page);
    await waitForPageStable(page);
  }

  await takeResponsiveScreenshot(page, testName, viewport, {
    fullPage: options?.fullPage,
  });
}
