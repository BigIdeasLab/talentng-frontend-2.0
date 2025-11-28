export interface Opportunity {
  id?: string;
  title: string;
  description: string;
  type?: string;
  location?: string;
  tags?: string[];
  status?: string;
  orgId?: string;
  postedById?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetOpportunitiesParams {
  q?: string;
  type?: string;
  title?: string;
  location?: string;
  tags?: string;
  status?: string;
  orgId?: string;
  postedById?: string;
  isFeatured?: boolean;
}
