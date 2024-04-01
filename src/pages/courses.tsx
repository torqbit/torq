import type { GetServerSidePropsContext } from "next";
import styles from "@/styles/LandingPage.module.scss";

import { getSession } from "next-auth/react";
import { ICourseInfo } from "./add-course";
import React from "react";

import { Course } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { getAllCoursesById } from "@/actions/getCourseById";
import { Spin } from "antd";

interface IProps {
  userId: number;
  allCourses: Course[] | undefined;
}

export interface ICourseList extends ICourseInfo {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

const Home = (props: IProps) => {
  return (
    <div className={styles.container}>
      {props.allCourses ? <Courses allCourses={props.allCourses} /> : <Spin fullscreen tip />}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx);
  if (user) {
    const allCourses = await getAllCoursesById(user?.id);

    return {
      props: {
        userId: user.id,
        allCourses: JSON.parse(allCourses),
      },
    };
  }
};

export default Home;
