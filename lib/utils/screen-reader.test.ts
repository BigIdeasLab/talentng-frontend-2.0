import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ScreenReaderManager, screenReaderText, mobileScreenReaderOptimizations } from "./screen-reader";

describe("ScreenReaderManager", () => {
  let manager: ScreenReaderManager;

  beforeEach(() => {
    // Reset the singleton instance
    (ScreenReaderManager as any).instance = undefined;
    
    // Mock document.body
    document.body.innerHTML = '';
    
    manager = ScreenReaderManager.getInstance();
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  it("should be a singleton", () => {
    const manager1 = ScreenReaderManager.getInstance();
    const manager2 = ScreenReaderManager.getInstance();
    expect(manager1).toBe(manager2);
  });

  it("should create live regions on initialization", () => {
    const liveRegions = document.querySelectorAll('[aria-live]');
    expect(liveRegions).toHaveLength(2);
    
    const assertiveRegion = document.querySelector('[aria-live="assertive"]');
    const politeRegion = document.querySelector('[aria-live="polite"]');
    
    expect(assertiveRegion).toBeTruthy();
    expect(politeRegion).toBeTruthy();
    expect(assertiveRegion?.getAttribute('aria-atomic')).toBe('true');
    expect(politeRegion?.getAttribute('aria-atomic')).toBe('true');
  });

  it("should announce messages", async () => {
    vi.useFakeTimers();
    
    manager.announce("Test message", false);
    
    // Fast-forward past the initial delay
    vi.advanceTimersByTime(150);
    
    const politeRegion = document.querySelector('[aria-live="polite"]');
    expect(politeRegion?.textContent).toBe("Test message");
    
    // Fast-forward past the clear delay
    vi.advanceTimersByTime(1000);
    expect(politeRegion?.textContent).toBe("");
    
    vi.useRealTimers();
  });

  it("should announce urgent messages", async () => {
    vi.useFakeTimers();
    
    manager.announce("Urgent message", true);
    
    // Fast-forward past the initial delay
    vi.advanceTimersByTime(150);
    
    const assertiveRegion = document.querySelector('[aria-live="assertive"]');
    expect(assertiveRegion?.textContent).toBe("Urgent message");
    
    vi.useRealTimers();
  });

  it("should announce navigation changes", async () => {
    vi.useFakeTimers();
    
    manager.announceNavigation("Dashboard");
    
    vi.advanceTimersByTime(150);
    
    const politeRegion = document.querySelector('[aria-live="polite"]');
    expect(politeRegion?.textContent).toBe("Navigating to Dashboard");
    
    vi.useRealTimers();
  });

  it("should announce modal state changes", async () => {
    vi.useFakeTimers();
    
    manager.announceModalState(true, "Settings modal");
    
    vi.advanceTimersByTime(150);
    
    const assertiveRegion = document.querySelector('[aria-live="assertive"]');
    expect(assertiveRegion?.textContent).toBe("Settings modal opened");
    
    vi.useRealTimers();
  });

  it("should announce form errors", async () => {
    vi.useFakeTimers();
    
    manager.announceFormError("Email", "This field is required");
    
    vi.advanceTimersByTime(150);
    
    const assertiveRegion = document.querySelector('[aria-live="assertive"]');
    expect(assertiveRegion?.textContent).toBe("Email: This field is required");
    
    vi.useRealTimers();
  });

  it("should announce loading states", async () => {
    vi.useFakeTimers();
    
    manager.announceLoading(true, "user data");
    
    vi.advanceTimersByTime(150);
    
    const politeRegion = document.querySelector('[aria-live="polite"]');
    expect(politeRegion?.textContent).toBe("Loading user data...");
    
    manager.announceLoading(false, "user data");
    
    vi.advanceTimersByTime(150);
    expect(politeRegion?.textContent).toBe("Loading complete for user data");
    
    vi.useRealTimers();
  });

  it("should announce search results", async () => {
    vi.useFakeTimers();
    
    manager.announceSearchResults(5, "developers");
    
    vi.advanceTimersByTime(150);
    
    const politeRegion = document.querySelector('[aria-live="polite"]');
    expect(politeRegion?.textContent).toBe('Found 5 results for "developers"');
    
    vi.useRealTimers();
  });

  it("should announce filter changes", async () => {
    vi.useFakeTimers();
    
    manager.announceFilterChange("Location", "Remote", 10);
    
    vi.advanceTimersByTime(150);
    
    const politeRegion = document.querySelector('[aria-live="polite"]');
    expect(politeRegion?.textContent).toBe("Filter Location set to Remote. 10 results found");
    
    vi.useRealTimers();
  });
});

describe("screenReaderText", () => {
  it("should create screen reader only text", () => {
    const result = screenReaderText.srOnly("Hidden text");
    expect(result).toEqual({
      className: 'sr-only',
      children: 'Hidden text',
    });
  });

  it("should create expanded state text", () => {
    expect(screenReaderText.expandedState(true, "Menu")).toBe("Menu expanded");
    expect(screenReaderText.expandedState(false, "Menu")).toBe("Menu collapsed");
  });

  it("should create loading state text", () => {
    expect(screenReaderText.loadingState(true, "data")).toBe("Loading data...");
    expect(screenReaderText.loadingState(false, "data")).toBe("Loading complete for data");
    expect(screenReaderText.loadingState(true)).toBe("Loading...");
  });

  it("should create count text", () => {
    expect(screenReaderText.countText(0, "item")).toBe("No items");
    expect(screenReaderText.countText(1, "item")).toBe("1 item");
    expect(screenReaderText.countText(5, "item")).toBe("5 items");
  });

  it("should create status text", () => {
    expect(screenReaderText.statusText("active", "User")).toBe("User status: active");
    expect(screenReaderText.statusText("active")).toBe("Status: active");
  });
});

describe("mobileScreenReaderOptimizations", () => {
  it("should optimize button labels", () => {
    expect(mobileScreenReaderOptimizations.optimizeButtonLabel("Save", "form")).toBe("Save, form");
    expect(mobileScreenReaderOptimizations.optimizeButtonLabel("Save")).toBe("Save");
  });

  it("should create touch target labels", () => {
    expect(mobileScreenReaderOptimizations.touchTargetLabel("Tap", "button", "top right"))
      .toBe("Tap button, top right");
    expect(mobileScreenReaderOptimizations.touchTargetLabel("Tap", "button"))
      .toBe("Tap button");
  });

  it("should create navigation announcements", () => {
    expect(mobileScreenReaderOptimizations.navigationAnnouncement("Home", "Profile"))
      .toBe("Navigated from Home to Profile");
  });

  it("should create gesture hints", () => {
    expect(mobileScreenReaderOptimizations.gestureHint("Swipe left", "dismiss"))
      .toBe("Swipe left to dismiss");
  });
});