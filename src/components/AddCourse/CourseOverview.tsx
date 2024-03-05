import appConstant from "@/services/appConstant";
import { InputRef, message, Form, Input, Select, Divider, Space, Button, FormInstance } from "antd";
import { useRouter } from "next/router";
import EditorJS from "@editorjs/editorjs";
import { FC, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ICourseInfo } from "@/pages/add-course";
import { IResponse, postFetch } from "@/services/request";
import { useSession } from "next-auth/react";
import CustomEditorJS from "../Editorjs/CustomEditorJS";
import styles from "@/styles/AddCourse.module.scss";
import React from "react";
import Image from "next/image";
import { CourseType } from "@prisma/client";

let index = 0;
interface ICourseIcon {
  path: string;
  name: string;
}

const courseIcon: ICourseIcon[] = [
  {
    name: "HTML",
    path: "/img/courseIcon/html5.svg",
  },
  {
    name: "ReactJS",
    path: "/img/courseIcon/react.svg",
  },
  {
    name: "NodeJS",
    path: "/img/courseIcon/nodejs.svg",
  },
  {
    name: "Javascript",
    path: "/img/courseIcon/js.svg",
  },
  {
    name: "HTML",
    path: "/img/courseIcon/html5.svg",
  },
  {
    name: "GraphQL",
    path: "/img/courseIcon/graphql.svg",
  },
  {
    name: "GIT",
    path: "/img/courseIcon/git.svg",
  },
  {
    name: "Cloud",
    path: "/img/courseIcon/cloud.svg",
  },
  {
    name: "Container",
    path: "/img/courseIcon/container.svg",
  },
];
const CourseOverview: FC<{
  form: FormInstance;
  descData: any;
  onChangeMenu: (key: any) => void;
  type?: CourseType;
}> = ({ form, descData, onChangeMenu, type = "FREE" }) => {
  const { data: session } = useSession();
  const ref = React.useRef<EditorJS>();
  const inputRef = useRef<InputRef>(null);
  const router = useRouter();
  const query = router.query;

  const [loading, setLoading] = useState<boolean>(false);
  const [courseTags, setCourseTags] = useState(appConstant.courseTags);
  const [tagName, setTagName] = useState("");
  const [courseType, setCourseType] = useState<CourseType>(type);

  const onSelectTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const addTag = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!tagName) return message.info("Please enter any tag name");
    e.preventDefault();
    setCourseTags([...courseTags, tagName || `New item ${index++}`]);
    setTagName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Save Course on DB
  const onSubmitCourse = async () => {
    const blocks = await ref.current?.save();
    try {
      const courseInfo: ICourseInfo = {
        name: form.getFieldValue("course_title"),
        about: form.getFieldValue("course_about"),
        description: blocks,
        thumbnail: form.getFieldValue("course_thumbnail"),
        icon: form.getFieldValue("course_icon"),
        tags: form.getFieldValue("course_tags"),
        courseType: form.getFieldValue("course_type"),
        coursePrice: form.getFieldValue("course_price"),
        userId: session?.id,
      };
      form.validateFields().then(async (r) => {
        if (!courseInfo.name) {
          form.setFields([
            {
              name: "course_title",
              errors: ["Required Title"],
            },
          ]);
          return false;
        }
        if (!courseInfo.about) {
          form.setFields([
            {
              name: "course_about",
              errors: ["Required About"],
            },
          ]);
          return false;
        }
        if (blocks?.blocks.length === 0) {
          form.setFields([
            {
              name: "course_desc",
              errors: ["Required Description"],
            },
          ]);
          return false;
        }
        if (!courseInfo.thumbnail) {
          if (!courseInfo.description) {
            form.setFields([
              {
                name: "course_tags",
                errors: ["Required Tags"],
              },
            ]);
            return false;
          }
        }
        setLoading(true);
        const res = await postFetch(courseInfo, "/api/course/create");
        const result = (await res.json()) as IResponse;
        if (res.ok && res.status === 200) {
          message.success(result.message);
          if (result.courseId) {
            router.push(`/add-course?edit=true&courseId=${result.courseId}`);
            onChangeMenu("add_chapter");
          }
        } else {
          message.error(result.error);
        }
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);

      message.error("Error on adding new course");
    }
  };

  // Update Course on DB
  const onUpdateCourese = async () => {
    setLoading(true);
    const blocks = await ref.current?.save();
    try {
      const courseInfo: ICourseInfo = {
        name: form.getFieldValue("course_title"),
        about: form.getFieldValue("course_about"),
        description: blocks,
        thumbnail: form.getFieldValue("course_thumbnail"),
        icon: form.getFieldValue("course_icon"),
        tags: form.getFieldValue("course_tags"),
        courseType: form.getFieldValue("course_type"),
        coursePrice: form.getFieldValue("course_price"),
        courseId: Number(query.courseId),
        userId: session?.id,
      };
      const res = await postFetch(courseInfo, "/api/course/update");
      const result = await res.json();
      if (res.ok) {
        message.success(result.message);
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      message.error("Error while updating course");
      setLoading(false);
    }
  };

  return (
    <>
      <h2>{router?.query?.edit === "true" ? "Update Course Summary" : "Add Course Summary"}</h2>
      <Form.Item label="Title" name="course_title" rules={[{ required: true, message: "Required Title" }]}>
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item label="About" name="course_about" rules={[{ required: true, message: "Required About" }]}>
        <Input.TextArea placeholder="About" rows={3} />
      </Form.Item>
      <Form.Item label="Icon" name="course_icon">
        <Select
          style={{ width: "100%" }}
          placeholder="Select Icon"
          options={courseIcon.map((icon, i) => {
            return {
              label: (
                <Space align="center">
                  <Image
                    src={icon.path}
                    style={{
                      background: "#000",
                      padding: "5px",
                      borderRadius: 8,
                    }}
                    className={styles.course_icon}
                    alt={icon.name}
                    width={25}
                    height={25}
                  />
                  <div>{icon.name}</div>
                </Space>
              ),
              value: icon.path,
            };
          })}
        />
      </Form.Item>
      <Form.Item label="Thumbnail" name="course_thumbnail" rules={[{ required: true, message: "Required Thumbnail" }]}>
        <Input placeholder="Thumbnail" />
      </Form.Item>
      <Form.Item label="Tags" name="course_tags" rules={[{ required: true, message: "Required Tags" }]}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Add Skills"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input placeholder="Enter new tag" ref={inputRef} value={tagName} onChange={onSelectTag} />
                <Button type="text" icon={<PlusOutlined rev={undefined} />} onClick={addTag}>
                  Add Tag
                </Button>
              </Space>
            </>
          )}
          options={courseTags.map((tag) => ({ label: tag, value: tag }))}
        />
      </Form.Item>
      <Form.Item label="Course Type" name="course_type">
        <Select
          style={{ width: "100%" }}
          placeholder="Course Type"
          onSelect={(v) => setCourseType(v as CourseType)}
          options={appConstant.courseType.map((type, i) => {
            return {
              label: type,
              value: type,
            };
          })}
        />
      </Form.Item>
      {courseType === appConstant.courseType[1] && (
        <Form.Item label="Price" name="course_price" rules={[{ required: true, message: "Required Price" }]}>
          <Input addonBefore={<span>&#8377;</span>} type="number" min={0} placeholder="Price" />
        </Form.Item>
      )}
      <Form.Item label="Description" name="course_desc">
        <CustomEditorJS holder="desc_editor_edit" editorRef={ref} editorData={descData} readOnly={false} />
      </Form.Item>
      <Form.Item noStyle>
        <Space>
          <Button
            style={{ padding: "0 40px" }}
            loading={loading}
            type="primary"
            onClick={query.edit === "true" ? onUpdateCourese : onSubmitCourse}
          >
            {query.edit === "true" ? "Update" : "Save"}
          </Button>
        </Space>
      </Form.Item>
    </>
  );
};

export default CourseOverview;
