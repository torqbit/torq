import { FC } from "react";

import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import Image from "next/image";
import { Flex, Tag } from "antd";

const CourseCard: FC<{ banner: string; title: string; description: string; duration: string }> = ({
  banner,
  title,
  description,
  duration,
}) => {
  return (
    <div className={styles.course_card_wrapper}>
      <img alt='course_banner' src={banner} />
      <Flex vertical justify='space-between' className={styles.course_detail}>
        <div>
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
        <Tag className={styles.duration_tag}>{duration}</Tag>
      </Flex>
    </div>
  );
};
export default CourseCard;
