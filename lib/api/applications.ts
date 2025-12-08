import apiClient from "./index";

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    talentProfile: {
      id: string;
      fullName: string;
      headline: string;
      bio?: string;
      skills: string[];
      location: string;
      profileImageUrl: string;
      category: string;
    };
  };
}

export async function getApplications(params: { opportunityId: string }): Promise<Application[]> {
  try {
    const response = await apiClient<Application[]>(
      `/applications?opportunityId=${params.opportunityId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}

export async function getApplicationById(applicationId: string) {
  try {
    const response = await apiClient(`/applications/${applicationId}`);
    return response;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  try {
    const response = await apiClient(`/applications/${applicationId}`, {
      method: "PATCH",
      body: { status },
    });
    return response;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
}
