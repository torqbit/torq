import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Space, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layout2/Layout2";
import { Course } from "@prisma/client";

interface ICourseCard {
  badge: "Beginner" | "Intermidiate" | "Advanced";
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  duration: string;
  courseId: number;
}

const CourseCard: FC<ICourseCard> = ({ badge, thumbnail, courseName, courseDescription, courseId, duration }) => {
  const daysToMonth = Math.floor(Number(duration) / 30);
  const days = Math.floor(Number(duration) % 30);
  console.log(daysToMonth, "month");

  return (
    <div className={styles.course_card}>
      <div className={styles.card_img}>
        <img src={thumbnail} alt={courseName} />
      </div>
      <div className={styles.card_content}>
        <div>
          <Tag className={styles.badge}>{badge}</Tag>
          <h3 className={styles.card_title}>{courseName}</h3>
          <p className={styles.card_description}>{courseDescription}</p>
        </div>

        <div className={styles.card_footer}>
          <div className={styles.course_duration}>
            {daysToMonth} months {days} days
            {/* {duration} */}
          </div>
          <Button type="primary">Start Course</Button>
        </div>
      </div>
    </div>
  );
};

const Courses: FC<{
  allCourses: Course[];
}> = ({ allCourses }) => {
  const { data: user } = useSession();
  //   src={`https://vz-bb827f5e-131.b-cdn.net/${uploadUrl.videoUrl}/thumbnail.jpg`}
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
                  thumbnail={`https://torqbit-dev.b-cdn.net/static/course-banners/${course.thumbnail}`}
                  badge="Beginner"
                  courseName={course.name}
                  courseDescription={course.description}
                  duration={String(course.durationInMonths)}
                  courseId={course.courseId}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <h1 className={styles.course_content}>No Courses Availble</h1>
      )}
    </Layout2>
  );
};

export default Courses;
