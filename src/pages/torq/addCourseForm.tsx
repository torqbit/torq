import React, { FC, useState } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Form, Input, List, Space, Tabs, TabsProps, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";
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
          <Button type="primary">Save Setting </Button>
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
    </section>
  );
};

const AddCourseForm: FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Setting",
      children: <Setting />,
    },
    {
      key: "2",
      label: "Curriculum",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Pricing",
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "Preview",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <Layout2>
      <section className={styles.add_course_page}>
        <div className={styles.add_course_header}>
          <div className={styles.left_icon}>
            <div className={styles.cancel_add_course}>
              <Link href="content">{SvgIcons.xMark}</Link>
            </div>
            <h3>ADD COURSE</h3>
          </div>
          <Button size="small">Publish Changes</Button>
        </div>
        <Tabs
          tabBarGutter={20}
          defaultActiveKey="1"
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default AddCourseForm;
