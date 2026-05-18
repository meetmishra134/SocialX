import cron from "node-cron";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { weeklyTrendingTemplate } from "../utils/email.template";
import { sendEmail } from "../utils/email";

export const initWeekelyHighlightCron = () => {
  cron.schedule("0 10 * * 5", runWeekelyHighlights, {
    timezone: "Asia/Kolkata",
  });
};
const runWeekelyHighlights = async () => {
  console.log("📨 [CRON] Starting Weekly Highlights Email...");
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const topPosts = await Post.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
      {
        $project: {
          text: 1,
          likesCount: 1,
          _id: 1,
          "author.userName": "$authorDetails.userName",
          "author.fullName": "$authorDetails.fullName",
          "author.avatarUrl": "$authorDetails.avatarUrl.url",
        },
      },
    ]);
    if (topPosts.length === 0) {
      console.log("ℹ️ [CRON] No new posts this week. Skipping emails.");
      return;
    }
    const users = await User.find({ isEmailVerified: true });
    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Your Weekly Highlights from SocialX",
          htmlContent: weeklyTrendingTemplate(
            user.fullName || user.userName,
            topPosts,
          ),
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (emailError) {
        console.error(
          `Failed to send weekly digest to ${user.email}:`,
          emailError,
        );
      }
    }
    console.log(`✅ [CRON] Weekly Highlights sent to ${users.length} users.`);
  } catch (error) {
    console.error("❌ [CRON] Weekly Highlights Job Failed:", error);
  }
};
