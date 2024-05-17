import Layout2 from "@/components/Layout2/Layout2";
import SvgIcons from "@/components/SvgIcons";
import ProgramService from "@/services/ProgramService";
import { ChapterDetail, CourseLessons } from "@/types/courses/Course";
import styles from "@/styles/LearnCourses.module.scss";
import { Button, Collapse, Flex, Skeleton, Space, Spin, Tabs, TabsProps, Tag, message } from "antd";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { IResourceDetail } from "@/lib/types/learn";
import { convertSecToHourandMin } from "@/pages/admin/content";
import QADiscssionTab from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { IResponse, getFetch, postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";

const LessonItem: FC<{
  title: string;
  time: string;
  keyValue: string;
  selectedLesson: IResourceDetail | undefined;
  onSelectResource: (resourceId: number) => void;
  setChapterId: (value: number) => void;
  resourceId: number;
  loading: boolean;
  chapterId: number;
  refresh: boolean;
  currentLessonId?: number;
  icon: ReactNode;
}> = ({
  title,
  time,
  onSelectResource,
  loading,
  refresh,
  selectedLesson,
  setChapterId,
  currentLessonId,
  keyValue,
  icon,
  resourceId,
  chapterId,
}) => {
    const [completed, setCompleted] = useState<boolean>();

    return (
      <>
        {loading ? (
          <Skeleton.Button />
        ) : (
          <div
            style={{
              padding: resourceId > 0 ? "5px 0px" : 0,
              paddingLeft: resourceId > 0 ? "20px" : 0,
            }}
            className={`${selectedLesson && resourceId === selectedLesson.resourceId && styles.selectedLable} ${resourceId > 0 ? styles.lessonLabelContainer : styles.labelContainer
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
              <div className={styles.timeContainer}>
                <Tag className={styles.time_tag}>{time}</Tag>
              </div>
            </Flex>
            <div className={styles.selected_bar}></div>
          </div>
        )}
      </>
    );
  };


const LessonPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [courseLessons, setCourseLessons] = useState<CourseLessons[]>([])
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
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [chapterId, setChapterId] = useState<number>();
  const [currentLessonId, serCurrentLessonId] = useState<number>();

  const [loadingLesson, setLessonLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [isCompleted, setCompleted] = useState<boolean>();
  const [isCourseCompleted, setCourseCompleted] = useState<boolean>();

  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    router.query.courseId &&
      ProgramService.getCourseLessons(
        Number(router.query.courseId),
        (result) => {
          setCourseLessons(result.lessons)
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);

  const checkIsCompleted = async (resourceId: number) => {
    setLoadingBtn(true);
    const res = await getFetch(`/api/progress/get/${resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setCompleted(result.isCompleted);
    }
    ProgramService.getProgress(
      Number(router.query.courseId),
      (result) => {
        serCurrentLessonId(result.latestProgress.nextLesson.resourceId);
      },
      (error) => { }
    );
    setLoadingBtn(false);

    return result.isCompleted;
  };

  const selectResource = (resourceId: number) => {
    setSelectedLesson(
      courseData.chapters
        .find((chapter) => chapter.chapterId === chapterId)
        ?.resource.find((data) => data.resourceId === resourceId)
    );
  };

  const onSelectResource = async (resourceId: number) => {
    const isCompleted = await checkIsCompleted(resourceId);

    if (selectedLesson?.resourceId === resourceId) {
      setLessonLoading(true);

      selectResource(resourceId);
      setLessonLoading(false);
    } else {
      if (isCompleted) {
        setLessonLoading(true);

        selectResource(resourceId);
        setLessonLoading(false);
      } else if (!isCompleted) {
        getProgressDetail();

        currentLessonId !== resourceId && messageApi.error("First complete the previous lessons");
        // getProgressDetail();
      }
    }
    setLessonLoading(false);
  };

  const lessonItems = courseLessons.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      totalTime = totalTime + data.video?.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${content.chapterId}`,
      label: (
        <LessonItem
          title={content.name}
          icon={SvgIcons.folder}
          time={duration}
          onSelectResource={() => { }}
          loading={loading}
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
              <LessonItem
                title={res.name}
                icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
                time={convertSecToHourandMin(res.video?.videoDuration)}
                onSelectResource={onSelectResource}
                resourceId={res.resourceId}
                setChapterId={() => { }}
                selectedLesson={selectedLesson}
                currentLessonId={currentLessonId}
                loading={loading}
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
        <QADiscssionTab loading={loading} resourceId={selectedLesson?.resourceId} userId={session?.id} />
      ),
    },
  ];

  const getProgressDetail = () => {
    ProgramService.getProgress(
      Number(router.query.courseId),
      (result) => {
        setSelectedLesson(result.latestProgress.nextLesson);
        setChapterId(result.latestProgress.nextLesson?.chapterId);

        serCurrentLessonId(result.latestProgress.nextLesson.resourceId);
        setRefresh(!refresh);
      },
      (error) => { }
    );
  };

  const onMarkAsCompleted = async () => {
    try {
      if (isCompleted) return;

      const res = await postFetch(
        {
          chapterId: selectedLesson?.chapterId,
          courseId: Number(router.query.courseId),
          sequenceId: selectedLesson?.sequenceId,
          resourceId: selectedLesson?.resourceId,
        },
        `/api/progress/create`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        messageApi.success(result.message);
        setRefresh(!refresh);
        getProgressDetail();
        ProgramService.getProgress(
          Number(router.query.courseId),
          (result) => {
            setCourseCompleted(result.latestProgress.completed);
          },
          (error) => { }
        );
      } else {
        messageApi.error(result.error);
      }
    } catch (err) {
      messageApi.error(appConstant.cmnErrorMsg);
    }
  };

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
            <div className={styles.lessons_video_player_wrapper}>
              <div className={styles.video_container}>
                {selectedLesson?.video?.videoUrl && !loadingLesson ? (
                  <>
                    <iframe
                      allowFullScreen
                      style={{
                        position: "absolute",

                        width: 800,
                        height: 450,
                        outline: "none",
                        border: "none",
                      }}
                      src={selectedLesson.video.videoUrl}
                    ></iframe>
                  </>
                ) : (
                  <Skeleton.Image
                    style={{
                      position: "absolute",
                      width: 800,
                      height: 450,
                      top: 0,
                    }}
                  />
                )}
              </div>

              <Tabs
                style={{
                  padding: "0px 20px 10px",
                  maxWidth: "800px",
                }}
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

export default LessonPage;
