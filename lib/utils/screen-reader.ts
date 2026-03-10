/**
 * Screen reader utilities for enhanced accessibility on mobile devices
 */

/**
 * Screen reader announcement utilities
 */
export class ScreenReaderManager {
  private static instance: ScreenReaderManager;
  private liveRegion: HTMLElement | null = null;
  private politeRegion: HTMLElement | null = null;

  private constructor() {
    this.setupLiveRegions();
  }

  static getInstance(): ScreenReaderManager {
    if (!ScreenReaderManager.instance) {
      ScreenReaderManager.instance = new ScreenReaderManager();
    }
    return ScreenReaderManager.instance;
  }

  /**
   * Setup ARIA live regions for announcements
   */
  private setupLiveRegions() {
    if (typeof window === "undefined") return;

    // Create assertive live region for urgent announcements
    this.liveRegion = document.createElement("div");
    this.liveRegion.setAttribute("aria-live", "assertive");
    this.liveRegion.setAttribute("aria-atomic", "true");
    this.liveRegion.setAttribute("class", "sr-only");
    this.liveRegion.style.position = "absolute";
    this.liveRegion.style.left = "-10000px";
    this.liveRegion.style.width = "1px";
    this.liveRegion.style.height = "1px";
    this.liveRegion.style.overflow = "hidden";
    document.body.appendChild(this.liveRegion);

    // Create polite live region for non-urgent announcements
    this.politeRegion = document.createElement("div");
    this.politeRegion.setAttribute("aria-live", "polite");
    this.politeRegion.setAttribute("aria-atomic", "true");
    this.politeRegion.setAttribute("class", "sr-only");
    this.politeRegion.style.position = "absolute";
    this.politeRegion.style.left = "-10000px";
    this.politeRegion.style.width = "1px";
    this.politeRegion.style.height = "1px";
    this.politeRegion.style.overflow = "hidden";
    document.body.appendChild(this.politeRegion);
  }

  /**
   * Announce message to screen readers (assertive - interrupts current reading)
   */
  announce(message: string, urgent = false) {
    const region = urgent ? this.liveRegion : this.politeRegion;
    if (!region) return;

    // Clear previous message
    region.textContent = "";

    // Add new message after a brief delay to ensure it's announced
    setTimeout(() => {
      region.textContent = message;
    }, 100);

    // Clear message after announcement to avoid repetition
    setTimeout(() => {
      region.textContent = "";
    }, 1000);
  }

  /**
   * Announce navigation changes
   */
  announceNavigation(destination: string) {
    this.announce(`Navigating to ${destination}`, false);
  }

  /**
   * Announce modal/drawer state changes
   */
  announceModalState(isOpen: boolean, modalName: string) {
    const state = isOpen ? "opened" : "closed";
    this.announce(`${modalName} ${state}`, true);
  }

  /**
   * Announce form validation errors
   */
  announceFormError(fieldName: string, error: string) {
    this.announce(`${fieldName}: ${error}`, true);
  }

  /**
   * Announce loading states
   */
  announceLoading(isLoading: boolean, context?: string) {
    const message = isLoading
      ? `Loading${context ? ` ${context}` : ""}...`
      : `Loading complete${context ? ` for ${context}` : ""}`;
    this.announce(message, false);
  }

  /**
   * Announce search results
   */
  announceSearchResults(count: number, query?: string) {
    const message = query
      ? `Found ${count} results for "${query}"`
      : `Found ${count} results`;
    this.announce(message, false);
  }

  /**
   * Announce filter changes
   */
  announceFilterChange(
    filterName: string,
    value: string,
    resultCount?: number,
  ) {
    let message = `Filter ${filterName} set to ${value}`;
    if (resultCount !== undefined) {
      message += `. ${resultCount} results found`;
    }
    this.announce(message, false);
  }
}

/**
 * Enhanced ARIA attributes for mobile screen readers
 */
