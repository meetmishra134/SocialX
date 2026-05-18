import { Post } from "../types/post.types";

export const getVerificationEmailTemplate = (
  userName: string,
  verificationLink: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your SocialX Account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #18181b; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #3f3f46; line-height: 1.6; }
        .content h2 { color: #18181b; font-size: 20px; margin-top: 0; }
        .button-container { text-align: center; margin: 35px 0; }
        .button { background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; }
        .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #a1a1aa; border-top: 1px solid #e4e4e7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SocialX</h1>
        </div>
        <div class="content">
          <h2>Welcome back, ${userName}!</h2>
          <p>We received a request to send you an email verification link. Please click the button below to verify your account.</p>
          <div class="button-container">
            <a href="${verificationLink}" class="button">Verify My Account</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3b82f6; font-size: 14px;">${verificationLink}</p>
        </div>
        <div class="footer">
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
export const getPasswordResetEmailTemplate = (
  userName: string,
  resetLink: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your SocialX Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #18181b; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #3f3f46; line-height: 1.6; }
        .content h2 { color: #18181b; font-size: 20px; margin-top: 0; }
        .button-container { text-align: center; margin: 35px 0; }
        .button { background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; }
        .button:hover { background-color: #2563eb; }
        .warning-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px; font-size: 14px; color: #92400e; }
        .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #a1a1aa; border-top: 1px solid #e4e4e7; }
        .footer a { color: #3b82f6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <div class="header">
          <h1>SocialX</h1>
        </div>

        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>We received a request to reset the password for your SocialX account. If you made this request, please click the button below to choose a new password.</p>
          
          <div class="button-container">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link directly into your browser:</p>
          <p style="word-break: break-all; color: #3b82f6; font-size: 14px;">
            ${resetLink}
          </p>

          <div class="warning-box">
            <strong>Didn't request this?</strong> You can safely ignore this email. Your password will not change unless you create a new one using the link above.
          </div>
          
          <p>
            Thanks,<br>
            <strong>The SocialX Team</strong>
          </p>
        </div>

        <div class="footer">
          <p>For security reasons, this link will expire in 15 minutes.</p>
          <p>&copy; ${new Date().getFullYear()} SocialX. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};
export const weeklyTrendingTemplate = (userName: string, posts: Post[]) => {
  const postsHtml = posts
    .map(
      (post) => `
    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <img src="${post.author.avatarUrl}" alt="${post.author.userName}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 10px;" />
        <div>
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111827;">${post.author.fullName}</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">@${post.author.userName}</p>
        </div>
      </div>
      <p style="font-size: 14px; color: #374151; margin-bottom: 12px; line-height: 1.5;">
        ${post.text?.length > 100 ? post.text.substring(0, 100) + "..." : post.text}
      </p>
      <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 8px;">
        ❤️ ${post.likes?.length || 0} Likes · 
      </div>
      <a href="${process.env.FRONTEND_URL}/post/${post._id}" style="display: inline-block; margin-top: 12px; font-size: 13px; color: #0ea5e9; text-decoration: none; font-weight: 500;">
        Read full post →
      </a>
    </div>
  `,
    )
    .join("");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin: 0; font-size: 28px; letter-spacing: -0.5px;">SocialX</h1>
        <p style="color: #6b7280; margin-top: 5px; font-size: 16px;">Your Weekly Highlights</p>
      </div>

      <!-- Greeting -->
      <div style="margin-bottom: 24px;">
        <p style="font-size: 16px; color: #1f2937; margin: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">Here are some of the most engaging conversations happening on SocialX this week. Jump in and share your thoughts!</p>
      </div>

      <!-- Posts Container -->
      <div>
        ${postsHtml}
      </div>

      <!-- Main CTA -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #0ea5e9; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
          Explore More on SocialX
        </a>
      </div>

      <!-- Footer -->
      <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          © ${new Date().getFullYear()} SocialX. All rights reserved.
        </p>
      </div>

    </div>
  `;
};
