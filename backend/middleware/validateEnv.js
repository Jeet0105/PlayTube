// Validate required environment variables
export const validateEnv = () => {
  const required = [
    "MONGODB_URL",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing.join(", "));
    process.exit(1);
  }

  // Validate email configuration if using email features
  if (process.env.EMAIL_USER && !process.env.EMAIL_PASS) {
    console.warn("Warning: EMAIL_USER set but EMAIL_PASS missing");
  }
};

