import type { GetServerSidePropsContext } from "next";
import styles from "@/styles/Dashboard.module.scss";

import { getSession } from "next-auth/react";
import React from "react";

import { Course } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { getAllCourses } from "@/actions/getCourseById";
import { Spin } from "antd";
import Layout2 from "@/components/Layout2/Layout2";

interface IProps {
  userId: number;
  allCourses: Course[] | undefined;
}

const CoursesPage = (props: IProps) => {
  return (
    <Layout2 className={styles.container}>
      {props.allCourses && props.allCourses.filter((c) => c.state === "ACTIVE").length > 0 ? (
        <Courses allCourses={props.allCourses.filter((c) => c.state === "ACTIVE")} />
      ) : (
        <>
          <div className={styles.no_course_found}>
            <img src="/img/common/empty.svg" alt="" />
            <h2>No Courses were found</h2>
            <p>Contact support team for more information.</p>
          </div>
        </>
      )}
    </Layout2>
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
