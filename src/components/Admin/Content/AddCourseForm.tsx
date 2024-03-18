import React, { FC, useEffect, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, Tabs, TabsProps, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Curriculum from "./Curriculum";
import { useRouter } from "next/router";
import Preview from "./Preview";
import { getFetch, postWithFile } from "@/services/request";
import appConstant from "@/services/appConstant";
import ProgramService from "@/services/ProgramService";
const AddCourseForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [form] = Form.useForm();

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
        onDeleteThumbnail(result.getCourse.thumbnailId);
        onDeleteThumbnail(result.getCourse.videoId);
        ProgramService.deleteCourse(
          Number(router.query.id),

          (result) => {
            message.success(result.message);
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  };

  const onSubmit = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        let course = {
          name: courseData?.name || form.getFieldsValue().course_name,
          duration: courseData?.duration,
          state: "ACTIVE",
          skills: [],
          description: courseData?.description || form.getFieldsValue().course_description,
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
            setRefresh(!refresh);
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
  const onSetCourseData = (key: string, value: string) => {
    setCourseData({ ...courseData, [key]: value });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Settings",
      children: (
        <Setting
          onSetCourseData={onSetCourseData}
          beforeUpload={beforeUpload}
          form={form}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          courseData={courseData}
          uploadUrl={
            uploadUrl as {
              uploadType?: string;
              thumbnailImg?: string;
              thumbnailId?: string;
              videoUrl?: string;
              videoId?: string;
            }
          }
          loading={loading}
          refresh={refresh}
        />
      ),
    },
    {
      key: "2",
      label: "Curriculum",

      children: <Curriculum />,
    },

    {
      key: "3",
      label: "Preview",
      children: <Preview />,
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
          tabBarGutter={40}
          defaultActiveKey={router.query.feature as string}
          className={styles.add_course_tabs}
          items={items}
        />
      </section>
    </Layout2>
  );
};

export default AddCourseForm;
