import WelcomeEmailPage from "@/components/Email/WelcomeEmail";

const EmailTemplatePage = () => {
  return (
    <WelcomeEmailPage
      configData={{
        name: "mehrab",
        url: `/courses`,
        email: "",
        courses: [
          {
            name: "a",
            thumbnail: "",
            link: `/courses/21`,
          },
        ],
      }}
    />
  );
};

export default EmailTemplatePage;
