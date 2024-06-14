import SpinLoader from "@/components/SpinLoader/SpinLoader";
import SvgIcons from "@/components/SvgIcons";

import { convertSecToHourandMin } from "@/pages/admin/content";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { CourseLessonAPIResponse, VideoLesson } from "@/types/courses/Course";
import { Breadcrumb, Button, Collapse, Flex, Space, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { FC, ReactNode, useState } from "react";

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

const Preview: FC<{
  courseDetail?: CourseLessonAPIResponse;
  addContentPreview?: boolean;
  videoUrl?: string;
  enrolled?: boolean;
  isCourseCompleted?: boolean;
  onEnrollCourse?: () => void;
  isCourseStarted?: boolean;
}> = ({ addContentPreview, videoUrl, onEnrollCourse, enrolled, isCourseCompleted, courseDetail, isCourseStarted }) => {
  const router = useRouter();

  const items = courseDetail?.lessons.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      totalTime = totalTime + data.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: <Label title={content.chapterName} icon={SvgIcons.folder} time={duration} keyValue={`${i + 1}`} />,
      children: content.lessons.map((res: VideoLesson, i: any) => {
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

  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };

  const onViewCertificate = () => {
    ProgramService.getCertificate(
      Number(router.query.courseId),
      (result) => {
        const id = String(result?.certificateDetail?.getIssuedCertificate?.id);
        router.push(`/courses/${router.query.courseId}/certificate/${id}`);
      },
      (error) => {}
    );
  };
  return (
    <section className={styles.preview_container}>
      <Space direction="vertical">
        <div style={{ fontSize: 20 }} className={styles.coursehHeaderLinks}>
          {courseDetail && !addContentPreview && (
            <Breadcrumb
              items={[
                {
                  title: <a href="/courses"> Courses</a>,
                },
                {
                  title: `${courseDetail.course.name}`,
                },
              ]}
            />
          )}
        </div>
        <div className={styles.video_container}>
          <Flex className={styles.spin_wrapper} align="center" justify="center">
            <SpinLoader className="preview_loader" />
          </Flex>
          {
            <iframe
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                outline: "none",
                border: "none",
              }}
              src={videoUrl}
            ></iframe>
          }
          <div className={styles.video_player_info}>
            <Space direction="vertical">
              <h2>{courseDetail?.course.name}</h2>
              <p>{courseDetail?.course.description}</p>
            </Space>

            {enrolled ? (
              <>
                {isCourseCompleted ? (
                  <Flex align="center" gap={10}>
                    <Button onClick={onViewCertificate}>View Certificate</Button>

                    <Link
                      href={`/courses/${router.query.courseId}/lesson/${courseDetail?.lessons[0].lessons[0].lessonId}`}
                    >
                      <Button type="primary">Rewatch</Button>
                    </Link>
                  </Flex>
                ) : (
                  <Button
                    className={styles.save_btn}
                    type="primary"
                    onClick={() => {
                      !addContentPreview && onEnrollCourse && onEnrollCourse();
                    }}
                  >
                    {!isCourseStarted ? "Start Course" : "Resume"}
                    {SvgIcons.arrowRight}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  className={styles.save_btn}
                  type="primary"
                  onClick={() => {
                    !addContentPreview && onEnrollCourse && onEnrollCourse();
                  }}
                >
                  Enroll Course
                  {SvgIcons.arrowRight}
                </Button>
              </>
            )}
          </div>
        </div>

        <h2>Table of Contents</h2>
        <div>
          <div className={styles.chapter_list}>
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
        </div>
      </Space>
    </section>
  );
};

export default Preview;
