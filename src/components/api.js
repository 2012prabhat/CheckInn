import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enable sending cookies with requests
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    // 🔹 Call the refresh token endpoint with credentials
    const response = await axios.get(
      "/api/auth/refresh",
      {}, // Empty body (refreshToken is sent via cookies)
      { withCredentials: true } // Send cookies with the request
    );

    const { accessToken } = response.data;
    // 🔹 Store the new accessToken in localStorage
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);

    // 🔹 Clear tokens and redirect to login page
    localStorage.removeItem("accessToken");
    window.location.href = "/login"; // Redirect to login page

    throw error; // Re-throw the error to stop further execution
  }
};

// Request Interceptor: Attach accessToken to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 Get accessToken from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Refresh accessToken if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔹 Check if the error is due to an expired or invalid token
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔹 Refresh the access token
        const newToken = await refreshAccessToken();
        if (newToken) {
          // 🔹 Update the Authorization header with the new token
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // 🔹 Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // 🔹 Clear tokens and redirect to login page
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect to login page

        return Promise.reject(refreshError);
      }
    }

    // 🔹 Handle other errors (e.g., network errors, server errors)
    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;