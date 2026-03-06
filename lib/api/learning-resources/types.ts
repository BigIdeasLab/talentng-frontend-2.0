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
  q?: string;
  title?: string;
  category?: string;
  provider?: string;
  tags?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedLearningResourcesResponse {
  data: LearningResource[];
  pagination: PaginationInfo;
}
