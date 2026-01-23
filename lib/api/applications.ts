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

export async function getApplications(params: {
  opportunityId: string;
}): Promise<Application[]> {
  try {
    const response = await apiClient<Application[]>(
      `/applications?opportunityId=${params.opportunityId}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}

export async function getApplicationById(
  applicationId: string,
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
}

export async function submitApplication(data: {
  opportunityId: string;
  note?: string;
  files?: File[];
}): Promise<Application> {
  try {
    // If there are files, use FormData; otherwise use JSON
    if (data.files && data.files.length > 0) {
      const formData = new FormData();
      formData.append("opportunityId", data.opportunityId);
      if (data.note) {
        formData.append("note", data.note);
      }
      data.files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await apiClient<Application>(`/applications`, {
        method: "POST",
        body: formData,
      });
      return response;
    } else {
      // No files - send as JSON
      const response = await apiClient<Application>(`/applications`, {
        method: "POST",
        body: {
          opportunityId: data.opportunityId,
          note: data.note,
        },
      });
      return response;
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}`,
      {
        method: "PATCH",
        body: { status },
      },
    );
    return response;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
}
