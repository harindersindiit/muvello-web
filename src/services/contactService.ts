import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const contactService = {
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const token = localStorageService.getItem("accessToken");
      const response = await axiosInstance.post("/user/contact-us", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        message:
          response.data.message || "Your message has been sent successfully!",
        data: response.data,
      };
    } catch (error: any) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to send message. Please try again.";

      throw new Error(errorMessage);
    }
  },
};
