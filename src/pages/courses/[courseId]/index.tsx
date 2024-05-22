import Preview from "@/components/Admin/Content/Preview";
import Layout2 from "@/components/Layouts/Layout2";
import { ICourseStatus } from "@/lib/types/learn";
import ProgramService from "@/services/ProgramService";
import { IResponse, postFetch } from "@/services/request";
import { ChapterDetail, CourseInfo } from "@/types/courses/Course";
import { Modal, Spin, message } from "antd";
import { NextPage } from "next";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LearnCoursesPage: NextPage = () => {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [chapterList, setChapterList] = useState<ChapterDetail[]>();
  const [courseType, setCourseType] = useState<string>();
  const [courseDetail, setCourseDetail] = useState<CourseInfo>();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>();
  const [courseStatus, setCourseStatus] = useState<ICourseStatus>();

  const onCheckErollment = async () => {
    ProgramService.getEnrollmentStatus(
      Number(router.query.courseId),
      (result) => {
        setCourseStatus(result.enrollStatus);
      },
      (error) => {}
    );
  };

  const onEnrollCourse = async () => {
    setLoading(true);
    try {
      if (courseStatus?.isEnrolled) {
        router.replace(`/courses/${router.query.courseId}/lesson/${courseStatus?.nextLessonId}`);
        return;
      }
      const res = await postFetch(
        {
          courseId: Number(router.query.courseId),
          courseType: courseType,
        },
        "/api/v1/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.already) {
          router.replace(`/courses/${router.query.courseId}/lesson/${courseStatus?.nextLessonId}`);
          setLoading(false);
        } else {
          Modal.info({
            title: result.message,
            onOk: () => {
              onCheckErollment();
              setLoading(false);
            },
          });
        }
      } else {
        messageApi.error(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      messageApi.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.courseId) {
      ProgramService.getProgress(
        Number(router.query.courseId),
        (result) => {
          setCourseStatus({ ...courseStatus, isCourseCompleted: result.latestProgress.completed } as ICourseStatus);
        },
        (error) => {}
      );
    }
  }, []);

  useEffect(() => {
    if (router.query.courseId) {
      onCheckErollment();
      ProgramService.getCourses(
        Number(router.query.courseId),
        (result) => {
          setCourseDetail(result.courseDetails);
          setVideoUrl(result.courseDetails.tvUrl);
          setChapterList(result.courseDetails.chapters.filter((c) => c.state === "ACTIVE"));
          setCourseType(result.courseDetails.courseType);
        },
        (error) => {}
      );
    }
  }, [router.query.courseId]);

  return (
    <Layout2>
      {contextMessageHolder}
      {chapterList?.length ? (
        <Preview
          videoUrl={videoUrl}
          enrolled={courseStatus?.isEnrolled}
          chapter={chapterList}
          onEnrollCourse={onEnrollCourse}
          courseDetail={courseDetail}
          isCourseCompleted={courseStatus?.isCourseCompleted}
          isCourseStarted={courseStatus?.courseStarted}
        />
      ) : (
        <Spin tip="Loading..." fullscreen />
      )}
    </Layout2>
  );
};

export default LearnCoursesPage;
