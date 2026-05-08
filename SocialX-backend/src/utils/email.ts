import { Resend } from "resend";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  htmlContent: string;
}

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}: SendEmailParams) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "SocialX <noreply@send.socialx.tech>",
      to,
      subject,
      html: htmlContent,
    });
    // const { data, error } = await resend.emails.send({
    //   from: "SocialX <noreply@send.socialx.tech>",
    //   to: "test@olkeionteu.resend.app", // or bounced@resend.dev, complained@resend.dev
    //   subject: "Welcome!",
    //   html: "<p>Thanks for signing up.</p>",
    // });
    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
    console.log("Email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Internal error sending email:", error);
    throw new Error("Email delivery failed");
  }
};
