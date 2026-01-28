export type NotificationType =
  | "admin_notice"
  | "job_alert"
  | "message"
  | "profile_update"
  | "application_update"
  | "system_alert";

export type NotificationChannel = "email" | "push" | "in_app" | "sms";

export type DeliveryStatus = "queued" | "sent" | "failed";

export type InAppPayloadType = "info" | "success" | "warning" | "error";

export type RelatedType =
  | "application"
  | "opportunity"
  | "interview"
  | "mentorship"
  | "account"
  | "payment"
  | "message"
  | "profile"
  | "system";

export interface NotificationAction {
  label: string;
  route: string;
  id: string;
}

export interface NotificationMetadata {
  relatedId: string;
  relatedType: RelatedType;
}

export interface InAppNotificationPayload {
  title: string;
  message: string;
  type: InAppPayloadType;
  icon?: string;
  image?: string;
  action?: NotificationAction;
  metadata?: NotificationMetadata;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, any> | InAppNotificationPayload;
  channels: NotificationChannel[];
  deliveryStatus: DeliveryStatus;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  payload: string; // JSON-stringified
  channels: NotificationChannel[];
  deliveryStatus?: DeliveryStatus;
  readAt?: string;
}

export interface UpdateNotificationPayload {
  readAt?: string;
  deliveryStatus?: DeliveryStatus;
  isRead?: boolean;
}

export interface GetNotificationsFilters {
  userId?: string;
  type?: NotificationType;
  deliveryStatus?: DeliveryStatus;
  read?: boolean;
}
