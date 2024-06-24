import { GetServerSidePropsContext, NextPage } from "next";
import prisma from "@/lib/prisma";
import { StateType, Theme, User } from "@prisma/client";
import { FC, useEffect } from "react";
import { ICoursePageDetail } from "@/types/courses/Course";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import CoursePreview from "@/components/Marketing/Courses/CoursePreview";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { useAppContext } from "@/components/ContextApi/AppContext";

interface IProps {
  courseDetail: ICoursePageDetail;
  user: User;
}

const CourseDetailPage: FC<IProps> = ({ courseDetail, user }) => {
  const { dispatch, globalState } = useAppContext();

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);
  return (
    <>
      <MarketingLayout heroSection={<CoursePreview courseDetails={courseDetail} />}>\</MarketingLayout>
    </>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const courseDetail = await prisma.course.findUnique({
    where: {
      slug: String(params?.slug),
    },
    select: {
      name: true,
      description: true,
      tvUrl: true,
      difficultyLevel: true,
      state: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      chapters: {
        where: {
          state: StateType.ACTIVE,
        },
        select: {
          sequenceId: true,
          name: true,
          resource: {
            where: {
              state: StateType.ACTIVE,
            },
            select: {
              name: true,
              resourceId: true,
              video: {
                select: {
                  videoDuration: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return { props: { courseDetail: courseDetail, user } };
};
export default CourseDetailPage;
