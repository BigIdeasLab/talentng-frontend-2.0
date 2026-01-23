/**
 * Server-side Notifications API Client
 * Used only in Next.js Server Components and Server Actions
 */

import serverApiClient from "@/lib/api/server-client";
import type { Notification } from "./types";

/**
 * Get notifications (Server-side)
 * GET /notifications
 */
export async function getServerNotifications(
  userId: string,
  read?: boolean,
  type?: string,
): Promise<Notification[]> {
  const query = new URLSearchParams({ userId });
  if (read !== undefined) {
    query.append("read", String(read));
  }
  if (type) {
    query.append("type", type);
  }
  const endpoint = `/notifications?${query.toString()}`;
  return serverApiClient<Notification[]>(endpoint);
}
