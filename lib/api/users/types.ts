export interface UsernameAvailability {
  available: boolean;
  taken: boolean;
}

export interface CheckUsernameParams {
  username: string;
}

export interface DeleteAccountResponse {
  accountDeleted: boolean;
  message?: string;
  deletedAt?: string;
}
