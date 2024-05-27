import SvgIcons from "@/components/SvgIcons";
import ProgramService from "@/services/ProgramService";
import { ChapterDetail, CourseLessons, VideoLesson } from "@/types/courses/Course";
import styles from "@/styles/LearnCourses.module.scss";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Flex,
  List,
  Segmented,
  Skeleton,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Tag,
  message,
} from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { IResourceDetail } from "@/lib/types/learn";
import { convertSecToHourandMin } from "@/pages/admin/content";
import QADiscssionTab from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { IResponse, getFetch, postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";
import Layout2 from "@/components/Layouts/Layout2";
import { ICourseProgressUpdateResponse } from "@/lib/types/program";
import { getUserEnrolledCoursesId } from "@/actions/getEnrollCourses";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { LoadingOutlined } from "@ant-design/icons";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
export interface ICertficateData {
  loading: boolean;
  certificateId: string;
  completed: boolean;
}

const LessonItem: FC<{
  title: string;
  keyValue: string;
  selectedLesson: IResourceDetail | undefined;
  resourceId: number;
  loading: boolean;
  refresh: boolean;
  icon: ReactNode;
}> = ({ title, loading, refresh, selectedLesson, keyValue, icon, resourceId }) => {
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
          className={`${selectedLesson && resourceId === selectedLesson.resourceId && styles.selectedLable} ${
            resourceId > 0 ? styles.lessonLabelContainer : styles.labelContainer
          }`}
        >
          <Flex justify="space-between" align="center">
            <div className={styles.title_container}>
              <Flex gap={10} align="center">
                {completed ? SvgIcons.check : icon}
                <div style={{ cursor: "auto" }}>{title}</div>
              </Flex>
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
  const [courseDetail, setCourseDetails] = useState<{ name: string; description: string }>();
  const [courseLessons, setCourseLessons] = useState<CourseLessons[]>([]);
  const [currentLesson, setCurrentLesson] = useState<{
    chapterName?: string;
    chapterSeq?: number;
    lesson?: VideoLesson;
  }>();

  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loadingLesson, setLessonLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<ICertficateData>();

  const onCreateCertificate = () => {
    setCertificateData({ ...certificateData, loading: true, completed: true } as ICertficateData);
    ProgramService.createCertificate(
      Number(router.query.courseId),
      (result) => {
        setCertificateData({
          certificateId: result.certificateIssueId,
          loading: false,
          completed: true,
        } as ICertficateData);
      },
      (error) => {
        setCertificateData({ ...certificateData, loading: false, completed: true } as ICertficateData);
      }
    );
  };

  const findAndSetCurrentLesson = (chapterLessons: CourseLessons[], markAsCompleted: boolean) => {
    chapterLessons.forEach((ch) => {
      let foundLesson = ch.lessons.find((l) => l.lessonId == Number(router.query.lessonId));
      if (foundLesson) {
        if (markAsCompleted) {
          foundLesson = {
            ...foundLesson,
            isWatched: true,
          };
        }
        setCurrentLesson({ chapterName: ch.chapterName, chapterSeq: ch.chapterSeq, lesson: foundLesson });
      }
    });
  };

  const updateChapterLesson = (chapterSeq: number, lessonId: number) => {
    let copyChapterLessons = [...courseLessons];
    const updatedChapters = copyChapterLessons.map((stateCh) => {
      if (stateCh.chapterSeq == chapterSeq) {
        const updatedLessons = stateCh.lessons.map((l) => {
          if (l.lessonId == lessonId) {
            return {
              ...l,
              isWatched: true,
            };
          } else return l;
        });
        return {
          ...stateCh,
          lessons: updatedLessons,
        };
      } else return stateCh;
    });

    setCourseLessons(updatedChapters);
  };

  const moveToNextLesson = (currentLessonId: number, lessonsCompleted: number, totalLessons: number) => {
    currentLesson?.chapterSeq &&
      currentLesson?.lesson &&
      updateChapterLesson(currentLesson.chapterSeq, currentLesson.lesson.lessonId);
    if (lessonsCompleted == totalLessons) {
      //go to certificate page
      findAndSetCurrentLesson(courseLessons, true);

      onCreateCertificate();
      console.log("go to certificate page");
    } else {
      let nextLessonId = 0;
      courseLessons.forEach((ch, chapterIndex) => {
        const currentLessonIndex = ch.lessons.findIndex((l) => l.lessonId == currentLessonId);
        if (currentLessonIndex >= 0 && currentLessonIndex != ch.lessons.length - 1) {
          nextLessonId = ch.lessons[currentLessonIndex + 1].lessonId;
        } else if (currentLessonIndex >= 0 && currentLessonIndex == ch.lessons.length - 1) {
          if (chapterIndex == courseLessons.length - 1 && lessonsCompleted == totalLessons) {
            //move to complete course
            console.log(`Don't go any where but update the current lesson state`);
            findAndSetCurrentLesson(courseLessons, true);
          } else if (chapterIndex == courseLessons.length - 1 && lessonsCompleted < totalLessons) {
            console.log(`Other lessons are still pending, but update the current lesson state`);
            findAndSetCurrentLesson(courseLessons, true);
          } else if (chapterIndex < courseLessons.length - 1) {
            console.log(`Move to the next lesson`);
            const nextChapter = courseLessons[chapterIndex + 1];
            nextLessonId = nextChapter.lessons[0].lessonId;
          }
        }
      });

      if (nextLessonId > 0) {
        router.push(`/courses/${router.query.courseId}/lesson/${nextLessonId}`);
      }
    }
  };

  useEffect(() => {
    router.query.courseId &&
      ProgramService.getCourseLessons(
        Number(router.query.courseId),
        (result) => {
          setCourseLessons(result.lessons);
          setLessonLoading(false);
          setCourseDetails({ name: result.course.name, description: result.course.description });
          findAndSetCurrentLesson(result.lessons, false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);

  useEffect(() => {
    if (router.query.lessonId && courseLessons.length > 0) {
      findAndSetCurrentLesson(courseLessons, false);
    }
  }, [router.query.lessonId]);

  const lessonItems = courseLessons.map((content, index) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      totalTime = totalTime + data.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    const videoLessons = (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={content.lessons}
        renderItem={(item, index) => (
          <List.Item
            style={{
              // border: "none",
              padding: "8px 8px 8px 16px",
            }}
            className={
              Number(router.query.lessonId) == item.lessonId
                ? `${styles.lesson__selected}`
                : `${styles.lesson__default}`
            }
          >
            <Link href={`/courses/${router.query.courseId}/lesson/${item.lessonId}`} className={styles.lesson__item}>
              <div style={{ display: "flex" }}>
                <i style={{ height: 20 }}>{item.isWatched ? SvgIcons.check : SvgIcons.playBtn}</i>
                <p style={{ marginBottom: 0, marginLeft: 5 }}>{item.title}</p>
              </div>

              <div>
                <Tag style={{ marginRight: 0 }} className={styles.time_tag}>
                  {convertSecToHourandMin(item.videoDuration)}
                </Tag>
              </div>
            </Link>
          </List.Item>
        )}
      />
    );
    return {
      key: `${content.chapterSeq}`,
      label: (
        <LessonItem
          title={content.chapterName}
          icon={SvgIcons.folder}
          loading={loading}
          resourceId={0}
          selectedLesson={undefined}
          keyValue={`${content.chapterSeq}`}
          refresh={refresh}
        />
      ),
      children: videoLessons,
      showArrow: false,
    };
  });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "About",
      children: courseDetail?.description,
    },
    {
      key: "2",
      label: "Q & A",

      children: session && currentLesson?.lesson && (
        <QADiscssionTab loading={loading} resourceId={currentLesson?.lesson?.lessonId} userId={session?.id} />
      ),
    },
  ];

  const onMarkAsCompleted = async () => {
    try {
      const res = await postFetch(
        {
          courseId: Number(router.query.courseId),
          resourceId: Number(router.query.lessonId),
        },
        `/api/v1/course/${router.query.courseId}/update-progress`
      );
      const result = (await res.json()) as ICourseProgressUpdateResponse;
      if (res.ok && result.success) {
        messageApi.success(result.message);
        moveToNextLesson(Number(router.query.lessonId), result.progress.lessonsCompleted, result.progress.totalLessons);
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
          <Flex align="start" justify="space-between">
            <div className={styles.lessons_video_player_wrapper}>
              <div className={styles.learn_breadcrumb}>
                <Flex style={{ fontSize: 20 }}>
                  <Breadcrumb
                    items={[
                      {
                        title: <Link href={`/courses`}>Courses</Link>,
                      },
                      {
                        title: courseDetail?.name,
                      },
                      {
                        title: currentLesson?.chapterName,
                      },
                      {
                        title: currentLesson?.lesson?.title,
                      },
                    ]}
                  />
                </Flex>
              </div>
              {!certificateData?.completed ? (
                <div className={styles.video_container}>
                  {currentLesson?.lesson?.videoUrl && !loadingLesson ? (
                    <>
                      <iframe
                        allowFullScreen
                        style={{
                          position: "absolute",

                          width: "100%",
                          height: "100%",
                          outline: "none",
                          border: "none",
                        }}
                        src={currentLesson?.lesson?.videoUrl}
                      ></iframe>
                    </>
                  ) : (
                    <Skeleton.Image
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.certificatePage}>
                    {certificateData?.loading ? (
                      <>
                        <SpinLoader />

                        <p> Generating Certificate</p>
                      </>
                    ) : (
                      <div className={styles.certificateBtn}>
                        <h1>You have successfully completed this course</h1>
                        <Button
                          type="primary"
                          onClick={() => {
                            router.push(
                              `/courses/${router.query.courseId}/certificate/${certificateData?.certificateId}`
                            );
                          }}
                        >
                          View Certificate
                          {SvgIcons.arrowRight}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Tabs
                style={{
                  padding: "0 0 10px",
                }}
                tabBarExtraContent={
                  <>
                    {currentLesson?.lesson ? (
                      <>
                        {currentLesson?.lesson?.isWatched && (
                          <Button>
                            <Flex gap={5}>{SvgIcons.check} Completed </Flex>
                          </Button>
                        )}
                        {!currentLesson?.lesson?.isWatched && (
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
            <div className={styles.lesson_wrapper}>
              <div className={styles.lessons_container}>
                <h2>Course Content</h2>
                {lessonItems?.map((item, i) => {
                  return (
                    <div key={i} className={styles.lessons_list_wrapper}>
                      <Collapse
                        defaultActiveKey={`${currentLesson?.chapterSeq}`}
                        size="small"
                        bordered={false}
                        accordion={false}
                        activeKey={courseLessons.map((ch) => ch.chapterSeq.toString())}
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
            </div>
          </Flex>
        </section>
      ) : (
        <SpinLoader />
      )}
    </Layout2>
  );
};

export default LessonPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isEnrolled = await getUserEnrolledCoursesId(Number(params.courseId), user?.id);
    if (!isEnrolled) {
      return {
        redirect: {
          permanent: false,
          message: "you are not enrolled in this course",
          destination: "/unauthorized?from=lesson",
        },
      };
    }
  }
  return { props: {} };
};
