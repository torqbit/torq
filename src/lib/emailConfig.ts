export interface IWelcomeEmailConfig {
  name: string;
  productName: string;
  url: string;
  email: string;
  courses: { name: string; thumbnail: string }[];
}

export interface IEnrolmentEmailConfig {
  name: string;
  productName: string;
  url: string;
  email: string;
  course: { name: string; thumbnail: string };
}

export interface ICompletionEmailConfig {
  name: string;
  productName: string;
  url: string;
  email: string;

  courseName: string;
}

export interface IEmailResponse {
  success: boolean;
  response: string;
}
