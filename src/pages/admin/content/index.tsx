import React, { FC, useState } from "react";
import styles from "../../../styles/Dashboard.module.scss";
import { Button, Dropdown, MenuProps, Modal, Space, Table, Tabs, TabsProps, Tag } from "antd";
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

const EnrolledCourseList: FC<{ allCourses: Course[] | undefined; author: string }> = ({ allCourses, author }) => {
  const router = useRouter();

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
      render: (_: any, user: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    router.replace(`/admin/content/course/${user?.key}/edit`);
                  },
                },
                {
                  key: "2",
                  label: "Hide",
                },
                {
                  key: "3",
                  label: "Delete",
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
    </div>
  );
};

const Content = (props: IProps) => {
  const { data: user } = useSession();
  const [modal, contextWrapper] = Modal.useModal();
  const { globalState, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Courses",
      children: <EnrolledCourseList allCourses={props.allCourses} author={props.author} />,
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
    console.log(`inside creatind the draft course`);

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
