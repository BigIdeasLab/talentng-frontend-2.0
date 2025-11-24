export interface LearningResource {
  id: string;
  title: string;
  category: string;
  provider: string;
  url: string;
  tags: string[];
  featured: boolean;
  status: string;
  createdById: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  duration: string;
  backgroundImage: string;
}
