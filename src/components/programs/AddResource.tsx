import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Segmented,
  Upload,
  Select,
  message,
  Space,
  Popconfirm,
  MenuProps,
  Dropdown,
  Flex,
} from "antd";
import { FC, useState } from "react";
import styles from "@/styles/AddCourse.module.scss";
import { useRouter } from "next/router";
import { CloseOutlined, EllipsisOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Resource, ResourceContentType } from "@prisma/client";
import appConstant from "@/services/appConstant";
import { IAddResource } from "@/lib/types/program";
import { RcFile } from "antd/es/upload";
import SvgIcons from "../SvgIcons";
import { UploadedResourceDetail } from "@/types/courses/Course";

const AddResource: FC<{
  setAddResource: (value: IAddResource) => void;
  addResource: IAddResource;
  formData: FormInstance;
  onDeleteVideo: (id: string) => void;
  isEdit: boolean;
  uploadResourceUrl: UploadedResourceDetail;
  loading: boolean | undefined;
  chapterId: number;
  onRefresh: () => void;
  onUploadVideo: (file: RcFile, title: string) => void;
  onCreateRes: (chapterId: number) => void;
  setResourceDrawer: (value: boolean) => void;
  showResourceDrawer: boolean;
  availableRes: Resource[] | undefined;
  onDeleteResource: (id: number) => void;
  onFindRsource: (id: number, content: ResourceContentType) => void;
  onUpdateRes: (resId: number) => void;
  onDeleteThumbnail: (name: string, dir: string) => void;
  uploadFile: (file: any, title: string) => void;
  currResId?: number;
}> = ({
  setResourceDrawer,
  showResourceDrawer,
  onUpdateRes,
  onRefresh,
  uploadResourceUrl,
  loading,
  chapterId,
  isEdit,
  onDeleteResource,
  setAddResource,
  formData,
  onDeleteVideo,
  onCreateRes,
  availableRes,
  onUploadVideo,
  addResource,
  onFindRsource,
  currResId,
  onDeleteThumbnail,
  uploadFile,
}) => {
  const router = useRouter();
  const onUploadAssignment = (info: any) => {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      const res = info.file.response; // TODO
      setAddResource({ ...addResource, assignmentFileName: res.fileName });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  let currentSeqIds = availableRes?.map((r) => {
    return r.sequenceId;
  });

  return (
    <>
      <Drawer
        width={400}
        maskClosable={false}
        closeIcon={false}
        className={styles.newResDetails}
        title={
          <div className={styles.drawerHeader}>
            <Space className={styles.drawerTitle}>
              <CloseOutlined
                onClick={() => {
                  setResourceDrawer(false);
                }}
              />
              New Resource Details
            </Space>
          </div>
        }
        placement="right"
        onClose={() => {
          setResourceDrawer(false);
          currResId && !isEdit && onDeleteResource(currResId);
          formData.resetFields();
          onRefresh();
        }}
        open={showResourceDrawer}
        footer={
          <Form
            form={formData}
            onFinish={() => {
              isEdit ? onUpdateRes(Number(currResId)) : onCreateRes(chapterId);
            }}
          >
            <Space className={styles.footerBtn}>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Update" : "Save Lesson"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setResourceDrawer(false);
                  currResId && !isEdit && onDeleteResource(currResId);
                  formData.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        }
      >
        <div className={styles.drawerContainer}>
          <Form
            form={formData}
            layout="vertical"
            onFinish={() => {
              isEdit && currResId ? onUpdateRes(currResId) : onCreateRes(chapterId);
            }}
          >
            <div className={styles.formCourseName}>
              <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
                <Input
                  onChange={(e) => {
                    !router.query.resId && setAddResource({ ...addResource, name: e.target.value });
                  }}
                  value={formData.getFieldsValue().name}
                  placeholder="Set the title of the resource"
                />
              </Form.Item>
              <div>
                <div>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please Enter Description" }]}
                  >
                    <Input.TextArea rows={4} placeholder="Brief description about the resource" />
                  </Form.Item>
                </div>
              </div>

              {addResource.content === "Video" && (
                <div>
                  <div>
                    <Form.Item
                      name="VideoUrl"
                      label="Video URL"
                      rules={[{ required: true, message: "Please Enter Description" }]}
                    >
                      <Upload
                        name="avatar"
                        disabled={!formData.getFieldsValue().name && !isEdit ? true : false}
                        listType="picture-card"
                        className={"resource_video_uploader"}
                        showUploadList={false}
                        beforeUpload={(file) => {
                          if (uploadResourceUrl.videoUrl) {
                            onDeleteVideo(uploadResourceUrl.videoUrl);
                          }
                          onUploadVideo(file, formData.getFieldsValue().name);
                        }}
                      >
                        {uploadResourceUrl?.videoUrl ? (
                          <>
                            <img
                              src={uploadResourceUrl.thumbnail}
                              alt=""
                              height={"100%"}
                              className={styles.video_container}
                              width={355}
                              onClick={() => {}}
                            />
                          </>
                        ) : (
                          <button style={{ border: 0, background: "none", width: 350 }} type="button">
                            {loading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                            <div style={{ marginTop: 8 }}>Upload Video</div>
                          </button>
                        )}
                      </Upload>
                      {uploadResourceUrl?.videoUrl && (
                        <div className={styles.camera_btn}>{loading ? <LoadingOutlined /> : SvgIcons.video}</div>
                      )}
                    </Form.Item>
                  </div>
                </div>
              )}
              {addResource.content === "Assignment" && (
                <div>
                  <Form.Item
                    label="Hours To Submit "
                    name="submitDay"
                    rules={[{ required: true, message: "Required Days" }]}
                  >
                    <InputNumber
                      onChange={(e) => !router.query.resId && setAddResource({ ...addResource, duration: Number(e) })}
                      style={{ width: 330 }}
                      min={1}
                      placeholder="Enter submit hours"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Languages"
                    name="assignmentLang"
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
                      name="avatar"
                      listType="picture-card"
                      className={"resource_video_uploader"}
                      showUploadList={false}
                      disabled={!formData.getFieldsValue().name ? true : false}
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      beforeUpload={(file) => {
                        // beforeUpload(file, "img");
                        if (uploadResourceUrl.fileName) {
                          onDeleteThumbnail(uploadResourceUrl.fileName, "course-assignments");
                        }
                        uploadFile(file, formData.getFieldsValue().name);
                      }}
                    >
                      {uploadResourceUrl.fileName ? (
                        <>
                          <img
                            height={"100%"}
                            width={355}
                            style={{ marginLeft: 20, objectFit: "cover" }}
                            src={`https://torqbit-dev.b-cdn.net/static/course-assignments/${uploadResourceUrl.fileName}`}
                          />
                          {uploadResourceUrl?.fileName && (
                            <div className={styles.camera_btn_img}>
                              {" "}
                              {loading ? <LoadingOutlined /> : SvgIcons.file}
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          style={{ border: 0, background: "none" }}
                          onClick={() => {
                            if (!formData.getFieldsValue().name) {
                              message.warning("please enter the title of the resource");
                            }
                          }}
                          type="button"
                        >
                          {loading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                          <div style={{ marginTop: 8 }}>Upload File</div>
                        </button>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              )}
            </div>
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default AddResource;
