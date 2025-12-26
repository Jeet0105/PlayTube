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
    SUBSCRIBE: "/api/v1/user/togglesubscribe",
    GET_ALL_CHANNEL: "/api/v1/user/allchannel",
    GET_SUBSCRIBED_DATA : "/api/v1/user/subscribed-data",
    ADD_HISTORY : "/api/v1/user/add-history",
    GET_HISTORY : "/api/v1/user/get-history",
  },
  CONTENT: {
    Create_Video: "/api/v1/content/create-video",
    Create_Short: "/api/v1/content/create-short",
    Get_All_Videos: "/api/v1/content/getallvideos",
    Get_All_Shorts: "/api/v1/content/getallshorts",
    LIKE_VIDEO: (videoId) => `/api/v1/content/videos/${videoId}/like`,
    DISLIKE_VIDEO: (videoId) => `/api/v1/content/videos/${videoId}/dislike`,
    SAVE_VIDEO: (videoId) => `/api/v1/content/videos/${videoId}/save`,
    INCREMENT_VIEW: (videoId) => `/api/v1/content/videos/${videoId}/views`,
    ADD_COMMENT: (videoId) => `/api/v1/content/videos/${videoId}/comments`,
    ADD_REPLY: (videoId, commentId) => `/api/v1/content/videos/${videoId}/comments/${commentId}/replies`,
    LIKE_SHORT: (shortId) => `/api/v1/content/shorts/${shortId}/like`,
    DISLIKE_SHORT: (shortId) => `/api/v1/content/shorts/${shortId}/dislike`,
    SAVE_SHORT: (shortId) => `/api/v1/content/shorts/${shortId}/save`,
    INCREMENT_VIEW_SHORT: (shortId) => `/api/v1/content/shorts/${shortId}/views`,
    ADD_COMMENT_SHORT: (shortId) => `/api/v1/content/shorts/${shortId}/comments`,
    ADD_REPLY_SHORT: (shortId, commentId) => `/api/v1/content/shorts/${shortId}/comments/${commentId}/replies`,
    GET_SHORT_COMMENTS: (shortId) => `/api/v1/content/shorts/${shortId}/get-comments`,
    CREATE_PLAYLIST: "/api/v1/content/create-playlist",
    CREATE_POST: "/api/v1/content/create-post",
    SAVE_PLAYLIST: "/api/v1/content/playlist/save",
    POST_LIKE: "/api/v1/content/post/like",
    POST_COMMENT: "/api/v1/content/post/comments",
    POST_REPLY: "/api/v1/content/post/comments/replies",
    GET_LIKED_VIDEO: "/api/v1/content/getlikedvideo",
    GET_LIKED_SHORT: "/api/v1/content/getlikedshort",
    GET_SAVED_VIDEO: "/api/v1/content/getsavedvideo",
    GET_SAVED_SHORT: "/api/v1/content/getsavedshort",
    GET_SAVED_PLAYLIST: "/api/v1/content/getsavedplaylist",
    AI_SEARCH: "/api/v1/content/search",
  }
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

