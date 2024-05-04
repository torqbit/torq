import { getUserEnrolledCoursesId } from "@/actions/getEnrollCourses";
import LearnCourse from "@/components/LearnCourse/LearnCourse";
import appConstant from "@/services/appConstant";
import { message } from "antd";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

const PlayLesson: NextPage = () => {
  return <LearnCourse />;
};

export default PlayLesson;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;

  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isEnrolled = await getUserEnrolledCoursesId(Number(params.courseId), user?.id);
    if (!isEnrolled) {
      return {
        redirect: {
          permanent: false,
          message: "you are not enrolled in this course",
          destination: "/unauthorized?from=playLesson",
        },
      };
    }
  }
  return { props: {} };
};
