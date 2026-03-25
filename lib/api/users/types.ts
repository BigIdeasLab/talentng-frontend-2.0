export interface UsernameAvailability {
  available: boolean;
  taken: boolean;
}

export interface CheckUsernameParams {
  username: string;
}

export interface DeleteAccountResponse {
  message: string;
  deletedAt: string;
}
