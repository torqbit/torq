import { FC } from "react";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import { Flex, Space, Tag } from "antd";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";
import CourseCard from "./CourseCard";
import { IOfflineCourseCard } from "@/types/courses/offline";

const OfflineCoursePreview: FC<{
  icon: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  courseDetails: IOfflineCourseCard[];
}> = ({ icon, title, description, duration, price, courseDetails }) => {
  return (
    <div className={styles.offline_course_preview}>
      <div className={styles.offline_course_preview_wrapper}>
        <div>
          <div>
            <Image height={80} width={80} src={icon} alt={title} />
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
          <div className={styles.price_wrapper}>
            <Flex align='center' gap={5}>
              <i>{SvgIcons.rupees}</i>
              <h2 style={{ marginBottom: 0 }}>{price}</h2>
            </Flex>
            <Tag>{duration}</Tag>
          </div>
        </div>
        <div className={styles.courses_list}>
          {courseDetails.map((detail, i) => {
            return (
              <CourseCard banner={detail.banner} title={detail.title} description={detail.description} duration={detail.duration} key={i} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OfflineCoursePreview;
