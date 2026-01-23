import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    const decoded = JSON.parse(jsonPayload);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.error("Token expired.");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") {
    return;
  }
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // Make cookie accessible to server-side code by not setting HttpOnly
  // SameSite=Lax allows the cookie to be sent with same-site requests
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  console.log("[setCookie] Set", name, "cookie");
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return `Posted ${formattedDate}`;
}

export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    return "N/A";
  }

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
