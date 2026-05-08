import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectDatabase from "./config/database";
import { httpServer } from "./app";
import { initNotificationCleanup } from "./cron/notificationCleaner.cron";
import { initWeekelyHighlightCron } from "./cron/weekelyHighlights.cron";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
export default cloudinary;
const port = Number(process.env.PORT) || 9000;

connectDatabase()
  .then(() => {
    httpServer.listen(port, "0.0.0.0", () => {
      initNotificationCleanup();
      initWeekelyHighlightCron();
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Failed To Connect MongoDB", error);
    process.exit(1);
  });
