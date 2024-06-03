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
