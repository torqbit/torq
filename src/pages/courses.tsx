import type { GetServerSidePropsContext } from "next";
import styles from "@/styles/LandingPage.module.scss";
import { getSession } from "next-auth/react";
import React from "react";

import { Course } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { getAllCourses } from "@/actions/getCourseById";
import { Spin } from "antd";

interface IProps {
  userId: number;
  allCourses: Course[] | undefined;
}

const CoursesPage = (props: IProps) => {
  return (
    <div className={styles.container}>
      {props.allCourses ? (
        <Courses allCourses={props.allCourses.filter((c) => c.state === "ACTIVE")} />
      ) : (
        <Spin fullscreen tip />
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx);
  if (user) {
    const allCourses = await getAllCourses(user?.id);

    return {
      props: {
        userId: user.id,
        allCourses: JSON.parse(allCourses),
      },
    };
  }
};

export default CoursesPage;
