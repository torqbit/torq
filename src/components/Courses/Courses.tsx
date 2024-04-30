import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Modal, Space, Tag, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layout2/Layout2";
import { Course } from "@prisma/client";
import { useRouter } from "next/router";
import { IResponse, getFetch, postFetch } from "@/services/request";
import ProgramService from "@/services/ProgramService";
import Link from "next/link";

interface ICourseCard {
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  duration: string;
  courseId: number;
  courseType: string;
}

const CourseCard: FC<ICourseCard> = ({ thumbnail, courseName, courseDescription, courseId, duration, courseType }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [enrolled, setEnroll] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [isCourseCompleted, setCourseCompleted] = useState<boolean>();

  const daysToMonth = Math.floor(Number(duration) / 30);
  const days = Math.floor(Number(duration) % 30);

  const onCheckErollment = async () => {
    const res = await getFetch(`/api/course/get-enrolled/${courseId}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      result.isEnrolled ? setEnroll("enrolled") : setEnroll("notEnrolled");
    }
  };

  const onEnrollCourse = async () => {
    setLoading(true);
    try {
      if (enrolled === "enrolled") {
        router.replace(`/courses/${courseId}`);
        return;
      }
      const res = await postFetch(
        {
          userId: session?.id,
          courseId: Number(courseId),
          courseType: courseType,
        },
        "/api/v1/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.already) {
          router.replace(`/courses/${courseId}`);
          setLoading(false);
        } else {
          Modal.info({
            title: result.message,
            onOk: () => {
              router.replace(`/courses/${courseId}`);
              setLoading(false);
            },
          });
        }
      } else {
        message.error(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      message.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    onCheckErollment();

    ProgramService.getProgress(
      Number(courseId),
      (result) => {
        setCourseCompleted(result.latestProgress.completed);
      },
      (error) => {}
    );
  }, []);

  return (
    <Link href={`/courses/${courseId}`}>
      <div className={styles.course_card}>
        <div className={styles.card_img}>
          <img src={thumbnail} alt={courseName} />
        </div>
        <div className={styles.card_content}>
          <div>
            <h3 className={styles.card_title}>{courseName}</h3>
            <p className={styles.card_description}>{courseDescription}</p>
          </div>

          <div className={styles.card_footer}>
            <div className={styles.course_duration}>
              {daysToMonth} months {days} days
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Courses: FC<{
  allCourses: Course[];
}> = ({ allCourses }) => {
  const { data: user } = useSession();

  return (
    <Layout2>
      {allCourses.length ? (
        <section className={styles.course_content}>
          <h2>Hello {user?.user?.name}</h2>
          <h3>Courses</h3>
          <div className={styles.course_card_wrapper}>
            {allCourses.map((course: Course, i) => {
              return (
                <CourseCard
                  thumbnail={course.thumbnail as string}
                  courseName={course.name}
                  courseDescription={course.description}
                  duration={String(course.expiryInDays)}
                  courseId={course.courseId}
                  courseType={course.courseType}
                />
              );
            })}
          </div>
        </section>
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

export default Courses;
