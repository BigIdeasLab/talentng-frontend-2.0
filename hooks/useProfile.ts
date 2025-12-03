"use client";

import { useContext } from "react";
import { ProfileContext } from "@/app/(app)/profile-provider";

/**
 * Hook to access profile data from ProfileProvider context
 * Must be used within ProfileProvider wrapper
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  
  return context;
}
