import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cookie utilities — re-exported from lib/auth/cookies.ts for backwards compatibility
export { getCookie, deleteCookie, setCookie } from "./auth/cookies";
