import { courseCompletionEmailConfig } from "@/lib/courseCompletionEmailConfig";
import { courseRegistrionEmailConfig } from "@/lib/courseRegistrionEmailConfig";
import { IEmailConfig, IEmailEventType, NodemailerConfig } from "@/lib/types/email";
import { welcomeEmailConfig } from "@/lib/welcomeEmail";
import { render } from "@react-email/render";
import WelcomeEmailPage, { IWelcomeEmail } from "@/components/Email/WelcomeEmail";
import nodemailer from "nodemailer";
import CourseRegistraionEmail, { CourseRegistraionProps } from "@/components/Email/CourseRegistraionEmail";
import CourseCompletionEmail, { CourseCompletionProps } from "@/components/Email/CourseCompletionEmail";

export const getEventEmail = (eventType: IEmailEventType) => {
  switch (eventType) {
    case "NEW_USER":
      return welcomeEmailConfig;
    case "COURSE_ENROLMENT":
      return courseRegistrionEmailConfig;
    case "COURSE_COMPLETION":
      return courseCompletionEmailConfig;
  }
};

export class MailerService {
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
  sendMail = (
    eventType: IEmailEventType,
    config: any,
    toEmail: string,
    userName: string,
    studentId: string,
    courseId?: number
  ) => {
    switch (eventType) {
      case "NEW_USER":
        let c = config as IEmailConfig;
        return this.sendWelcomeMail(config, this.transporter, toEmail, userName);
      case "COURSE_ENROLMENT":
        return this.sendRegistrationMail(config, this.transporter, toEmail, userName, Number(courseId));
      case "COURSE_COMPLETION":
        return this.sendCompletionMail(config, this.transporter, toEmail, userName, Number(courseId), studentId);
    }
  };

  async sendWelcomeMail(config: IEmailConfig, transporter: any, toEmail: string, userName: string) {
    const courses = await prisma?.course.findMany({
      take: 3,
      select: {
        name: true,
        thumbnail: true,
      },
    });
    const htmlString = render(
      WelcomeEmailPage({ name: userName, courses: courses, configData: config } as IWelcomeEmail)
    );

    const sendMail = transporter.sendMail({
      to: toEmail,
      from: `Torqbit <${process.env.FROM_SMTP_USER_EMAIL}>`,
      subject: "Welcome User",

      html: htmlString,
    });
  }

  async sendRegistrationMail(
    config: IEmailConfig,
    transporter: any,
    toEmail: string,
    userName: string,
    courseId: number
  ) {
    const course = await prisma?.course.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        name: true,
        thumbnail: true,
      },
    });
    const htmlString = render(
      CourseRegistraionEmail({ name: userName, course: course, configData: config, courseId } as CourseRegistraionProps)
    );

    const sendMail = transporter.sendMail({
      to: toEmail,
      from: `Torqbit <${process.env.FROM_SMTP_USER_EMAIL}>`,
      subject: "Course Registration",
      html: htmlString,
    });
  }

  async sendCompletionMail(
    config: IEmailConfig,
    transporter: any,
    toEmail: string,
    userName: string,
    courseId: number,
    studentId: string
  ) {
    const course = await prisma?.course.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        name: true,
        thumbnail: true,
      },
    });
    const courseCertificate = await prisma?.courseCertificates.findFirst({
      where: {
        courseId: courseId,
        studentId: studentId,
      },
    });
    const htmlString = render(
      CourseCompletionEmail({
        name: userName,
        course: course,
        configData: config,
        courseId: courseId,
        issuedCertificateId: courseCertificate?.id,
      } as CourseCompletionProps)
    );

    const sendMail = transporter.sendMail({
      to: toEmail,
      from: `Torqbit <${process.env.FROM_SMTP_USER_EMAIL}>`,
      subject: "Course Completion",
      html: htmlString,
    });
  }
}
