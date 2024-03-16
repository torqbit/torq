import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, FormInstance, Input, Radio, Space, Upload, UploadProps } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";

const { TextArea } = Input;

const Setting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;

  beforeUpload: (file: any, fileType: string) => void;
  loading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: { name: string; description: string; duration: number };
  uploadUrl: {
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  };
  refresh: boolean;
}> = ({ onSubmit, form, courseData, onDiscard, beforeUpload, loading, uploadUrl, onSetCourseData, refresh }) => {
  const router = useRouter();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Video</div>
    </button>
  );

  useEffect(() => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        form.setFieldValue("course_name", result.getCourse.name);
        form.setFieldValue("course_description", result.getCourse.description);
        onSetCourseData("duration", String(result.getCourse.durationInMonths));
      },
      (error) => {}
    );
  }, [router.query.id, refresh]);
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      return;
    }
    if (info.file.status === "done") {
    }
  };

  return (
    <section className={styles.add_course_setting}>
      <div className={styles.setting_header}>
        <h3>Settings</h3>
        <Space>
          <Button onClick={() => onDiscard()}>Discard</Button>
          <Button type="primary" onClick={() => onSubmit()} className={styles.save_setting_btn}>
            Save Settings <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
          </Button>
        </Space>
      </div>
      <div className={styles.course_info}>
        <h3>Basic Setting</h3>
        <Form form={form} onFinish={() => {}} layout="vertical" requiredMark={false}>
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
        </Form>
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
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={(file) => {
                beforeUpload(file, "video");
              }}
              onChange={handleChange}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                {loading && uploadUrl?.uploadType === "video" ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                <div style={{ marginTop: 8 }}>Upload Video</div>
              </button>
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
                beforeUpload(file, "img");
              }}
              onChange={handleChange}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                {loading && uploadUrl?.uploadType === "img" ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                <div style={{ marginTop: 8 }}>Upload Image</div>
              </button>
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
            <div className={styles.days_left}>
              <Input
                placeholder="days left"
                onChange={(e) => {
                  onSetCourseData("duration", e.currentTarget.value);
                }}
                value={courseData.duration}
                defaultValue={courseData.duration}
              />
              <div>Days</div>
            </div>
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
    </section>
  );
};

export default Setting;
