import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        geist: ["Geist", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
        sans: ["Geist", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
        "inter-tight": [
          "Inter Tight",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
      },
      fontSize: {
        // Responsive typography scale
        // Mobile-first approach with responsive scaling
        "heading-1": ["2rem", { lineHeight: "2.25rem" }], // 32px mobile -> 3.5rem (56px) desktop
        "heading-2": ["1.75rem", { lineHeight: "2rem" }], // 28px mobile -> 2.75rem (44px) desktop
        "heading-3": ["1.5rem", { lineHeight: "1.75rem" }], // 24px mobile -> 2.5rem (40px) desktop
        "heading-4": ["1.25rem", { lineHeight: "1.5rem" }], // 20px mobile -> 1.875rem (30px) desktop
        "heading-5": ["1.125rem", { lineHeight: "1.375rem" }], // 18px mobile -> 1.5rem (24px) desktop
        "heading-6": ["1rem", { lineHeight: "1.25rem" }], // 16px mobile -> 1.25rem (20px) desktop
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        "body-base": ["1rem", { lineHeight: "1.5rem" }], // 16px - minimum for mobile readability
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        caption: ["0.75rem", { lineHeight: "1rem" }], // 12px
      },
      spacing: {
        // Responsive spacing scale
        // Mobile-optimized spacing that scales up on larger screens
        "mobile-xs": "0.5rem", // 8px
        "mobile-sm": "0.75rem", // 12px
        "mobile-base": "1rem", // 16px
        "mobile-lg": "1.5rem", // 24px
        "mobile-xl": "2rem", // 32px
        "tablet-xs": "0.75rem", // 12px
        "tablet-sm": "1rem", // 16px
        "tablet-base": "1.5rem", // 24px
        "tablet-lg": "2rem", // 32px
        "tablet-xl": "3rem", // 48px
        "desktop-xs": "1rem", // 16px
        "desktop-sm": "1.5rem", // 24px
        "desktop-base": "2rem", // 32px
        "desktop-lg": "3rem", // 48px
        "desktop-xl": "4rem", // 64px
      },
      colors: {
        // Talent.ng brand colors
        brand: {
          primary: "#FF563D",
          "primary-light": "#FF9586",
        },
        gray: {
          50: "#FBFBFB",
          100: "#F2F4F7",
          200: "#F7F7F7",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#373F51",
          700: "#344054",
          800: "#222834",
          900: "#14171F",
        },
        // Keep existing shadcn color system
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-in-right": {
          from: {
            transform: "translateX(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-hidden": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-styled": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#D0D5DD #FBFBFB",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#FBFBFB",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#D0D5DD",
            borderRadius: "4px",
            "&:hover": {
              background: "#98A2B3",
            },
          },
        },
        // Responsive typography utilities
        ".text-responsive-h1": {
          fontSize: "2rem",
          lineHeight: "2.25rem",
          "@media (min-width: 768px)": {
            fontSize: "2.5rem",
            lineHeight: "2.75rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "3.5rem",
            lineHeight: "3.75rem",
          },
        },
        ".text-responsive-h2": {
          fontSize: "1.75rem",
          lineHeight: "2rem",
          "@media (min-width: 768px)": {
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "2.75rem",
            lineHeight: "3rem",
          },
        },
        ".text-responsive-h3": {
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
          "@media (min-width: 768px)": {
            fontSize: "2rem",
            lineHeight: "2.25rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "2.5rem",
            lineHeight: "2.75rem",
          },
        },
        ".text-responsive-h4": {
          fontSize: "1.25rem",
          lineHeight: "1.5rem",
          "@media (min-width: 768px)": {
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
          },
        },
        ".text-responsive-h5": {
          fontSize: "1.125rem",
          lineHeight: "1.375rem",
          "@media (min-width: 768px)": {
            fontSize: "1.25rem",
            lineHeight: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
          },
        },
        ".text-responsive-h6": {
          fontSize: "1rem",
          lineHeight: "1.25rem",
          "@media (min-width: 768px)": {
            fontSize: "1.125rem",
            lineHeight: "1.375rem",
          },
          "@media (min-width: 1024px)": {
            fontSize: "1.25rem",
            lineHeight: "1.5rem",
          },
        },
        // Responsive spacing utilities
        ".p-responsive": {
          padding: "1rem",
          "@media (min-width: 768px)": {
            padding: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            padding: "2rem",
          },
        },
        ".px-responsive": {
          paddingLeft: "1rem",
          paddingRight: "1rem",
          "@media (min-width: 768px)": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
        },
        ".py-responsive": {
          paddingTop: "1rem",
          paddingBottom: "1rem",
          "@media (min-width: 768px)": {
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            paddingTop: "2rem",
            paddingBottom: "2rem",
          },
        },
        ".m-responsive": {
          margin: "1rem",
          "@media (min-width: 768px)": {
            margin: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            margin: "2rem",
          },
        },
        ".gap-responsive": {
          gap: "1rem",
          "@media (min-width: 768px)": {
            gap: "1.5rem",
          },
          "@media (min-width: 1024px)": {
            gap: "2rem",
          },
        },
      });
    },
  ],
} satisfies Config;
