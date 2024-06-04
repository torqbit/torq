export interface IWelcomeEmailConfig {
  name: string;
  url: string;
  email: string;
  courses: { name: string; thumbnail: string; link: string }[];
}

export interface IEnrolmentEmailConfig {
  name: string;
  url: string;
  email: string;
  course: { name: string; thumbnail: string };
}

export interface ICompletionEmailConfig {
  name: string;
  url: string;
  email: string;

  courseName: string;
}

export interface IEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}
