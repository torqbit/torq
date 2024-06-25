import SvgIcons from "@/components/SvgIcons";
import { convertSecToHourandMin } from "@/pages/admin/content";
import styles from "@/styles/NavBar.module.scss";
import { Button, Collapse, Divider, Flex, Space, Tag } from "antd";
import { FC, ReactNode, useState } from "react";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { ICoursePageDetail } from "@/types/courses/Course";
import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

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
const CoursePreview: FC<{ courseDetails: ICoursePageDetail; user: User }> = ({ courseDetails, user }) => {
  const courseListDetail = {
    course: {
      name: courseDetails.name,
      description: courseDetails.description,
      courseTrailer: courseDetails.tvUrl,
      difficulty: courseDetails.difficultyLevel,
    },

    chapters: courseDetails.chapters.map((chapter) => {
      return {
        chapterSeq: chapter.sequenceId,
        chapterName: chapter.name,
        lessons: chapter.resource.map((r) => {
          return {
            title: r.name,
            videoDuration: r.video.videoDuration,
            lessonId: r.resourceId,
          };
        }),
      };
    }),
  };

  const items = courseListDetail?.chapters.map((content, i) => {
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
  let duration: number = 0;

  courseDetails.chapters.forEach((chapter) => {
    chapter.resource.forEach((r) => {
      duration = duration + r.video.videoDuration;
    });
  });

  const totalDuration = convertSecToHourandMin(duration);

  const courseFeatures = [
    {
      icon: MarketingSvgIcons.info,
      label: courseDetails.state === "ACTIVE" ? "Available for all" : "N/A",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: courseDetails.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: totalDuration,
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
        <Space direction="vertical" style={{ width: "100%" }}>
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
                src={String(courseListDetail.course.courseTrailer)}
              ></iframe>
            }
          </div>

          <h1>{courseDetails.name}</h1>
          <Flex align="center" gap={10} className={styles.authorInfo}>
            <Image src={courseDetails.user.image} alt="" height={50} width={50} loading="lazy" />
            <Space direction="vertical" size={"small"}>
              <span>A Course by</span>
              <div>{courseDetails.user.name}</div>
            </Space>
          </Flex>
          <div className={styles.descriptionWrapper}>
            <h2>Description</h2>
            <p>{courseDetails.description}</p>
          </div>
        </Space>
        <div style={{ width: "100%" }}>
          <div className={styles.courseEnrollmentCard}>
            <div className={styles.cardWrapper}>
              <Image
                src="https://torqbit-dev.b-cdn.net/static/github.jpeg"
                height={375}
                width={375}
                alt=""
                loading="lazy"
              />
              <div className={styles.cardDetail}>
                <div>Details</div>
                <div>
                  {courseFeatures.map((c, i) => {
                    return (
                      <Flex key={i} align="center" gap={10}>
                        <i>{c.icon}</i>
                        <div>{c.label}</div>
                      </Flex>
                    );
                  })}
                </div>
              </div>
              <Divider />
              <Link href={user ? `/courses/${courseDetails.courseId}` : `/login`} className={styles.buttonWrapper}>
                <Button type="primary">{courseDetails.state === "ACTIVE" ? "Enroll for free" : "Notify me"}</Button>
              </Link>
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
