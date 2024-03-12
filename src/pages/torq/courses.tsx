import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layout2/Layout2";

interface ICourseCard {
  badge: "Beginner" | "Intermidiate" | "Advanced";
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  duration: string;
  courseId: number;
}

const CourseCard: FC<ICourseCard> = ({ badge, thumbnail, courseName, courseDescription, courseId, duration }) => {
  return (
    <div className={styles.course_card}>
      <div className={styles.card_img}>
        <img src={thumbnail} alt={courseName} />
      </div>
      <div className={styles.card_content}>
        <Tag className={styles.badge}>{badge}</Tag>
        <h3 className={styles.card_title}>{courseName}</h3>
        <p className={styles.card_description}>{courseDescription}</p>

        <div className={styles.card_footer}>
          <div className={styles.course_duration}>{duration}</div>
          <Button className={styles.start_course_btn}>
            <span>Start Course</span>
            {SvgIcons.arrowRight}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Courses: FC = (params) => {
  const { data: user } = useSession();
  return (
    <Layout2>
      <section className={styles.course_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Courses</h3>
        <div className={styles.course_card_wrapper}>
          <CourseCard
            thumbnail="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            badge="Beginner"
            courseName="Foundations of web Development"
            courseDescription="Learn to build a portfolio website using HTML & CSS, that works in all devices - desktop, mobile and tablets"
            duration="10h 30m"
            courseId={1}
          />
          <CourseCard
            thumbnail="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            badge="Beginner"
            courseName="Foundations of web Development"
            courseDescription="Learn to build a portfolio website using HTML & CSS, that works in all devices - desktop, mobile and tablets"
            duration="10h 30m"
            courseId={1}
          />
          <CourseCard
            thumbnail="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            badge="Beginner"
            courseName="Foundations of web Development"
            courseDescription="Learn to build a portfolio website using HTML & CSS, that works in all devices - desktop, mobile and tablets"
            duration="10h 30m"
            courseId={1}
          />
          <CourseCard
            thumbnail="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            badge="Beginner"
            courseName="Foundations of web Development"
            courseDescription="Learn to build a portfolio website using HTML & CSS, that works in all devices - desktop, mobile and tablets"
            duration="10h 30m"
            courseId={1}
          />
        </div>
      </section>
    </Layout2>
  );
};

export default Courses;
