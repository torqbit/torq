import React, { FC, useEffect, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, Tabs, TabsProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Curriculum from "./Curriculum";
import { useRouter } from "next/router";
import Preview from "./Preview";

import ProgramService from "@/services/ProgramService";
import {
  ChapterDetail,
  CourseAPIResponse,
  UploadedResourceDetail,
  VideoAPIResponse,
  VideoInfo,
} from "@/types/courses/Course";
import AddCourseChapter from "@/components/programs/AddCourseChapter";
import { Resource, ResourceContentType } from "@prisma/client";
import { IAddResource, ResourceDetails } from "@/lib/types/program";
import AddResource from "@/components/programs/AddResource";

import { RcFile } from "antd/es/upload";
import { postWithFile } from "@/services/request";
import upload from "@/pages/api/program/upload";

const AddCourseForm: FC = () => {
  const [courseBannerUploading, setCourseBannerUploading] = useState<boolean>(false);
  const [courseTrailerUploading, setCourseTrailerUploading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [isEdit, setEdit] = useState<boolean>(false);
  const [currResId, setResId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [chapterForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formData] = Form.useForm();
  const [showResourceDrawer, setResourceDrawer] = useState<boolean>(false);
  const [availableRes, setAvailableRes] = useState<Resource[]>();
  const onRefresh = () => {
    setRefresh(!refresh);
  };

  const onChange = (key: string) => {
    if (key === "3") {
      onRefresh();
      router.replace(`/admin/content/course/${router.query.id}/edit`);
      setActiveKey("3");
    }
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

  const [uploadVideo, setUploadVideo] = useState<VideoInfo>();
  const [courseThumbnail, setCourseThumbnail] = useState<string>();

  const [courseData, setCourseData] = useState<{
    name: string;
    description: string;
    duration: number;
    chapters: ChapterDetail[];
  }>({
    name: "",
    description: "",
    duration: 0,
    chapters: [],
  });

  const [uploadResourceUrl, setUploadResUrl] = useState<UploadedResourceDetail>();

  const onDiscard = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result: CourseAPIResponse) => {
        onDeleteVideo(result.courseDetails.videoUrl);
        ProgramService.deleteCourse(
          Number(router.query.id),
          (result) => {
            message.success(result.message);
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  };

  const onSubmit = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result: CourseAPIResponse) => {
        let course = {
          name: courseData?.name || form.getFieldsValue().course_name,
          duration: courseData?.duration,
          state: "ACTIVE",
          skills: [],
          description: courseData?.description || form.getFieldsValue().course_description,
          thumbnail: result.courseDetails.thumbnail || "",
          videoThumbnail: result.courseDetails.videoThumbnail || "",
          videoUrl: result.courseDetails.videoUrl || "",
          videoId: result.courseDetails.videoId || "",
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
      (error) => { }
    );
  };

  const onSetCourseData = (key: string, value: string) => {
    setCourseData({ ...courseData, [key]: value });
  };

  let currentSeqIds = courseData.chapters.map((c) => {
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
      (error) => { }
    );
  };
  const deleteRes = (id: number) => {
    ProgramService.getResource(
      id,
      (result) => {
        onDeleteVideo(String(result.resource.thumbnail));
        onDeleteThumbnail(String(result.resource.content), "course-assignments");

        ProgramService.deleteResource(
          id,
          (result) => {
            message.success(result.message);
            onRefresh();
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  };

  const updateChapterState = (id: number, state: string) => {
    ProgramService.updateChapterState(
      id,
      state,
      (result) => {
        message.success(result.message);

        onRefresh();
      },
      (error) => { }
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
      (error) => { }
    );
  };
  const createChapter = async (courseId: number) => {
    setLoading(true);
    let chaptereData = {
      name: chapterForm.getFieldsValue().name,
      description: chapterForm.getFieldsValue().description,
      duration: chapterForm.getFieldsValue().duration,
      courseId: courseId,
      sequenceId: Number(courseData.chapters.length + 1),
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
        formData.resetFields();
        setLoading(false);
        !showResourceDrawer && setResourceDrawer(true);
        setUploadResUrl({});
        setAddRes({ ...addRes, chapterId: id });
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onCreateRes = (chapterId: number) => {
    setLoading(true);
    let rs = formData.getFieldsValue() as ResourceDetails;
    ProgramService.createResource(
      rs,
      (result) => {
        message.success(result.message);

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
      thumbnail: uploadResourceUrl?.videoUrl,
      contentType: addRes.content,
      content: uploadResourceUrl?.fileName || "",
      videoId: Number(uploadResourceUrl?.videoId),
    } as ResourceDetails;

    ProgramService.updateResource(
      resData,
      (result) => {
        message.success(result.message);
        onFindResource(addRes.chapterId, "Video");
        formData.resetFields();
        setLoading(false);
        setAddRes({
          content: "Video",
          chapterId: 0,
          name: "",
          duration: 0,
          assignmentFileName: "",
        });
        formData.setFieldValue("contentType", "Video");
        setEdit(false);

        setResourceDrawer(false);
      },
      (error) => {
        onRefresh();
        message.error(error);
        setLoading(false);
      }
    );
  };

  const onDeleteThumbnail = (name: string, dir: string) => {
    ProgramService.deleteFile(
      name,
      dir,
      (result) => { },
      (error) => { }
    );
  };

  const onUploadVideo = async (file: RcFile, title: string) => {
    setCourseTrailerUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);
    if (!postRes.ok) {
      setCourseTrailerUploading(false);
      throw new Error("Failed to upload file");
    }
    const res = await postRes.json();

    if (res.success) {
      setUploadResUrl({
        videoId: String(res.videoDetail.videoId),
        videoUrl: res.videoDetail.videoUrl,
        thumbnail: res.videoDetail.thumbnail,
      });
      setCourseTrailerUploading(false);
    }
  };

  const onUploadTrailer = async (file: RcFile, title: string) => {
    setCourseTrailerUploading(true);
    const name = title.replace(/\s+/g, "-");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", name);

    const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);
    if (!postRes.ok) {
      setLoading(false);
      throw new Error("Failed to upload file");
    }
    const res = (await postRes.json()) as VideoAPIResponse;

    if (res.success) {
      let courseVideo = {
        videoThumbnail: res.video.thumbnail,
        videoUrl: res.video.videoUrl,
        videoId: `${res.video.videoId}`,
        courseId: Number(router.query.id),
      };
      ProgramService.updateCourse(
        courseVideo,
        (result) => {
          setUploadVideo({
            ...uploadVideo,
            videoId: res.video.videoId,
            videoUrl: res.video.videoUrl,
            thumbnail: res.video.thumbnail,
            previewUrl: res.video.previewUrl,
          });
          setRefresh(!refresh);
          message.success("Course trailer video has been uploaded");
          setCourseTrailerUploading(false);
        },
        (error) => {
          setCourseTrailerUploading(false);
          message.error(error);
        }
      );
    }
  };

  const onDeleteVideo = (id: string) => {
    ProgramService.deleteVideo(
      id,
      (result) => { },
      (error) => { }
    );
  };
  const uploadFile = async (file: any, title: string) => {
    if (file) {
      setLoading(true);
      const name = title.replace(/\s+/g, "-");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", name);
      formData.append("dir", "course-banners");

      const postRes = await postWithFile(formData, `/api/v1/upload/file/upload`);
      if (!postRes.ok) {
        setLoading(false);
        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();

      if (res.success) {
        let course = {
          thumbnail: res.fileCDNPath,
          courseId: Number(router.query.id),
        };
        ProgramService.updateCourse(
          course,
          (result) => {
            setCourseThumbnail(res.fileCDNPath);
            setRefresh(!refresh);
            message.success("file uploaded");
            setCourseBannerUploading(false);
          },
          (error) => {
            setCourseBannerUploading(false);
            message.error(error);
          }
        );
      }
    }
  };

  const uploadAssignment = async (file: any, title: string) => {
    if (file) {
      setLoading(true);
      const name = title.replace(/\s+/g, "-");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", name);
      formData.append("dir", "course-assignments");

      const postRes = await postWithFile(formData, `/api/v1/upload/file/upload`);
      if (!postRes.ok) {
        setLoading(false);
        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();

      if (res.success) {
        setUploadResUrl({ fileName: res.fileCDNPath as string });
      }
    }
  };

  const onEditResource = (id: number) => {
    setResId(id);
    ProgramService.getResource(
      id,
      (result) => {
        formData.setFieldValue("name", result.resource?.name);
        formData.setFieldValue("description", result.resource?.description);
        formData.setFieldValue("assignmentLang", result.resource.assignmentLang);
        formData.setFieldValue("submitDay", result.resource.daysToSubmit);
        formData.setFieldValue("VideoUrl", result.resource.thumbnail);
        formData.setFieldValue("duration", result.resource.videoDuration);
        formData.setFieldValue("index", result.resource.sequenceId);
        formData.setFieldValue("assignment_file", result.resource.content);
        formData.setFieldValue("contentType", result.resource.contentType);
        setEdit(true);

        setAddRes({
          ...addRes,
          content: result.resource.contentType,
          chapterId: result.resource.chapterId,
        });
        setUploadResUrl({
          fileName: String(result.resource.content),
          videoId: String(result.resource.videoId),
          videoUrl: String(result.resource.thumbnail),
        });
        setResourceDrawer(true);
      },
      (error) => { }
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Settings",
      children: (
        <Setting
          onSetCourseData={onSetCourseData}
          form={form}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          courseData={courseData}
          onRefresh={onRefresh}
          onUploadTrailer={onUploadTrailer}
          uploadFile={uploadFile}
          onDeleteThumbnail={onDeleteThumbnail}
          onDeleteVideo={onDeleteVideo}
          uploadVideo={uploadVideo}
          courseBannerUploading={courseBannerUploading}
          courseTrailerUploading={courseTrailerUploading}
          courseBanner={courseThumbnail}
          refresh={refresh}
        />
      ),
    },
    {
      key: "2",
      label: "Curriculum",

      children: (
        <Curriculum
          chapter={courseData.chapters}
          onRefresh={onRefresh}
          setOpen={setOpen}
          onFindResource={onFindResource}
          deleteChapter={deleteChapter}
          updateChapterState={updateChapterState}
          updateResState={updateResState}
          deleteRes={deleteRes}
          onEditResource={onEditResource}
          onSave={onChange}
          onDiscard={onDiscard}
        />
      ),
    },

    {
      key: "3",
      label: "Preview",
      children: <Preview uploadVideo={uploadVideo} chapter={courseData.chapters} />,
    },
  ];

  useEffect(() => {
    router.query.id &&
      ProgramService.getCourses(
        Number(router.query.id),
        (result) => {
          form.setFieldValue("course_name", result.courseDetails.name);
          form.setFieldValue("course_description", result.courseDetails.description);
          form.setFieldValue("course_duration", result.courseDetails.expiryInDays);

          setCourseData({
            ...courseData,
            duration: result.courseDetails.expiryInDays,
            chapters: result.courseDetails.chapters,
          });
          setCourseThumbnail(result.courseDetails.thumbnail);
          setUploadVideo({
            ...uploadVideo,
            previewUrl: "",
            thumbnail: result.courseDetails.videoThumbnail,
            videoId: result.courseDetails.videoId,
            videoUrl: result.courseDetails.videoUrl,
          });
        },
        (error) => { }
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
        currResId={currResId}
        isEdit={isEdit}
        uploadResourceUrl={
          uploadResourceUrl as {
            fileName?: string;
            videoUrl?: string;
            videoId?: string;
            thumbnail?: string;
          }
        }
        onUpdateRes={onUpdateRes}
        availableRes={availableRes}
        onUploadVideo={onUploadVideo}
        formData={formData}
        setResourceDrawer={setResourceDrawer}
        onDeleteVideo={onDeleteVideo}
        showResourceDrawer={showResourceDrawer}
        loading={loading}
        onFindRsource={onFindResource}
        uploadFile={uploadAssignment}
        onDeleteThumbnail={onDeleteThumbnail}
      />
    </Layout2>
  );
};

export default AddCourseForm;
