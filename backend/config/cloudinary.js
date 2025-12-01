import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload file
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Delete local temp file
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Attempt cleanup even if upload fails
    try {
      fs.unlinkSync(filePath);
    } catch {}

    return null;
  }
};

export default uploadOnCloudinary;
