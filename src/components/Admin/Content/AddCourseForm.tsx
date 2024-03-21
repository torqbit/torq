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
import { ChapterDetail } from "@/pages/add-course";
import AddCourseChapter from "@/components/programs/AddCourseChapter";
import { Resource, ResourceContentType } from "@prisma/client";
import { IAddResource, resData } from "@/lib/types/program";
import AddResource from "@/components/programs/AddResource";
import { onDeleteVideo } from "@/pages/api/v1/upload/bunny/create";

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

  const [uploadUrl, setUploadUrl] = useState<{
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  }>();

  const [uploadResUrl, setUploadResUrl] = useState<{
    thumbnailImg?: string;

    videoUrl?: string;
    videoId?: number;
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

  const onDiscard = () => {
    ProgramService.getCourses(
      Number(router.query.id),
      (result) => {
        ProgramService.getCredentials(
          "bunny",
          async (videoData) => {
            if (uploadUrl?.videoUrl) {
              onDeleteVideo(uploadUrl.videoUrl as string, Number(uploadUrl.videoId), videoData.credentials.api_key);
            }
            ProgramService.getCredentials(
              "bunny img",
              async (imgData) => {
                onDeleteThumbnail(result.getCourse?.thumbnail, imgData.credentials.api_key, "course-banners");

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
  const deleteRes = (id: number, videoId: number, videoUrl: string, assignment_file: string, type: string) => {
    if (type === "Video") {
      ProgramService.getCredentials(
        "bunny",
        async (result) => {
          if (uploadResUrl?.videoUrl) {
            onDeleteVideo(videoUrl as string, Number(videoId), result.credentials.api_key);
          }
        },
        (error) => {}
      );
    }
    if (type === "Assignment") {
      ProgramService.getCredentials(
        "bunny img",
        async (fileData) => {
          onDeleteThumbnail(assignment_file, fileData.credentials.api_key as string, "course-assignments");
        },
        (error) => {}
      );
    }
    ProgramService.deleteResource(
      id,
      (deleteMessage) => {
        message.success(deleteMessage.message);
        onRefresh();
      },
      (error) => {}
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
  const createChapter = async (courseId: number) => {
    setLoading(true);
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
    formData.resetFields();
    setResourceDrawer(true);
    setUploadResUrl({});
    // ProgramService.getResources(
    //   id,
    //   (result) => {
    //     setAvailableRes(result.allResource);
    //     !showResourceDrawer && setResourceDrawer(true);
    //     !showResourceDrawer
    //       ? setAddRes({ ...addRes, chapterId: id, content: content })
    //       : setAddRes({
    //           content: content,
    //           chapterId: 0,
    //           name: "",
    //           duration: 0,
    //           assignmentFileName: "",
    //         });
    //   },
    //   (error) => {
    //     message.error(error);
    //   }
    // );
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
      thumbnail: uploadResUrl?.videoUrl || "",
      videoId: uploadResUrl?.videoId,
      contentType: addRes.content,
      content: uploadResUrl?.thumbnailImg || "",
    } as unknown as resData;
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
        setUploadResUrl({});
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
      content: uploadResUrl?.thumbnailImg,
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

  const onEditResource = (id: number) => {
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
        setUploadResUrl({
          thumbnailImg: result.resource.content as string,
          videoId: Number(result.resource.videoId),
          videoUrl: result.resource.thumbnail as string,
        });

        setAddRes({
          ...addRes,
          content: result.resource.contentType,
          chapterId: result.resource.chapterId,
        });
        setResourceDrawer(true);
      },
      (error) => {}
    );
  };

  const createVideo = async (
    title: string,
    libraryId: number,
    accessKey: string,
    courseId: number,
    file: any,
    type: string
  ) => {
    setLoading(true);
    const fetch = require("node-fetch");
    const url = `https://video.bunnycdn.com/library/${Number(libraryId)}/videos`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: accessKey as string,
      },
      body: JSON.stringify({ title: title }),
    };

    fetch(url, options)
      .then((res: { json: () => JSON }) => res.json())
      .then((json: any) => {
        let uploadedData = uploadVideo(json.guid, accessKey, libraryId, courseId, file, type);
        return uploadedData;
      })
      .catch((err: string) => {
        console.error("error:" + err);
      });
  };

  const uploadVideo = (id: string, accessKey: string, libraryId: number, courseId: number, file: any, type: string) => {
    const fetch = require("node-fetch");

    const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${id}`;
    const options = {
      method: "PUT",
      headers: { accept: "application/json", AccessKey: accessKey },
      body: file,
    };
    if (type === "resource") {
      setUploadResUrl({ ...uploadResUrl, videoId: libraryId, videoUrl: id });
    }

    fetch(url, options)
      .then((res: { json: () => JSON }) => res.json())
      .then((json: any) => {
        if (type === "trailer") {
          let course = {
            name: undefined,
            duration: undefined,
            state: "DRAFT",
            skills: [],
            description: undefined,
            thumbnail: undefined,
            thumbnailId: undefined,
            videoUrl: id,
            videoId: `${libraryId}`,
            programId: 0,
            authorId: 0,
            sequenceId: undefined,
            courseId: courseId,
          };
          ProgramService.updateCourse(
            course,
            (result) => {
              setRefresh(!refresh);
              message.success("file uploaded");
              setLoading(false);
              router.reload();
            },
            (error) => {
              setLoading(false);

              message.error(error);
            }
          );
        } else if (type === "resource") {
          message.success("video uploaded");
          onRefresh();
          setLoading(false);
        }
      })
      .catch((err: string) => {
        console.error("error:" + err);
      });
  };

  const uploadFile = async (file: any, accessKey: string, type: string, dir: string) => {
    if (file) {
      setLoading(true);
      const fileExtention = function getFileExtension(filename: string) {
        const extension = filename.split(".").pop();
        return extension;
      };
      let extension = fileExtention(file.name);
      let dashed = form.getFieldsValue().course_name.replace(/\s+/g, "-").toLowerCase();
      let currentTime = new Date().getTime();
      const fileName = `${dashed}-${currentTime}.${extension}`;
      console.log(fileName, "file name");
      const BASE_HOSTNAME = "storage.bunnycdn.com";

      const url = `https://storage.bunnycdn.com/torqbit-files/static/${dir}/${fileName}`;

      const options = {
        method: "PUT",
        host: BASE_HOSTNAME,
        headers: {
          AccessKey: accessKey,
          "Content-Type": "application/octet-stream",
        },
        body: file,
      };

      fetch(url, options)
        .then((res: { json: () => any }) => res.json())
        .then((json: any) => {
          console.log(json);
          if (type === "banner") {
            let course = {
              name: undefined,
              duration: undefined,
              state: "DRAFT",
              skills: [],
              description: undefined,
              thumbnail: fileName,
              thumbnailId: "",
              videoUrl: undefined,
              videoId: undefined,
              programId: 0,
              authorId: 0,
              sequenceId: undefined,
              courseId: Number(router.query.id),
            };
            ProgramService.updateCourse(
              course,
              (result) => {
                setRefresh(!refresh);
                message.success("file uploaded");
                setLoading(false);
              },
              (error) => {
                setLoading(false);

                message.error(error);
              }
            );
          } else if (type === "assignment") {
            console.log(fileName, "sf");
            setUploadResUrl({ ...uploadResUrl, thumbnailImg: fileName });
            message.success("file uploaded");
            setLoading(false);
          }
        })
        .catch((err: string) => {
          console.error("error:" + err);
        });
    }
  };
  const onDeleteThumbnail = (name: string, accessKey: string, dir: string) => {
    const fetch = require("node-fetch");

    const url = `https://storage.bunnycdn.com/torqbit-files/static/${dir}/${name}`;

    const options = {
      method: "DELETE",
      headers: { AccessKey: accessKey },
    };

    fetch(url, options)
      .then((res: { json: () => any }) => res.json())
      .then((json: any) => {
        onRefresh();
      })
      .catch((err: string) => console.error("error:" + err));
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
          setLoading={setLoading}
          onRefresh={onRefresh}
          createVideo={createVideo}
          uploadFile={uploadFile}
          onDeleteThumbnail={onDeleteThumbnail}
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
          onEditResource={onEditResource}
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
  setTimeout(() => {
    console.log(uploadResUrl, "res url");
  }, 200);

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
        uploadFile={uploadFile}
        loading={loading}
        onFindRsource={onFindResource}
        onDeleteThumbnail={onDeleteThumbnail}
        createVideo={createVideo}
        setLoading={setLoading}
        uploadResUrl={
          uploadResUrl as {
            thumbnailImg?: string;

            videoUrl?: string;
            videoId?: string;
          }
        }
      />
    </Layout2>
  );
};

export default AddCourseForm;
