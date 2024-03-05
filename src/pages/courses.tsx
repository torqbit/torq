import type { GetServerSidePropsContext } from "next";
import styles from "@/styles/LandingPage.module.scss";
import CourseListPage from "../components/CoursesListPage";
import { getSession } from "next-auth/react";
import { ICourseInfo } from "./add-course";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Role } from "@prisma/client";


interface IProps {
  userId: number;
  role: Role;
}

export interface ICourseList extends ICourseInfo {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

const Home = (props: IProps) => {
  return (
    <div className={styles.container}>
      <CourseListPage userId={props.userId} role={props.role} />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx);
  return {
    props: {
      role: user?.role ?? "",
      userId: user?.id ?? "",
    },
  };
};

export default Home;
