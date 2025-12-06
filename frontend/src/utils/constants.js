// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// App Configuration
export const APP_NAME = "PlayTube";
export const APP_VERSION = "1.0.0";

// Environment
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/v1/auth/signup",
    SIGNIN: "/api/v1/auth/signin",
    SIGNOUT: "/api/v1/auth/signout",
    GOOGLE_AUTH: "/api/v1/auth/googleauth",
    SEND_OTP: "/api/v1/auth/sendotp",
    VERIFY_OTP: "/api/v1/auth/verifyotp",
    RESET_PASSWORD: "/api/v1/auth/resetpassword",
  },
  USER: {
    GET_USER: "/api/v1/user/get-user",
    CREATE_CHANNEL: "/api/v1/user/createchannel",
    GET_CHANNEL: "/api/v1/user/get-channel",
    UPDATE_CHANNEL: "/api/v1/user/updatechannel",
  },
};

// Categories
export const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Movies",
  "Sports",
  "Learning",
  "Fashion & Beauty",
  "TV Shows",
  "Trending",
  "Live",
  "Comedy",
  "Entertainment",
  "Education",
  "Science & Technology",
  "Art",
  "Cooking",
  "Travel",
  "Autos & Vehicles",
];

// File upload limits
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
  },
};

