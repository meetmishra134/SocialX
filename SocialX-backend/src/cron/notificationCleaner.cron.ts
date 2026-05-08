import cron from "node-cron";
import { Notification } from "../models/notification.model";

export const initNotificationCleanup = () => {
  cron.schedule("0 1 * * 5", async () => {
    console.log("🧹 [CRON] Starting 10-day Notification cleanup...");

    try {
      let tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const result = await Notification.deleteMany({
        createdAt: { $lt: tenDaysAgo },
      });
      console.log(
        `✅ [CRON] Deleted ${result.deletedCount} notifications older than 10 days.`,
      );
    } catch (error) {
      console.error(
        "❌ [CRON] Error occurred while cleaning up notifications:",
        error,
      );
    }
  });
};
