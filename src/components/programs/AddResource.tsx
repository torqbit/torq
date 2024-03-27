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
import ProgramService from "@/services/ProgramService";
import { error } from "console";
import { RcFile } from "antd/es/upload";
import SvgIcons from "../SvgIcons";

const ResourceList: FC<{
  name: string;
  contentType: ResourceContentType;
  setAddRes: (value: IAddResource) => void;
  addRes: IAddResource;
  duration: number | null;
  resId: number;
  onFindRsource: (id: number, content: ResourceContentType) => void;
  formData: FormInstance;
  chapterId: number;
}> = ({ name, contentType, duration, setAddRes, addRes, resId, chapterId, onFindRsource, formData }) => {
  const router = useRouter();

  const onDeleteResource = () => {
    ProgramService.deleteResource(
      Number(resId),
      (result) => {
        message.success(result.message);
        onFindRsource(chapterId, "Video");
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onEditResource = () => {
    ProgramService.getResource(
      resId,
      (result) => {
        formData.setFieldValue("name", result.resource?.name);
        formData.setFieldValue("description", result.resource?.description);
        formData.setFieldValue("assignmentLang", result.resource.assignmentLang);
        formData.setFieldValue("submitDay", result.resource.daysToSubmit);
        formData.setFieldValue("VideoUrl", result.resource.thumbnail);
        formData.setFieldValue("duration", result.resource.videoDuration);
        formData.setFieldValue("index", result.resource.sequenceId);
        formData.setFieldValue("assignment_file", result.resource.content);
        formData.setFieldValue("contentType", result.resource.contentType);

        setAddRes({
          ...addRes,
          content: result.resource.contentType,
          chapterId: result.resource.chapterId,
        });
      },
      (error) => {}
    );
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",

      onClick: () => {
        onEditResource();
      },
      style: { textAlign: "center" },
    },
    {
      key: "2",

      label: (
        <Popconfirm
          title="Delete the Resource"
          description="Are you sure to delete this resource?"
          onConfirm={onDeleteResource}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
      onClick: () => {},
      style: { textAlign: "center" },
    },
  ];
  return (
    <div className={`${styles.resorceListWrapper}  ${Number(router.query.resId) === resId && `${styles.resSelected}`}`}>
      <div className={styles.resourceListContent}>
        <div>
          {contentType === "Video" ? (
            <img height={30} width={30} src="/img/about-course/playcircle.svg" alt="Video" />
          ) : (
            <img height={30} width={30} src="/img/about-course/assignment.svg" alt="Assignment" />
          )}
        </div>
        <div>
          <div>{name ? name : <>{contentType === "Video" ? "New Video" : "New Assignment"}</>}</div>
          {contentType === "Assignment" ? <div>{duration} hrs</div> : <div>{duration} min</div>}
        </div>
      </div>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" arrow>
        <EllipsisOutlined className={styles.ellipsisOutlined} />
      </Dropdown>
    </div>
  );
};

const AddResource: FC<{
  setAddRes: (value: IAddResource) => void;
  addRes: IAddResource;
  formData: FormInstance;
  onDeleteVideo: (id: string) => void;
  isEdit: boolean;
  uploadResourceUrl: {
    fileName?: string;
    videoUrl?: string;
    videoId?: string;
  };
  loading: boolean | undefined;
  chapterId: number;
  onUploadVideo: (file: RcFile, title: string) => void;
  onCreateRes: (chapterId: number) => void;
  setResourceDrawer: (value: boolean) => void;
  showResourceDrawer: boolean;
  availableRes: Resource[] | undefined;
  onFindRsource: (id: number, content: ResourceContentType) => void;
  onUpdateRes: (resId: number) => void;
  onDeleteThumbnail: (name: string, dir: string) => void;
  uploadFile: (file: any, title: string) => void;
  currResId?: number;
}> = ({
  setResourceDrawer,
  showResourceDrawer,
  onUpdateRes,
  uploadResourceUrl,
  loading,
  chapterId,
  isEdit,
  setAddRes,
  formData,
  onDeleteVideo,
  onCreateRes,
  availableRes,
  onUploadVideo,
  addRes,
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
      setAddRes({ ...addRes, assignmentFileName: res.fileName });
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
            {/* <div>
              <ResourceList
                chapterId={0}
                resId={0}
                formData={formData}
                onFindRsource={onFindRsource}
                name={addRes.name}
                duration={addRes.duration}
                contentType={addRes.content}
                setAddRes={setAddRes}
                addRes={addRes}
              />
            </div> */}
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
          formData.resetFields();
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
                {isEdit ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setResourceDrawer(false);

                  formData.resetFields();
                  setAddRes({
                    content: "Video",
                    chapterId: 0,
                    name: "",
                    duration: 0,
                    assignmentFileName: "",
                  });
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
                    !router.query.resId && setAddRes({ ...addRes, name: e.target.value });
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

              {addRes.content === "Video" && (
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
                              src={`https://vz-bb827f5e-131.b-cdn.net/${uploadResourceUrl.videoUrl}/thumbnail.jpg`}
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
                  <div>
                    <Form.Item
                      name="duration"
                      label="Video Duration(in minutes)"
                      rules={[{ required: true, message: "Please Enter Description" }]}
                    >
                      <InputNumber
                        onChange={(e) => !router.query.resId && setAddRes({ ...addRes, duration: Number(e) })}
                        style={{ width: 330 }}
                        placeholder="Enter the Duration"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}
              {addRes.content === "Assignment" && (
                <div>
                  <Form.Item
                    label="Hours To Submit "
                    name="submitDay"
                    rules={[{ required: true, message: "Required Days" }]}
                  >
                    <InputNumber
                      onChange={(e) => !router.query.resId && setAddRes({ ...addRes, duration: Number(e) })}
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
