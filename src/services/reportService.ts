import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";

export type ReportType = "post" | "workout" | "user";

export interface ReportPayload {
  reason: string;
  post_id?: string;
  workout_id?: string;
  reported_user?: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data?: any;
}

class ReportService {
  private getAuthHeaders() {
    const token = localStorageService.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async reportPost(postId: string, reason: string): Promise<ReportResponse> {
    try {
      const response = await axiosInstance.post(
        "/post-reports",
        {
          post_id: postId,
          reason,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: true,
        message: response.data.message || "Post reported successfully",
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to report post");
    }
  }

  async reportWorkout(
    workoutId: string,
    reason: string
  ): Promise<ReportResponse> {
    try {
      const response = await axiosInstance.post(
        "/workout-reports",
        {
          workout_id: workoutId,
          reason,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: true,
        message: response.data.message || "Workout reported successfully",
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error || "Failed to report workout"
      );
    }
  }

  async reportUser(userId: string, reason: string): Promise<ReportResponse> {
    try {
      const response = await axiosInstance.post(
        "/user-reports",
        {
          reported_user: userId,
          reason,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: true,
        message: response.data.message || "User reported successfully",
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to report user");
    }
  }

  async getReports(
    reportType: ReportType,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const endpoint =
        reportType === "user"
          ? "/user-reports"
          : reportType === "post"
          ? "/post-reports"
          : "/workout-reports";

      const response = await axiosInstance.get(endpoint, {
        params: { page, limit },
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error || "Failed to fetch reports"
      );
    }
  }
}

export default new ReportService();
