export type User = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role?: string;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailVerifiedAt: string | null;
  isVerified: boolean;
  lastLoginAt: string | null;
  oneSignalPlayerId: string | null;
  status: string;
  verificationLevel: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};
