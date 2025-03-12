import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post("/api/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // Redirect to login page
    return null;
  }
};

// Request Interceptor: Attach accessToken to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh accessToken if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and token refresh is needed
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry failed request with new token
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
