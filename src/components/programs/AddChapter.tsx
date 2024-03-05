import appConstant from "@/services/appConstant";
import styles from "../../styles/addOverview.module.scss";
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Popconfirm,
  Segmented,
  SegmentedProps,
  Select,
  Space,
  Upload,
  UploadFile,
  message,
} from "antd";
import { FC, useEffect, useState } from "react";
import { ICourse, ICourseChapter } from "./AddOverview";
import ResourceListItem from "../LearnCourse/ResourceListItem";

import { ArrowRightOutlined, CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { IContentType } from "../AddCourse/AddResourceForm";
import ResourceTime from "../LearnCourse/ResourceTime";
import { string } from "zod";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { IResponse, postFetch } from "@/services/request";
import { useSession } from "next-auth/react";
import { Resource } from "@prisma/client";

const ResourceItem: FC<{
  contentType: IContentType;
  onEditResource: (id: number, chapterId: number) => void;
  onDeleteResource: (id: number) => void;
  id: number;
  resourceId: number;
  name: string;
  time: number;
  form: FormInstance;
  description: string;
  videoUrl: string;
  languages: string[];
  submitDay: number;
}> = ({
  contentType,
  onEditResource,
  onDeleteResource,
  name,
  time,
  id,
  resourceId,
  form,
  videoUrl,
  description,
  languages,
  submitDay,
}) => {
  const router = useRouter();
  const onCLickEdit = (resource: {
    resourceTitle: string;
    resourceDescripton: string;
    contentType: string;
    videoDuration: number;
    videoUrl: string;
    submitDay: number;
    languages: string[];
  }) => {
    router.push(
      `/programs/${router.query.programId}/course/${router.query.courseId}/?edit=resource&resourceId=${resourceId}`
    );
    form.setFieldValue("resourceTitle", resource.resourceTitle);
    form.setFieldValue("resourceDescripton", resource.resourceDescripton);

    submitDay !== 0 && form.setFieldValue("submitDay", resource.submitDay);
    form.setFieldValue("assign_lang", resource.languages);

    contentType === "Assignment" && time !== 0 && form.setFieldValue("assignment_duration", resource.videoDuration);
    contentType === "Video" && time !== 0 && form.setFieldValue("videoDuration", resource.videoDuration);

    form.setFieldValue("videoUrl", resource.videoUrl);
  };

  return (
    <Space key={id} className={`${styles.resource_item}`} align="start">
      <div>
        <div className={styles.resource_no}>{id + 1}</div>
        {contentType === "Video" ? (
          <img src="/img/about-course/playcircle.svg" alt="Video" />
        ) : (
          <img src="/img/about-course/assignment.svg" alt="Assignment" />
        )}
        <Space direction="vertical" size={0} align="start">
          <span className={styles.resource_name}>{name}</span>
          {contentType === "Video" ? (
            <ResourceTime time={time} className={styles.lecture_time} />
          ) : (
            <div className={styles.lecture_time}>{submitDay}</div>
          )}
        </Space>
      </div>

      <Space className={styles.edit_resource} align="center">
        <EditOutlined
          rev={undefined}
          onClick={() => {
            let resource = {
              resourceTitle: name,
              resourceDescripton: description,
              contentType: contentType,
              videoDuration: time,
              videoUrl: videoUrl,
              submitDay: submitDay,
              languages: languages,
            };

            onCLickEdit(resource);
          }}
        />
        <Popconfirm
          title="Delete the resource"
          description="Are you sure to delete this resource?"
          onConfirm={() => onDeleteResource(resourceId)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined rev={undefined} style={{ color: "red" }} />
        </Popconfirm>
      </Space>
    </Space>
  );
};

const ChapterForm: FC<{
  onChapterSave: () => void;
  updateChapterName: (key: string, value: string) => void;
  onUpdateEditState: (value: string) => void;
  addChapter: ICourseChapter | undefined;
  setAssignmentFileName: (value: string) => void;
  onClose: () => void;
  courseState: ICourse | any;
  contentType: string | number;
  setContent: (v: string) => void;
  onUpdateChapter: () => void;
  form: FormInstance;

  onAddChapter: (
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
  ) => void;
}> = ({
  onChapterSave,
  onUpdateEditState,
  updateChapterName,
  courseState,
  contentType,
  setContent,
  form,
  onAddChapter,
  onClose,
  addChapter,
  onUpdateChapter,
  setAssignmentFileName,
}) => {
  const router = useRouter();
  const [chapter, setChapter] = useState<any>();
  const [reFresh, setRefresh] = useState<boolean>(false);
  const { data: user } = useSession();
  useEffect(() => {
    ProgramService.getChapter(
      Number(router.query.id),
      (result) => {
        if (router.query.edit === "chapter") {
          setChapter(result.getChapter as any);
          setContent("Video");

          // setTimeout(() => {
          //   form.setFieldValue("chapterDescription", chapter?.description);
          // }, 100);
        }
      },
      (error) => {}
    );
  }, [router.query.id, reFresh, router.query.edit]);

  const onEditResource = async (id: number, chapterId: number) => {
    const res = await postFetch(
      {
        name: form.getFieldsValue().resourceTitle,
        description: form.getFieldsValue().resourceDescripton,
        videoDuration: Number(form.getFieldsValue().videoDuration),
        contentType: form.getFieldsValue().resourceTitle,
        thumbnail: form.getFieldsValue().videoUrl,

        chapterId: Number(chapter?.chapterId),
        userId: user?.id,
        resourceId: id,

        assignmentLang: form.getFieldsValue().assign_lang,
      },
      "/api/resource/update"
    );
    const result = (await res.json()) as IResponse;

    if (res.ok && res.status === 200) {
      message.success(result.message);
      form.resetFields();

      setRefresh(!reFresh);

      router.push(`/programs/${router.query.programId}/course/${router.query.courseId}/?edit=chapter&&id=${chapterId}`);
    } else {
      message.error(result.error);
    }
  };

  const onDeleteResource = async (id: number) => {
    setRefresh(true);
    const deleteRes = await postFetch({ resourceId: id }, "/api/resource/delete");
    const result = (await deleteRes.json()) as IResponse;
    if (deleteRes.ok) {
      message.success(result.message);
      setRefresh(false);
    } else {
      message.error(result.error);
    }
  };

  // Save Assignment file to public dir
  const onUploadAssignment = (info: any) => {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      const res = info.file.response; // TODO
      setAssignmentFileName(res.fileName);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <section className={styles.chapterForm}>
      <Drawer
        maskClosable={false}
        footer={
          <>
            {router.query.edit !== "resource" && (
              <div className={styles.DrawerfooterContent}>
                <Button
                  className={styles.primaryDrawerBtn}
                  type="primary"
                  onClick={() => {
                    router.query.edit === "chapter" ? onUpdateChapter() : onChapterSave();

                    form.resetFields();
                  }}
                >
                  {router.query.edit === "chapter" ? "Update Chapter" : "Save and Continue"}
                  <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
                </Button>
                <Button
                  onClick={() => {
                    {
                      if (router.query.edit) {
                        form.resetFields();
                        updateChapterName("chapterName", "New Chapter");

                        router.push(`/programs/${router.query.programId}/course/${router.query.courseId}`);
                      }
                      updateChapterName("drawer", "false");
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        }
        className={styles.drawerWraper}
        title={
          courseState?.onEdit === "chapterName" ? (
            <Form.Item name={"chapterName"} noStyle>
              <Input
                onChange={(e) => {
                  updateChapterName("chapterName", e.currentTarget.value);
                }}
                placeholder="Course Title"
                suffix={
                  <CheckOutlined
                    rev={undefined}
                    onClick={() => {
                      onUpdateEditState("");
                    }}
                  />
                }
              />
            </Form.Item>
          ) : (
            <div>
              {router.query.edit === "chapter" ? (
                courseState?.chapterName ? (
                  courseState?.chapterName
                ) : (
                  chapter?.name
                )
              ) : (
                <>{!courseState?.chapterName ? "New Chapter" : courseState?.chapterName}</>
              )}
              <span>
                &nbsp;
                <EditOutlined
                  onClick={() => {
                    onUpdateEditState("chapterName");
                  }}
                  rev={undefined}
                />
              </span>
            </div>
          )
        }
        width={600}
        placement="right"
        open={courseState?.drawer}
        onClose={onClose}
      >
        <Form layout="vertical" form={form} onFinish={() => onAddChapter(form.getFieldsValue(), 0)}>
          <div className={styles.drwaerContent}>
            <Form.Item name={"chapterDescription"}>
              <Input.TextArea
                placeholder="Brief description about the chapter"
                autoSize={{ minRows: 10, maxRows: 20 }}
                defaultValue={courseState.chapterDescription || ""}
                onChange={(e) => {
                  updateChapterName("chapterDescription", e.currentTarget.value);
                }}
              />
            </Form.Item>

            <h4>Resource</h4>
            {router.query.edit && (
              <div>
                {chapter?.resource
                  .sort((a: Resource, b: Resource) => a.sequenceId - b.sequenceId)
                  .map((r: any, i: number) => {
                    return (
                      <>
                        {router.query.edit === "chapter" ? (
                          <>
                            <div key={i} className={styles.resource_item}>
                              <ResourceItem
                                description={r.description}
                                videoUrl={r.thumbnail}
                                form={form}
                                key={i}
                                name={r.name}
                                time={r.videoDuration}
                                id={i}
                                resourceId={r.resourceId}
                                onEditResource={onEditResource}
                                onDeleteResource={onDeleteResource}
                                contentType={r.contentType as IContentType}
                                languages={r.assignmentLang}
                                submitDay={r.daysToSubmit}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {Number(router.query.resourceId) === r.resourceId && (
                              <div key={i} className={styles.resource_item}>
                                <ResourceItem
                                  description={r.description}
                                  videoUrl={r.thumbnail}
                                  form={form}
                                  key={i}
                                  name={r.name}
                                  time={r.videoDuration}
                                  id={i}
                                  resourceId={r.resourceId}
                                  onEditResource={onEditResource}
                                  onDeleteResource={onDeleteResource}
                                  contentType={r.contentType as IContentType}
                                  languages={[]}
                                  submitDay={0}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })}
              </div>
            )}

            <div>
              {router.query.edit === "chapter" && addChapter?.resources[0]?.resourceTitle != "" && (
                <h4>New Resources</h4>
              )}

              {addChapter?.resources[0]?.resourceTitle != "" &&
                addChapter?.resources.map((r, i) => {
                  return (
                    <div key={i} className={styles.resource_item}>
                      {r.resourceTitle !== undefined && (
                        <ResourceItem
                          description={""}
                          videoUrl={""}
                          form={form}
                          key={i}
                          name={r.resourceTitle}
                          time={r.videoDuration}
                          id={i}
                          resourceId={0}
                          onEditResource={() => {}}
                          onDeleteResource={() => {}}
                          contentType={r.contentType as IContentType}
                          languages={[]}
                          submitDay={0}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            <Form.Item label="Title" name="resourceTitle" rules={[{ required: true, message: "Required Title" }]}>
              <Input placeholder="add resource title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="resourceDescripton"
              rules={[{ required: true, message: "Required description" }]}
            >
              <Input.TextArea placeholder="add resource description" autoSize={{ minRows: 12, maxRows: 20 }} />
            </Form.Item>
            <Form.Item label="Choose content type" name="resource_type">
              <Segmented
                className="content-type-segment"
                onChange={(v) => setContent(v.toString())}
                options={["Video", "Assignment"]}
                size="middle"
              />
            </Form.Item>

            {contentType === "Assignment" && (
              <div>
                <Form.Item
                  label="Days To Submit "
                  name="submitDay"
                  rules={[{ required: true, message: "Required Days" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item
                  label="Languages"
                  name="assign_lang"
                  rules={[{ required: true, message: "Required Languages" }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Add Language"
                    options={appConstant.assignmentLang?.map((lang) => ({
                      label: lang,
                      value: lang,
                    }))}
                  />
                </Form.Item>

                <Form.Item label="Assignment file" name="assignment_file">
                  <Upload
                    onChange={onUploadAssignment}
                    style={{ width: "100%" }}
                    multiple={false}
                    maxCount={1}
                    action="/api/assignment/save"
                    listType="text"
                  >
                    <Button style={{ width: "100%" }} icon={<PlusOutlined rev={undefined} />}>
                      Upload
                    </Button>
                  </Upload>
                </Form.Item>
                {/* <Form.Item
                  label="Video Duration (in seconds)"
                  name="assignment_duration"
                  rules={[{ required: true, message: "Required duration" }]}
                >
                  <InputNumber min={1} />
                </Form.Item> */}
              </div>
            )}

            {contentType === "Video" && (
              <div>
                <Form.Item label="Video URL" name="videoUrl" rules={[{ required: true, message: "Required URL" }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Video Duration (in seconds)"
                  name="videoDuration"
                  rules={[{ required: true, message: "Required duration" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </div>
            )}

            <div className={styles.actionBtn}>
              <Dropdown.Button
                type="primary"
                className={styles.dropDownBtn}
                onClick={() => {
                  let seqId = addChapter?.resources
                    ? addChapter.resources[addChapter?.resources.length - 1].sequenceId + 1
                    : chapter?.resource.length + 1;
                  {
                    router.query.edit === "resource"
                      ? onEditResource(Number(router.query.resourceId), chapter?.chapterId)
                      : onAddChapter(form.getFieldsValue(), router.query.edit === "chapter" ? seqId : 1);
                  }
                }}
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "Cancel",

                      onClick: () => {
                        {
                          form.resetFields();
                          router.query.edit === "resource" &&
                            router.push(
                              `/programs/${router.query.programId}/course/${router.query.courseId}?edit=chapter&id=${chapter.chapterId}`
                            );
                        }
                      },
                    },
                  ],
                }}
              >
                {router.query.edit === "resource" ? "Update" : "Save"}
              </Dropdown.Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </section>
  );
};

export default ChapterForm;
