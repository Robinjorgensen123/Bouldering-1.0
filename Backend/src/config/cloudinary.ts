import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "try configurate Cloudinary with:",
  process.env.CLOUDINARY_CLOUD_NAME || "missing"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "boulders",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "heic"],
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB gräns
});
