import React, { FC, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, FormInstance, Input, Popconfirm, Radio, Space, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { useRouter } from "next/router";
import { ChapterDetail } from "@/pages/add-course";
import { onDeleteVideo } from "@/pages/api/v1/upload/video/method";
import ProgramService from "@/services/ProgramService";
import { postWithFile } from "@/services/request";

const { TextArea } = Input;

const Setting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;
  setLoading: (value: boolean) => void;
  uploadFile: (file: any, accessKey: string, type: string, dir: string) => void;
  onRefresh: () => void;
  createVideo: (title: string, libraryId: number, accessKey: string, courseId: number, file: any, type: string) => void;

  loading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: { name: string; description: string; duration: number; chapter: ChapterDetail[] };
  uploadUrl: {
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  };
  refresh: boolean;
  onDeleteThumbnail: (name: string, accessKey: string, dir: string) => void;
}> = ({
  onSubmit,
  form,
  courseData,
  createVideo,
  setLoading,
  uploadFile,
  onDiscard,

  loading,
  uploadUrl,
  onSetCourseData,
  onDeleteThumbnail,
  refresh,
  onRefresh,
}) => {
  const router = useRouter();

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
    }
  };

  return (
    <section className={styles.add_course_setting}>
      <Form form={form} onFinish={onSubmit} layout="vertical" requiredMark={false}>
        <div className={styles.setting_header}>
          <h3>Settings</h3>
          <Space>
            <Popconfirm
              title={`Delete this course`}
              description={`Are you sure to delete this entire course?`}
              onConfirm={() => onDiscard()}
              okText="Yes"
              cancelText="No"
            >
              <Button>Discard</Button>
            </Popconfirm>
            <Button type="primary" htmlType="submit" className={styles.save_setting_btn}>
              Save Settings <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
            </Button>
          </Space>
        </div>
        <div className={styles.course_info}>
          <h3>Basic Setting</h3>

          <Form.Item label="Course Name" name="course_name" rules={[{ required: true, message: "Required!" }]}>
            <Input
              placeholder="Course Name"
              onChange={(e) => {
                onSetCourseData("name", e.currentTarget.value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Course Description"
            name="course_description"
            rules={[{ required: true, message: "Required" }]}
          >
            <TextArea
              onChange={(e) => {
                onSetCourseData("descripiton", e.currentTarget.value);
              }}
              rows={3}
              placeholder="A brief description about the course"
            />
          </Form.Item>
        </div>
        <div className={styles.course_thumbnails}>
          <h3>Trailer and thumbnail images</h3>
          <div className={styles.row_1}>
            <div>
              <h4>Course trailer video</h4>
              <p>Displayed on the course details page</p>
              <p>Upload a video of upto 30 sec duration in 16:9 aspect ratio</p>
            </div>
            <div className={styles.video_container}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={"course_video_uploader"}
                showUploadList={false}
                beforeUpload={(file) => {
                  if (router.query.id) {
                    ProgramService.getCredentials(
                      "bunny",
                      async (result) => {
                        if (uploadUrl.videoUrl) {
                          onDeleteVideo(
                            uploadUrl.videoUrl as string,
                            Number(uploadUrl.videoId),
                            result.credentials.api_key
                          );
                        }
                        createVideo(
                          `${form.getFieldsValue().course_name}_trailer`,
                          Number(result.credentials.api_secret),
                          result.credentials.api_key,
                          Number(router.query.id),
                          file,
                          "trailer"
                        );
                      },
                      (error) => {}
                    );
                  }
                }}
                onChange={handleChange}
              >
                {uploadUrl?.videoUrl ? (
                  <>
                    <img
                      src={`https://vz-bb827f5e-131.b-cdn.net/${uploadUrl.videoUrl}/thumbnail.jpg`}
                      alt=""
                      height={"100%"}
                      className={styles.video_container}
                      width={"100%"}
                    />

                    {uploadUrl?.videoUrl && (
                      <div style={{ width: 230 }} className={styles.camera_btn}>
                        {loading ? <LoadingOutlined /> : SvgIcons.video}
                      </div>
                    )}
                  </>
                ) : (
                  <button style={{ border: 0, background: "none" }} type="button">
                    {loading && uploadUrl?.uploadType === "video" ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                    <div style={{ marginTop: 8 }}>Upload Video</div>
                  </button>
                )}
              </Upload>
            </div>
          </div>
          <div className={styles.row_2}>
            <div>
              <h4>Course thumbnail image</h4>
              <p>Displayed on the course listing page</p>
              <p>Upload a photo of 250 x 250 pixels</p>
            </div>
            <div className={styles.video_container}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={"course_thumbnail_uploader"}
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={(file) => {
                  // beforeUpload(file, "img");
                  if (router.query.id) {
                    ProgramService.getCredentials(
                      "bunny img",
                      async (result) => {
                        if (uploadUrl.thumbnailImg) {
                          onDeleteThumbnail(uploadUrl.thumbnailImg, result.credentials.api_key, "course-banners");
                        }
                        uploadFile(file, result.credentials.api_key, "banner", "course-banners");
                      },
                      (error) => {}
                    );
                  }
                }}
                onChange={handleChange}
              >
                {uploadUrl?.thumbnailImg ? (
                  <>
                    <img
                      height={"100%"}
                      width={"100%"}
                      style={{ marginLeft: 20, objectFit: "cover" }}
                      src={`https://torqbit-dev.b-cdn.net/static/course-banners/${uploadUrl.thumbnailImg}`}
                    />
                    {uploadUrl?.thumbnailImg && <div className={styles.camera_btn_img}>{SvgIcons.camera}</div>}
                  </>
                ) : (
                  <button style={{ border: 0, background: "none" }} type="button">
                    {loading && uploadUrl?.uploadType === "img" ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                    <div style={{ marginTop: 8 }}>Upload Image</div>
                  </button>
                )}
              </Upload>
            </div>
          </div>
        </div>
        <div className={styles.course_pricing}>
          <h4>Pricing</h4>
          <p>Displayed on the Course listing and landing page</p>
          <div className={styles.course_payment_type}>
            <div className={styles.free_course}>
              <Radio checked>Free</Radio>
              <p>Free content for the specified duration </p>
              <p>Days until expiry</p>
              <Form.Item name="course_duation">
                <div className={styles.days_left}>
                  <Input
                    placeholder="days left"
                    onChange={(e) => {
                      onSetCourseData("duration", e.currentTarget.value);
                    }}
                    value={courseData.duration || form.getFieldsValue().course_duration}
                    defaultValue={courseData.duration}
                  />

                  <div>Days</div>
                </div>
              </Form.Item>
            </div>
            <div className={styles.paid_course}>
              <Radio disabled>One time Payment</Radio>
              <p>Paid content for the specified duration </p>

              <div className={styles.paid_overview}>
                <div>
                  <p className={styles.expiry_para}> {`Price (in USD)`}</p>
                  <div className={styles.days_left}>
                    <Input placeholder="add price" disabled defaultValue={149} />

                    <div>Price</div>
                  </div>
                </div>
                <div>
                  <p className={styles.expiry_para}>Days until expiry</p>
                  <div className={styles.days_left}>
                    <Input placeholder="days left" disabled defaultValue={365} />

                    <div>Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </section>
  );
};

export default Setting;
