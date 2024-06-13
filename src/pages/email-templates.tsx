import CourseEnrolmentEmail from "@/components/Email/CourseRegistrationEmail";
import WelcomeEmailPage from "@/components/Email/WelcomeEmail";

const EmailTemplatePage = () => {
  return (
    <WelcomeEmailPage
      configData={{
        name: "mehrab",
        url: `/courses`,
        email: "",
      }}
    />
    // <CourseEnrolmentEmail
    //   configData={{
    //     name: "Mehrab",
    //     url: "/dash",
    //     email: "/",
    //     course: {
    //       name: "Git Branch",
    //       thumbnail: "https://torqbit-dev.b-cdn.net/static//courses/banners/Git-Intro_banner-1717674874299.jpg",
    //     },
    //   }}
    // />
  );
};

export default EmailTemplatePage;
