import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Tag } from "antd";

import Link from "next/link";
import { convertSecToHourandMin } from "@/pages/admin/content";

interface ICourseCard {
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  duration: string;
  courseId: number;
  courseType: string;
  difficulty: string;
}

const CourseCard: FC<ICourseCard> = ({
  thumbnail,
  courseName,
  courseDescription,
  courseId,
  duration,
  courseType,
  difficulty,
}) => {
  return (
    <Link href={`/courses/${courseId}`}>
      <div className={styles.course_card}>
        <div className={styles.card_img}>
          <img src={thumbnail} alt={courseName} />
        </div>
        <div className={styles.card_content}>
          <div>
            <Tag className={styles.card_difficulty_level}>{difficulty}</Tag>

            <h3 className={styles.card_title}>{courseName}</h3>
            <p className={styles.card_description}>{courseDescription}</p>
          </div>

          <div className={styles.card_footer}>
            <div className={styles.course_duration}>{duration}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Courses: FC<{
  allCourses: any[];
}> = ({ allCourses }) => {
  const { data: user } = useSession();

  return (
    <>
      {allCourses.length ? (
        <section className={styles.course_content}>
          <h2>Hello {user?.user?.name}</h2>
          <h3>Courses</h3>
          <div className={styles.course_card_wrapper}>
            {allCourses.map((course: any, i) => {
              let totalDuration = 0;
              course.chapters.forEach((chap: any) => {
                chap.resource.forEach((r: any) => {
                  totalDuration = totalDuration + r.video?.videoDuration;
                });
              });
              let duration = convertSecToHourandMin(totalDuration);
              return (
                <CourseCard
                  thumbnail={course.thumbnail as string}
                  courseName={course.name}
                  courseDescription={course.description}
                  duration={String(duration)}
                  courseId={course.courseId}
                  courseType={course.courseType}
                  difficulty={course.difficultyLevel}
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
    </>
  );
};

export default Courses;
