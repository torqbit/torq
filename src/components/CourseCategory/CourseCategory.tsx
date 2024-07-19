import { FC } from "react";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { Card, Flex, Tag } from "antd";
import Image from "next/image";

type ICourseDisplay = {
  name: string;
  link: string;
  tools: string[];
};
export type ICourseCategory = {
  name: string;
  description: string;
  image: string;
  courses: ICourseDisplay[];
};

export const CourseCategory: FC<{
  direction: "ltr" | "rtl";
  category: ICourseCategory;
  index: number;
  isMobile: boolean;
}> = ({ direction, category, index, isMobile }) => (
  <section
    className={`${styles.course__category}  ${index % 2 != 0 ? styles.odd__category : styles.even__category}`}
    id="courses"
  >
    <div className={`${direction == "ltr" ? "" : styles.rtl}`}>
      <div>
        <span className={styles.tag__stage}>Stage {index}</span>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
      </div>
      <div className={styles.category__detail}>
        <Flex align="center" justify="center" gap={20}>
          {category.courses.map((co, index) => (
            <Card key={index} bordered={false} className={styles.cardWrapper} size={isMobile ? "small" : "default"}>
              <p className={styles.course__title}>{co.name}</p>
              <div className={styles.tagWrapper}>
                {" "}
                {co.tools.map((t, index) => (
                  <Tag key={index} bordered={false} className={styles.tags}>
                    {t}
                  </Tag>
                ))}
              </div>
            </Card>
          ))}
        </Flex>
      </div>
    </div>
  </section>
);
