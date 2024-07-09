import { FC } from "react";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { Card, Flex, Tag } from "antd";
import Image from "next/image";

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
    <div className={`${direction == "ltr" ? "" : styles.rtl}`}>
      <div
        data-aos={`${direction == "ltr" ? "slide-right" : "slide-left"}`}
        data-aos-offset="100"
        data-aos-delay="50"
        data-aos-duration="800"
        data-aos-easing="ease-in-out"
      >
        <Image src={category.image} alt="" height={isMobile ? 250 : 600} width={isMobile ? 254 : 800} loading="lazy" />
      </div>
      <div
        className={styles.category__detail}
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="150"
        data-aos-duration="800"
        data-aos-easing="ease-in-out"
      >
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
