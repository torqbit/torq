import {
  Button,
  Collapse,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Popconfirm,
  Popover,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/EditCourse.module.scss";
import { CheckOutlined, DeleteFilled, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import appConstant from "@/services/appConstant";
import ChapterForm from "./AddChapter";
import { IResponse, getFetch, postFetch } from "@/services/request";
import SpinLoader from "../SpinLoader/SpinLoader";
import { useSession } from "next-auth/react";
import useModal from "antd/es/modal/useModal";

const EditCourse: FC<{
  loading: boolean;
  setLoading: (value: boolean) => void;
}> = ({ loading, setLoading }) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef>(null);
  const router = useRouter();
  const courseId = router.query.courseId;
  const courseTags = appConstant.courseTags;

  const [courseState, setCourseState] = useState<{
    onEdit: string;
    drawer: boolean;
    chapterDescription: string;
    about: string;
    authorId: number;
    contentType: string;
    chapterName: string;
    sequenceId: number;
    chapter: [
      {
        chapterId: number | undefined;
        courseId: number | undefined;
        description: string;
        name: string;
        sequenceId: number;

        resources: [
          {
            resourceTitle: string;
            resourceDescripton: string;
            sequenceId: number;

            contentType: string;
            videoDuration: number;
            videoUrl: string;
            submitDay: number;
            languages: string[];
          }
        ];
      }
    ];

    courseId: number;
    coursePrice: number;
    courseType: string;
    createdAt: string;
    description: string;
    durationInMonths: number;
    name: string;
    programId: number;
    state: string;
    tagName: string;
    tags: string[];
  }>();
  const { data: user } = useSession();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modal, contextWrapper] = Modal.useModal();

  const [assignmentFileName, setAssignmentFileName] = useState<string>("");

  const [addChapter, setAddChapter] = useState<any>();
  // const [contentType, setContentType] = useState<string>("Video");
  const onSelectTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseState({ ...courseState, tagName: event.target.value } as any);
  };
  let index = 0;
  const addTag = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!courseState?.tagName) return message.info("Please enter any tag name");
    e.preventDefault();

    courseTags.push(courseState.tagName);
    setCourseState({ ...courseState, tagName: "" } as any);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const setContent = (v: string) => {
    v === "Video"
      ? setCourseState({ ...courseState, contentType: v } as any)
      : setCourseState({ ...courseState, contentType: v } as any);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   setLoading(true);

  //   courseId &&
  //     ProgramService.getCourses(
  //       Number(router.query.programId),
  //       Number(courseId),
  //       (result) => {
  //         // setCourseState(result.getCourse as any);

  //         setLoading(false);
  //       },
  //       (error) => {
  //         // setLoading(false);

  //         // modal.error({
  //         //   title: "Course Not Found",
  //         //   onOk: () => {
  //         //     router.push(`/programs/overview/${router.query.programId}`);
  //         //   },
  //         // });
  //       }
  //     );
  // }, [courseId, refresh]);
  const onUpdateEditState = (value: string) => {
    setCourseState({ ...courseState, onEdit: value } as any);
  };

  const onClose = () => {
    setCourseState({ ...courseState, drawer: false } as any);
    router.query.edit && router.push(`/programs/${router.query.programId}/course/${router.query.courseId}`);
  };
  const onAddChapter = (
    formData: {
      chapterName: string;
      chapterDescription: string;
      resourceDescripton: string;
      resourceTitle: string;
      resource_type: string;
      videoDuration: string;
      videoUrl: string;
      submitDay: number;
      assignment_duration: string;
      assign_lang: string[];
    },
    sequenceId: number
  ) => {
    if (courseState?.chapterName !== "New Chapter") {
      if (courseState?.contentType === "Assignment") {
        addChapter?.resources && addChapter?.resources.length >= 1 && addChapter?.resources[0].resourceTitle
          ? setAddChapter({
              courseId: undefined,
              chapterId: undefined,
              name: courseState?.chapterName,
              description: formData.chapterDescription,
              sequenceId: courseState ? courseState?.chapter?.length + 1 : 1,
              resources: [
                ...addChapter?.resources,
                {
                  videoUrl: "",
                  content: assignmentFileName,
                  sequenceId: router.query.edit === "chapter" ? sequenceId : addChapter.resources.length + 1,
                  videoDuration: 0,
                  contentType: courseState?.contentType.toString(),
                  resourceTitle: formData.resourceTitle,
                  resourceDescripton: formData.resourceDescripton,
                  submitDay: formData.submitDay,
                  languages: formData.assign_lang,
                },
              ],
            })
          : setAddChapter({
              courseId: undefined,
              chapterId: undefined,
              name: courseState?.chapterName,
              description: formData.chapterDescription,
              sequenceId: courseState ? courseState?.chapter?.length + 1 : 1,
              resources: [
                {
                  videoUrl: "",
                  sequenceId: router.query.edit === "chapter" ? sequenceId : 1,
                  videoDuration: 0,
                  contentType: courseState?.contentType?.toString(),
                  resourceTitle: formData.resourceTitle,
                  resourceDescripton: formData.resourceDescripton,
                  submitDay: formData.submitDay,
                  languages: formData.assign_lang,
                  content: assignmentFileName,
                },
              ],
            });
      } else {
        addChapter?.resources && addChapter?.resources.length >= 1 && addChapter?.resources[0].resourceTitle
          ? setAddChapter({
              courseId: undefined,
              chapterId: undefined,
              name: courseState?.chapterName as any,
              description: formData.chapterDescription,
              sequenceId: courseState ? courseState?.chapter?.length + 1 : 1,
              resources: [
                ...addChapter?.resources,
                {
                  sequenceId: router.query.edit === "chapter" ? sequenceId : addChapter.resources.length + 1,
                  videoUrl: formData.videoUrl,
                  videoDuration: Number(formData.videoDuration),
                  contentType: courseState?.contentType?.toString()
                    ? courseState?.contentType?.toString()
                    : ("Video" as any),
                  resourceTitle: formData.resourceTitle,
                  resourceDescripton: formData.resourceDescripton,
                  content: "",
                  submitDay: 0,
                  languages: [],
                },
              ],
            })
          : setAddChapter({
              sequenceId: courseState ? courseState?.chapter?.length + 1 : 1,
              courseId: undefined,
              chapterId: undefined,
              name: courseState?.chapterName as any,
              description: formData.chapterDescription,
              resources: [
                {
                  sequenceId: router.query.edit === "chapter" ? sequenceId : 1,
                  videoUrl: formData.videoUrl,
                  videoDuration: Number(formData.videoDuration),
                  contentType: courseState?.contentType?.toString()
                    ? courseState?.contentType?.toString()
                    : ("Video" as any),
                  resourceTitle: formData.resourceTitle,
                  resourceDescripton: formData.resourceDescripton,
                  submitDay: 0,
                  languages: [],
                  content: "",
                },
              ],
            });
      }
      form.resetFields([
        "videoUrl",
        "videoDuration",
        "contentType",
        "resourceTitle",
        "resourceDescripton",
        "submitDay",
        "assign_lang",
        "assignment_duration",
      ]);
    } else {
      message.warning({
        content: "Please fill the chapter name first",
      });
    }
  };

  const updateChapterName = (key: string, value: string) => {
    key === "chapterName" && setCourseState({ ...courseState, chapterName: value } as any);
    key === "drawer" && setCourseState({ ...courseState, drawer: false } as any);
    key === "chapterDescription" && setCourseState({ ...courseState, chapterDescription: value } as any);
  };

  const onChapterSave = () => {
    setTimeout(() => {
      setCourseState({
        ...courseState,
        chapterName: "",
        drawer: false,
        chapter: [
          ...(courseState?.chapter as any),
          {
            courseId: Number(courseId),
            description: addChapter?.description,
            name: addChapter?.name,
            sequenceId: courseState && courseState?.chapter?.length + 1,
            resources: addChapter?.resources,
          },
        ],
      } as any);
    }, 100);

    setTimeout(() => {
      setAddChapter({
        courseId: undefined,
        chapterId: undefined,
        name: "",
        description: "",
        sequenceId: 0,
        resources: [
          {
            videoUrl: "",
            videoDuration: 0,
            contentType: "Video",
            resourceTitle: "",
            resourceDescripton: "",
            submitDay: 0,
            languages: [],
            sequenceId: 0,
            content: "",
          },
        ],
      });
    }, 200);
  };

  const onUpdateCourse = async (state: string) => {
    setLoading(true);
    const res = await postFetch(
      {
        name: courseState?.name,
        description: courseState?.description,
        courseId: Number(courseId),
        tags: courseState?.tags,
        durationInMonths: courseState?.durationInMonths,
        state: state,
      },
      "/api/course/update"
    );
    const result = await res.json();
    if (res.ok) {
      // {
      //   courseState?.chapter &&
      //     courseState?.chapter.length > 0 &&
      //     courseState?.chapter.map((chapter) => {
      //       ProgramService.createChapter(
      //         Number(courseId),
      //         chapter?.name,
      //         chapter?.description,
      //         chapter?.resources,
      //         chapter.sequenceId,
      //         (result) => {
      //           setLoading(false);
      //         },
      //         (error) => {
      //           setLoading(false);
      //         }
      //       );
      //     });
      // }

      message.success(result.message);
      router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
      setLoading(false);
    } else {
      message.error(result.error);
      setLoading(false);
    }
  };

  const onDeleteChapter = async (chapterId: number | undefined) => {
    setLoading(true);
    const deleteChap = await getFetch(`/api/chapter/delete/${chapterId}`);
    const result = (await deleteChap.json()) as IResponse;
    if (deleteChap.ok && deleteChap.status === 200) {
      message.success(result.message);

      setLoading(false);
      setRefresh(!refresh);
    } else {
      message.error(result.error);
    }
  };

  const onEditChapter = (chapter: any) => {
    setCourseState({
      ...courseState,
      drawer: true,
      chapterDescription: chapter?.description,
      chapterName: chapter.name,
    } as any);

    router.replace(`/programs/${router.query.programId}/course/${courseId}?edit=chapter&id=${chapter.chapterId}`);
  };

  // const onUpdateChapter = () => {
  //   ProgramService.updateChapter(
  //     Number(router.query.id),
  //     courseState?.chapterName,
  //     courseState?.chapterDescription,

  //     (result) => {
  //       if (addChapter?.resources && addChapter.resources.length >= 1 && addChapter.resources[0].resourceTitle) {
  //         addChapter.resources.map(async (r) => {
  //           const res = await postFetch(
  //             {
  //               name: r.resourceTitle,
  //               description: r.resourceDescripton,
  //               videoDuration: Number(r.videoDuration),
  //               contentType: r.contentType,
  //               thumbnail: r.videoUrl,
  //               userId: user?.id,
  //               courseId: Number(router.query.courseId),
  //               chapterId: Number(router.query.id),
  //               daysToSubmit: Number(r.submitDay),
  //               assignmentLang: r.languages,
  //               sequenceId: r.sequenceId,
  //               content: r.content,
  //             },
  //             "/api/resource/create"
  //           );
  //           const resResult = (await res.json()) as IResponse;

  //           if (res.ok && res.status === 200) {
  //             message.success(result.message);
  //           } else {
  //             message.error(resResult.error);
  //           }
  //         });
  //       }

  //       message.info(result.message);

  //       router.replace(`/programs/${router.query.programId}/course/${courseId}`);
  //       setTimeout(() => {
  //         setRefresh(!refresh);
  //       }, 100);

  //       setTimeout(() => {
  //         setAddChapter({
  //           courseId: undefined,
  //           chapterId: undefined,
  //           name: "",
  //           description: "",
  //           sequenceId: 0,

  //           resources: [
  //             {
  //               videoUrl: "",
  //               sequenceId: 0,
  //               content: "",
  //               videoDuration: 0,
  //               contentType: "Video",
  //               resourceTitle: "",
  //               resourceDescripton: "",
  //               submitDay: 0,
  //               languages: [],
  //             },
  //           ],
  //         });
  //       }, 200);
  //     },
  //     (error) => {}
  //   );

  //   setCourseState({
  //     ...courseState,
  //     chapterName: "",
  //     chapterDescription: "",
  //     onEdit: "",
  //     drawer: false,
  //   } as any);
  // };
  return (
    <section className={styles.editCourseWrapper}>
      {contextWrapper}
      <div className={styles.courseListWrapper}>
        <h1>Add Courses</h1>
        {loading || !courseState ? (
          <SpinLoader />
        ) : (
          <>
            <Form form={form} layout="vertical">
              <Collapse activeKey={0} className="collapseContainer">
                <Panel
                  className={styles.panelContainer}
                  showArrow={false}
                  header={
                    <div className={styles.PanelHeader}>
                      <div>
                        {courseState?.onEdit === "name" ? (
                          <Form.Item required noStyle>
                            <Input
                              defaultValue={courseState?.name}
                              required
                              onChange={(e) => {
                                setCourseState({
                                  ...courseState,
                                  name: e.currentTarget.value,
                                });
                              }}
                              placeholder="Add course name"
                              suffix={
                                <CheckOutlined
                                  onClick={() => {
                                    onUpdateEditState("");
                                  }}
                                  rev={undefined}
                                />
                              }
                            />
                          </Form.Item>
                        ) : (
                          <div className={styles.editPanelHeader}>
                            <h4>{courseState?.name}</h4>

                            <Button type="default" onClick={() => showDrawer()}>
                              Edit
                            </Button>
                          </div>
                        )}
                        <div className={styles.durationAndSkill}>
                          {courseState?.onEdit === "duration" ? (
                            <Form.Item required noStyle>
                              <InputNumber
                                required
                                defaultValue={courseState?.durationInMonths}
                                onChange={(e) => {
                                  setCourseState({
                                    ...courseState,
                                    durationInMonths: Number(e),
                                  });
                                }}
                                placeholder="Add duration in months"
                              />
                            </Form.Item>
                          ) : (
                            <h4>{courseState?.durationInMonths} months</h4>
                          )}
                          <span className={styles.skillWrapper}>
                            {courseState?.onEdit === "skill" ? (
                              <Form.Item
                                noStyle
                                name="course_tags"
                                rules={[
                                  {
                                    required: true,
                                    message: "Required Tags",
                                  },
                                ]}
                              >
                                <Select
                                  mode="tags"
                                  style={{ width: "200px" }}
                                  placeholder="Add Skills"
                                  onChange={(value) => {
                                    setCourseState({
                                      ...courseState,
                                      tags: value,
                                    });
                                  }}
                                  options={courseTags?.map((tag) => ({
                                    label: tag,
                                    value: tag,
                                  }))}
                                />{" "}
                              </Form.Item>
                            ) : (
                              <span>
                                <span>
                                  {courseState?.tags?.map((tag, i) => {
                                    return (
                                      <Tag className={styles.skillTags} key={i}>
                                        {tag}
                                      </Tag>
                                    );
                                  })}
                                </span>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                  children={
                    <div>
                      {" "}
                      <div className={styles.courseChapterWrapper}>
                        {courseState?.onEdit === "description" ? (
                          <Form.Item required>
                            <Input
                              required
                              onChange={(e) => {
                                setCourseState({
                                  ...courseState,
                                  description: e.currentTarget.value,
                                });
                              }}
                              suffix={
                                <CheckOutlined
                                  rev={undefined}
                                  onClick={() => {
                                    onUpdateEditState("");
                                  }}
                                />
                              }
                              placeholder="Add you description"
                            />
                          </Form.Item>
                        ) : (
                          <p>
                            {courseState?.description}
                            <span>
                              &nbsp;
                              <EditOutlined
                                onClick={() => {
                                  onUpdateEditState("description");
                                }}
                                rev={undefined}
                              />
                            </span>
                          </p>
                        )}
                        <div className={styles.chapterListContainer}>
                          {courseState?.chapter &&
                          courseState?.chapter?.length >= 1 &&
                          courseState?.chapter[0]?.name !== "" ? (
                            <>
                              {" "}
                              {courseState?.chapter
                                .sort((a, b) => a.sequenceId - b.sequenceId)
                                .map((chapter, i) => {
                                  return (
                                    <div key={i} className={styles.chapterList}>
                                      <div className={styles.chapterEditACtion__container}>
                                        <div>
                                          <img src="/img/program/chapter.png" alt="" /> <span>Chapter {i + 1}</span>
                                        </div>
                                        <Space>
                                          <EditOutlined
                                            onClick={() => {
                                              onEditChapter(chapter);
                                            }}
                                            rev={undefined}
                                          />

                                          {chapter.chapterId && (
                                            <Popconfirm
                                              title="Delete the resource"
                                              description="Are you sure to delete this resource?"
                                              onConfirm={() => {
                                                onDeleteChapter(chapter?.chapterId);
                                              }}
                                              okText="Yes"
                                              cancelText="No"
                                            >
                                              <DeleteOutlined className={styles.deleteBtn} rev={undefined} />
                                            </Popconfirm>
                                          )}
                                        </Space>
                                      </div>
                                      <h4>{chapter?.name}</h4>
                                      <p>{chapter?.description}</p>
                                    </div>
                                  );
                                })}
                            </>
                          ) : (
                            ""
                          )}
                          {!router.query.edit && (
                            <div
                              className={styles.addChapter}
                              onClick={() => {
                                setCourseState({
                                  ...courseState,
                                  chapterName: "",
                                  drawer: true,
                                } as any);
                              }}
                            >
                              <div>
                                <PlusOutlined className={styles.plusIcon} rev={undefined} />
                              </div>
                              <h5>New Chapter</h5>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.saveCourseContainer}>
                        <Dropdown.Button
                          type="primary"
                          onClick={() => {
                            onUpdateCourse("ACTIVE");
                          }}
                          menu={{
                            items: [
                              {
                                key: 1,
                                label: "Save as Draft",
                                onClick: () => {
                                  onUpdateCourse("DRAFT");
                                },
                              },
                              {
                                key: 2,
                                label: "Cancel",
                                onClick: () => {
                                  router.push(`/programs/${router.query.programId}/add-overview?edit=true`);
                                },
                              },
                            ],
                          }}
                        >
                          Update Course
                        </Dropdown.Button>
                      </div>
                    </div>
                  }
                  key={""}
                />
              </Collapse>
              <ChapterForm
                onChapterSave={onChapterSave}
                courseState={courseState as any}
                updateChapterName={updateChapterName}
                onUpdateEditState={onUpdateEditState}
                onAddChapter={onAddChapter}
                addChapter={addChapter}
                contentType={!courseState?.contentType ? "Video" : (courseState?.contentType as any)}
                setContent={setContent}
                form={form}
                onClose={onClose}
                onUpdateChapter={() => {}}
                setAssignmentFileName={setAssignmentFileName}
              />
            </Form>

            <Drawer title="EditCourse" placement="right" maskClosable={false} onClose={onCloseDrawer} open={open}>
              <Form form={form} layout="vertical">
                <div>
                  <Form.Item required label="Enter Course Name">
                    <Input
                      defaultValue={courseState?.name}
                      required
                      onChange={(e) => {
                        setCourseState({
                          ...courseState,
                          name: e.currentTarget.value,
                        });
                      }}
                      placeholder="Add course name"
                    />
                  </Form.Item>

                  <Form.Item required label="Enter Duration">
                    <InputNumber
                      required
                      defaultValue={courseState?.durationInMonths}
                      onChange={(e) => {
                        setCourseState({
                          ...courseState,
                          durationInMonths: Number(e),
                        });
                      }}
                      placeholder="Add duration in months"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Select Skills"
                    name="course_tags"
                    rules={[
                      {
                        required: true,
                        message: "Required Tags",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={courseState?.tags}
                      mode="tags"
                      style={{ width: "200px" }}
                      placeholder="Add Skills"
                      onChange={(value) => {
                        setCourseState({
                          ...courseState,
                          tags: value,
                        });
                      }}
                      options={courseTags?.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                    />{" "}
                  </Form.Item>

                  <Form.Item required label="Enter Description">
                    <Input.TextArea
                      required
                      onChange={(e) => {
                        setCourseState({
                          ...courseState,
                          description: e.currentTarget.value,
                        });
                      }}
                      placeholder="Add you description"
                      defaultValue={courseState?.description}
                    />
                  </Form.Item>
                  <Button style={{ marginTop: 10 }} type="primary" onClick={() => onCloseDrawer()}>
                    Save
                  </Button>
                </div>
              </Form>
            </Drawer>
          </>
        )}
      </div>
    </section>
  );
};

export default EditCourse;
