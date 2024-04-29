import React, { FC, useEffect, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Dropdown, Form, Tabs, TabsProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Curriculum from "./Curriculum";
import { useRouter } from "next/router";
import Preview from "./Preview";

import ProgramService from "@/services/ProgramService";
import {
  ChapterDetail,
  CourseAPIResponse,
  CourseData,
  IVideoLesson,
  UploadVideoObjectType,
  UploadedResourceDetail,
  VideoAPIResponse,
  VideoInfo,
} from "@/types/courses/Course";
import AddCourseChapter from "@/components/programs/AddCourseChapter";
import { Resource, ResourceContentType, courseDifficultyType } from "@prisma/client";
import { IAddResource, ResourceDetails } from "@/lib/types/program";
import AddVideoLesson from "@/components/programs/AddVideoLesson";

import { RcFile } from "antd/es/upload";
import { postWithFile } from "@/services/request";
import { error } from "console";

const AddCourseForm: FC = () => {
  const [courseBannerUploading, setCourseBannerUploading] = useState<boolean>(false);
  const [courseTrailerUploading, setCourseTrailerUploading] = useState<boolean>(false);
  const [resourceVideoUploading, setResourceVideoUploading] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isChapterEdit, setChapterEdit] = useState<boolean>(false);
  const [currResId, setResId] = useState<number>();
  const [selectedChapterId, setSelectedChapterId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [chapterForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [videoForm] = Form.useForm();

  const [showResourceDrawer, setResourceDrawer] = useState<boolean>(false);
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

  const [videoLesson, setVideoLesson] = useState<IVideoLesson>({
    title: "Untitled",
    description: "Description about the lesson",
  });

  const router = useRouter();

  const [uploadVideo, setUploadVideo] = useState<VideoInfo>();
  const [courseThumbnail, setCourseThumbnail] = useState<string>();

  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    description: "",
    expiryInDays: 365,
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
          (error) => {}
        );
      },
      (error) => {}
    );
  };

  const onSubmit = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result: CourseAPIResponse) => {
        let course = {
          name: courseData?.name || form.getFieldsValue().course_name,
          expiryInDays: Number(courseData?.expiryInDays),
          description: courseData?.description || form.getFieldsValue().course_description,
          thumbnail: result.courseDetails.thumbnail || "",
          tvThumbnail: result.courseDetails.tvThumbnail || "",
          tvUrl: result.courseDetails.videoUrl || "",
          tvProviderId: result.courseDetails.tvProviderId || "",
          courseId: Number(router.query.id),
          difficultyLevel: form.getFieldsValue().course_difficulty,
        };

        ProgramService.updateCourse(
          course,
          (result) => {
            setActiveKey("2");
            form.resetFields();
            setRefresh(!refresh);
            message.success("course has been updated");
          },
          (error) => {
            message.error(error);
          }
        );
      },
      (error) => {}
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
      (error) => {}
    );
  };
  const onDeleteResource = (id: number) => {
    ProgramService.deleteResource(
      id,
      Number(router.query.id),
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {
        message.error(error);
      }
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

  const handleNewChapter = () => {
    setChapterEdit(false);
    setOpen(true);
  };

  const handleChapterEdit = async (chapterId: number) => {
    setSelectedChapterId(chapterId);
    ProgramService.getChapter(
      chapterId,
      (result) => {
        chapterForm.setFieldValue("name", result.chapter.name);
        chapterForm.setFieldValue("description", result.chapter.description);
        showChapterDrawer(true);
        setChapterEdit(true);
      },
      (error) => {
        message.error(error);
      }
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
        onRefresh();
        showChapterDrawer(false);
        chapterForm.resetFields();
        setEdit(false);
      },
      (error) => {
        setLoading(false);
        setEdit(false);
        message.error(error);
      }
    );
  };

  const onFindResource = (chapterId: number, content: ResourceContentType) => {
    setEdit(false);
    ProgramService.getResources(
      chapterId,
      (result) => {
        videoForm.resetFields();
        setLoading(false);
        !showResourceDrawer && setResourceDrawer(true);
        setUploadResUrl({});
        setVideoLesson({ ...videoLesson, chapterId: chapterId });
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onAddResource = (chapterId: number, content: ResourceContentType) => {
    setEdit(false);
    ProgramService.createResource(
      {
        chapterId: chapterId,
        name: "Untitled",
        description: "Description about the lesson",
        contentType: content,
      } as ResourceDetails,
      (result) => {
        videoForm.setFieldValue("name", result.resource.name);
        videoForm.setFieldValue("description", result.resource.description);
        setResId(result.resource.resourceId);
        setLoading(false);
        !showResourceDrawer && setResourceDrawer(true);
        setVideoLesson({ ...videoLesson, chapterId: chapterId, video: undefined });
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onUpdateVideoLesson = (resId: number) => {
    setLoading(true);

    let resData = {
      name: videoForm.getFieldsValue().name,
      resourceId: resId,
      description: videoForm.getFieldsValue().description,
    };

    ProgramService.updateResource(
      resData,
      (result) => {
        message.success(result.message);
        videoLesson.chapterId && onFindResource(videoLesson.chapterId, "Video");
        videoForm.resetFields();
        setLoading(false);
        videoForm.setFieldValue("contentType", "Video");
        setEdit(false);
        setResourceDrawer(false);
        onRefresh();
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
      (result) => {},
      (error) => {}
    );
  };

  const onUploadVideo = async (file: RcFile, title: string, resourceId: number) => {
    setResourceVideoUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("objectId", resourceId.toString());
    formData.append("objectType", "lesson");

    const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);
    if (!postRes.ok) {
      setResourceVideoUploading(false);
    }
    const res = (await postRes.json()) as VideoAPIResponse;
    if (res.success) {
      setVideoLesson({
        ...videoLesson,
        video: {
          id: 0,
          providerVideoId: res.video.videoId,
          videoUrl: res.video.videoUrl,
          thumbnail: res.video.thumbnail,
          resourceId: currResId || 0,
          state: res.video.state,
          mediaProvider: res.video.mediaProviderName,
          videoDuration: res.video.videoDuration,
        },
      });
      setUploadResUrl({
        videoId: String(res.video.videoId),
        videoUrl: res.video.videoUrl,
        thumbnail: res.video.thumbnail,
        state: res.video.state,
        mediaProvider: res.video.mediaProviderName,
        videoDuration: res.video.videoDuration,
      });
      setResourceVideoUploading(false);
    }
  };

  const onUploadTrailer = async (file: RcFile, title: string) => {
    setCourseTrailerUploading(true);
    const name = title.replace(/\s+/g, "-");
    let courseIdStr = router.query.id?.toString();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", name);
    formData.append("objectId", courseIdStr || "");
    formData.append("objectType", "course");

    const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);
    if (!postRes.ok) {
      setLoading(false);
      const response = (await postRes.json()) as VideoAPIResponse;
      message.error(response.message);
      setCourseTrailerUploading(false);
    } else {
      const res = (await postRes.json()) as VideoAPIResponse;
      setUploadVideo({
        ...uploadVideo,
        videoId: res.video.videoId,
        videoUrl: res.video.videoUrl,
        thumbnail: res.video.thumbnail,
        previewUrl: res.video.previewUrl,
        videoDuration: res.video.videoDuration,
        state: res.video.state,
        mediaProviderName: res.video.mediaProviderName,
      });
      setRefresh(!refresh);
      message.success("Course trailer video has been uploaded");
      setCourseTrailerUploading(false);
    }
  };

  const onDeleteVideo = (id: string) => {
    ProgramService.deleteVideo(
      id,
      (result) => {},
      (error) => {}
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

  const onEditResource = (id: number) => {
    setResId(id);
    ProgramService.getResource(
      id,
      (result) => {
        videoForm.setFieldValue("name", result.resource?.name);
        videoForm.setFieldValue("description", result.resource?.description);
        videoForm.setFieldValue("videoUrl", result.resource?.video.videoUrl);
        setEdit(true);
        setVideoLesson({ ...videoLesson, chapterId: result.resource.chapterId, video: result.resource.video });
        setResourceDrawer(true);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onPublishCourse = (state: string) => {
    if (courseData.chapters.length > 0 && courseData.chapters[0].resource.length >= 2) {
      ProgramService.updateCourseState(
        Number(router.query.id),
        state,
        (result) => {
          router.push("/courses");
        },
        (error) => {}
      );
    } else {
      message.error("Minimum two published lessons are required to publish the course");
    }
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
          chapters={courseData.chapters}
          onRefresh={onRefresh}
          handleNewChapter={handleNewChapter}
          onAddResource={onAddResource}
          deleteChapter={deleteChapter}
          updateChapterState={updateChapterState}
          handleEditChapter={handleChapterEdit}
          updateResState={updateResState}
          deleteRes={onDeleteResource}
          onEditResource={onEditResource}
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
          uploadVideo={uploadVideo}
          chapter={courseData.chapters}
          courseDetail={courseData}
          addContentPreview={true}
        />
      ),
    },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;
    if (uploadVideo && uploadVideo.state == "PROCESSING" && typeof intervalId === "undefined") {
      intervalId = setInterval(() => {
        onRefresh();
      }, 1000 * 5); // in milliseconds
    }
    if (intervalId && uploadVideo && uploadVideo.state == "READY") {
      clearInterval(intervalId);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [uploadVideo]);

  useEffect(() => {
    router.query.id &&
      ProgramService.getCourses(
        Number(router.query.id),
        (result) => {
          form.setFieldValue("course_name", result.courseDetails.name);
          form.setFieldValue("course_description", result.courseDetails.description);
          form.setFieldValue("course_duration", result.courseDetails.expiryInDays);
          form.setFieldValue("course_difficulty", result.courseDetails.difficultyLevel);

          setCourseData({
            ...courseData,
            expiryInDays: result.courseDetails.expiryInDays,
            name: result.courseDetails.name,
            description: result.courseDetails.description,
            chapters: result.courseDetails.chapters,
            difficultyLevel: result.courseDetails.difficultyLevel,
            state: result?.courseDetails.state,
          });
          setCourseThumbnail(result.courseDetails.thumbnail);
          setUploadVideo({
            ...uploadVideo,
            previewUrl: "",
            thumbnail: result.courseDetails.tvThumbnail,
            videoId: result.courseDetails.tvProviderId,
            videoUrl: result.courseDetails.tvUrl,
            videoDuration: result.courseDetails.durationInMonths,
            state: result.courseDetails.tvState,
            mediaProviderName: "",
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
          <div>
            <Dropdown.Button
              onClick={() => {
                courseData.state === "DRAFT" ? onPublishCourse("ACTIVE") : onPublishCourse("DRAFT");
              }}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: courseData.state === "DRAFT" ? "Save and exit" : "Publish Course",
                    onClick: () => {
                      router.push("/admin/content");
                    },
                  },
                ],
              }}
            >
              {courseData.state === "DRAFT" ? "  Publish Course" : "Save as Draft"}
            </Dropdown.Button>
          </div>
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
        edit={isChapterEdit}
        open={open}
        form={chapterForm}
        chapterId={selectedChapterId}
      />

      {currResId && (
        <AddVideoLesson
          videoLesson={videoLesson}
          onRefresh={onRefresh}
          setVideoLesson={setVideoLesson}
          currResId={currResId}
          onDeleteResource={onDeleteResource}
          isEdit={isEdit}
          onUpdateVideoLesson={onUpdateVideoLesson}
          onUploadVideo={onUploadVideo}
          formData={videoForm}
          setResourceDrawer={setResourceDrawer}
          onDeleteVideo={onDeleteVideo}
          showResourceDrawer={showResourceDrawer}
          videoUploading={resourceVideoUploading}
        />
      )}
    </Layout2>
  );
};

export default AddCourseForm;
