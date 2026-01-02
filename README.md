# 🎥 PlayTube

A modern, full-stack video streaming platform built with the MERN stack, featuring AI-powered search, real-time interactions, and seamless media management.

## ✨ Features

- **🔐 Authentication & Authorization**
  - Email/Password authentication with JWT
  - Google OAuth integration via Firebase
  - Password reset with OTP verification
  - Secure cookie-based session management

- **📹 Video Management**
  - Upload and share videos with Cloudinary integration
  - Create short-form content (Shorts)
  - Organize content with playlists
  - Comment and reply system
  - Like/Dislike functionality
  - View tracking and analytics

- **🤖 AI-Powered Features**
  - Intelligent search using Google Gemini AI
  - Category-based content filtering with AI
  - Smart keyword extraction and matching

- **👤 Channel Management**
  - Create and customize channels
  - Subscribe/Unsubscribe to channels
  - Channel analytics
  - Profile customization

- **🎯 User Experience**
  - Personalized content recommendations
  - Watch history tracking
  - Saved videos and playlists
  - Responsive design with TailwindCSS
  - Dark mode interface

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **State Management:** Redux Toolkit
- **Styling:** TailwindCSS 4.1
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth
- **UI Components:** Lucide React, React Icons
- **Notifications:** React Toastify
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js with Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer, Cloudinary
- **AI Integration:** Google Generative AI (Gemini 2.5 Flash)
- **Email Service:** Nodemailer
- **Security:** Helmet, CORS, Express Rate Limit
- **Validation:** Validator.js

### Tools & Services
- **Cloud Storage:** Cloudinary
- **Authentication:** Firebase
- **AI Model:** Google Gemini API
- **Email:** Nodemailer with SMTP

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**
- **MongoDB**
- **Git**

## 🔑 Environment Variables

### Backend (.env in `/backend` folder)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URL=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Frontend (.env in `/frontend` folder)

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jeet0105/PlayTube.git
cd PlayTube
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and add your environment variables
# (See Environment Variables section above)

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file and add your environment variables
# (See Environment Variables section above)

# Start the development server
npm run dev
```

The frontend application will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **Health Check:** `http://localhost:8000/health`

## 📁 Project Structure

```
PlayTube/
├── backend/
│   ├── config/           # Configuration files (DB, Cloudinary, etc.)
│   ├── controller/       # Route controllers
│   ├── middleware/       # Custom middleware (auth, error handling, etc.)
│   ├── model/           # Mongoose models
│   ├── route/           # API routes
│   ├── public/          # Static files
│   ├── index.js         # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/          # Public assets
│   ├── src/
│   │   ├── component/   # Reusable components
│   │   ├── components/  # Additional components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store and slices
│   │   ├── utils/       # Utility functions and constants
│   │   ├── customHooks/ # Custom React hooks
│   │   ├── App.jsx      # Main App component
│   │   └── main.jsx     # Entry point
│   ├── utils/           # Utility files (Firebase config)
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🌐 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Endpoints

#### Authentication Routes
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in with credentials
- `POST /auth/signout` - Sign out user
- `POST /auth/googleauth` - Google OAuth authentication
- `POST /auth/sendotp` - Send OTP for password reset
- `POST /auth/verifyotp` - Verify OTP
- `POST /auth/resetpassword` - Reset password

#### User Routes
- `GET /user/get-user` - Get current user details
- `POST /user/createchannel` - Create a new channel
- `GET /user/get-channel` - Get channel details
- `PUT /user/updatechannel` - Update channel information
- `POST /user/togglesubscribe` - Subscribe/Unsubscribe to channel
- `GET /user/allchannel` - Get all channels
- `GET /user/subscribed-data` - Get subscribed channels data
- `POST /user/add-history` - Add video to watch history
- `GET /user/get-history` - Get watch history
- `GET /user/recommended-content` - Get recommended content

#### Content Routes
- `POST /content/create-video` - Upload new video
- `POST /content/create-short` - Upload new short
- `GET /content/getallvideos` - Get all videos
- `GET /content/getallshorts` - Get all shorts
- `POST /content/videos/:videoId/like` - Like a video
- `POST /content/videos/:videoId/dislike` - Dislike a video
- `POST /content/videos/:videoId/save` - Save a video
- `POST /content/videos/:videoId/views` - Increment view count
- `POST /content/videos/:videoId/comments` - Add comment to video
- `POST /content/create-playlist` - Create a playlist
- `POST /content/search` - AI-powered search
- `POST /content/filter` - AI-powered category filtering

## 🔒 Security Features

- **Helmet.js** - Secure HTTP headers
- **CORS** - Cross-Origin Resource Sharing protection
- **Rate Limiting** - API request throttling
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **Input Validation** - Request data validation
- **Environment Variables** - Sensitive data protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Built with ❤️ by Jeet

## 🙏 Acknowledgments

- Google Gemini AI for intelligent search capabilities
- Cloudinary for media management
- Firebase for authentication services

---

**Note:** Make sure to configure all environment variables before running the application. Never commit sensitive credentials to version control.
