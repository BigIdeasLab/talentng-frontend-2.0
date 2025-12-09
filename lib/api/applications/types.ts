export interface Application {
  id?: string;
  opportunityId: string;
  talentId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationSubmission {
  opportunityId: string;
  note?: string;
  attachments?: File[];
}

export interface ApplicationResponse {
  id: string;
  opportunityId: string;
  applicantId: string;
  status: "applied" | "shortlisted" | "hired" | "rejected";
  note?: string;
  createdAt: string;
}
