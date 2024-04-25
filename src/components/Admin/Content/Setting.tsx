import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";

import {
  Button,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Radio,
  Space,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { useRouter } from "next/router";
import { onDeleteVideo } from "@/pages/api/v1/upload/bunny/create";
import ProgramService from "@/services/ProgramService";
import { postWithFile } from "@/services/request";
import { RcFile } from "antd/es/upload";
import { ChapterDetail, VideoInfo } from "@/types/courses/Course";

const { TextArea } = Input;

const CourseSetting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;
  onDeleteVideo: (id: string) => void;
  uploadFile: (file: any, title: string) => void;
  onRefresh: () => void;
  onUploadTrailer: (file: RcFile, title: string) => void;
  courseBannerUploading: boolean;
  courseTrailerUploading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: { name: string; description: string; expiryInDays: number; chapters: ChapterDetail[] };
  courseBanner?: string;
  uploadVideo?: VideoInfo;
  refresh: boolean;
  onDeleteThumbnail: (name: string, dir: string) => void;
}> = ({
  onSubmit,
  form,
  courseData,
  onUploadTrailer,
  uploadFile,
  onDiscard,
  onDeleteVideo,
  courseBannerUploading,
  courseTrailerUploading,
  uploadVideo,
  onSetCourseData,
  courseBanner,
  onDeleteThumbnail,
  refresh,
  onRefresh,
}) => {
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
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
            <Button
              type="primary"
              htmlType="submit"
              className={styles.save_setting_btn}
              disabled={courseTrailerUploading || uploadVideo?.state == "PROCESSING"}
            >
              Save Settings <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
            </Button>
          </Space>
        </div>
        <div className={styles.course_info}>
          <h3>Basic Setting</h3>

          <Form.Item label="Course Name" name="course_name" rules={[{ required: true, message: "Required!" }]}>
            <Input
              placeholder="Course Name"
              defaultValue={form.getFieldsValue().course_name}
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
              <p>Upload a video of upto 30 sec duration in 16:9 aspect ratio</p>
            </div>
            <div className={styles.video_container}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={styles.upload__trailer}
                disabled={courseTrailerUploading || uploadVideo?.state == "PROCESSING"}
                showUploadList={false}
                beforeUpload={(file) => {
                  if (uploadVideo && uploadVideo.videoUrl) {
                    onDeleteVideo(uploadVideo.videoUrl);
                  }
                  onUploadTrailer(file, `${form.getFieldsValue().course_name}_trailer`);
                }}
                onChange={handleChange}
              >
                {uploadVideo?.state == "READY" && !courseTrailerUploading && (
                  <Tooltip title="Upload new trailer video">
                    <img
                      src={uploadVideo?.thumbnail}
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
                {(uploadVideo?.state == "PROCESSING" || courseTrailerUploading) && (
                  <div
                    style={{ height: 50, width: 80 }}
                    className={`${styles.video_status} ${styles.video_status_loading}`}
                  >
                    <LoadingOutlined />
                    <span>{courseTrailerUploading ? "Uploading" : "Processing"}</span>
                  </div>
                )}
                {!uploadVideo?.state && !courseTrailerUploading && (
                  <div
                    style={{ height: 50, width: 150 }}
                    className={`${styles.video_status} ${styles.video_status_loading}`}
                  >
                    <i style={{ display: "block" }}>{SvgIcons.video}</i>
                    <span>Upload Video</span>
                  </div>
                )}
              </Upload>
            </div>
          </div>
          <div className={styles.row_2}>
            <div>
              <h4>Course thumbnail image</h4>
              <p>Upload a photo of 256px x 256px </p>
            </div>
            <div className={styles.video_container}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={styles.upload__thumbnail}
                disabled={courseTrailerUploading}
                showUploadList={false}
                style={{ width: 118, height: 118 }}
                beforeUpload={(file) => {
                  if (courseBanner) {
                    onDeleteThumbnail(courseBanner, "course-banners");
                  }
                  uploadFile(file, `${form.getFieldsValue().course_name}_banner`);
                }}
                onChange={handleChange}
              >
                {courseBanner ? (
                  <>
                    <img style={{ borderRadius: 4, objectFit: "cover", width: 148, height: 148 }} src={courseBanner} />
                    <Tooltip title="Upload course thumbnail">
                      <div className={styles.camera_btn_img}>
                        {courseBannerUploading && courseBanner ? <LoadingOutlined /> : SvgIcons.camera}
                      </div>
                    </Tooltip>
                  </>
                ) : (
                  <button style={{ border: 0, background: "none", width: 150, height: 150 }} type="button">
                    {courseBannerUploading && courseBanner ? <LoadingOutlined /> : SvgIcons.uploadIcon}
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
              <Form.Item name="expiryInDays">
                <div className={styles.days_left}>
                  <Input
                    placeholder="days left"
                    onChange={(e) => {
                      onSetCourseData("expiryInDays", e.currentTarget.value);
                    }}
                    value={courseData.expiryInDays || form.getFieldsValue().expiryInDays}
                    defaultValue={courseData.expiryInDays}
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

export default CourseSetting;
