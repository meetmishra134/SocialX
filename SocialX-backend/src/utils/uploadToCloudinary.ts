import fs from "fs";
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

    fs.unlink(localFilePath, () => {}); // fire & forget cleanup

    return result;
  } catch (error) {
    fs.unlink(localFilePath, () => {});
    console.error("CLOUDINARY ERROR 👉", error);
    throw new ApiError(400, "Cloudinary upload failed");
  }
};
