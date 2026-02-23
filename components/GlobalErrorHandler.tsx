"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";

export function GlobalErrorHandler() {
  const queryClient = useQueryClient();
  const { triggerRoleSwitch, setActiveRole } = useProfile();

  useEffect(() => {
    // Intercept query errors
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error as any;
        if (error?.isRoleMismatch) {
          if (error.actualRole) {
            // Auto-sync frontend role with backend role if they mismatched
            console.log(
              `Auto-syncing role to ${error.actualRole} from backend error`,
            );
            setActiveRole(error.actualRole);
            localStorage.setItem("activeRole", error.actualRole);
            document.cookie = `activeRole=${error.actualRole}; path=/; max-age=31536000; SameSite=Lax`;
          } else if (error.requiredRole) {
            triggerRoleSwitch(error.requiredRole);
          }
        }
      }
    });

    // Intercept mutation errors
    const unsubscribeMutation = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type === "updated" && event.action.type === "error") {
          const error = event.action.error as any;
          if (error?.isRoleMismatch) {
            if (error.actualRole) {
              setActiveRole(error.actualRole);
              localStorage.setItem("activeRole", error.actualRole);
              document.cookie = `activeRole=${error.actualRole}; path=/; max-age=31536000; SameSite=Lax`;
            } else if (error.requiredRole) {
              triggerRoleSwitch(error.requiredRole);
            }
          }
        }
      });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient, triggerRoleSwitch]);

  return null;
}
