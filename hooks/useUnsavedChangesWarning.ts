import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to warn users about unsaved changes when navigating away
 * Handles both browser navigation (refresh/close) and client-side routing
 */
export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  onNavigateAway?: () => void,
) {
  const router = useRouter();

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle client-side navigation (back button, link clicks)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Intercept browser back/forward buttons
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
        );
        if (!confirmLeave) {
          // Push current state back to prevent navigation
          window.history.pushState(null, "", window.location.href);
        } else {
          onNavigateAway?.();
        }
      }
    };

    // Push a dummy state to enable popstate detection
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, onNavigateAway]);

  // Provide a method to navigate with confirmation
  const navigateWithConfirmation = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
        );
        if (confirmLeave) {
          onNavigateAway?.();
          router.push(path);
        }
      } else {
        router.push(path);
      }
    },
    [hasUnsavedChanges, router, onNavigateAway],
  );

  return { navigateWithConfirmation };
}
