import React, { FC } from "react";
import styles from "../../styles/ProgramCourse.module.scss";
import { Button, Collapse, Divider, Dropdown, MenuProps, Popconfirm, Space, Tag, message } from "antd";
import { useRouter } from "next/router";
import { ArrowUpOutlined, CaretDownFilled, CaretUpFilled, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ICourseDetial } from "@/lib/types/program";

import { useSession } from "next-auth/react";
import { postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";

const ProgramCourse: FC<{
  courses: [
    {
      description: string;
      state: string;
      about: string;
      durationInMonths: number;
      courseId: number;
      authorId: number;
      programId: number;
      tags: string[];
      name: string;
      chapter: [
        {
          chapterId: number;
          courseId: number;
          createdAt: string;
          description: string;
          isActive: boolean;
          name: string;
        }
      ];
    }
  ];
  edit: boolean;
  onUpdatePanel: (Value: string) => void;
  onUpdateProgramState: (key: string, value: string) => void;
  panelActive: number;
  courseList: ICourseDetial[];
  deleteCourse: (courseId: number) => void;
}> = ({ edit, courses, onUpdatePanel, panelActive, onUpdateProgramState, courseList, deleteCourse }) => {
  const { Panel } = Collapse;
  const router = useRouter();
  const { data: user } = useSession();
  const items = [
    {
      key: "1",
      label: "Publish",
    },
  ];

  const onUpdateCourse = async (state: string, courseId: number) => {
    const res = await postFetch(
      {
        courseId: Number(courseId),
        state: state,
      },
      "/api/course/update"
    );
    const result = await res.json();
    if (res.ok) {
      message.success(result.message);
      router.reload();
    } else {
      message.error(result.error);
    }
  };

  return (
    <>
      {edit ? (
        <section className={`${styles.programCourse} progamCourse`}>
          <div className={styles.programCourseDetail}>
            {courseList.length === 0 ? (
              "No Course Available"
            ) : (
              <h1 className={styles.programH1}>{edit ? "Courses created" : "Courses in the Program"}</h1>
            )}

            <div className={styles.courseListWrapper}>
              <Collapse accordion className="collapseContainer">
                {courseList.map((courseItem, i) => {
                  return (
                    <>
                      <Panel
                        className={styles.panelContainer}
                        showArrow={false}
                        header={
                          <div
                            key={i}
                            className={styles.PanelHeader}
                            onClick={() => (i !== panelActive ? onUpdatePanel(`${i}`) : onUpdatePanel(`999`))}
                          >
                            <div>
                              <h4>{courseItem.name}</h4>
                              <div>
                                {courseItem.durationInMonths} months{" "}
                                <span className={styles.skillWrapper}>
                                  &nbsp;{" "}
                                  {courseItem.skills?.map((tag, i) => {
                                    return <Tag key={i}>{tag} </Tag>;
                                  })}
                                </span>
                              </div>
                            </div>
                            <div>
                              {courseItem.state === "DRAFT" && <Tag>{courseItem.state}</Tag>}
                              <CaretDownFilled
                                className={panelActive === i ? styles.panelArrowActive : styles.panelArrowInActive}
                                style={{ fontSize: 24 }}
                                rev={undefined}
                              />
                            </div>
                          </div>
                        }
                        key={i}
                        children={
                          <div className={styles.courseChapterWrapper}>
                            <p>{courseItem.description}</p>

                            <div className={styles.chapterListContainer}>
                              {courseItem.chapter?.map((chapter, i) => {
                                return (
                                  <div key={i} className={styles.chapterList}>
                                    <div>
                                      <img src="" alt="" /> <span>Chapter {i + 1}</span>
                                    </div>
                                    <h4>{chapter.name}</h4>
                                    <p>{chapter.description}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        }
                      />
                    </>
                  );
                })}
              </Collapse>
            </div>
          </div>
        </section>
      ) : (
        <section className={`${styles.programCourse} progamCourse`}>
          <div className={styles.programCourseDetail}>
            <h1 className={styles.programHeader}>
              {courses.length > 0 ? "Courses in the Program" : "No Courses Available"}
            </h1>
            <div className={styles.courseListWrapper}>
              <Collapse accordion className="collapseContainer">
                {courses.map((courseItem, i) => {
                  return (
                    <>
                      {router.query.edit === "true" ? (
                        <Panel
                          showArrow={false}
                          className={styles.panelContainer}
                          header={
                            <div
                              key={i}
                              className={styles.PanelHeader}
                              onClick={() => (i !== panelActive ? onUpdatePanel(`${i}`) : onUpdatePanel(`999`))}
                            >
                              <div>
                                <h4 style={{ fontSize: 20 }}>{courseItem.name}</h4>
                                <div style={{ fontSize: 15 }}>
                                  {courseItem.durationInMonths} months
                                  <span className={styles.skillWrapper}>
                                    &nbsp;{" "}
                                    {courseItem.tags?.map((tag, i) => {
                                      return <Tag key={i}>{tag} </Tag>;
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {courseItem.state === "DRAFT" && user?.id === courseItem?.authorId && (
                                  <Tag>{courseItem.state}</Tag>
                                )}
                                <CaretDownFilled
                                  className={panelActive === i ? styles.panelArrowActive : styles.panelArrowInActive}
                                  style={{ fontSize: 24 }}
                                  rev={undefined}
                                />
                              </div>
                            </div>
                          }
                          key={i}
                          children={
                            <div>
                              <div className={styles.courseChapterWrapper}>
                                <p>{courseItem.description}</p>
                                <div className={styles.chapterListContainer}>
                                  {courseItem.chapter?.map((chapter, i) => {
                                    return (
                                      <div key={i} className={styles.chapterList}>
                                        <div>
                                          <img src="/img/program/chapter.png" alt="" /> <span>Chapter {i + 1}</span>
                                        </div>
                                        <h1></h1>
                                        <h4>{chapter.name}</h4>
                                        <p>{chapter.description}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              {user?.id === courseItem?.authorId && courseItem.state === "DRAFT" ? (
                                <div className={styles.saveCourseContainer}>
                                  <Dropdown.Button
                                    onClick={() => {
                                      onUpdateCourse("ACTIVE", courseItem.courseId);
                                    }}
                                    menu={{
                                      items: [
                                        {
                                          key: 1,
                                          label: "Edit",
                                          onClick: () => {
                                            router.push(
                                              `/programs/${router.query.programId}/course/${courseItem.courseId}`
                                            );
                                          },
                                        },
                                      ],
                                    }}
                                  >
                                    Publish
                                  </Dropdown.Button>
                                </div>
                              ) : (
                                <div className={styles.saveCourseContainer}>
                                  <Dropdown.Button
                                    type="primary"
                                    onClick={() => {
                                      router.push(`/programs/${router.query.programId}/course/${courseItem.courseId}`);
                                    }}
                                    menu={{
                                      items: [
                                        {
                                          key: "1",
                                          label: (
                                            <Popconfirm
                                              title="Delete the resource"
                                              description="Are you sure to delete this resource?"
                                              onConfirm={() => {
                                                deleteCourse(courseItem.courseId);
                                              }}
                                              okText="Yes"
                                              cancelText="No"
                                            >
                                              Delete
                                            </Popconfirm>
                                          ),
                                        },
                                        {
                                          key: "2",
                                          label: "Save as Draft",
                                          onClick: () => {
                                            onUpdateCourse("DRAFT", courseItem.courseId);
                                          },
                                        },
                                      ],
                                    }}
                                  >
                                    Edit
                                  </Dropdown.Button>
                                </div>
                              )}
                            </div>
                          }
                        />
                      ) : (
                        <>
                          {courseItem.state === "ACTIVE" && (
                            <Panel
                              style={{
                                marginBottom: 20,
                                width: 937,
                                marginLeft: 16,
                              }}
                              showArrow={false}
                              header={
                                <div
                                  key={i}
                                  className={styles.PanelHeader}
                                  onClick={() => (i !== panelActive ? onUpdatePanel(`${i}`) : onUpdatePanel(`999`))}
                                >
                                  <div>
                                    <h4 style={{ fontSize: 20 }}>{courseItem.name}</h4>
                                    <div style={{ fontSize: 15 }}>
                                      {courseItem.durationInMonths} months
                                      <span className={styles.skillWrapper}>
                                        &nbsp;{" "}
                                        {courseItem.tags?.map((tag, i) => {
                                          return <Tag key={i}>{tag} </Tag>;
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <CaretDownFilled
                                      className={
                                        panelActive === i ? styles.panelArrowActive : styles.panelArrowInActive
                                      }
                                      style={{ fontSize: 24 }}
                                      rev={undefined}
                                    />
                                  </div>
                                </div>
                              }
                              key={i}
                              children={
                                <div className={styles.courseChapterWrapper}>
                                  <p>{courseItem.description}</p>
                                  <div className={styles.chapterListContainer}>
                                    {courseItem.chapter?.map((chapter, i) => {
                                      return (
                                        <div key={i} className={styles.chapterList}>
                                          <div>
                                            <img src="/img/program/chapter.png" alt="" /> <span>Chapter {i + 1}</span>
                                          </div>
                                          <h4>{chapter.name}</h4>
                                          <p>{chapter.description}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              }
                            />
                          )}
                        </>
                      )}
                    </>
                  );
                })}
              </Collapse>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProgramCourse;
