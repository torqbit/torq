import { IEmailEventType } from "@/lib/types/email";
import { render } from "@react-email/render";
import WelcomeEmailPage from "@/components/Email/WelcomeEmail";
import nodemailer from "nodemailer";
import { CourseEnrolmentEmail } from "@/components/Email/CourseRegistrationEmail";
import CourseCompletionEmail from "@/components/Email/CourseCompletionEmail";
import { ICompletionEmailConfig, IEmailResponse, IEnrolmentEmailConfig, IWelcomeEmailConfig } from "@/lib/emailConfig";
export const getEmailErrorMessage = (response: string) => {
  let errResponse;
  if (response === "CONN") {
    errResponse = "Connection failed";
  } else if (response === "AUTH PLAIN") {
    errResponse = "authentication failed";
  } else {
    errResponse = response;
  }
  return errResponse;
};

class MailerService {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      port: 587,
      host: process.env.NEXT_SMTP_HOST,
      secure: false,
      auth: {
        user: process.env.NEXT_SMTP_USER,
        pass: process.env.NEXT_SMTP_PASSWORD,
      },
      from: `${process.env.FROM_SMTP_USER_EMAIL}`,
    });
  }
  sendMail = (eventType: IEmailEventType, config: any) => {
    switch (eventType) {
      case "NEW_USER":
        return this.sendWelcomeMail(config as IWelcomeEmailConfig);
      case "COURSE_ENROLMENT":
        return this.sendEnrolmentMail(config as IEnrolmentEmailConfig);
      case "COURSE_COMPLETION":
        return this.sendCompletionMail(config as ICompletionEmailConfig);
      default:
        throw new Error("something went wrong");
    }
  };

  async sendWelcomeMail(config: IWelcomeEmailConfig): Promise<IEmailResponse> {
    try {
      const htmlString = render(WelcomeEmailPage({ configData: config }));
      const sendMail = await this.transporter.sendMail({
        to: config.email,
        from: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} <${process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Welcome to ${process.env.NEXT_PUBLIC_PLATFORM_NAME}: Ignite Your Learning Journey!`,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendEnrolmentMail(config: IEnrolmentEmailConfig) {
    try {
      const htmlString = render(CourseEnrolmentEmail({ configData: config }));
      const sendMail = await this.transporter.sendMail({
        to: config.email,
        from: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} <${process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: "Course Enrolment",
        html: htmlString,
      });

      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendCompletionMail(config: ICompletionEmailConfig) {
    try {
      const htmlString = render(
        CourseCompletionEmail({
          configData: config,
        })
      );

      const sendMail = await this.transporter.sendMail({
        to: config.email,
        from: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} <${process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: "Course Completion",
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }
}

export default new MailerService();
