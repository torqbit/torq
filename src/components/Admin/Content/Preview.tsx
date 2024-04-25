import SvgIcons from "@/components/SvgIcons";
import { IResourceDetail } from "@/lib/types/learn";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { ChapterDetail, CourseInfo, VideoInfo } from "@/types/courses/Course";
import { Button, Collapse, Flex, Space, Tag } from "antd";
import Link from "next/link";

import { FC, ReactNode, useEffect, useState } from "react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  onRender: (value: string[]) => void;
  render: string[];
  icon: ReactNode;
}> = ({ title, time, onRender, render, keyValue, icon, resourceId }) => {
  const [completed, setCompleted] = useState<boolean>();
  const onActive = (value: string[]) => {
    if (render.includes(value[0])) {
      let currentValue = render.filter((v) => v !== value[0]);
      onRender(currentValue);
    } else {
      render.push(value[0]);
    }
  };

  useEffect(() => {
    resourceId &&
      ProgramService.checkProgress(
        resourceId,
        (result) => {
          setCompleted(result.completed);
        },
        (error) => {}
      );
  }, []);
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {completed ? SvgIcons.check : icon}
            <div style={{ cursor: "pointer" }} onClick={() => onActive([keyValue])}>
              {title}
            </div>
          </Flex>
        </div>
        <div>
          <Tag color="#eee" className={styles.time_tag}>
            {time}
          </Tag>
        </div>
      </Flex>
    </div>
  );
};

const Preview: FC<{
  courseDetail?: CourseInfo;
  videoUrl?: string;
  uploadVideo?: VideoInfo;
  chapter: ChapterDetail[];
  enrolled?: boolean;
  isCourseCompleted?: boolean;
  onEnrollCourse?: () => void;
}> = ({ uploadVideo, chapter, videoUrl, onEnrollCourse, enrolled, isCourseCompleted, courseDetail }) => {
  const renderKey = chapter.map((c, i) => {
    return `${i + 1}`;
  });
  const [render, setRender] = useState(renderKey);

  const items = chapter.map((content, i) => {
    return {
      key: `${i + 1}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={""}
          onRender={setRender}
          render={render}
          keyValue={`${i + 1}`}
        />
      ),
      children: content.resource
        .filter((r) => r.state === "ACTIVE")
        .map((res: IResourceDetail, i: any) => {
          return (
            <div className={styles.resContainer}>
              <Label
                title={res.name}
                icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
                time={res.contentType === "Video" ? `${res.video?.videoDuration} min` : `${res.daysToSubmit} days`}
                onRender={setRender}
                resourceId={res.resourceId}
                render={render}
                keyValue={`${i + 1}`}
              />
            </div>
          );
        }),
      showArrow: false,
    };
  });

  return (
    <section className={styles.preview_container}>
      <Space direction="vertical">
        <div style={{ fontSize: 20 }}>
          {courseDetail && (
            <Flex>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <div>{courseDetail.name}</div>
            </Flex>
          )}
        </div>
        <div className={styles.video_container}>
          {uploadVideo?.videoUrl ||
            (videoUrl && (
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
            ))}
          <div className={styles.video_player_info}>
            <Space direction="vertical">
              <h2>{courseDetail?.name}</h2>
              <p>{courseDetail?.description}</p>
            </Space>

            {enrolled && isCourseCompleted ? (
              <Link href={`/courses/${chapter[0]?.courseId}/play`}>
                <Button>Rewatch</Button>
              </Link>
            ) : (
              <Button className={styles.save_btn} onClick={onEnrollCourse}>
                {enrolled ? "Resume" : "Enroll Course"}
                {SvgIcons.arrowRight}
              </Button>
            )}
          </div>
        </div>

        <h2>Table of Contents</h2>
        <div>
          {items.map((item, i) => {
            return (
              <div key={i} className={styles.chapter_list}>
                <Collapse
                  defaultActiveKey={"1"}
                  size="small"
                  accordion={false}
                  activeKey={render}
                  items={[
                    {
                      key: item.key,
                      label: item.label,
                      children: item.children,
                      showArrow: false,
                    },
                  ]}
                />
              </div>
            );
          })}
        </div>
      </Space>
    </section>
  );
};

export default Preview;
