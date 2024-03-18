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
import { ChapterDetail } from "@/pages/add-course";
import AddCourseChapter from "@/components/programs/AddCourseChapter";
import { Resource, ResourceContentType } from "@prisma/client";
import { IAddResource, resData } from "@/lib/types/program";
import AddResource from "@/components/programs/AddResource";

const AddCourseForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");

  const [chapterForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formData] = Form.useForm();
  const [showResourceDrawer, setResourceDrawer] = useState<boolean>(false);
  const [availableRes, setAvailableRes] = useState<Resource[]>();
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const [addRes, setAddRes] = useState<IAddResource>({
    name: "New Video ",
    duration: 0,
    content: "Video",
    assignmentFileName: "",
    chapterId: 0,
  });

  const router = useRouter();

  const [uploadUrl, setUploadUrl] = useState<{
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  }>();

  const [courseData, setCourseData] = useState<{
    name: string;
    description: string;
    duration: number;
    chapter: ChapterDetail[];
  }>({
    name: "",
    description: "",
    duration: 0,
    chapter: [],
  });

  const onRefresh = () => {
    setRefresh(!refresh);
  };

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
        console.log(result, "res");
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
            setActiveKey("2");
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
      setLoading(true);

      if (!isJpgOrPng && fileType === "img") {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M && fileType === "img") {
        setLoading(false);

        message.error("Image must smaller than 2MB!");
      }
      const isVidLt10M = file.size / 1024 / 1024 < 10;

      if (!isVidLt10M && fileType === "video") {
        setLoading(false);

        message.error("Video must smaller than 10MB!");
      }

      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", appConstant.IMG_KIT_PROGRAM_FOLDER);

      console.log(formData, "second step");

      const postRes = await postWithFile(formData, `/api/v1/upload/file`);
      if (!postRes.ok) {
        setLoading(false);

        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();
      console.log(res, "response");
      fileType === "img" &&
        setUploadUrl({ ...uploadUrl, thumbnailImg: res.uploadedFile[0].url, thumbnailId: res.uploadedFile[0].fileId });
      fileType === "video" &&
        setUploadUrl({ ...uploadUrl, videoUrl: res.uploadedFile[0].url, videoId: res.uploadedFile[0].fileId });
      if (res) {
        setTimeout(() => {
          console.log(uploadUrl, "up");
        }, 3000);
        let course = {
          name: "",
          duration: 0,
          state: "DRAFT",
          skills: [],
          description: "",
          thumbnail: fileType === "img" ? res.uploadedFile[0]?.url : uploadUrl?.thumbnailImg,
          thumbnailId: fileType === "img" ? res.uploadedFile[0]?.fileId : uploadUrl?.thumbnailId,
          videoUrl: fileType === "video" ? res.uploadedFile[0]?.url : uploadUrl?.videoUrl,
          videoId: fileType === "video" ? res.uploadedFile[0]?.fileId : uploadUrl?.videoId,
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
      console.log(err, "err");
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
    setLoading(false);
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

  let currentSeqIds = courseData.chapter.map((c) => {
    return c.sequenceId;
  });

  const showChapterDrawer = (value: boolean) => {
    setOpen(value);
  };

  const deleteChapter = (id: number) => {
    ProgramService.deleteChapter(
      id,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };
  const deleteRes = (id: number) => {
    console.log();
    ProgramService.deleteResource(
      id,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };

  const updateChapterState = (id: number, state: string) => {
    console.log(state);
    ProgramService.updateChapterState(
      id,
      state,
      (result) => {
        message.success(result.message);

        onRefresh();
      },
      (error) => {}
    );
  };
  const updateResState = (id: number, state: string) => {
    ProgramService.updateResState(
      id,
      state,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };
  const createChapter = async (courseId: number) => {
    setLoading(true);
    console.log(currentSeqIds, "sdf");
    let chaptereData = {
      name: chapterForm.getFieldsValue().name,
      description: chapterForm.getFieldsValue().description,
      duration: chapterForm.getFieldsValue().duration,

      courseId: courseId,
      // sequenceId: Number(chapterForm.getFieldsValue().index),
      sequenceId: Number(currentSeqIds[0] + 1),
    };

    ProgramService.createChapter(
      chaptereData,
      (result) => {
        setLoading(false);
        message.info(result.message);
        onRefresh();
        showChapterDrawer(false);
        chapterForm.resetFields();
      },
      (error) => {
        setLoading(false);
        message.error(error);
      }
    );
  };

  const updateChapter = async (chapterId: number) => {
    setLoading(true);

    ProgramService.updateChapter(
      chapterId,
      chapterForm.getFieldsValue().name,
      chapterForm.getFieldsValue().description,
      Number(chapterForm.getFieldsValue().index),
      (result) => {
        setLoading(false);
        message.info(result.message);
        // onRefresh();
        showChapterDrawer(false);
        chapterForm.resetFields();

        router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
      },
      (error) => {
        setLoading(false);
        message.error(error);
      }
    );
  };

  const onFindResource = (id: number, content: ResourceContentType) => {
    ProgramService.getResources(
      id,
      (result) => {
        setAvailableRes(result.allResource);
        !showResourceDrawer && setResourceDrawer(true);
        !showResourceDrawer
          ? setAddRes({ ...addRes, chapterId: id, content: content })
          : setAddRes({
              content: content,
              chapterId: 0,
              name: "",
              duration: 0,
              assignmentFileName: "",
            });
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onCreateRes = (chapterId: number) => {
    setLoading(true);
    let resData = {
      name: formData.getFieldsValue().name,

      description: formData.getFieldsValue().description,
      chapterId: chapterId,
      // sequenceId: Number(formData.getFieldsValue().index),
      sequenceId: Number(currentSeqIds[0] + 1),

      assignmentLang: formData.getFieldsValue().assignmentLang || [],
      videoDuration: formData.getFieldsValue().duration || 0,
      daysToSubmit: formData.getFieldsValue().submitDay || 0,
      thumbnail: formData.getFieldsValue().VideoUrl || "",
      contentType: addRes.content,
      content: addRes.assignmentFileName || "",
    } as resData;
    ProgramService.createResource(
      resData,
      (result) => {
        message.success(result.message);
        onFindResource(chapterId, "Video");
        formData.resetFields();
        setLoading(false);
        setResourceDrawer(false);
        setAddRes({
          content: "Video",
          chapterId: 0,
          name: "",
          duration: 0,
          assignmentFileName: "",
        });
        onRefresh();
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  const onUpdateRes = (resId: number) => {
    setLoading(true);

    let resData = {
      name: formData.getFieldsValue().name,
      resourceId: resId,
      description: formData.getFieldsValue().description,
      chapterId: addRes.chapterId,
      sequenceId: Number(formData.getFieldsValue().index),
      assignmentLang: formData.getFieldsValue().assignmentLang || [],
      videoDuration: formData.getFieldsValue().duration || 0,
      daysToSubmit: formData.getFieldsValue().submitDay || 0,
      thumbnail: formData.getFieldsValue().VideoUrl || "",
      contentType: addRes.content,
      content: addRes.assignmentFileName || "",
    } as resData;

    ProgramService.updateResource(
      resData,
      (result) => {
        message.success(result.message);
        onFindResource(addRes.chapterId, "Video");
        formData.resetFields();
        setLoading(false);
        // router.query.resId && router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
        setAddRes({
          content: "Video",
          chapterId: 0,
          name: "",
          duration: 0,
          assignmentFileName: "",
        });
        formData.setFieldValue("contentType", "Video");

        // setResourceDrawer(false);
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
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

      children: (
        <Curriculum
          chapter={courseData.chapter}
          onRefresh={onRefresh}
          setOpen={setOpen}
          onFindResource={onFindResource}
          deleteChapter={deleteChapter}
          updateChapterState={updateChapterState}
          updateResState={updateResState}
          deleteRes={deleteRes}
          onSave={onChange}
          onDiscard={onDiscard}
        />
      ),
    },

    {
      key: "3",
      label: "Preview",
      children: (
        <Preview
          uploadUrl={
            uploadUrl as {
              uploadType?: string;
              thumbnailImg?: string;
              thumbnailId?: string;
              videoUrl?: string;
              videoId?: string;
            }
          }
          chapter={courseData.chapter}
        />
      ),
    },
  ];

  useEffect(() => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        form.setFieldValue("course_name", result.getCourse.name);
        form.setFieldValue("course_description", result.getCourse.description);
        form.setFieldValue("course_duration", result.getCourse.durationInMonths);

        // onSetCourseData("duration", String(result.getCourse.durationInMonths));
        setCourseData({
          ...courseData,
          duration: result.getCourse.durationInMonths,
          chapter: result.getCourse.chapter as any,
        });
        setUploadUrl({
          ...uploadUrl,
          thumbnailId: result.getCourse.thumbnailId,
          thumbnailImg: result.getCourse.thumbnail,
          videoId: result.getCourse.videoId,
          videoUrl: result.getCourse.videoUrl,
        });
      },
      (error) => {}
    );
  }, [router.query.id, refresh]);

  return (
    <Layout2>
      <section className={styles.add_course_page}>
        <div className={styles.add_course_header}>
          <div className={styles.left_icon}>
            <div className={styles.cancel_add_course}>
              <Link href="content">{SvgIcons.xMark}</Link>
            </div>
            <h3>EDIT COURSE</h3>
          </div>
          <Button>Publish Changes</Button>
        </div>
        <Tabs
          tabBarGutter={40}
          activeKey={activeKey}
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
      <AddCourseChapter
        createChapter={createChapter}
        courseId={Number(router.query.id)}
        updateChapter={updateChapter}
        currentSeqIds={currentSeqIds}
        showChapterDrawer={showChapterDrawer}
        loading={loading}
        open={open}
        form={chapterForm}
      />
      <AddResource
        chapterId={addRes.chapterId}
        addRes={addRes}
        setAddRes={setAddRes}
        onCreateRes={onCreateRes}
        onUpdateRes={onUpdateRes}
        availableRes={availableRes}
        formData={formData}
        setResourceDrawer={setResourceDrawer}
        showResourceDrawer={showResourceDrawer}
        loading={loading}
        onFindRsource={onFindResource}
      />
    </Layout2>
  );
};

export default AddCourseForm;
