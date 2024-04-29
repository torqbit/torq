import Preview from "@/components/Admin/Content/Preview";
import Layout2 from "@/components/Layout2/Layout2";
import LearnCourse from "@/components/LearnCourse/LearnCourse";
import ProgramService from "@/services/ProgramService";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { ChapterDetail, CourseInfo } from "@/types/courses/Course";
import { Modal, Spin, message } from "antd";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LearnCoursesPage: NextPage = () => {
  const [videoUrl, setVideoUrl] = useState<string>();
  const [chapterList, setChapterList] = useState<ChapterDetail[]>();
  const router = useRouter();
  const { data: session } = useSession();
  const [enrolled, setEnroll] = useState<boolean>();
  const [courseType, setCourseType] = useState<string>();
  const [courseDetail, setCourseDetail] = useState<CourseInfo>();

  const [loading, setLoading] = useState<boolean>();
  const [isCourseCompleted, setCourseCompleted] = useState<boolean>();

  const onCheckErollment = async () => {
    const res = await getFetch(`/api/course/get-enrolled/${router.query.courseId}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      setEnroll(result.isEnrolled);
    }
  };

  const onEnrollCourse = async () => {
    setLoading(true);
    try {
      if (enrolled) {
        router.replace(`/courses/${router.query.courseId}/play`);
        return;
      }
      const res = await postFetch(
        {
          userId: session?.id,
          courseId: Number(router.query.courseId),
          courseType: courseType,
        },
        "/api/v1/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.already) {
          router.replace(`/courses/${router.query.courseId}/play`);
          setLoading(false);
        } else {
          Modal.info({
            title: result.message,
            onOk: () => {
              router.replace(`/courses/${router.query.courseId}/play`);
              setLoading(false);
            },
          });
        }
      } else {
        message.error(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      message.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.courseId) {
      ProgramService.getProgress(
        Number(router.query.courseId),
        (result) => {
          setCourseCompleted(result.latestProgress.completed);
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
      {chapterList?.length ? (
        <Preview
          videoUrl={videoUrl}
          enrolled={enrolled}
          chapter={chapterList}
          onEnrollCourse={onEnrollCourse}
          courseDetail={courseDetail}
          isCourseCompleted={isCourseCompleted}
        />
      ) : (
        <Spin tip="Loading..." fullscreen />
      )}
    </Layout2>
  );
};

export default LearnCoursesPage;
