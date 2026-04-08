"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { setCookie } from "@/lib/utils";
import { isRoleMismatchError } from "@/lib/api/errors";

export function GlobalErrorHandler() {
  const queryClient = useQueryClient();
  const { triggerRoleSwitch, setActiveRole } = useProfile();

  useEffect(() => {
    // Intercept query errors
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error;
        if (isRoleMismatchError(error)) {
          if (error.actualRole) {
            // Auto-sync frontend role with backend role if they mismatched
            setActiveRole(error.actualRole);
            localStorage.setItem("activeRole", error.actualRole);
            setCookie("activeRole", error.actualRole, 365);
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
          const error = event.action.error;
          if (isRoleMismatchError(error)) {
            if (error.actualRole) {
              setActiveRole(error.actualRole);
              localStorage.setItem("activeRole", error.actualRole);
              setCookie("activeRole", error.actualRole, 365);
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
  }, [queryClient, triggerRoleSwitch, setActiveRole]);

  return null;
}
