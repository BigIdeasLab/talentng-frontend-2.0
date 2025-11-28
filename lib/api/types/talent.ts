export interface Talent {
  id: string;
  userId: string;
  fullName?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  profileImageUrl?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
