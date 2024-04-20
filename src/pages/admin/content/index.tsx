import React, { FC, useEffect, useState } from "react";
import styles from "../../../styles/Dashboard.module.scss";
import { Button, Dropdown, MenuProps, Modal, Space, Table, Tabs, TabsProps, Tag, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { ISiderMenu, useAppContext } from "../../../components/ContextApi/AppContext";
import Layout2 from "@/components/Layout2/Layout2";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { getAllCoursesById } from "@/actions/getCourseById";
import { GetServerSidePropsContext } from "next";
import { Course } from "@prisma/client";

interface IProps {
  author: string;
  allCourses: Course[] | undefined;
}

const EnrolledCourseList: FC<{
  allCourses: Course[] | undefined;
  author: string;
  handleCourseStatusUpdate: (courseId: number, newState: string) => void;
  handleCourseDelete: (courseId: number) => void;
}> = ({ allCourses, author, handleCourseStatusUpdate, handleCourseDelete }) => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();

  const columns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "AUTHOR",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "STATE",
      dataIndex: "state",
      key: "state",
    },

    {
      title: "CONTENT DURATION",
      align: "center",
      dataIndex: "contentDuration",
      key: "key",
    },
    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, courseInfo: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    router.push(`/admin/content/course/${courseInfo?.key}/edit`);
                  },
                },
                {
                  key: "2",
                  label: courseInfo.state == "DRAFT" ? "Publish" : "Move to Draft",
                  onClick: () => {
                    handleCourseStatusUpdate(Number(courseInfo.key), courseInfo.state == "DRAFT" ? "ACTIVE" : "DRAFT");
                  },
                },
                {
                  key: "3",
                  label: "Delete",
                  onClick: () => {
                    console.log("clicked on delete");
                    modal.confirm({
                      title: "Are you sure you want to delete the course?",
                      okText: "Yes",
                      cancelText: "No",
                      onOk: () => {
                        console.log("deleting the course");
                        handleCourseDelete(Number(courseInfo.key));
                      },
                    });
                  },
                },
              ],
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "key",
    },
  ];

  const data = allCourses?.map((course, i) => {
    return {
      key: course.courseId,
      name: course.name,
      author: author,
      state: course.state,
      contentDuration: "4h 30m",
    };
  });

  return (
    <div>
      <Table size="small" className="users_table" columns={columns} dataSource={data} />
      {contextHolder}
    </div>
  );
};

const Content = (props: IProps) => {
  const { data: user } = useSession();
  const [modal, contextWrapper] = Modal.useModal();
  const { globalState, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coursesAuthored, setCoursesAuthored] = useState<{ fetchCourses: boolean; courses: Course[] | undefined }>({
    fetchCourses: false,
    courses: props.allCourses,
  });
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const onCourseDelete = (courseId: number) => {
    ProgramService.deleteCourse(
      courseId,
      (res) => {
        if (res.success) {
          setCoursesAuthored({ ...coursesAuthored, fetchCourses: true });
          message.success("Course has been deleted");
        } else {
          message.error(`Course deletion failed due to ${res.error}`);
        }
      },
      (err) => {
        message.error(`Course deletion failed due to ${err}`);
      }
    );
  };

  useEffect(() => {
    if (coursesAuthored.fetchCourses) {
      ProgramService.getCoursesByAuthor(
        (res) => {
          console.log(res.courses);
          setCoursesAuthored({ ...coursesAuthored, fetchCourses: false, courses: res.courses });
        },
        (err) => {
          setCoursesAuthored({ ...coursesAuthored, fetchCourses: false });
          message.error(`Unable to get the courses due to ${err}`);
        }
      );
    }
  }, [coursesAuthored.fetchCourses]);

  const onCourseUpdate = (courseId: number, newState: string) => {
    ProgramService.updateCourseState(
      courseId,
      newState,
      (res) => {
        if (res.success) {
          message.success(`Course status has been updated`);
          setCoursesAuthored({ ...coursesAuthored, fetchCourses: true });
        } else {
          message.error(`Course status update failed due to ${res.error}`);
        }
      },
      (err) => {
        message.error(`Course status update failed due to ${err}`);
      }
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Courses",
      children: (
        <EnrolledCourseList
          allCourses={coursesAuthored.courses}
          author={props.author}
          handleCourseDelete={onCourseDelete}
          handleCourseStatusUpdate={onCourseUpdate}
        />
      ),
    },
    {
      key: "2",
      label: "Certifications",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Quiz",
      children: "Content of Tab Pane 3",
    },
  ];

  const previousDraft = (id: number) => {
    router.push(`/admin/content/course/${id}/edit`);
    setIsModalOpen(false);
  };

  const handleOk = () => {
    console.log("create draft course clicked");
    setIsModalOpen(false);

    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        console.log(result);
        router.push(`/admin/content/course/${result.getCourse.courseId}/edit`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onCreateDraftCourse = () => {
    showModal();
    if (router.query.id) {
      router.push(`/admin/content/course/${router.query.id}/edit`);
    } else {
      ProgramService.getLatesDraftCourse(
        (result) => {
          if (result.getCourse) {
            modal.confirm({
              title: "Choose from the below options?",
              content: (
                <>
                  <p>You currently have unsaved changes that you had made while creating the course.</p>
                </>
              ),
              footer: (
                <Space>
                  <Button type="primary" onClick={() => previousDraft(result.getCourse.courseId)}>
                    Previous draft course
                  </Button>
                  or
                  <Button onClick={handleOk}>Create a new course</Button>
                </Space>
              ),
            });
          } else {
            handleOk();
          }
        },
        (error) => {}
      );
    }
  };

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Content</h3>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          tabBarExtraContent={
            <Button
              type="primary"
              onClick={() => {
                //dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "content" as ISiderMenu });
                onCreateDraftCourse();
              }}
              className={styles.add_user_btn}
            >
              <span>Add Course</span>
              {SvgIcons.arrowRight}
            </Button>
          }
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
        {contextWrapper}
      </section>
    </Layout2>
  );
};

export default Content;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx);
  if (user) {
    const allCourses = await getAllCoursesById(user?.id);

    return {
      props: {
        author: user.user?.name,
        allCourses: JSON.parse(allCourses),
      },
    };
  }
};
