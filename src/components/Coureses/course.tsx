import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";

const CourseCard = () => {
  return (
    <div className={styles.course_card}>
      <div className={styles.card_img}>
        <img
          src="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
      <div className={styles.card_content}>
        <Tag className={styles.badge}>Beginner</Tag>
        <h3 className={styles.card_title}>Foundations of web Development</h3>
        <p className={styles.card_description}>
          Learn to build a portfolio website using HTML & CSS, that works in all devices - desktop, mobile and tablets
        </p>

        <div className={styles.card_footer}>
          <div className={styles.course_duration}>10h 30m</div>
          <Button className={styles.start_course_btn}>
            <span>Start Course</span>
            {SvgIcons.arrowRight}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Courses: FC = () => {
  const { data: user } = useSession();
  return (
    <section className={styles.course_content}>
      <div className={styles.course_card_wrapper}>
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </section>
  );
};

export default Courses;
