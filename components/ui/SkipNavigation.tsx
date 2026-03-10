"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkipNavigationProps {
  /**
   * Array of skip navigation links
   */
  links?: Array<{
    href: string;
    label: string;
  }>;
  /**
   * Custom CSS classes
   */
  className?: string;
}

/**
 * Default skip navigation links
 */
const DEFAULT_SKIP_LINKS = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
];

/**
 * Skip Navigation component for accessibility
 * Provides keyboard users with quick navigation options
 */
export const SkipNavigation: React.FC<SkipNavigationProps> = ({
  links = DEFAULT_SKIP_LINKS,
  className,
}) => {
  return (
    <nav
      className={cn("skip-navigation", className)}
      aria-label="Skip navigation"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-nav"
          onClick={(e) => {
            // Ensure the target element receives focus
            const target = document.querySelector(link.href);
            if (target) {
              e.preventDefault();
              (target as HTMLElement).focus();
              (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

/**
 * Hook for managing skip navigation focus
 */
export function useSkipNavigation() {
  React.useEffect(() => {
    // Ensure main content area is focusable
    const mainContent = document.getElementById("main-content");
    if (mainContent && !mainContent.hasAttribute("tabindex")) {
      mainContent.setAttribute("tabindex", "-1");
    }

    // Ensure navigation area is focusable
    const navigation = document.getElementById("navigation");
    if (navigation && !navigation.hasAttribute("tabindex")) {
      navigation.setAttribute("tabindex", "-1");
    }

    // Ensure footer is focusable
    const footer = document.getElementById("footer");
    if (footer && !footer.hasAttribute("tabindex")) {
      footer.setAttribute("tabindex", "-1");
    }
  }, []);
}

/**
 * Main content wrapper with skip navigation target
 */
interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({
  children,
  className,
}) => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn("focus:outline-none", className)}
      role="main"
      aria-label="Main content"
    >
      {children}
    </main>
  );
};

/**
 * Navigation wrapper with skip navigation target
 */
interface NavigationWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationWrapper: React.FC<NavigationWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <nav
      id="navigation"
      tabIndex={-1}
      className={cn("focus:outline-none", className)}
      role="navigation"
      aria-label="Main navigation"
    >
      {children}
    </nav>
  );
};

/**
 * Footer wrapper with skip navigation target
 */
interface FooterWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const FooterWrapper: React.FC<FooterWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <footer
      id="footer"
      tabIndex={-1}
      className={cn("focus:outline-none", className)}
      role="contentinfo"
      aria-label="Footer"
    >
      {children}
    </footer>
  );
};

export default SkipNavigation;
