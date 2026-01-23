export interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  logo: string;
  keyResponsibilities: string[];
  employmentType: string | null;
  location: string;
  compensation: string;
  tags: string[];
  status: string;
  postedById: string;
  orgId: string;
  isFeatured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  talent: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

export interface JobCardProps {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  type?: string;
  employmentType: string | null;
  talent: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  onShare?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  hasApplied?: boolean;
  basePath?: string;
}
