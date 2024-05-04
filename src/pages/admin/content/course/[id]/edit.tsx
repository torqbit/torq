import AddCourseForm from "@/components/Admin/Content/AddCourseForm";
import appConstant from "@/services/appConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";

const SettingPage: NextPage = () => {
  return (
    <>
      <AddCourseForm />
    </>
  );
};

export default SettingPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user) {
    if (user.role === "STUDENT") {
      return {
        redirect: {
          permanent: false,
          message: "you are not authorized ",
          destination: "/unauthorized",
        },
      };
    }
  }
  return { props: {} };
};
