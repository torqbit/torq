import React, { FC, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Form, Input, List, Radio, Space, Tabs, TabsProps, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { ArrowRightOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Setting: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Video</div>
    </button>
  );

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
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
          <Button>Discard</Button>
          <Button type="primary" className={styles.save_setting_btn}>
            Save Settings <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
          </Button>
        </Space>
      </div>
      <div className={styles.course_info}>
        <h3>Basic Setting</h3>
        <Form form={form} onFinish={() => {}} layout="vertical" requiredMark={false}>
          <Form.Item label="Course Name" name="course_name" rules={[{ required: true, message: "Required!" }]}>
            <Input placeholder="Course Name" />
          </Form.Item>

          <Form.Item
            label="Course Description"
            name="course_description"
            rules={[{ required: true, message: "Required" }]}
          >
            <TextArea rows={3} placeholder="A brief description about the course" />
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
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                {loading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
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
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                {loading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                <div style={{ marginTop: 8 }}>Upload Video</div>
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
            <Radio>Free</Radio>
            <p>Free content for the specified duration </p>
            <p>Days until expiry</p>
            <div className={styles.days_left}>
              <div>365</div>
              <div>Days</div>
            </div>
          </div>
          <div className={styles.paid_course}>
            <Radio checked>One time Payment</Radio>
            <p>Paid content for the specified duration </p>

            <div className={styles.paid_overview}>
              <div>
                <p className={styles.expiry_para}> {`Price (in USD)`}</p>
                <div className={styles.days_left}>
                  <div>149</div>
                  <div>Price</div>
                </div>
              </div>
              <div>
                <p className={styles.expiry_para}>Days until expiry</p>
                <div className={styles.days_left}>
                  <div>365</div>
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
