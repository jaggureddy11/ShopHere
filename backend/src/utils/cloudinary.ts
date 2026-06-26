import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const useCloudinary =
  process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_NAME !== 'mock';

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadImage = async (filePath: string): Promise<string> => {
  if (useCloudinary) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'shophere'
    });
    return result.secure_url;
  } else {
    // Mock upload: Save or copy to public folder or just return a mock URL
    console.log(`[CLOUDINARY MOCK] File upload simulated for: ${filePath}`);
    
    // Create a local uploads directory inside public if needed, or return a placeholder
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }
};
