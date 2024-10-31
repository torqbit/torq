import React, { FC } from "react";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, FormInstance, Input, Popconfirm, Radio, Select, Space, Switch, Tooltip, Upload, UploadProps } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { ChapterDetail, VideoInfo } from "@/types/courses/Course";
import ImgCrop from "antd-img-crop";
import { certificateConfig } from "@/lib/certificatesConfig";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { $Enums, VideoState } from "@prisma/client";

const { TextArea } = Input;

const CourseSetting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;
  uploadFile: (file: any, title: string) => void;
  onUploadTrailer: (file: RcFile, title: string) => void;
  courseBannerUploading: boolean;
  courseTrailerUploading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: {
    name: string;
    description: string;
    expiryInDays: number;
    chapters: ChapterDetail[];
    coursePrice?: number;
  };
  courseBanner?: string;
  uploadVideo?: VideoInfo;
  settingLoading?: boolean;
  selectedCourseType: { free: boolean; paid: boolean };
  selectCourseType: (courseType: $Enums.CourseType) => void;
}> = ({
  onSubmit,
  form,
  courseData,
  onUploadTrailer,
  uploadFile,
  onDiscard,
  courseBannerUploading,
  courseTrailerUploading,
  uploadVideo,
  onSetCourseData,
  courseBanner,
  settingLoading,
  selectedCourseType,
  selectCourseType,
}) => {
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };

  const courseDifficulty = ["Beginner", "Intermediate", "Advance"];

  return (
    <>
      {settingLoading ? (
        <>
          <SpinLoader />
        </>
      ) : (
        <section className={styles.add_course_setting}>
          <Form form={form} onFinish={onSubmit} layout='vertical' requiredMark={false}>
            <div className={styles.setting_header}>
              <h3>Settings</h3>
              <Space>
                <Popconfirm
                  title={`Delete this course`}
                  description={`Are you sure to delete this entire course?`}
                  onConfirm={() => onDiscard()}
                  okText='Yes'
                  cancelText='No'>
                  <Button>Discard</Button>
                </Popconfirm>
                <Button
                  type='primary'
                  htmlType='submit'
                  className={styles.save_setting_btn}
                  disabled={
                    courseTrailerUploading || uploadVideo?.state == VideoState.PROCESSING || !uploadVideo?.videoUrl || !courseBanner
                  }>
                  Save Settings <img style={{ marginLeft: 5 }} src='/img/program/arrow-right.png' alt='arrow' />
                </Button>
              </Space>
            </div>
            <div className={styles.course_info}>
              <h4>Basic Setting</h4>

              <Form.Item label='Course Name' name='course_name' rules={[{ required: true, message: "Required!" }]}>
                <Input
                  placeholder='Course Name'
                  defaultValue={form.getFieldsValue().course_name}
                  onChange={(e) => {
                    onSetCourseData("name", e.currentTarget.value);
                  }}
                />
              </Form.Item>

              <Form.Item label='Course Description' name='course_description' rules={[{ required: true, message: "Required" }]}>
                <TextArea
                  onChange={(e) => {
                    onSetCourseData("descripiton", e.currentTarget.value);
                  }}
                  rows={3}
                  placeholder='A brief description about the course'
                />
              </Form.Item>

              <Form.Item
                name='course_difficulty'
                label='Difficulty level'
                rules={[
                  {
                    required: true,
                    message: "Required difficulty level",
                  },
                ]}>
                <Select
                  placeholder='Choose Difficulty level'
                  onChange={(e) => {
                    onSetCourseData("difficultyLevel", e);
                  }}>
                  {courseDifficulty.map((difficulty, i) => {
                    return (
                      <Select.Option key={i} value={`${difficulty}`}>
                        {difficulty}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name='certificate_template'
                label='Certificate Template'
                rules={[
                  {
                    required: true,
                    message: "Required Certificate template level",
                  },
                ]}>
                <Select
                  placeholder='Choose Certificate Template'
                  onChange={(e) => {
                    onSetCourseData("certificateTemplate", e);
                  }}>
                  {certificateConfig.map((certificate, i) => {
                    return (
                      <Select.Option key={i} value={`${certificate.id}`}>
                        {certificate.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={"previewMode"} label={"Preview Mode"}>
                <Switch value={true} />
              </Form.Item>
            </div>
            <div className={styles.course_thumbnails}>
              <h4>Trailer and thumbnail images</h4>
              <div className={styles.row_1}>
                <div>
                  <h5>Course trailer video</h5>
                  <p>Upload a video of upto 30 sec duration in 16:9 aspect ratio</p>
                </div>
                <div className={styles.video_container}>
                  <Upload
                    name='avatar'
                    listType='picture-card'
                    className={styles.upload__trailer}
                    disabled={courseTrailerUploading || uploadVideo?.state == VideoState.PROCESSING}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      onUploadTrailer(file, `${form.getFieldsValue().course_name}`);
                    }}
                    onChange={handleChange}>
                    {uploadVideo?.state == VideoState.READY && !courseTrailerUploading && (
                      <Tooltip title='Upload new trailer video'>
                        <img src={uploadVideo?.thumbnail} alt='' height={180} className={styles.video_container} width={320} />
                        <div
                          style={{ height: 50, width: 50, fontSize: "1.4rem" }}
                          className={`${styles.video_status} ${styles.video_status_ready}`}>
                          {SvgIcons.video}
                        </div>
                      </Tooltip>
                    )}
                    {(uploadVideo?.state == VideoState.PROCESSING || courseTrailerUploading) && (
                      <div style={{ height: 50, width: 80 }} className={`${styles.video_status} ${styles.video_status_loading}`}>
                        <LoadingOutlined />
                        <span>{courseTrailerUploading ? "Uploading" : "Processing"}</span>
                      </div>
                    )}
                    {!uploadVideo?.state && !courseTrailerUploading && (
                      <div style={{ height: 50, width: 150 }} className={`${styles.video_status} ${styles.video_status_loading}`}>
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
                  <ImgCrop rotationSlider>
                    <Upload
                      name='avatar'
                      listType='picture-card'
                      className={styles.upload__thumbnail}
                      disabled={courseTrailerUploading}
                      showUploadList={false}
                      style={{ width: 118, height: 118 }}
                      beforeUpload={(file) => {
                        uploadFile(file, `${form.getFieldsValue().course_name}_banner`);
                      }}
                      onChange={handleChange}>
                      {courseBanner ? (
                        <>
                          <img style={{ borderRadius: 4, objectFit: "cover", width: 148, height: 148 }} src={courseBanner} />
                          <Tooltip title='Upload course thumbnail'>
                            <div className={styles.camera_btn_img}>
                              {courseBannerUploading && courseBanner ? <LoadingOutlined /> : SvgIcons.camera}
                            </div>
                          </Tooltip>
                          <div className={styles.bannerStatus}>{courseBannerUploading && "Uploading"}</div>
                        </>
                      ) : (
                        <button
                          className={styles.upload_img_button}
                          style={{ border: 0, background: "none", width: 150, height: 150 }}
                          type='button'>
                          {courseBannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                          {!courseBannerUploading ? (
                            <div style={{ marginTop: 8 }}>Upload Image</div>
                          ) : (
                            <div style={{ color: "#000" }}>{courseBannerUploading && "Uploading"}</div>
                          )}
                        </button>
                      )}
                    </Upload>
                  </ImgCrop>
                </div>
              </div>
            </div>
            <div className={styles.course_pricing}>
              <h4>Pricing</h4>
              <p>Displayed on the Course listing and landing page</p>
              <div className={styles.course_payment_type}>
                <div className={styles.free_course}>
                  <Radio checked={selectedCourseType.free} onClick={() => selectCourseType($Enums.CourseType.FREE)}>
                    Free
                  </Radio>
                  <p>Free content for the specified duration </p>
                  <p>Days until expiry</p>
                  <Form.Item name='expiryInDays'>
                    <div className={styles.days_left}>
                      <Input
                        disabled={selectedCourseType.paid}
                        placeholder='days left'
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
                  <Radio checked={selectedCourseType.paid} onClick={() => selectCourseType($Enums.CourseType.PAID)}>
                    One time Payment
                  </Radio>
                  <p>Paid content for the specified duration </p>

                  <div className={styles.paid_overview}>
                    <div>
                      <p className={styles.expiry_para}> {`Price (in USD)`}</p>
                      <div className={styles.days_left}>
                        <Input
                          disabled={selectedCourseType.free}
                          placeholder='add price'
                          onChange={(e) => {
                            onSetCourseData("coursePrice", e.currentTarget.value);
                          }}
                          defaultValue={selectedCourseType.free ? 0 : courseData.coursePrice}
                        />

                        <div>Price</div>
                      </div>
                    </div>
                    <div>
                      <p className={styles.expiry_para}>Days until expiry</p>
                      <div className={styles.days_left}>
                        <Input
                          disabled={selectedCourseType.free}
                          placeholder='days left'
                          onChange={(e) => {
                            onSetCourseData("expiryInDays", e.currentTarget.value);
                          }}
                          value={courseData.expiryInDays || form.getFieldsValue().expiryInDays}
                          defaultValue={courseData.expiryInDays}
                        />

                        <div>Days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </section>
      )}
    </>
  );
};

export default CourseSetting;
