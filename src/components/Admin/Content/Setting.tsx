import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Button, Form, Input, List, Radio, Space, Tabs, TabsProps, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { ArrowRightOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import appConstant from "@/services/appConstant";
import { getFetch, postWithFile } from "@/services/request";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { error } from "console";

const { TextArea } = Input;

const Setting: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [uploadUrl, setUploadUrl] = useState<{
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  }>();

  const [courseData, setCourseData] = useState<{ name: string; description: string; duration: number }>({
    name: "",
    description: "",
    duration: 0,
  });

  const onDiscard = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        console.log(result, "delete res");
        onDeleteThumbnail(result.getCourse.thumbnailId);
        onDeleteThumbnail(result.getCourse.videoId);
        ProgramService.deleteCourse(
          Number(router.query.id),

          (result) => {
            console.log(result, "dele");
            message.success(result.message);
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  };

  const onSubmit = () => {
    console.log(router.query.id, "qew");
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        console.log(result, "delete res");
        let course = {
          name: courseData?.name,
          duration: courseData?.duration,
          state: "ACTIVE",
          skills: [],
          description: courseData?.description,
          thumbnail: result.getCourse.thumbnail || "",
          thumbnailId: result.getCourse.thumbnailId || "",
          videoUrl: result.getCourse.videoUrl || "",
          videoId: result.getCourse.videoId || "",
          programId: 0,
          authorId: 0,
          sequenceId: undefined,
          courseId: Number(router.query.id),
        };
        ProgramService.updateCourse(
          course,
          (result) => {
            form.resetFields();
            message.success("course created");
          },
          (error) => {
            message.error(error);
          }
        );
      },
      (error) => {}
    );
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Video</div>
    </button>
  );

  const beforeUpload = async (file: any, fileType: string) => {
    setUploadUrl({ ...courseData, uploadType: fileType });
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    try {
      if (!isJpgOrPng && fileType === "img") {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M && fileType === "img") {
        message.error("Image must smaller than 2MB!");
      }

      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", appConstant.IMG_KIT_PROGRAM_FOLDER);
      setLoading(true);

      const postRes = await postWithFile(formData, `/api/v1/upload/file`);
      if (!postRes.ok) {
        setLoading(false);

        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();
      console.log(res, "post res");
      setUploadUrl({ ...uploadUrl, thumbnailImg: res.uploadedFile[0].url, thumbnailId: res.uploadedFile[0].fileId });
      if (res) {
        let course = {
          name: "",
          duration: 0,
          state: "DRAFT",
          skills: [],
          description: "",
          thumbnail: fileType === "img" ? res.uploadedFile[0]?.url : "",
          thumbnailId: fileType === "img" ? res.uploadedFile[0]?.fileId : "",
          videoUrl: fileType === "video" ? res.uploadedFile[0]?.url : "",
          videoId: fileType === "video" ? res.uploadedFile[0]?.fileId : "",
          programId: 0,
          authorId: 0,
          sequenceId: undefined,
          courseId: Number(router.query.id),
        };
        ProgramService.updateCourse(
          course,
          (result) => {
            message.success("file uploaded");
          },
          (error) => {
            message.error(error);
          }
        );
      }

      setLoading(false);
      return false;
    } catch (err: any) {
      setLoading(false);

      message.error(err.message ?? appConstant.cmnErrorMsg);
      console.log(err, "this is error");
    }
  };

  const onDeleteThumbnail = async (id: string | null) => {
    try {
      if (id) {
        setLoading(true);
        const deleteRes = await getFetch(`/api/upload/delete/${id}`);
        if (!deleteRes.ok) {
          setLoading(false);
          throw new Error("Failed to delete uploaded file");
        }
        setUploadUrl({ ...uploadUrl, thumbnailImg: "", thumbnailId: "" });

        setLoading(false);
        message.success("File deleted successfully");
      } else {
        return;
      }
    } catch (err: any) {
      setLoading(false);
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      return;
    }
    if (info.file.status === "done") {
    }
  };

  useEffect(() => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        console.log(result, "sdf");
        form.setFieldValue("course_name", result.getCourse.name);
        form.setFieldValue("course_description", result.getCourse.description);
        setCourseData({ ...courseData, duration: result.getCourse.durationInMonths });
        setUploadUrl({ thumbnailImg: result.getCourse.thumbnail, videoUrl: result.getCourse.videoUrl });
      },
      (error) => {}
    );
  }, [router.query.id]);

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
                setCourseData({ ...courseData, name: e.currentTarget.value });
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
                setCourseData({ ...courseData, description: e.currentTarget.value });
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
              <button
                style={{ border: 0, background: "none" }}
                onClick={() => setUploadUrl({ ...courseData, uploadType: "video" })}
                type="button"
              >
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
                  setCourseData({ ...courseData, duration: Number(e.currentTarget.value) });
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
