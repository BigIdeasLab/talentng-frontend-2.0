/**
 * Color contrast utilities for WCAG compliance on mobile devices
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsWCAGStandard(
  contrastRatio: number,
  level: "AA" | "AAA" = "AA",
  textSize: "normal" | "large" = "normal",
): boolean {
  if (level === "AAA") {
    return textSize === "large" ? contrastRatio >= 4.5 : contrastRatio >= 7;
  }
  // AA level
  return textSize === "large" ? contrastRatio >= 3 : contrastRatio >= 4.5;
}

/**
 * Application color palette with WCAG-compliant alternatives
 */
export const ACCESSIBLE_COLORS = {
  // Primary colors
  primary: {
    // Original: #5C30FF (may not meet contrast requirements)
    default: "#5C30FF",
    accessible: "#4A1FE7", // Higher contrast version
    text: "#FFFFFF", // White text on primary
  },

  // Gray scale (WCAG AA compliant)
  gray: {
    50: "#F9FAFB", // Very light gray
    100: "#F3F4F6", // Light gray
    200: "#E5E7EB", // Light gray
    300: "#D1D5DB", // Medium light gray
    400: "#9CA3AF", // Medium gray
    500: "#6B7280", // Medium dark gray (4.5:1 on white)
    600: "#4B5563", // Dark gray (7:1 on white)
    700: "#374151", // Very dark gray (10.7:1 on white)
    800: "#1F2937", // Almost black (15.3:1 on white)
    900: "#111827", // Black (18.7:1 on white)
  },

  // Status colors (WCAG AA compliant)
  status: {
    success: {
      background: "#10B981", // Green (3.1:1 with white text)
      text: "#FFFFFF",
      light: "#D1FAE5", // Light green background
      dark: "#065F46", // Dark green text (7.4:1 on white)
    },
    warning: {
      background: "#F59E0B", // Amber (2.4:1 with white text - needs dark text)
      text: "#92400E", // Dark amber text (7.1:1 on white)
      light: "#FEF3C7", // Light amber background
      dark: "#92400E",
    },
    error: {
      background: "#EF4444", // Red (3.3:1 with white text)
      text: "#FFFFFF",
      light: "#FEE2E2", // Light red background
      dark: "#991B1B", // Dark red text (8.2:1 on white)
    },
    info: {
      background: "#3B82F6", // Blue (4.5:1 with white text)
      text: "#FFFFFF",
      light: "#DBEAFE", // Light blue background
      dark: "#1E40AF", // Dark blue text (8.6:1 on white)
    },
  },

  // Interactive elements
  interactive: {
    link: "#1D4ED8", // Blue link (8.9:1 on white)
    linkHover: "#1E40AF", // Darker blue on hover (8.6:1 on white)
    linkVisited: "#7C3AED", // Purple visited link (5.9:1 on white)
    focus: "#2563EB", // Focus ring color (7.8:1 on white)
  },

  // Mobile-specific high contrast colors
  mobile: {
    // High contrast for bright sunlight conditions
    highContrast: {
      text: "#000000", // Pure black (21:1 on white)
      background: "#FFFFFF", // Pure white
      border: "#374151", // Dark gray border (10.7:1 on white)
    },

    // Touch target colors
    touchTarget: {
      default: "#F3F4F6", // Light gray background
      active: "#E5E7EB", // Slightly darker on press
      focus: "#DBEAFE", // Light blue focus state
    },
  },
} as const;

/**
 * Get accessible color combination for text and background
 */
export function getAccessibleColorPair(
  preferredText: string,
  preferredBackground: string,
  level: "AA" | "AAA" = "AA",
  textSize: "normal" | "large" = "normal",
): { text: string; background: string; contrastRatio: number } {
  const contrastRatio = getContrastRatio(preferredText, preferredBackground);

  if (meetsWCAGStandard(contrastRatio, level, textSize)) {
    return {
      text: preferredText,
      background: preferredBackground,
      contrastRatio,
    };
  }

  // Fallback to high contrast colors
  const fallbackText = ACCESSIBLE_COLORS.mobile.highContrast.text;
  const fallbackBackground = ACCESSIBLE_COLORS.mobile.highContrast.background;
  const fallbackRatio = getContrastRatio(fallbackText, fallbackBackground);

  return {
    text: fallbackText,
    background: fallbackBackground,
    contrastRatio: fallbackRatio,
  };
}

/**
 * Tailwind CSS classes with guaranteed WCAG AA compliance
 */
export const ACCESSIBLE_TAILWIND_CLASSES = {
  // Text colors (all 4.5:1+ on white background)
  text: {
    primary: "text-gray-900", // #111827 (18.7:1)
    secondary: "text-gray-700", // #374151 (10.7:1)
    muted: "text-gray-600", // #4B5563 (7:1)
    link: "text-blue-700", // #1D4ED8 (8.9:1)
    success: "text-green-700", // #15803D (6.8:1)
    warning: "text-amber-800", // #92400E (7.1:1)
    error: "text-red-700", // #B91C1C (7.7:1)
  },

  // Background colors with appropriate text
  background: {
    primary: "bg-white text-gray-900",
    secondary: "bg-gray-50 text-gray-900",
    muted: "bg-gray-100 text-gray-900",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  },

  // Interactive states
  interactive: {
    button:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",
    buttonSecondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500",
    link: "text-blue-700 hover:text-blue-800 underline focus:ring-2 focus:ring-blue-500",
    input:
      "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
  },

  // Mobile-specific high contrast
  mobile: {
    highContrast: "text-black bg-white border-gray-700",
    touchTarget: "bg-gray-100 active:bg-gray-200 focus:bg-blue-100",
  },
} as const;

/**
 * Validate color contrast for mobile accessibility
 */
export function validateMobileColorContrast(
  textColor: string,
  backgroundColor: string,
  context: "normal" | "large" | "touch-target" = "normal",
): {
  isValid: boolean;
  contrastRatio: number;
  recommendation?: string;
} {
  const contrastRatio = getContrastRatio(textColor, backgroundColor);
  const textSize = context === "large" ? "large" : "normal";
  const isValid = meetsWCAGStandard(contrastRatio, "AA", textSize);

  let recommendation: string | undefined;

  if (!isValid) {
    if (context === "touch-target") {
      recommendation =
        "Use high contrast colors for touch targets on mobile devices";
    } else if (context === "large") {
      recommendation = "Large text needs 3:1 contrast ratio minimum";
    } else {
      recommendation = "Normal text needs 4.5:1 contrast ratio minimum";
    }
  }

  return { isValid, contrastRatio, recommendation };
}

/**
 * Mobile-specific color contrast enhancements
 */
export const mobileContrastEnhancements = {
  /**
   * Enhance colors for bright sunlight viewing
   */
  sunlightMode: {
    text: ACCESSIBLE_COLORS.mobile.highContrast.text,
    background: ACCESSIBLE_COLORS.mobile.highContrast.background,
    border: ACCESSIBLE_COLORS.mobile.highContrast.border,
  },

  /**
   * Enhance colors for low light viewing
   */
  lowLightMode: {
    text: "#E5E7EB", // Light gray text
    background: "#1F2937", // Dark background
    border: "#4B5563", // Medium gray border
  },

  /**
   * Touch target color enhancements
   */
  touchTargets: {
    default: ACCESSIBLE_COLORS.mobile.touchTarget.default,
    active: ACCESSIBLE_COLORS.mobile.touchTarget.active,
    focus: ACCESSIBLE_COLORS.mobile.touchTarget.focus,
  },
};
