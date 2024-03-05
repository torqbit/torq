import { IAddResource, ICourseDetial, resData } from "@/lib/types/program";

import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import { FC, useEffect, useRef, useState } from "react";
import styles from "@/styles/ProgramCourse.module.scss";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import router from "next/router";
import ProgramService from "@/services/ProgramService";
import AddCourseChapter from "./AddCourseChapter";
import AddResource from "./AddResource";
import { Resource } from "@prisma/client";

const CourseHeader: FC<{
  edit: boolean | undefined;
  name: string;
  durationInMonths: number;
  skills: string[];
  state: string;
  courseId: number;
  onDeleteCourse: (courseId: number) => void;
  onUpdateCourse: (courseId: number) => void;
  onRefresh: () => void;
}> = ({ name, durationInMonths, edit, skills, state, onUpdateCourse, courseId, onDeleteCourse, onRefresh }) => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",

      onClick: () => {
        onUpdateCourse(courseId);
      },
      style: { textAlign: "center" },
    },
    {
      key: "2",

      label: (
        <Popconfirm
          title="Delete the Course"
          description="Are you sure to delete this course?"
          onConfirm={() => onDeleteCourse(courseId)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
      onClick: () => {},
      style: { textAlign: "center" },
    },

    {
      key: "3",
      label: state === "ACTIVE" ? "Save as Draft" : "Publish",
      onClick: () => {
        state === "ACTIVE" ? onUpdateState(courseId, "DRAFT") : onUpdateState(courseId, "ACTIVE");
      },
      style: { textAlign: "center" },
    },
  ];

  const onUpdateState = (courseId: number, state: string) => {
    ProgramService.updateCourseState(
      courseId,
      state,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };

  return (
    <header>
      <div className={styles.card_title}>
        <div>{name}</div>
        <div>
          <Space>
            <div className={styles.duration}>{durationInMonths} months</div>
            <div className={styles.pipe}>|</div>
            <div>
              {skills?.map((s, index) => (
                <Tag className={styles.skillWrapper} key={index} bordered={false}>
                  {s}
                </Tag>
              ))}
            </div>
          </Space>
        </div>
      </div>

      {edit && (
        <div className={styles.__draft}>
          {state === "DRAFT" && <Tag>{state}</Tag>}
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" arrow>
            <EllipsisOutlined className={styles.course_actionBtn_dropdown} />
          </Dropdown>
        </div>
      )}
    </header>
  );
};

const CourseView: FC<ICourseDetial> = ({
  name,
  durationInMonths,
  description,
  state,
  sequenceId,
  courseId,
  edit,
  skills,
  chapter,
  onRefresh,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [loading, setLoading] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [showResourceDrawer, setResourceDrawer] = useState<boolean>(false);
  const showChapterDrawer = (value: boolean) => {
    setOpen(value);
  };
  const [form] = Form.useForm();
  const [formData] = Form.useForm();
  const [availableRes, setAvailableRes] = useState<Resource[]>();

  const [addRes, setAddRes] = useState<IAddResource>({
    name: "New Video ",
    duration: 0,
    content: "Video",
    assignmentFileName: "",
    chapterId: 0,
  });

  const createChapter = async (courseId: number) => {
    setLoading(true);
    let chaptereData = {
      name: form.getFieldsValue().name,
      description: form.getFieldsValue().description,
      duration: form.getFieldsValue().duration,

      courseId: courseId,
      sequenceId: Number(form.getFieldsValue().index),
    };

    ProgramService.createChapter(
      chaptereData,
      (result) => {
        setLoading(false);
        message.info(result.message);
        onRefresh();
        showChapterDrawer(false);
        form.resetFields();
      },
      (error) => {
        setLoading(false);
        message.error(error);
      }
    );
  };

  const updateChapter = async (chapterId: number) => {
    setLoading(true);

    ProgramService.updateChapter(
      chapterId,
      form.getFieldsValue().name,
      form.getFieldsValue().description,
      Number(form.getFieldsValue().index),
      (result) => {
        setLoading(false);
        message.info(result.message);
        onRefresh();
        showChapterDrawer(false);
        form.resetFields();

        router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
      },
      (error) => {
        setLoading(false);
        message.error(error);
      }
    );
  };

  const deleteChapter = (chapterId: number) => {
    ProgramService.deleteChapter(
      chapterId,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };

  let currentSeqIds = chapter.map((c) => {
    return c.sequenceId;
  });
  const editChapter = (chapterId: number) => {
    ProgramService.getChapter(
      chapterId,
      (result) => {
        form.setFieldValue("name", result.chapter?.name);
        form.setFieldValue("description", result.chapter?.description);
        form.setFieldValue("index", result.chapter.sequenceId);
        showChapterDrawer(true);
        router.replace(`/programs/${router.query.programId}/add-overview?edit=true&chapterId=${chapterId}`);
      },

      (error) => {}
    );
  };

  const onFindRsource = (id: number) => {
    ProgramService.getResources(
      id,
      (result) => {
        setAvailableRes(result.allResource);
        !showResourceDrawer && setResourceDrawer(true);
        !showResourceDrawer
          ? setAddRes({ ...addRes, chapterId: id })
          : setAddRes({
              content: "Video",
              chapterId: 0,
              name: "",
              duration: 0,
              assignmentFileName: "",
            });
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onCreateRes = (chapterId: number) => {
    setLoading(true);
    let resData = {
      name: formData.getFieldsValue().name,

      description: formData.getFieldsValue().description,
      chapterId: chapterId,
      sequenceId: Number(formData.getFieldsValue().index),
      assignmentLang: formData.getFieldsValue().assignmentLang || [],
      videoDuration: formData.getFieldsValue().duration || 0,
      daysToSubmit: formData.getFieldsValue().submitDay || 0,
      thumbnail: formData.getFieldsValue().VideoUrl || "",
      contentType: addRes.content,
      content: addRes.assignmentFileName || "",
    } as resData;
    ProgramService.createResource(
      resData,
      (result) => {
        message.success(result.message);
        onFindRsource(chapterId);
        formData.resetFields();
        setLoading(false);
        setResourceDrawer(false);
        setAddRes({
          content: "Video",
          chapterId: 0,
          name: "",
          duration: 0,
          assignmentFileName: "",
        });
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  const onUpdateRes = (resId: number) => {
    setLoading(true);

    let resData = {
      name: formData.getFieldsValue().name,
      resourceId: resId,
      description: formData.getFieldsValue().description,
      chapterId: addRes.chapterId,
      sequenceId: Number(formData.getFieldsValue().index),
      assignmentLang: formData.getFieldsValue().assignmentLang || [],
      videoDuration: formData.getFieldsValue().duration || 0,
      daysToSubmit: formData.getFieldsValue().submitDay || 0,
      thumbnail: formData.getFieldsValue().VideoUrl || "",
      contentType: addRes.content,
      content: addRes.assignmentFileName || "",
    } as resData;

    ProgramService.updateResource(
      resData,
      (result) => {
        message.success(result.message);
        onFindRsource(addRes.chapterId);
        formData.resetFields();
        setLoading(false);
        router.query.resId && router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
        setAddRes({
          content: "Video",
          chapterId: 0,
          name: "",
          duration: 0,
          assignmentFileName: "",
        });
        formData.setFieldValue("contentType", "Video");

        // setResourceDrawer(false);
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Card
        className={styles.card_conatiner}
        title={
          <CourseHeader
            edit={edit}
            onUpdateCourse={onUpdateCourse}
            name={name}
            durationInMonths={durationInMonths}
            skills={skills}
            state={state}
            courseId={courseId}
            onDeleteCourse={onDeleteCourse}
            onRefresh={onRefresh}
          />
        }
      >
        <div className={styles.card_content}>
          <p>{description}</p>
          <div className={styles.chapterListContainer}>
            {chapter
              ?.sort((a, b) => a.sequenceId - b.sequenceId)
              .map((c, i) => {
                return (
                  <div key={i} className={styles.chapterList}>
                    <div className={styles.chapterListHeader}>
                      <div>
                        <img src="/img/program/chapter.png" alt="chapter-Icon" /> {c.name}
                      </div>
                      <div>
                        {edit && (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "1",
                                  label: "Edit",
                                  onClick: () => {
                                    editChapter(c.chapterId);
                                  },
                                  style: { textAlign: "center" },
                                },
                                {
                                  key: "2",
                                  label: (
                                    <Popconfirm
                                      title="Delete the Chapter"
                                      description="Are you sure to delete this chapter?"
                                      onConfirm={() => deleteChapter(c.chapterId)}
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      Delete
                                    </Popconfirm>
                                  ),
                                  onClick: () => {},
                                  style: { textAlign: "center" },
                                },
                                {
                                  key: "3",
                                  label: "Add Resource",
                                  onClick: () => {
                                    onFindRsource(c.chapterId);
                                  },
                                  style: { textAlign: "center" },
                                },
                              ],
                            }}
                            trigger={["click"]}
                            placement="bottom"
                            arrow
                          >
                            <EllipsisOutlined style={{ fontSize: 30 }} />
                          </Dropdown>
                        )}
                      </div>
                    </div>

                    <p>{c.description}</p>
                  </div>
                );
              })}

            {edit && (
              <Button onClick={() => showChapterDrawer(true)} className={styles.addChapter}>
                <div>
                  <PlusOutlined className={styles.plusIcon} rev={undefined} />
                </div>
                <h4>New Chapter </h4>
              </Button>
            )}
          </div>
        </div>
      </Card>
      <AddCourseChapter
        createChapter={createChapter}
        courseId={courseId}
        updateChapter={updateChapter}
        currentSeqIds={currentSeqIds}
        showChapterDrawer={showChapterDrawer}
        loading={loading}
        open={open}
        form={form}
      />
      <AddResource
        chapterId={addRes.chapterId}
        addRes={addRes}
        setAddRes={setAddRes}
        onCreateRes={onCreateRes}
        onUpdateRes={onUpdateRes}
        availableRes={availableRes}
        formData={formData}
        setResourceDrawer={setResourceDrawer}
        showResourceDrawer={showResourceDrawer}
        loading={loading}
        onFindRsource={onFindRsource}
      />
    </>
  );
};

export default CourseView;
