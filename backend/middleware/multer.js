import path from "path";
import multer from "multer";

// Allowed file types
const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

// File filter for images
const imageFilter = (req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, WebM, and MOV videos are allowed."), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// Image upload (for profile pictures, avatars, banners)
export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

// Video upload (for future video uploads)
export const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: videoFilter,
});

// Default upload (backward compatibility)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export default upload;
