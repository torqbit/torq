import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/addOverview.module.scss";
import {
  Button,
  Collapse,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Select,
  Space,
  message,
} from "antd";
import { ICourse } from "./AddOverview";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IContentType } from "../AddCourse/AddResourceForm";
import ResourceTime from "../LearnCourse/ResourceTime";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ICourseDetial } from "@/lib/types/program";
const ResourceItem: FC<{
  contentType: IContentType;
  onEditResource: (id: number) => void;
  onDeleteResource: (id: number) => void;
  id: number;
  resourceId: number;
  name: string;
  time: number;
}> = ({ contentType, onEditResource, onDeleteResource, name, time, id, resourceId }) => {
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
          <ResourceTime time={time} className={styles.lecture_time} />
        </Space>
      </div>

      <Space className={styles.edit_resource} align="center">
        <EditOutlined rev={undefined} onClick={() => onEditResource(resourceId)} />

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

const AddCourse: FC<{
  courseDetail: ICourseDetial[];
  onRefresh: () => void;
  form: FormInstance;
  coursetate: ICourse;
  onUpdateCourseState: (key: string, value: string) => void;
  showDrawer: (value: boolean) => void;
  open: boolean;
}> = ({ courseDetail, form, coursetate, onUpdateCourseState, showDrawer, open, onRefresh }) => {
  const inputRef = useRef<InputRef>(null);
  const router = useRouter();
  const { Panel } = Collapse;
  const [assignmentFileName, setAssignmentFileName] = useState<string>("");

  const [model, contextWrapper] = Modal.useModal();

  const [active, setActive] = useState<{ isActive: boolean; loading: boolean }>({ isActive: false, loading: false });

  const [loading, setLoading] = useState<boolean>();

  const [availableCourses, setAvailableCourses] = useState<ICourseDetial[]>([]);

  useEffect(() => {
    ProgramService.getProgram(
      Number(router.query.programId),
      (result) => {
        setAvailableCourses(result.getProgram.course);
      },
      (error) => {}
    );
  }, [router.query.programId, active.loading, onRefresh]);
  const { data: user } = useSession();

  const updateCourse = async () => {
    setLoading(true);
    let courseData = {
      name: form.getFieldsValue().name,
      duration: form.getFieldsValue().duration,
      state: undefined,
      skills: coursetate.selectedTags,
      description: form.getFieldsValue().description,
      thumbnail: "",
      programId: Number(router.query.programId),
      authorId: user?.id,
      sequenceId: Number(form.getFieldsValue().index),
      courseId: Number(router.query.id),
    };
    ProgramService.updateCourse(
      courseData,
      (result) => {
        message.success(result.message);

        setLoading(false);
        showDrawer(false);
        form.resetFields();
        onRefresh();
        router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  const createCourse = async (state: string) => {
    setLoading(true);
    let courseData = {
      name: form.getFieldsValue().name,
      duration: form.getFieldsValue().duration,
      state: state,
      skills: coursetate.selectedTags,
      description: form.getFieldsValue().description,
      thumbnail: "",
      programId: Number(router.query.programId),
      authorId: user?.id,
      sequenceId: Number(form.getFieldsValue().index),
    };

    const res = await fetch(`/api/v1/program/course/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData),
    });
    const result = await res.json();
    if (res.ok) {
      form.resetFields();
      setLoading(false);

      Modal.info({
        title: "Add course",
        content: result.message,
        onOk: () => {
          showDrawer(false);
          onRefresh();
        },
      });
    } else {
      setLoading(false);
      Modal.warning({
        title: "Add course",
        content: result.error,
      });
      form.resetFields();
    }
  };
  let currentSeqIds = courseDetail.map((c) => {
    return c.sequenceId;
  });

  return (
    <div className={`${styles.programCourse} progamCourse`}>
      {contextWrapper}
      <div className={styles.courseFormWrapper}>
        <Drawer
          className={styles.newCourseDetails}
          title={router.query.id ? "Update Course" : "New Course Details"}
          maskClosable={false}
          placement="right"
          onClose={() => {
            showDrawer(false);
            form.resetFields();
            router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
          }}
          open={open}
          footer={
            <div className={styles.footerBtn}>
              {" "}
              <Button
                loading={loading}
                onClick={() => {
                  {
                    router.query.id ? updateCourse() : createCourse("ACTIVE");
                  }
                }}
                type="primary"
                htmlType="submit"
              >
                {router.query.edit && router.query.id ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  showDrawer(false);
                  form.resetFields();
                  router.query.id && router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
                }}
              >
                Cancel
              </Button>
            </div>
          }
        >
          <Form form={form} layout="vertical">
            <div className={styles.formCourseName}>
              <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
                <Input
                  onChange={(e) => {
                    onUpdateCourseState("title", e.currentTarget.value);
                  }}
                  placeholder="Set the title of the course"
                />
              </Form.Item>
              <div>
                <div>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please Enter Description" }]}
                  >
                    <Input.TextArea
                      rows={4}
                      onChange={(e) => {
                        onUpdateCourseState("description", e.currentTarget.value);
                      }}
                      placeholder="Brief description about the course"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label="Add Skills"
                    name="skills"
                    rules={[{ required: true, message: "Please Select Skill" }]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Choose skills"
                      onChange={(value) => {
                        onUpdateCourseState("tags", value as string);
                      }}
                      value={router.query.id && coursetate.selectedTags}
                      options={coursetate.courseTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                    />{" "}
                  </Form.Item>
                </div>
                <Form.Item
                  name="duration"
                  label="Set Duration (in months)"
                  rules={[{ required: true, message: "Please Enter duration" }]}
                >
                  <Select
                    placeholder="Select duration"
                    onChange={(e) => {
                      onUpdateCourseState("duration", String(e));
                    }}
                  >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="11">11</Select.Option>
                    <Select.Option value="12">12</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <Form.Item label="Set Index" name="index" rules={[{ required: true, message: "Please Enter Index" }]}>
                  <Select placeholder="Choose index">
                    {currentSeqIds.length >= 1 &&
                      currentSeqIds.map((seq, i) => {
                        return (
                          <Select.Option key={i} value={`${seq}`}>
                            {seq}
                          </Select.Option>
                        );
                      })}

                    {!router.query.id && (
                      <>
                        {currentSeqIds.length >= 1 ? (
                          <Select.Option value={`${currentSeqIds.length + 1}`}>
                            {currentSeqIds.length + 1}
                          </Select.Option>
                        ) : (
                          <Select.Option value="1">1</Select.Option>
                        )}
                      </>
                    )}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Drawer>

        {availableCourses.length === 0 ? (
          <Space className={styles.no_course_btn}>
            <div>No courses availabe</div>
            <Button
              type="primary"
              onClick={() => {
                setActive({ ...active, isActive: true }), showDrawer(true);
              }}
            >
              Add a Course
            </Button>
          </Space>
        ) : (
          <div className={styles.addCourseBtn}>
            <Button
              type="primary"
              onClick={() => {
                setActive({ ...active, isActive: true }), showDrawer(true);
              }}
            >
              Add a Course
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddCourse;
