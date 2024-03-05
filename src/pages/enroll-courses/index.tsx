import { GetServerSidePropsContext } from "next";
import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/EnrollCourses.module.scss";
import {
  Badge,
  Button,
  Progress,
  Result,
  Skeleton,
  Space,
  message,
} from "antd";
import Layout from "@/components/Layout";
import getEnrollCourses from "@/actions/getEnrollCourses";
import { CourseRegistration } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { getPercentage, truncateString } from "@/services/helper";
import { ICourse } from "../learn/program/[programId]";
import { IResponse, getFetch } from "@/services/request";
import SpinLoader from "@/components/SpinLoader/SpinLoader";

const CourseListCard: FC<any> = ({ course, userId }) => {
  const { thumbnail, name, about, chapter, courseId } = course as ICourse;
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRes, setTotalRes] = useState<number>(0);
  const [totalChapter, setTotalChapter] = useState<number>(0);
  const [completedRes, setCompletedRes] = useState<number>(0);
  const router = useRouter();

  const getTotalRes = () => {
    setTotalChapter(chapter.length);
    let no = 0;
    chapter.map((c, i) => {
      no = no + c.resource.length;
    });
    setTotalRes(no);
  };

  const fetchCompletedRes = async () => {
    try {
      const res = await getFetch(`/api/progress/get/all/${courseId}/${userId}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setCompletedRes(result.total);
      }
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);
    getTotalRes();
    fetchCompletedRes();
    setLoading(false);
  }, [course]);

  return (
    <div className={styles.course_list_card} key={courseId}>
      <div className={styles.course_card_img}>
        <img src={thumbnail} alt="Course thumbnail" />
        <span
          className={styles.play_btn}
          onClick={() => {
            router.push(`/learn/course/${courseId}`);
          }}
        >
          <img src="/img/courses/play-btn.svg" alt="play-btn" />
        </span>
      </div>
      <Skeleton
        loading={loading}
        style={{ padding: 15 }}
        paragraph={{ rows: 2, width: "100%" }}
      >
        <div className={styles.course_card_details}>
          <h3 className={styles.card_name}>{name}</h3>
          <Space align="center" size={3}>
            <Badge color="gray" status="default" count={totalChapter} />
            <div className={styles.card_chapter_name}>
              {truncateString(about, 60)}
            </div>
          </Space>
          <Progress
            trailColor="#6f6f6f"
            strokeColor="#4ece91"
            percent={Number(getPercentage(completedRes, totalRes).toFixed(0))}
            className={styles.progress_bar}
          />
        </div>
      </Skeleton>
    </div>
  );
};

interface IProps {
  userId: number;
  enrollCourses: CourseRegistration[];
}

const CoursesPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [enrollCourses, setEnrollCourses] = useState([]);

  const fetchEnrollCourses = async (userId: number) => {
    try {
      const res = await getFetch(`/api/course/get-enrolled/user/${userId}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setEnrollCourses(result.enrollCourses);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      message.error(err.error);
    }
  };

  useEffect(() => {
    if (session && session.id) {
      fetchEnrollCourses(session.id);
    }
  }, [session]);
  return (
    <Layout>
      <div className={styles.enroll_course_list_page}>
        {loading && <SpinLoader />}
        {enrollCourses?.length > 0 && (
          <>
            <h2 className={styles.page_title}>Your Courses</h2>
            <section className={styles.course_list}>
              {enrollCourses.map((course: CourseRegistration, i: number) => {
                return (
                  <CourseListCard {...course} key={i} userId={session?.id} />
                );
              })}
            </section>
          </>
        )}

        {enrollCourses.length === 0 && (
          <Result
            icon={null}
            className="empty_course_msg"
            title="You don't have any enroll courses"
            extra={
              <Link href={"/courses"}>
                <Button type="primary">Browse Course</Button>
              </Link>
            }
          />
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;
