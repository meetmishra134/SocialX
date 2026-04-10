import fs from "fs/promises";
import { ApiError } from "./api.error";
import cloudinary from "../server";

export const uploadToCloudinary = async (
  localFilePath: string,
  options: {
    folder: string;
    publicId?: string;
  },
) => {
  if (!localFilePath) {
    throw new ApiError(400, "File path not found");
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: options.folder,
      public_id: options.publicId,
      overwrite: true,
      resource_type: "image",
    });

    await fs.unlink(localFilePath).catch(() => {
      console.error("Failed to delete local file after success", localFilePath);
    }); // fire & forget cleanup

    return result;
  } catch (error: any) {
    fs.unlink(localFilePath).catch(() => {});
    console.error("CLOUDINARY ERROR 👉", error);
    const errorMessage = error?.message || "Cloudinary upload failed";
    throw new ApiError(400, "Cloudinary upload failed");
  }
};
