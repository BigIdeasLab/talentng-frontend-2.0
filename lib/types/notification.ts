export interface Notification {
  id: string;
  userId: string;
  type: string;
  payload: {
    title: string;
    message: string;
    action_url: string;
  };
  readAt: string | null;
  createdAt: string;
}
