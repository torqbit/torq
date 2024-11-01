import { FC } from "react";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import { Carousel, Flex, Space } from "antd";
import { IstudentStories } from "@/types/courses/offline";
const StudentStories: FC<{ storiesDetail: IstudentStories[] }> = ({ storiesDetail }) => {
  return (
    <section className={styles.student_stories}>
      <div className={styles.student_stories_wrapper}>
        <h1>
          Stories of <span>Students</span>
        </h1>
        <div className={styles.slider_wrapper}>
          <Carousel className={styles.carousel_wrapper} autoplay dots={{ className: styles.dot_position }}>
            {storiesDetail.map((detail, i) => {
              return (
                <div key={i}>
                  <h4>Transformation of {detail.name}</h4>
                  <div className={styles.stundet_info_wrapper}>
                    <Space size={20}>
                      <div className={styles.student_info}>
                        <img src={detail.previousImage} alt="" />

                        <p>{detail.qualification}</p>
                        <p>{detail.qualificationLocation}</p>
                      </div>

                      <Flex align="center" gap={10} style={{ marginBottom: 65 }}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                      </Flex>
                      <div className={styles.student_info}>
                        <img src={detail.transformedImage} alt="" />

                        <p>{detail.placement}</p>
                        <p>{detail.placementLocation}</p>
                      </div>
                    </Space>
                  </div>
                  <Flex vertical align="center" justify="center" key={i} className={styles.shared_image}>
                    <img src={"https://placehold.co/250x100"} alt="" />
                  </Flex>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </section>
  );
};
export default StudentStories;
