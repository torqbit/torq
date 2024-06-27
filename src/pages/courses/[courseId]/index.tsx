import Preview from "@/components/Admin/Content/Preview";
import Layout2 from "@/components/Layouts/Layout2";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { ICourseEnrollementStatus } from "@/lib/types/learn";
import ProgramService from "@/services/ProgramService";
import { IResponse, postFetch } from "@/services/request";
import { ChapterDetail, CourseInfo, CourseLessonAPIResponse } from "@/types/courses/Course";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin, message } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LearnCoursesPage: NextPage = () => {
  const router = useRouter();
  const [courseDetail, setCourseDetail] = useState<CourseLessonAPIResponse>();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>();
  const [courseStatus, setCourseStatus] = useState<ICourseEnrollementStatus>();

  const onCheckEnrollment = async () => {
    ProgramService.getEnrollmentStatus(
      Number(router.query.courseId),
      (result) => {
        setCourseStatus({
          ...courseStatus,
          isEnrolled: result.enrollStatus.isEnrolled,
          courseStarted: result.enrollStatus.courseStarted,
          nextLessonId: result.enrollStatus.nextLessonId,
          courseCompleted: result.enrollStatus.courseCompleted,
        });
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
              onCheckEnrollment();
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
      onCheckEnrollment();
      ProgramService.getCourses(
        Number(router.query.courseId),
        (result) => {
          setCourseDetail(result);
        },
        (error) => {
          message.error(error);
        }
      );
    }
  }, [router.query.courseId]);

  return (
    <Layout2>
      {contextMessageHolder}
      {courseDetail ? (
        <Preview
          videoUrl={courseDetail?.course.courseTrailer}
          enrolled={courseStatus?.isEnrolled}
          onEnrollCourse={onEnrollCourse}
          courseDetail={courseDetail}
          isCourseCompleted={courseStatus?.courseCompleted}
          isCourseStarted={courseStatus?.courseStarted}
        />
      ) : (
        <SpinLoader className="course__spinner" />
      )}
    </Layout2>
  );
};

export default LearnCoursesPage;
