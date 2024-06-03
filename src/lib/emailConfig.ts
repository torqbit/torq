export const courseRegistrationEmailConfig = {
  productName: "Torqbit",
  description: (course_title: string) => {
    return `
      We're excited to let you know that you've successfully enrolled in ${course_title}! Welcome
      abroad, and congratulations on taking this important step towards enhancing your skills.`;
  },
  linkDescription: "It's time to move forward. Click on the link below to get Start",
  supportDescription: " If you have any questions, feel free to email our support team, or even send a reply .",
  buttonText: "Start Course",
  queryDescription:
    "If you have any questions, feel free to email our support team, or even send a reply to this email. We wouuld be happy to answer any queries.",
  teamName: "Torqbit team",
  urlIssueDescription:
    "If you're having trouble with the button above, copy and paste the URL below into your web browser.",
  url: `${process.env.NEXTAUTH_URL}/courses`,
};

export const courseCompletionEmailConfig = {
  productName: "Torqbit",
  description: (course_title: string) => {
    return `
      Congratulations! You've successfully completed ${course_title}. We're thrilled to celebrate
      this ahievement with you and commend your hard work and dedication throughout the course.
      `;
  },
  linkDescription: "                You can download your certificate of completion by clicking the below image.  ",
  supportDescription: "  If you have any questions, feel free to email our support team, or even send a reply .",
  buttonText: "Learn More",
  queryDescription:
    "If you have any questions, feel free to email our support team, or even send a reply to this email. We wouuld be happy to answer any queries.",
  teamName: "Torqbit team",
  urlIssueDescription:
    "If you're having trouble with the button above, copy and paste the URL below into your web browser.",
  url: `${process.env.NEXTAUTH_URL}/courses/`,
};

import { IEmailConfig } from "./types/email";

export const welcomeEmailConfig: IEmailConfig = {
  productName: "Torqbit",
  description: (title: string) =>
    " Welcome to the Torqbit Platform. we're excited to have you join our community. You can nowexcel in the field of software development, connect with fellow learners and help each other to move forward.",
  linkDescription: "Choose from the courses below or click on the button at the bottom to view all the courses.",
  supportDescription: "  If you have any questions, feel free to email our support team, or even send a reply .",
  buttonText: "Learn More",
  queryDescription:
    "If you have any questions, feel free to email our support team, or even send a reply to this email. We wouuld be happy to answer any queries.",
  teamName: "Torqbit team",
  urlIssueDescription:
    "If you're having trouble with the button above, copy and paste the URL below into your web browser.",
  url: `${process.env.NEXTAUTH_URL}/courses`,
};
