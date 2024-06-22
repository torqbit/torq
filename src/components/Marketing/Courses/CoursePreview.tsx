import SvgIcons from "@/components/SvgIcons";
import { convertSecToHourandMin } from "@/pages/admin/content";
import styles from "@/styles/NavBar.module.scss";
import { Breadcrumb, Button, Card, Collapse, Divider, Flex, Space, Tag } from "antd";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import MarketingSvgIcons from "../MarketingSvgIcons";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {isCompleted ? SvgIcons.check : icon}
            <div>{title}</div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
    </div>
  );
};
const CoursePreview = () => {
  const courseListDetail = {
    course: {
      name: "Foundation of Web Development",
      description: "Description about the Git History",
      courseTrailer: "https://iframe.mediadelivery.net/embed/227219/6dd12bc6-4856-4095-9dc2-0f6f0de5137b",
    },
    lessons: [
      {
        chapterSeq: 1,
        chapterName: "Chapter 1",
        lessons: [
          {
            title: "Lesson 1",
            videoDuration: 2268,
            lessonId: 1,
            isWatched: false,
          },
          {
            title: "Lesson 2",
            videoDuration: 950,
            lessonId: 2,
            isWatched: false,
          },
          {
            title: "Lesson 3",
            videoDuration: 780,
            lessonId: 3,
            isWatched: false,
          },
        ],
      },
      {
        chapterSeq: 1,
        chapterName: "Chapter 2",
        lessons: [
          {
            title: "Lesson 1",
            videoDuration: 1450,
            lessonId: 1,
            isWatched: false,
          },
          {
            title: "Lesson 2",
            videoDuration: 3502,
            lessonId: 2,
            isWatched: false,
          },
          {
            title: "Lesson 3",
            videoDuration: 1500,
            lessonId: 3,
            isWatched: false,
          },
        ],
      },
      {
        chapterSeq: 1,
        chapterName: "Chapter 3",
        lessons: [
          {
            title: "Lesson 1",
            videoDuration: 1259,
            lessonId: 1,
            isWatched: false,
          },
          {
            title: "Lesson 2",
            videoDuration: 1659,
            lessonId: 2,
            isWatched: false,
          },
          {
            title: "Lesson 3",
            videoDuration: 1259,
            lessonId: 3,
            isWatched: false,
          },
        ],
      },
    ],
  };

  const items = courseListDetail?.lessons.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      totalTime = totalTime + data.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: <Label title={content.chapterName} icon={SvgIcons.folder} time={duration} keyValue={`${i + 1}`} />,
      children: content.lessons.map((res: any, i: any) => {
        const duration = convertSecToHourandMin(res.videoDuration);
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.title}
              icon={SvgIcons.playBtn}
              time={duration}
              isCompleted={res.isWatched}
              resourceId={res.videoId}
              keyValue={`${i + 1}`}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items ? items.map((item, i) => `${i + 1}`) : []);

  const courseDetail = [
    {
      icon: MarketingSvgIcons.courseLevel,
      label: "Beginner",
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },
    {
      icon: MarketingSvgIcons.users,
      label: "20 students",
    },
    {
      icon: MarketingSvgIcons.clock,
      label: "12h 20m",
    },
    {
      icon: MarketingSvgIcons.certificate,
      label: "Certificate on course completion",
    },
  ];
  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };
  return (
    <section className={styles.coursePreviewContainer}>
      <div className={styles.contentWrapper}>
        <Space direction="vertical">
          <div className={styles.videoContainer}>
            {
              <iframe
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  outline: "none",
                  border: "none",
                  borderRadius: "8px",
                }}
                allowFullScreen={true}
                src={courseListDetail.course.courseTrailer}
              ></iframe>
            }
          </div>

          <h1>Foundation of Web Development</h1>
          <Flex align="center" gap={10} className={styles.authorInfo}>
            <img src="https://placehold.co/50x50" alt="" />
            <Space direction="vertical" size={"small"}>
              <span>A Course by</span>
              <div>Shad Amez</div>
            </Space>
          </Flex>
          <div className={styles.descriptionWrapper}>
            <h2>Description</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui consequatur repudiandae cumque, numquam ab
              tempora? Delectus iure animi, nisi nihil omnis itaque atque vero explicabo placeat. Quo vel suscipit iusto
              aspernatur aliquid maiores modi officia repudiandae illum illo dicta aut perspiciatis quia soluta officiis
              quas, provident neque! Maxime nesciunt alias minus cupiditate repellat sint voluptatem distinctio illo, a
              fugiat voluptatum!
            </p>
          </div>
        </Space>
        <div>
          <div className={styles.courseEnrollmentCard}>
            <div className={styles.cardWrapper}>
              <img src="https://torqbit-dev.b-cdn.net/static/github.jpeg" alt="" />
              <div className={styles.cardDetail}>
                <div>Details</div>
                <div>
                  {courseDetail.map((c, i) => {
                    return (
                      <Flex align="center" gap={10}>
                        <i>{c.icon}</i>
                        <div>{c.label}</div>
                      </Flex>
                    );
                  })}
                </div>
              </div>
              <Divider />
              <div className={styles.buttonWrapper}>
                <Button type="primary"> Enroll for free</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.chapter_list}>
        <h1>Chapters</h1>

        <Collapse
          onChange={onChange}
          activeKey={activeCollapseKey}
          size="small"
          accordion={false}
          items={
            items &&
            items.map((item, i) => {
              return {
                key: item.key,
                label: item.label,
                children: item.children,
                showArrow: false,
              };
            })
          }
        />
      </div>
    </section>
  );
};
export default CoursePreview;
