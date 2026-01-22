import Mailgen from "mailgen";
import { MailOptions } from "../types/mail.types";
import nodemailer from "nodemailer";

const sendEmail = async (options: MailOptions) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "SocialX",
      link: "http://SocialX.com",
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(
    options.mailgenContent(),
  );
  const emailHtml = mailGenerator.generate(options.mailgenContent());

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: parseInt(process.env.MAILTRAP_SMTP_PORT || "2525"),
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  } as nodemailer.TransportOptions);
  const mail = {
    from: "mail.socialX@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log("Email sending failed", error);
  }
};
const emailVerificationMailGenContent = (
  username: string,
  verificationUrl: string,
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app we're very excited to have you on board",
      action: {
        instructions: "To verify your email please click here",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
const forgotPasswordMailGenContent = (
  username: string,
  passwordResetUrl: string,
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "We've got the request to reset your password",
      action: {
        instructions: "To reset your password please click here",
        button: {
          color: "#bc2222ff", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
export {
  sendEmail,
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
};
