import { Button, Drawer, Form, FormInstance, Input, Upload, Space, Tooltip } from "antd";
import { FC } from "react";
import styles from "@/styles/AddCourse.module.scss";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import SvgIcons from "../../SvgIcons";
import { IVideoLesson } from "@/types/courses/Course";

const AddVideoLesson: FC<{
  formData: FormInstance;
  isEdit: boolean;
  videoLesson: IVideoLesson;
  setVideoLesson: React.Dispatch<React.SetStateAction<IVideoLesson>>;
  videoUploading: boolean;
  onRefresh: () => void;
  onUploadVideo: (file: RcFile, title: string, resourceId: number) => void;
  setResourceDrawer: (value: boolean) => void;
  showResourceDrawer: boolean;
  onDeleteResource: (id: number) => void;
  onUpdateVideoLesson: (resId: number) => void;
  currResId?: number;
}> = ({
  setResourceDrawer,
  showResourceDrawer,
  onUpdateVideoLesson,
  onRefresh,
  videoLesson,
  setVideoLesson,
  videoUploading,
  isEdit,
  onDeleteResource,
  formData,
  onUploadVideo,
  currResId,
}) => {
  return (
    <>
      <Drawer
        classNames={{ header: styles.headerWrapper, body: styles.body, footer: styles.footer }}
        width={400}
        maskClosable={false}
        closeIcon={false}
        className={styles.newResDetails}
        title={
          <div className={styles.drawerHeader}>
            <Space className={styles.drawerTitle}>
              <CloseOutlined
                onClick={() => {
                  currResId && !isEdit && onDeleteResource(currResId);
                  setResourceDrawer(false);
                  formData.resetFields();
                  onRefresh();
                }}
              />
              New Resource Details
            </Space>
          </div>
        }
        placement="right"
        open={showResourceDrawer}
        footer={
          <Form
            form={formData}
            onFinish={() => {
              onUpdateVideoLesson(Number(currResId));
            }}
          >
            <Space className={styles.footerBtn}>
              <Button type="primary" htmlType="submit" disabled={videoUploading || !videoLesson.video}>
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
              currResId && onUpdateVideoLesson(currResId);
            }}
          >
            <div className={styles.formCourseName}>
              <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
                <Input
                  onChange={(e) => {
                    setVideoLesson({ ...videoLesson, title: e.currentTarget.value });
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
                    <Input.TextArea
                      onChange={(e) => {
                        setVideoLesson({ ...videoLesson, description: e.currentTarget.value });
                      }}
                      rows={4}
                      placeholder="Brief description about the resource"
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <div>
                  <Form.Item
                    name="videoUrl"
                    label="Upload Video"
                    rules={[{ required: true, message: "Please Enter Description" }]}
                  >
                    <Upload
                      name="avatar"
                      disabled={videoUploading}
                      listType="picture-card"
                      className={"resource_video_uploader"}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        currResId && onUploadVideo(file, formData.getFieldsValue().name, currResId);
                      }}
                    >
                      {videoLesson?.video?.state == "READY" && !videoUploading && (
                        <Tooltip title="Upload new lesson video">
                          <img
                            src={videoLesson?.video?.thumbnail}
                            alt=""
                            height={180}
                            className={styles.video_container}
                            width={320}
                          />
                          <div
                            style={{ height: 50, width: 50, fontSize: "1.4rem" }}
                            className={`${styles.video_status} ${styles.video_status_ready}`}
                          >
                            {SvgIcons.video}
                          </div>
                        </Tooltip>
                      )}
                      {(videoLesson?.video?.state == "PROCESSING" || videoUploading) && (
                        <div
                          style={{ height: 50, width: 80 }}
                          className={`${styles.video_status} ${styles.video_status_loading}`}
                        >
                          <LoadingOutlined />
                          <span>{videoUploading ? "Uploading" : "Processing"}</span>
                        </div>
                      )}
                      {!videoLesson?.video?.state && !videoUploading && (
                        <div
                          style={{ height: 50, width: 150 }}
                          className={`${styles.video_status} ${styles.video_status_loading}`}
                        >
                          <i style={{ display: "block" }}>{SvgIcons.video}</i>
                          <span>Upload Video</span>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default AddVideoLesson;
