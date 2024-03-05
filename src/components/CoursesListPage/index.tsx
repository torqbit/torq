import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/CoursesList.module.scss";
import { Button, Modal, Popconfirm, Space, Spin, Tag, message } from "antd";
import Layout from "@/components/Layout";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { ICourseList } from "@/pages/courses";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import appConstant from "@/services/appConstant";
import { Role } from "@prisma/client";
import { IResponse, getFetch, postFetch } from "@/services/request";
import SpinLoader from "../SpinLoader/SpinLoader";
import { useAppContext } from "../ContextApi/AppContext";
import { json } from "stream/consumers";

const CourseListCard: FC<ICourseList> = ({
  thumbnail,
  name,
  about,
  courseId,
  tags,
  userId,
  courseType,
  coursePrice,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isEnrolled, setEnrolled] = useState<boolean>(false);
  const onEnrollCourse = async () => {
    setLoading(true);
    try {
      const res = await postFetch(
        {
          userId: session?.id,
          courseId: courseId,
          courseType: courseType,
        },
        "/api/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        Modal.info({
          title: result.message,
        });
        setRefresh(!refresh);
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err: any) {
      message.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  const getEnrolledStatus = async () => {
    setLoading(true);
    const res = await getFetch(`/api/course/get-enrolled/${courseId}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      setEnrolled(result.isEnrolled);
    }
    setLoading(false);
  };
  const deleteCourse = async () => {
    try {
      const deleteRes = await postFetch(
        {
          userId: Number(session?.id),
          courseId: courseId,
        },
        "/api/course/delete"
      );

      const result = await deleteRes.json();

      if (deleteRes.ok) {
        message.success(result.message);
        router.reload();
      } else {
        message.error(result.error);
      }
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const sendMail = (email: string) => {
    fetch("/api/course/get-enrolled/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    }).then((res) => {
      res.json().then((data) => {});
    });
  };

  useEffect(() => {
    getEnrolledStatus();
  }, [refresh]);

  return (
    <div className={styles.course_list_card} key={courseId}>
      <div className={styles.course_card_img}>
        <img src={thumbnail} alt="Course thumbnail" />
        <span
          className={styles.play_btn}
          onClick={() => {
            if (isEnrolled) {
              router.push(`/learn/course/${courseId}`);
            }
          }}
        >
          <img src="/img/courses/play-btn.svg" alt="play-btn" />
        </span>
      </div>
      <div className={styles.course_card_details}>
        <div className={styles.course_card_header}>
          <Link href={`/course/about/${courseId}`}>
            <h3 className={styles.card_name}>{name}</h3>
          </Link>
          {session?.role === appConstant.userRole.AUTHOR && (
            <Space className={styles.actions_btns}>
              <Link href={`/add-course?edit=true&courseId=${courseId}`}>
                <EditOutlined rev={undefined} style={{ color: "#666" }} />
              </Link>
              <Popconfirm
                title="Delete the course"
                description="Are you sure to delete this course?"
                onConfirm={deleteCourse}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined rev={undefined} style={{ color: "red" }} />
              </Popconfirm>
            </Space>
          )}
        </div>
        <p className={styles.course_about}>{about}</p>
        <div className={styles.tag_label}>Learning</div>
        <div className={styles.stack_tags}>
          {tags.map((tag, i) => {
            return (
              <Tag key={i} className={styles.tag}>
                {tag}
              </Tag>
            );
          })}
        </div>
        <Space align="center">
          {isEnrolled ? (
            <Button
              type="primary"
              disabled={isEnrolled}
              loading={loading}
              className={styles.enrolled_btn}
              onClick={onEnrollCourse}
            >
              Enrolled
            </Button>
          ) : (
            <Button
              type="primary"
              loading={loading}
              className={styles.enroll_btn}
              onClick={() => {
                onEnrollCourse();

                sendMail(`${session?.user?.email}`);
              }}
            >
              {courseType === "FREE" ? "Enroll Free" : <span style={{ fontSize: "20px" }}>&#8377; {coursePrice}</span>}
            </Button>
          )}
          <Link href={`/course/about/${courseId}`}>
            <Button type="default" className={styles.read_more_btn}>
              Read More
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

const CoursesPage: FC<{ userId: number; role: Role }> = ({ userId, role }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [allCourses, setAllCourses] = React.useState<ICourseList[]>([]);

  const getData = async () => {
    try {
      const res = await getFetch(`/api/course/list-courses?pageNo=${1}&pageSize=${8}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setAllCourses(result.allCourses);
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      {loading ? (
        <SpinLoader title="Loading..." />
      ) : (
        <div className={styles.courses_list_page}>
          {allCourses.length > 0 && <h2 className={styles.page_title}>Browse Courses</h2>}
          <section className={styles.course_list}>
            {allCourses?.map((course, i) => {
              return <CourseListCard {...course} key={i} userId={userId} />;
            })}

            {allCourses.length === 0 && (
              <div className={styles.empty_course_wrapper}>
                <h1>You don't have any created or active course</h1>
                {role === appConstant.userRole.AUTHOR && (
                  <Button
                    type="primary"
                    onClick={() => router.push("/add-course")}
                    className={styles.create_course_btn}
                  >
                    Create Course
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </Layout>
  );
};

export default CoursesPage;
