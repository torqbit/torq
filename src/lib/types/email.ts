import { ReactNode } from "react";

export interface IEmailConfig {
  productName: string;
  description: (course_title: string) => ReactNode | string;
  linkDescription: string;
  supportDescription: string;
  buttonText: string;
  queryDescription: string;
  teamName: string;
  urlIssueDescription: string;
  url: string;
}

export type IEmailEventType = "NEW_USER" | "COURSE_ENROLMENT" | "COURSE_COMPLETION";
