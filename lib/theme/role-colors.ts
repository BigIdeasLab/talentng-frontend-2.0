/**
 * Centralized role-based color theme.
 *
 * Each role has a palette with semantic shades:
 *  - primary:    main brand color (buttons, accents, active states)
 *  - primaryHover: hover state for primary buttons
 *  - dark:       darker variant (welcome cards, gradients)
 *  - light:      light background (skeletons, profile switcher, notification bg)
 *  - accent:     decorative / SVG fills
 */

export interface RoleColorPalette {
  primary: string;
  primaryHover: string;
  dark: string;
  light: string;
  accent: string;
}

export const ROLE_COLORS = {
  talent: {
    primary: "#5C30FF",
    primaryHover: "#4A26CC",
    dark: "#5c30ff",
    light: "#DBEAFE",
    accent: "#60A5FA",
  },
  recruiter: {
    primary: "#047857",
    primaryHover: "#059669",
    dark: "#047857",
    light: "#ECFDF5",
    accent: "#34D399",
  },
  mentor: {
    primary: "#e63c23",
    primaryHover: "#059669",
    dark: "#e63c23",
    light: "#FEF2F0",
    accent: "#A890FF",
  },
} as const satisfies Record<string, RoleColorPalette>;

export type RoleKey = keyof typeof ROLE_COLORS;

export function getRoleColors(role?: string | null): RoleColorPalette {
  if (role && role in ROLE_COLORS) {
    return ROLE_COLORS[role as RoleKey];
  }
  return ROLE_COLORS.talent;
}
