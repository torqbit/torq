import { FC } from "react";
import styles from "../../styles/CourseCategory/CourseCategory.module.scss";
import { Card, Tag } from "antd";
import SvgIcons from "../SvgIcons";

type ICourseDisplay = {
  name: string;
  tools: string[];
};
export type ICourseCategory = {
  name: string;
  description: string;
  courses: ICourseDisplay[];
};

export const CourseCategory: FC<{ direction: "ltr" | "rtl"; category: ICourseCategory }> = ({
  direction,
  category,
}) => (
  <section className={styles.course__category}>
    {direction == "rtl" && <i style={{ left: 0, top: -100, transform: "rotate(-90deg)" }}>{SvgIcons.categoryWave}</i>}
    {direction == "ltr" && <i style={{ right: 0, top: -50 }}>{SvgIcons.categoryWave}</i>}

    <div className={`${direction == "ltr" ? "" : styles.rtl}`}>
      <div>
        <img src="/img/categories/front-end-screen.png" alt="" />
      </div>
      <div className={styles.category__detail}>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <div>
          {category.courses.map((co, index) => (
            <Card key={index} bordered={false} style={{ width: 250 }}>
              <p className={styles.course__title}>{co.name}</p>
              {co.tools.map((t, index) => (
                <Tag key={index} bordered={false} className={styles.tags}>
                  {t}
                </Tag>
              ))}
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);
