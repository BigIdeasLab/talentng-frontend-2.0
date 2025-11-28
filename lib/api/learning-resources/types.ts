export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  provider?: string;
  tags?: string[];
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetLearningResourcesParams {
  title?: string;
  category?: string;
  provider?: string;
  tags?: string;
}
