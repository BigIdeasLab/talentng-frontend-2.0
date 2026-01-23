/**
 * Centralized color constants
 * Single source of truth for all brand colors
 */

export const COLORS = {
  // Primary brand
  primary: "#5C30FF",
  primaryHover: "#4a1fe5",
  primaryLight: "rgba(92, 48, 255, 0.10)",

  // Secondary colors
  success: "#008B47",
  successLight: "rgba(0, 139, 71, 0.09)",

  warning: "#D99400",
  warningLight: "rgba(246, 188, 63, 0.10)",

  // Neutral
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F5F5F5",
    100: "#F5F5F5",
    200: "#E8E8E8",
    300: "#E1E4EA",
    400: "#B2B2B2",
    500: "#92B2B2",
    600: "#606060",
    700: "#525866",
    800: "#181B25",
    900: "#000000",
  },

  // Background
  bgLight: "#FFFFFF",
  bgGray: "#F5F5F5",

  // Text
  textPrimary: "#000000",
  textSecondary: "#525866",
  textTertiary: "#B2B2B2",
  textDisabled: "rgba(0, 0, 0, 0.3)",

  // Borders
  borderLight: "#E1E4EA",
  borderDefault: "#E1E4EA",
} as const;

export type Color = (typeof COLORS)[keyof typeof COLORS];
