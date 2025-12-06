import axios from "axios";
import { toast } from "react-toastify";

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear user data and redirect to sign in
          if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
            toast.error("Session expired. Please sign in again.");
            // Clear any stored user data
            localStorage.removeItem("persist:root");
            window.location.href = "/signin";
          }
          break;
        case 403:
          toast.error("You don't have permission to perform this action.");
          break;
        case 404:
          toast.error(data?.message || "Resource not found.");
          break;
        case 409:
          toast.error(data?.message || "Conflict occurred.");
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data?.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;

