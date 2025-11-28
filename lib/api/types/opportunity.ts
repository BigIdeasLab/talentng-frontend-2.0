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
}
