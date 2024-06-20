import { FC } from "react";

import styles from "../../styles/CourseCategory/CourseCategory.module.scss";
import { Card, Flex, Tag } from "antd";
import SvgIcons from "../SvgIcons";

type ICourseDisplay = {
  name: string;
  tools: string[];
};
export type ICourseCategory = {
  name: string;
  description: string;
  image: string;
  courses: ICourseDisplay[];
};

export const CourseCategory: FC<{ direction: "ltr" | "rtl"; category: ICourseCategory; isMobile: boolean }> = ({
  direction,
  category,
  isMobile,
}) => (
  <section className={styles.course__category}>
    {direction == "rtl" && !isMobile && (
      <i style={{ left: 0, top: -100, transform: "rotate(-90deg)" }}>{SvgIcons.categoryWave}</i>
    )}
    {direction == "ltr" && !isMobile && <i style={{ right: 0, top: -50 }}>{SvgIcons.categoryWave}</i>}

    <div className={`${direction == "ltr" ? "" : styles.rtl}`}>
      <div>
        <img src={category.image} alt="" />
      </div>
      <div className={styles.category__detail}>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <Flex align="center" justify="center">
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
