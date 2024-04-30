import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/ProgramCoursesDetail.module.scss";
import { Button, Modal, Skeleton, Space, Tabs, TabsProps, message } from "antd";
import { useRouter } from "next/router";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { ICourseDetial } from "@/lib/types/program";
import { Role } from "@prisma/client";

const ProgramCoursesDetail: FC<{
  role: Role | undefined;
  programType: string;
  courseDetail: ICourseDetial[];
  authorId: number;
  programDetail: string;
  userId: number;
}> = ({ programType, courseDetail, role, programDetail, authorId, userId }) => {
  const router = useRouter();
  const programId = router.query.programId;
  const [panelActive, setPanel] = useState<number>(500000);
  const [reFresh, setRefresh] = useState<{
    loading: boolean;
    prgLoading: boolean;
    enrolled: boolean;
  }>({ loading: false, prgLoading: false, enrolled: false });

  const onUpdatePanel = (Value: string) => {
    if (Number(Value) === panelActive) {
      setPanel(5000);
    } else {
      setPanel(Number(Value));
    }
  };

  const onEnrollCourse = async () => {
    setRefresh({ ...reFresh, prgLoading: true });

    try {
      const res = await postFetch(
        {
          userId: userId,
          programId: Number(programId),
          programType: programType,
        },
        "/api/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.already) {
          setRefresh({
            ...reFresh,
            loading: !reFresh.loading,
            prgLoading: false,
          });
          router.replace(`/learn/program/${programId}`);
        } else {
          if (programType === "PAID") {
            Modal.info({
              title: "PAID Course not configured",
            });
            return;
          } else {
            Modal.info({
              title: result.message,
              onOk: () => {
                setRefresh({
                  ...reFresh,
                  loading: !reFresh.loading,
                  prgLoading: false,
                });
                router.replace(`/learn/program/${programId}`);
              },
            });
          }
        }
      } else {
        message.error(result.error);
        setRefresh({ ...reFresh, prgLoading: false });
      }
      setRefresh({ ...reFresh, prgLoading: false });
    } catch (err: any) {
      message.error("Error while enrolling course ", err?.message);
      setRefresh({ ...reFresh, prgLoading: false });
    }
  };
  const getEnrolledStatus = async (id: number) => {
    const res = await getFetch(`/api/course/get-enrolled/${id}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      setRefresh({ ...reFresh, enrolled: result.isEnrolled });
    }
  };
  useEffect(() => {
    programId && userId && getEnrolledStatus(Number(programId));
  }, [reFresh.loading, programId]);

  return (
    <section className={styles.coursesDetail}>
      <nav>
        <div className={styles.navWrapper}>
          <div className={`${styles.tabBarContainer} tabBarContainer`}>
            <Tabs
              tabBarStyle={{ marginLeft: -10, width: 940 }}
              tabBarExtraContent={
                <Space>
                  {authorId === userId && role === "AUTHOR" && (
                    <Button
                      className={styles.edit_Btn}
                      onClick={() => {
                        router.push(`/programs/${programId}/add-overview?edit=true`);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    className={styles.enrollBtn}
                    type="primary"
                    loading={reFresh.prgLoading}
                    onClick={() => {
                      onEnrollCourse();
                    }}
                  >
                    {reFresh.enrolled ? "Resume" : "Enroll to Learn"}
                    {!reFresh.enrolled && (
                      <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
                    )}
                  </Button>
                </Space>
              }
            >
              <Tabs.TabPane tab={"About"} key="1">
                <div className={styles.aboutProgramTabContentContainer}>
                  <h1>Descripton</h1>
                  <p>{programDetail}</p>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={"Courses"} key="2">
                <div className={styles.coursesDetailWrapper} style={{ marginTop: 10 }}>
                  {courseDetail.length >= 1 ? (
                    <Space align="center" direction="vertical" size={"large"}>
                      {courseDetail
                        .sort((a, b) => a.sequenceId - b.sequenceId)
                        .map((course, i) => {
                          return (
                            <>
                              {course.state === "ACTIVE" && <div className={styles.courseViewContainer} key={i}></div>}
                            </>
                          );
                        })}
                    </Space>
                  ) : (
                    <div className={styles.no_course_available}>
                      <div>No courses available</div>
                    </div>
                  )}
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default ProgramCoursesDetail;
