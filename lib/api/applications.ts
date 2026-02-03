import apiClient from "./index";

export interface ApplicationInterview {
  id: string;
  applicationId: string;
  scheduledDate: string;
  message?: string;
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  profileType: "talent" | "mentor";
  profileId: string;
  status: "applied" | "shortlisted" | "rejected" | "hired";
  note?: string;
  galleryIds?: string[];
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
      gallery?: Array<{ url: string; title: string }>;
      hiredCount: number;
      earnings: string;
    };
  };
  opportunity: {
    id: string;
    title: string;
    company: string;
    type: string;
    description?: string;
    location: string;
  };
  interviews?: ApplicationInterview[];
}

export async function getApplications(params?: {
  opportunityId?: string;
}): Promise<Application[]> {
  try {
    let endpoint = "/applications";
    if (params?.opportunityId) {
      endpoint += `?opportunityId=${params.opportunityId}`;
    }
    const response = await apiClient<Application[]>(endpoint);
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
  profileType: "talent" | "mentor";
  note?: string;
  galleryIds?: string[];
  files?: File[];
}): Promise<Application> {
  try {
    // If there are files, use FormData; otherwise use JSON
    if (data.files && data.files.length > 0) {
      const formData = new FormData();
      formData.append("opportunityId", data.opportunityId);
      formData.append("profileType", data.profileType);
      if (data.note) {
        formData.append("note", data.note);
      }
      if (data.galleryIds && data.galleryIds.length > 0) {
        data.galleryIds.forEach((galleryId) => {
          formData.append("galleryIds", galleryId);
        });
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
          profileType: data.profileType,
          note: data.note,
          galleryIds: data.galleryIds,
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

export async function rescheduleInterview(
  applicationId: string,
  interviewId: string,
  scheduledDate: string,
  message: string,
  meetingLink?: string,
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}/interviews/${interviewId}/reschedule`,
      {
        method: "POST",
        body: { scheduledDate, message, meetingLink },
      },
    );
    return response;
  } catch (error) {
    console.error("Error rescheduling interview:", error);
    throw error;
  }
}

export async function cancelInterview(
  applicationId: string,
  interviewId: string,
  reason: string,
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}/interviews/${interviewId}/cancel`,
      {
        method: "POST",
        body: { reason },
      },
    );
    return response;
  } catch (error) {
    console.error("Error cancelling interview:", error);
    throw error;
  }
}

export async function completeInterview(
  applicationId: string,
  interviewId: string,
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}/interviews/${interviewId}/complete`,
      {
        method: "POST",
        body: {},
      },
    );
    return response;
  } catch (error) {
    console.error("Error completing interview:", error);
    throw error;
  }
}

export async function addRecommendation(
  applicationId: string,
  data: {
    title: string;
    comment: string;
    rating: number;
  },
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}/recommendation`,
      {
        method: "POST",
        body: data,
      },
    );
    return response;
  } catch (error) {
    console.error("Error adding recommendation:", error);
    throw error;
  }
}

export async function sendInvitations(input: {
  opportunityId: string;
  talentIds: string[];
}): Promise<any[]> {
  try {
    const response = await apiClient<any[]>("/applications/invitations/send", {
      method: "POST",
      body: input,
    });
    return response;
  } catch (error) {
    console.error("Error sending invitations:", error);
    throw error;
  }
}

export async function scheduleInterview(
  applicationId: string,
  input: {
    scheduledDate: string;
    message?: string;
    meetingLink?: string;
  },
): Promise<Application> {
  try {
    const response = await apiClient<Application>(
      `/applications/${applicationId}/schedule-interview`,
      {
        method: "POST",
        body: input,
      },
    );
    return response;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
}
