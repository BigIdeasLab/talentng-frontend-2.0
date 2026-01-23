export interface AccountSettings {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ProfileSettings {
  visibility: "public" | "private";
  location: string;
  category: string;
  availability: "full-time" | "part-time" | "contract";
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  push: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface UserSettings {
  account: AccountSettings;
  profile: ProfileSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}
