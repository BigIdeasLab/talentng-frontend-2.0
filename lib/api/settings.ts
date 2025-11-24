import apiClient from "../api";
import { AccountSettings, NotificationSettings, ProfileSettings, UserSettings } from "../types/settings";

export const getUserSettings = async (): Promise<UserSettings> => {
  return apiClient<UserSettings>("/settings");
};

export const updateAccountInfo = async (data: Partial<AccountSettings>) => {
  return apiClient<AccountSettings>("/settings/account", {
    method: "PATCH",
    body: data,
  });
};

export const changePassword = async (data: any) => {
  return apiClient("/auth/change-password", {
    method: "POST",
    body: data,
  });
};

export const deleteAccount = async () => {
  return apiClient("/users/me", {
    method: "DELETE",
  });
};

export const updateProfilePreferences = async (data: Partial<ProfileSettings>) => {
  return apiClient<ProfileSettings>("/settings/profile", {
    method: "PATCH",
    body: data,
  });
};

export const updateNotificationSettings = async (data: NotificationSettings) => {
  return apiClient<NotificationSettings>("/settings/notifications", {
    method: "PUT",
    body: data,
  });
};

export const setTwoFactor = async (enabled: boolean) => {
  return apiClient("/settings/security/2fa", {
    method: "PUT",
    body: { enabled },
  });
};
