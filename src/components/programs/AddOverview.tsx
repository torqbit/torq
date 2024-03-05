import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/addOverview.module.scss";
import ProgramService from "@/services/ProgramService";
import ImgCrop from "antd-img-crop";
import { useRouter } from "next/router";
import { Button, Tabs, Upload, Form, Input, Modal, message, Space, Spin, Result } from "antd";
import appConstant from "@/services/appConstant";
import { IResponse, getFetch, postFetch, postWithFile } from "@/services/request";
import CourseView from "./CourseView";
import { ICourseDetial } from "@/lib/types/program";
import AddCourse from "./AddCourse";

export interface ICourse {
  courseId: number | undefined;
  program: {
    aboutProgram: string;
    title: string;
    description: string;
  };
  courseTags: string[];
  selectedTags: string[];
  tabKey: string;
}

const AddOverview: FC<{
  onRefresh: () => void;
  onUpdateProgramState: (key: string, value: string) => void;
  courseDetail: ICourseDetial[];
  programState: {
    programId: number | undefined;
    banner: string;
  };
}> = ({ onRefresh, programState, onUpdateProgramState, courseDetail }) => {
  const [model, contextWrapper] = Modal.useModal();
  const [form] = Form.useForm();
  const router = useRouter();
  const programId = router.query.programId;
  const [bannerImgId, setBannerImgId] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [thumbnailImg, setThumbnailImg] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdateProgram = async () => {
    if (courseState.program.aboutProgram) {
      setLoading(true);
      try {
        const postRes = await postFetch(
          {
            programId: String(programId),
            aboutProgram: courseState.program.aboutProgram,
            bannerImg: programState.banner,
          },
          `/api/program/updateProgram`
        );
        const result = (await postRes.json()) as IResponse;
        if (postRes.ok && result.success) {
          setLoading(false);

          model.success({
            title: "Update Program",
            content: result.message,
            onOk: () => {
              setCourseState({ ...courseState, tabKey: "2" });
            },
          });
        } else {
          setLoading(false);
          message.error(result.error);
        }
      } catch (err) {
        setLoading(false);
        message.error(appConstant.cmnErrorMsg);
      }
    }
  };

  const [courseState, setCourseState] = useState<ICourse>({
    courseId: undefined,
    program: {
      aboutProgram: "",
      description: "",
      title: "",
    },
    courseTags: appConstant.courseTags,
    selectedTags: ["Add Tags"],
    tabKey: "1",
  });

  const onUpdateCourseState = (key: string, value: string | string[]) => {
    if (key === "aboutProgram" && typeof value === "string") {
      setCourseState({
        ...courseState,
        program: { ...courseState.program, aboutProgram: value },
      });
    }
    if (key === "tags" && typeof value !== "string") {
      setCourseState({
        ...courseState,
        selectedTags: value,
      });
    }
  };

  useEffect(() => {
    if (programId) {
      ProgramService.getProgram(
        Number(programId),
        (result) => {
          setCourseState({
            ...courseState,
            program: {
              aboutProgram: result.getProgram.aboutProgram,
              title: result.getProgram.title,
              description: result.getProgram.description,
            },
          });
          onUpdateProgramState("banner", result.getProgram.banner);
        },
        (error) => {}
      );
    }
  }, [programId]);

  const onBeforeUploadFile = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", appConstant.IMG_KIT_PROGRAM_FOLDER);
      setUploading(true);
      const postRes = await postWithFile(formData, `/api/upload/files`);
      if (!postRes.ok) {
        setUploading(false);
        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();
      setThumbnailImg(res.upFiles[0]?.url);
      setBannerImgId(res.upFiles[0]?.fileId);
      onUpdateProgramState("banner", res.upFiles[0]?.url);
      setUploading(false);
    } catch (err: any) {
      setUploading(false);
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
    return false;
  };

  const onDeleteBanner = async () => {
    setThumbnailImg("");
    setBannerImgId("");
    onUpdateProgramState("banner", "");
    return;
    try {
      const deleteRes = await getFetch(`/api/upload/delete/${bannerImgId}`);
      if (!deleteRes.ok) {
        setUploading(false);
        throw new Error("Failed to delete uploaded file");
      }
      setThumbnailImg("");
      setBannerImgId("");
      onUpdateProgramState("banner", "");
      message.success("File deleted successfully");
    } catch (err: any) {
      setUploading(false);
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
  };

  const [open, setOpen] = useState(false);

  const showDrawer = (value: boolean) => {
    setOpen(value);
  };

  const onUpdateCourse = (courseId: number) => {
    ProgramService.getCourses(
      courseId,
      (result) => {
        form.setFieldValue("name", result.getCourse.name);
        form.setFieldValue("description", result.getCourse.description);
        form.setFieldValue("skills", result.getCourse.skills);
        setCourseState({ ...courseState, selectedTags: result.getCourse.skills });
        form.setFieldValue("duration", result.getCourse.durationInMonths);
        form.setFieldValue("index", result.getCourse.sequenceId);
        setOpen(true);
        router.replace(`/programs/${router.query.programId}/add-overview?edit=true&id=${courseId}`);
      },
      (error) => {}
    );
  };

  const onDeleteCourse = (courseId: number) => {
    ProgramService.deleteCourse(
      courseId,
      Number(router.query.programId),
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };

  return (
    <section className={styles.addOverview}>
      {contextWrapper}
      <div className={styles.addOverviewWrapper}>
        <h1>{courseState.program.title}</h1>
        {uploading && <Spin spinning={uploading} tip="Uploading banner image" fullscreen />}

        <p style={{ color: "#f0f0f0" }}>{courseState.program.description}</p>
        <div className={`${styles.bannerWrapper} uploadOverviewImage`}>
          <div className={styles.uploadWrapper}>
            {programState.banner && <img src={programState.banner} alt="Banner" height={400} width={900} />}
            <ImgCrop rotationSlider aspect={9 / 4}>
              <Upload
                showUploadList={false}
                onChange={(value) => {}}
                beforeUpload={async (file) => {
                  onBeforeUploadFile(file);
                  return false;
                }}
                multiple={false}
                className={styles.ant__upload}
              >
                <div className={styles.camera__button}>
                  <img height={24} style={{ margin: "0 auto" }} src="/img/program/camera-add.svg" />
                </div>
              </Upload>
            </ImgCrop>
          </div>
        </div>
      </div>
      <div className={styles.coursesDetail}>
        <nav>
          <div className={styles.navWrapper}>
            <div className={`${styles.tabBarContainer} addOverviewTabBar`}>
              <Tabs
                // activeKey={courseState.tabKey ? courseState.tabKey : "1"}
                tabBarStyle={{ paddingLeft: 30, width: 920 }}
                tabBarExtraContent={
                  <Space align="center">
                    <Button
                      className={styles.cancelBtn}
                      onClick={() => {
                        router.push(`/programs/overview/${programId}`);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="primary"
                      onClick={() => {
                        router.query.edit === "true" && onUpdateProgram();

                        router.push("/programs");
                      }}
                      className={styles.createCourseBtn}
                    >
                      {router.query.edit === "true" ? "Update Program " : "Save Program"}

                      <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
                    </Button>
                  </Space>
                }
              >
                <Tabs.TabPane
                  tab={
                    <span
                      onClick={() => {
                        setCourseState({ ...courseState, tabKey: "1" });
                      }}
                    >
                      About
                    </span>
                  }
                  key={"1"}
                >
                  <div className={styles.aboutProgramTabContentContainer}>
                    <Input.TextArea
                      value={courseState.program.aboutProgram ? courseState.program.aboutProgram : undefined}
                      onChange={(e) => {
                        onUpdateCourseState("aboutProgram", e.target.value);
                      }}
                      className={styles.aboutTextArea}
                      required
                      autoSize={{ minRows: 15, maxRows: 15 }}
                      placeholder="Describe the program"
                    />

                    <div>
                      <Space className={styles.actionBtn}>
                        <Button
                          loading={loading}
                          type="primary"
                          className={styles.primaryBtn}
                          onClick={() => {
                            onUpdateProgram();
                          }}
                        >
                          {router.query.edit === "true" ? "Update " : "Save and continue"}
                          <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
                        </Button>
                      </Space>
                    </div>
                  </div>
                </Tabs.TabPane>

                <Tabs.TabPane
                  tab={
                    <span
                      onClick={() => {
                        setCourseState({ ...courseState, tabKey: "2" });
                      }}
                    >
                      Course
                    </span>
                  }
                  key={"2"}
                  active={router.query.item === "course" ? true : false}
                >
                  {courseDetail.length >= 1 && (
                    <Space align="center" direction="vertical">
                      {courseDetail.map((course, i) => {
                        return (
                          <div className={styles.courseViewContainer} key={i}>
                            <CourseView
                              edit={true}
                              name={course.name}
                              durationInMonths={course.durationInMonths}
                              skills={course.skills}
                              description={course.description}
                              sequenceId={course.sequenceId}
                              chapter={course.chapter}
                              state={course.state}
                              courseId={course.courseId}
                              onRefresh={onRefresh}
                              onUpdateCourse={onUpdateCourse}
                              onDeleteCourse={onDeleteCourse}
                            />
                          </div>
                        );
                      })}
                    </Space>
                  )}

                  <AddCourse
                    form={form}
                    coursetate={courseState}
                    onUpdateCourseState={onUpdateCourseState}
                    showDrawer={showDrawer}
                    open={open}
                    onRefresh={onRefresh}
                    courseDetail={courseDetail}
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default AddOverview;
