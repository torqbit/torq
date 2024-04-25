import { Button, Collapse, Flex, Skeleton, Space, Spin, Tabs, TabsProps, Tag, message } from "antd";
import Layout2 from "../Layout2/Layout2";
import styles from "@/styles/LearnCourses.module.scss";
import { FC, ReactNode, useEffect, useState } from "react";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import { ChapterDetail } from "@/types/courses/Course";
import { IResourceDetail } from "@/lib/types/learn";

import Link from "next/link";
import CourseDiscussion from "./AboutCourse/CourseDiscussion/CourseDiscussion";
import { useSession } from "next-auth/react";
import { IResponse, getFetch, postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  selectedLesson: IResourceDetail | undefined;
  onSelectResource: (resourceId: number) => void;
  setChapterId: (value: number) => void;
  resourceId: number;
  chapterId: number;
  refresh: boolean;

  icon: ReactNode;
}> = ({
  title,
  time,
  onSelectResource,
  refresh,
  selectedLesson,
  setChapterId,
  keyValue,
  icon,
  resourceId,
  chapterId,
}) => {
  const [completed, setCompleted] = useState<boolean>();
  const checkIsCompleted = async () => {
    const res = await getFetch(`/api/progress/get/${resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setCompleted(result.isCompleted);
    }
  };
  useEffect(() => {
    checkIsCompleted();
  }, [refresh]);
  return (
    <div
      style={{ padding: resourceId > 0 ? "5px 0px" : 0, paddingLeft: resourceId > 0 ? "20px" : 0 }}
      className={`${
        selectedLesson && resourceId === selectedLesson.resourceId ? styles.selectedLable : styles.labelContainer
      }`}
      onClick={() => {
        onSelectResource(resourceId);
      }}
    >
      <Flex justify="space-between" align="center">
        <div className={styles.title_container}>
          <Flex gap={10} align="center" onClick={() => setChapterId(chapterId)}>
            {completed ? SvgIcons.check : icon}
            <div style={{ cursor: "pointer" }}>{title}</div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
      <div className={styles.selected_bar}></div>
    </div>
  );
};

const LearnCourse: FC<{}> = () => {
  const [courseData, setCourseData] = useState<{
    name: string;
    description: string;
    expiryInDays: number;
    chapters: ChapterDetail[];
  }>({
    name: "",
    description: "",
    expiryInDays: 365,
    chapters: [],
  });

  const [selectedLesson, setSelectedLesson] = useState<IResourceDetail>();

  const [chapterId, setChapterId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLesson, setLessonLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const router = useRouter();

  const [isCompleted, setCompleted] = useState<boolean>();
  const [isCourseCompleted, setCourseCompleted] = useState<boolean>();

  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const checkIsCompleted = async () => {
    setLoadingBtn(true);
    const res = await getFetch(`/api/progress/get/${selectedLesson?.resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setCompleted(result.isCompleted);
    }
    setLoadingBtn(false);
  };

  useEffect(() => {
    if (selectedLesson?.resourceId) {
      checkIsCompleted();
    }
  }, [selectedLesson, refresh]);

  const onMarkAsCompleted = async () => {
    try {
      if (isCompleted) return;

      const res = await postFetch(
        {
          chapterId: selectedLesson?.chapterId,
          courseId: Number(router.query.courseId),
          userId: session?.id,
          sequenceId: selectedLesson?.sequenceId,

          resourceId: selectedLesson?.resourceId,
        },
        `/api/progress/create`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        message.success(result.message);
        setRefresh(!refresh);
        getProgressDetail();
        ProgramService.getProgress(
          Number(router.query.courseId),
          (result) => {
            setCourseCompleted(result.latestProgress.completed);
          },
          (error) => {}
        );
      } else {
        message.error(result.error);
      }
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "About",
      children: selectedLesson?.description,
    },
    {
      key: "2",
      label: "Q & A",

      children: session && selectedLesson && (
        <CourseDiscussion loading={loading} resourceId={selectedLesson?.resourceId} userId={session?.id} />
      ),
    },
  ];

  const onSelectResource = (resourceId: number) => {
    setLessonLoading(true);
    setSelectedLesson(
      courseData.chapters
        .find((chapter) => chapter.chapterId === chapterId)
        ?.resource.find((data) => data.resourceId === resourceId)
    );
    setLessonLoading(false);
  };

  const lessonItems = courseData.chapters?.map((content, i) => {
    let totalTime = 0;
    content.resource.forEach((data) => {
      totalTime = totalTime + data.video?.videoDuration;
    });
    return {
      key: `${content.chapterId}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={`${totalTime} min`}
          onSelectResource={() => {}}
          resourceId={0}
          chapterId={content.chapterId}
          setChapterId={setChapterId}
          selectedLesson={undefined}
          keyValue={`${content.chapterId}`}
          refresh={refresh}
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
                onSelectResource={onSelectResource}
                resourceId={res.resourceId}
                setChapterId={() => {}}
                selectedLesson={selectedLesson}
                chapterId={0}
                keyValue={`${i + 1}`}
                refresh={refresh}
              />
            </div>
          );
        }),
      showArrow: false,
    };
  });

  const getProgressDetail = () => {
    ProgramService.getProgress(
      Number(router.query.courseId),
      (result) => {
        setSelectedLesson(result.latestProgress.nextLesson);
        setChapterId(result.latestProgress.nextLesson?.chapterId);
        setRefresh(!refresh);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    setLoading(true);
    router.query.courseId &&
      ProgramService.getCourses(
        Number(router.query.courseId),
        (result) => {
          if (result.courseDetails?.chapters.filter((c) => c.state === "ACTIVE").length === 0) {
            router.push("/courses");
          }
          setCourseData({
            ...courseData,
            name: result.courseDetails?.name,
            expiryInDays: result.courseDetails?.expiryInDays,
            chapters: result.courseDetails?.chapters.filter((c) => c.state === "ACTIVE"),
          });
          getProgressDetail();

          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);
  return (
    <Layout2>
      {!loading ? (
        <section className={styles.learn_course_page}>
          <div className={styles.learn_breadcrumb}>
            <Flex style={{ fontSize: 20 }}>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <Link href={`/courses/${router.query.courseId}`}> {courseData.name}</Link>
              <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div> Play
            </Flex>
          </div>

          <Flex align="start" justify="space-between">
            <div>
              <div className={styles.video_container}>
                {selectedLesson?.video?.videoUrl && !loadingLesson ? (
                  <>
                    {isCourseCompleted ? (
                      <div
                        className={styles.video_completed_screen}
                        style={{
                          position: "absolute",

                          width: 800,
                          height: 450,
                          outline: "none",
                          border: "none",
                        }}
                      >
                        <div>Congratulations! You have successfully completed the course</div>
                        <Space>
                          <Link href={"/dashboard"}>
                            <Button>Go Home</Button>
                          </Link>
                          <Button
                            type="primary"
                            onClick={() => {
                              getProgressDetail();
                              setCourseCompleted(false);
                            }}
                          >
                            Rewatch
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <iframe
                        style={{
                          position: "absolute",

                          width: 800,
                          height: 450,
                          outline: "none",
                          border: "none",
                        }}
                        src={selectedLesson.video.videoUrl}
                      ></iframe>
                    )}
                  </>
                ) : (
                  <Skeleton.Image
                    style={{
                      position: "absolute",
                      width: 800,
                      height: 450,
                    }}
                  />
                )}
              </div>

              <Tabs
                tabBarExtraContent={
                  <>
                    {!loadingBtn && isCompleted !== undefined ? (
                      <>
                        {isCompleted && (
                          <Button>
                            <Flex gap={5}>{SvgIcons.check} Completed </Flex>
                          </Button>
                        )}
                        {!isCompleted && (
                          <Button loading={loadingBtn} type="primary" onClick={onMarkAsCompleted}>
                            Mark as Completed
                          </Button>
                        )}
                      </>
                    ) : (
                      <Skeleton.Button />
                    )}
                  </>
                }
                tabBarGutter={40}
                className={styles.add_course_tabs}
                items={items}
              />
            </div>
            <div className={styles.lessons_container}>
              {lessonItems?.map((item, i) => {
                return (
                  <div key={i} className={styles.lessons_list_wrapper}>
                    <Collapse
                      defaultActiveKey={"1"}
                      size="small"
                      accordion={false}
                      activeKey={chapterId}
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
          </Flex>
        </section>
      ) : (
        <Spin fullscreen tip="Lessons loading..." />
      )}
    </Layout2>
  );
};

export default LearnCourse;
