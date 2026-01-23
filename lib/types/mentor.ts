export interface Mentor {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  bio: string;
  expertise: string[];
  experience: any[]; // Replace 'any' with a more specific type if you have one
  availability: "full_time" | "part_time" | "contract" | "unavailable";
  location: string;
  links: any; // Replace 'any' with a more specific type if you have one
  visibility: "public" | "private";
  isFeatured: boolean;
  featuredUntil: string | null;
  views: number;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  company: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    username: string;
    isVerified: boolean;
  };
}