export const MOBILE_ARIA_ATTRIBUTES = {
  // Navigation elements
  navigation: {
    role: "navigation",
    "aria-label": "Main navigation",
  },
  mobileMenu: {
    role: "navigation",
    "aria-label": "Mobile navigation menu",
  },
  breadcrumb: {
    role: "navigation",
    "aria-label": "Breadcrumb navigation",
  },

  // Interactive elements
  button: {
    role: "button",
    tabIndex: 0,
  },
  link: {
    role: "link",
  },
  menuItem: {
    role: "menuitem",
    tabIndex: -1,
  },

  // Form elements
  searchInput: {
    role: "searchbox",
    "aria-label": "Search",
  },
  combobox: {
    role: "combobox",
    "aria-expanded": "false",
    "aria-haspopup": "listbox",
  },

  // Content regions
  main: {
    role: "main",
    "aria-label": "Main content",
  },
  complementary: {
    role: "complementary",
  },
  banner: {
    role: "banner",
  },

  // Status and alerts
  status: {
    role: "status",
    "aria-live": "polite",
  },
  alert: {
    role: "alert",
    "aria-live": "assertive",
  },
} as const;

/**
 * Screen reader friendly text utilities
 */
export const screenReaderText = {
  /**
   * Create screen reader only text
   */
  srOnly: (text: string) => ({
    className: "sr-only",
    children: text,
  }),

  /**
   * Create expanded state text for screen readers
   */
  expandedState: (isExpanded: boolean, itemName: string) =>
    `${itemName} ${isExpanded ? "expanded" : "collapsed"}`,

  /**
   * Create loading state text for screen readers
   */
  loadingState: (isLoading: boolean, context?: string) =>
    isLoading
      ? `Loading${context ? ` ${context}` : ""}...`
      : `Loading complete${context ? ` for ${context}` : ""}`,

  /**
   * Create count text for screen readers
   */
  countText: (count: number, itemType: string) => {
    if (count === 0) return `No ${itemType}s`;
    if (count === 1) return `1 ${itemType}`;
    return `${count} ${itemType}s`;
  },

  /**
   * Create status text for screen readers
   */
  statusText: (status: string, context?: string) =>
    context ? `${context} status: ${status}` : `Status: ${status}`,
};

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const manager = ScreenReaderManager.getInstance();

  return {
    announce: (message: string, urgent = false) =>
      manager.announce(message, urgent),
    announceNavigation: (destination: string) =>
      manager.announceNavigation(destination),
    announceModalState: (isOpen: boolean, modalName: string) =>
      manager.announceModalState(isOpen, modalName),
    announceFormError: (fieldName: string, error: string) =>
      manager.announceFormError(fieldName, error),
    announceLoading: (isLoading: boolean, context?: string) =>
      manager.announceLoading(isLoading, context),
    announceSearchResults: (count: number, query?: string) =>
      manager.announceSearchResults(count, query),
    announceFilterChange: (
      filterName: string,
      value: string,
      resultCount?: number,
    ) => manager.announceFilterChange(filterName, value, resultCount),
  };
}

/**
 * Mobile-specific screen reader optimizations
 */
export const mobileScreenReaderOptimizations = {
  /**
   * Optimize button labels for mobile screen readers
   */
  optimizeButtonLabel: (baseLabel: string, context?: string) => {
    // Mobile screen readers benefit from more context
    return context ? `${baseLabel}, ${context}` : baseLabel;
  },

  /**
   * Create descriptive labels for touch targets
   */
  touchTargetLabel: (action: string, target: string, position?: string) => {
    let label = `${action} ${target}`;
    if (position) {
      label += `, ${position}`;
    }
    return label;
  },

  /**
   * Create navigation announcements for mobile
   */
  navigationAnnouncement: (from: string, to: string) =>
    `Navigated from ${from} to ${to}`,

  /**
   * Create gesture hints for mobile screen readers
   */
  gestureHint: (gesture: string, action: string) => `${gesture} to ${action}`,
};
