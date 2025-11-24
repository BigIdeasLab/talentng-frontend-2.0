import { getCookie, setCookie, deleteCookie } from "@/lib/utils";
import { Opportunity } from "./types/opportunity";
import { Application } from "./types/application";
import { Mentor } from "./types/mentor";
import { Notification } from "./types/notification";
import { LearningResource } from "./types/learning";
import { Talent } from "./types/talent";

const baseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_TALENTNG_API_URL 
  : '/api/v1';

type ApiOptions = {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
};

let isRefreshing = false;
const failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue.length = 0;
};

const apiClient = async <T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> => {
  let token = getCookie("accessToken");

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  if (options.body) {
    if (options.body instanceof FormData) {
      delete (config.headers as Record<string, string>)["Content-Type"];
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    let response = await fetch(`${baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(newToken => {
          (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
          return fetch(`${baseUrl}${endpoint}`, config);
        })
        .then(res => res.json());
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, { method: 'POST' });
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }
        const { accessToken: newAccessToken } = await refreshResponse.json();
        setCookie("accessToken", newAccessToken);
        processQueue(null, newAccessToken);
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
        response = await fetch(`${baseUrl}${endpoint}`, config);
      } catch (error) {
        processQueue(error as Error, null);
        deleteCookie("accessToken");
        deleteCookie("user");
        window.location.href = '/login';
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || response.statusText };
      }
      throw new Error(errorData.message || "An error occurred during the API request.");
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : ({} as T);

  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
};

export default apiClient;


interface GetOpportunitiesParams {
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

export const getOpportunities = async (
  params?: GetOpportunitiesParams,
): Promise<Opportunity[]> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetOpportunitiesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<Opportunity[]>(endpoint);
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const endpoint = `/opportunities/${id}`;
  return apiClient<Opportunity>(endpoint);
};

export const getDashboardStats = async () => {
  return apiClient<any>("/talent/dashboard");
};

export const applyToOpportunity = async (
  application: Application,
): Promise<any> => {
  return apiClient<any>("/applications", {
    method: "POST",
    body: application,
  });
};

export const getApplications = async (): Promise<Application[]> => {
  return apiClient<Application[]>("/applications");
};

export const getMentors = async (query?: string): Promise<Mentor[]> => {
  const endpoint = query ? `/mentor?q=${query}` : "/mentor";
  return apiClient<Mentor[]>(endpoint);
};

export const getMentorById = async (id: string): Promise<Mentor> => {
  return apiClient<Mentor>(`/mentor/${id}`);
};

export const getMentorAvailability = async (
  mentorId: string,
): Promise<{ startTime: string; endTime: string }[]> => {
  return apiClient<{ startTime: string; endTime: string }[]>(
    `/mentor/${mentorId}/availability`,
  );
};

export const bookSession = async (
  mentorId: string,
  startTime: string,
  topic?: string,
  note?: string,
): Promise<any> => {
  return apiClient<any>(`/mentor/booking`, {
    method: "POST",
    body: { mentorId, startTime, topic, note },
  });
};

export const getNotifications = async (
  userId: string,
  read?: boolean,
  type?: string,
): Promise<Notification[]> => {
  const query = new URLSearchParams({ userId });
  if (read !== undefined) {
    query.append("read", String(read));
  }
  if (type) {
    query.append("type", type);
  }
  const endpoint = `/notifications?${query.toString()}`;
  return apiClient<Notification[]>(endpoint);
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const endpoint = `/notifications/${notificationId}`;
  return apiClient<Notification>(endpoint, {
    method: "PATCH",
    body: { isRead: true },
  });
};

interface GetLearningResourcesParams {
  title?: string;
  category?: string;
  provider?: string;
  tags?: string;
}

export const getLearningResources = async (
  params?: GetLearningResourcesParams,
): Promise<LearningResource[]> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetLearningResourcesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/learning-resources${queryString ? `?${queryString}` : ""}`;
  return apiClient<LearningResource[]>(endpoint);
};

interface GetTalentsParams {
  isFeatured?: boolean;
  visibility?: string;
  location?: string;
  skills?: string;
  bio?: string;
  headline?: string;
}

export const getTalents = async (
  params?: GetTalentsParams,
): Promise<Talent[]> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetTalentsParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/talent${queryString ? `?${queryString}` : ""}`;
  return apiClient<Talent[]>(endpoint);
};