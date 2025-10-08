import axios from "axios";
import localStorageService from "./localStorageService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageService.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// ✅ Handle 401 here in response interceptor
axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const { config, response } = error;
    console.log(error);
    if (
      response &&
      [401, 419].includes(response.status) &&
      !config?.url?.includes("/auth")
    ) {
      console.log("Redirecting to login due to expired or invalid token");

      localStorage.clear();
      window.location.href = "/auth"; // or "/login" based on your route
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
