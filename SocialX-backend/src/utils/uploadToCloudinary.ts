import fs from "fs";
import { ApiError } from "./api.error";
import cloudinary from "../server";

export const uploadToCloudinary = async (
  localFilePath: string,
  imageName: string,
  authorName: string,
) => {
  if (!localFilePath) {
    throw new ApiError(400, "File path not found");
  }
  const safeAuthor = authorName.toLowerCase().replace(/[^a-z0-9]/g, "-");

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: `posts/${safeAuthor}`,
      public_id: imageName,
      resource_type: "image",
    });

    fs.unlink(localFilePath, () => {}); // fire & forget cleanup

    return result;
  } catch (error) {
    fs.unlink(localFilePath, () => {});
    console.error("CLOUDINARY ERROR 👉", error);
    throw new ApiError(400, "Cloudinary upload failed");
  }
};
