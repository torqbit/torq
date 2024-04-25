import { IAddResources } from "@/pages/add-course";
import {
  Form,
  Input,
  InputRef,
  Button,
  Space,
  Segmented,
  Select,
  FormInstance,
  message,
  Popconfirm,
  Divider,
  InputNumber,
} from "antd";
import styles from "@/styles/AddCourse.module.scss";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { useSession } from "next-auth/react";
import CustomEditorJS from "../Editorjs/CustomEditorJS";
import EditorJS from "@editorjs/editorjs";

import React from "react";
import ResourceTime from "../LearnCourse/ResourceTime";
import appConstant from "@/services/appConstant";

export type IContentType = "Video" | "Assignment";

export interface IResResources extends IResponse {
  allResources: IAddResources[];
}

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
        <EditOutlined onClick={() => onEditResource(resourceId)} />
        <Popconfirm
          title="Delete the resource"
          description="Are you sure to delete this resource?"
          onConfirm={() => onDeleteResource(resourceId)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red" }} />
        </Popconfirm>
      </Space>
    </Space>
  );
};

const AddResourceForm: FC<{
  form: FormInstance;

  chapterId?: number;
}> = ({ form, chapterId }) => {
  const router = useRouter();
  const inputRef = React.useRef<InputRef>(null);
  const resourceRef = React.useRef<EditorJS>();
  const assignmentRef = React.useRef<EditorJS>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const [addedResources, setAddedResource] = useState<IAddResources[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [assignLangs, setAssignLangs] = useState<string[]>([]);

  const [sltResource, setSltResource] = useState<IAddResources>({
    name: "",
    description: "",
    videoDuration: 0,
    contentType: "Video",
    content: "",
    assignmentLang: [],
  });
  const [contentType, setContentType] = useState<string | number>("Video");

  const resetFields = () => {
    setSltResource({
      name: "",
      description: "",
      videoDuration: 0,
      contentType: "Video",
      content: "",
      assignmentLang: [],
    });
    form.resetFields([
      "resource_title",
      "resource_desc",
      "resource_type",
      "resource_content",
      "resource_video_duration",
      "daysToSubmit",
      "assignmentLang",
    ]);
  };

  const onAddResource = async () => {
    try {
      // Validate fields
      const resourceName = form.getFieldValue("resource_title");
      const resourceType = form.getFieldValue("resource_type");
      const resourceContent = form.getFieldValue("resource_content");
      const resourceTime = form.getFieldValue("resource_video_duration");
      const blocks = await resourceRef.current?.save();
      const assignBlocks = await assignmentRef.current?.save();
      const daysToSubmit = form.getFieldValue("daysToSubmit");
      const assignmentLang = form.getFieldValue("assign_lang");
      form.validateFields().then(async (r) => {
        if (!resourceName) {
          form.setFields([
            {
              name: "resource_title",
              errors: ["Required Title"],
            },
          ]);
          return false;
        }
        if (blocks?.blocks.length === 0) {
          form.setFields([
            {
              name: "resource_desc",
              errors: ["Required Description"],
            },
          ]);
          return false;
        }
        if (!resourceTime) {
          form.setFields([
            {
              name: "resource_video_duration",
              errors: ["Required Video Duration"],
            },
          ]);
          return false;
        }

        setLoading(true);
        // UPDATE RESOURCE IN DB
        if (addedResources.length && sltResource.resourceId) {
          const res = await postFetch(
            {
              name: resourceName,
              description: blocks,
              videoDuration: Number(resourceTime),
              contentType: resourceType,
              content: resourceContent,
              assignment: assignBlocks,
              chapterId: chapterId,
              userId: session?.id,
              resourceId: sltResource.resourceId,
              daysToSubmit: Number(daysToSubmit),
              assignmentLang: assignmentLang,
            },
            "/api/resource/update"
          );
          const result = (await res.json()) as IResponse;

          if (res.ok && res.status === 200) {
            message.success(result.message);
            setRefresh(!refresh);
          } else {
            message.error(result.error);
          }
          setLoading(false);
        } else {
          setLoading(true);
          // SAVE NEW RESOURCE IN DB
          const res = await postFetch(
            {
              name: resourceName,
              description: blocks,
              videoDuration: Number(resourceTime),
              contentType: resourceType,
              assignment: assignBlocks,
              userId: session?.id,
              courseId: router.query.courseId,
              chapterId: chapterId,
              daysToSubmit: Number(daysToSubmit),
              assignmentLang: assignmentLang,
            },
            "/api/resource/create"
          );
          const result = (await res.json()) as IResponse;
          if (res.ok && res.status === 200) {
            message.success(result.message);
            resetFields();
            setRefresh(!refresh);
          } else {
            message.error(result.error);
          }
          setLoading(false);
        }
      });
    } catch (err) {}
  };

  const onEditResource = (resourceId: number) => {};

  useEffect(() => {
    resetFields();
  }, []);

  const getAllResourceByChId = async () => {
    try {
      const res = await getFetch(`/api/resource/${chapterId}`);
      const result = (await res.json()) as IResResources;
      if (res.ok && result.success) {
        setAddedResource(result.allResources);
      }
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };

  useEffect(() => {
    if (chapterId) {
      getAllResourceByChId();
    }
  }, [chapterId, refresh]);

  const onDeleteResource = async (resourceId: number) => {
    const deleteRes = await postFetch({ resourceId: resourceId }, "/api/resource/delete");
    const result = (await deleteRes.json()) as IResponse;
    if (deleteRes.ok) {
      message.success(result.message);
      setRefresh(!refresh);
    } else {
      message.error(result.error);
    }
  };

  return (
    <section className={styles.add_resource_section}>
      {addedResources?.length > 0 && (
        <div className={styles.resource_itmes}>
          {addedResources.map((r, i) => {
            return (
              <ResourceItem
                key={i}
                name={r.name}
                time={r.videoDuration}
                id={i}
                resourceId={Number(r.resourceId)}
                onEditResource={onEditResource}
                onDeleteResource={onDeleteResource}
                contentType={r.contentType}
              />
            );
          })}
        </div>
      )}
      <Form.Item label="Title" name="resource_title" rules={[{ required: true, message: "Required Title" }]}>
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item label="Description" name="resource_desc">
        <CustomEditorJS
          placeholder=""
          holder="resource_editor"
          editorRef={resourceRef}
          editorData={sltResource.description}
          readOnly={false}
        />
      </Form.Item>
      <Form.Item label="Choose content type" name="resource_type">
        <Segmented
          className="content-type-segment"
          onChange={(v) => setContentType(v)}
          options={["Video", "Assignment"]}
          size="middle"
        />
      </Form.Item>
      {contentType === "Video" ? (
        <Form.Item
          label="Video URL"
          name="resource_content"
          rules={[{ required: true, message: "Required Video URL" }]}
        >
          <Input placeholder="Video URL" />
        </Form.Item>
      ) : (
        <>
          <Form.Item label="Assignment" name="resource_assignment">
            <CustomEditorJS
              placeholder=""
              editorRef={assignmentRef}
              editorData={sltResource.assignment}
              readOnly={false}
              holder="resource_assign_editor"
            />
          </Form.Item>
          <Form.Item
            label="Days To Submit"
            name="daysToSubmit"
            rules={[{ required: true, message: "Required Days To Submit" }]}
          >
            <InputNumber min={1} placeholder="Days To Submit" />
          </Form.Item>
          <Form.Item label="Languages" name="assign_lang" rules={[{ required: true, message: "Required Languages" }]}>
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
        </>
      )}
      <Form.Item
        label="Video Duration (in secs)"
        name="resource_video_duration"
        rules={[{ required: true, message: "Required Video Duration" }]}
      >
        <InputNumber min={1} placeholder="Video Duration (in secs) " />
      </Form.Item>
      <Form.Item noStyle>
        <Space>
          <Button type="primary" onClick={onAddResource} loading={loading} style={{ padding: "0 40px" }}>
            {sltResource.name ? "Update" : "Save"}
          </Button>
          {sltResource.name && (
            <Button type="default" onClick={resetFields} style={{ padding: "0 40px" }}>
              Cancel
            </Button>
          )}
          <Button
            type="default"
            onClick={() => {}}
            style={{
              padding: "0 40px",
              backgroundColor: "#fff",
              color: "#000",
            }}
          >
            Back
          </Button>
        </Space>
      </Form.Item>
    </section>
  );
};

export default AddResourceForm;
