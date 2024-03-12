import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { List, Space, Tabs, TabsProps } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layout2/Layout2";

const EnrolledCourseList: FC = () => {
  const courseList = [
    {
      courseName: "Foundation of Web Development",
      completed: "25%",
    },
    {
      courseName: "Code Collaboration with Git & Github",
      completed: "15%",
    },
    {
      courseName: "Interactivity with Javascript",
      completed: "50%",
    },
  ];
  return (
    <List
      size="small"
      header={false}
      footer={false}
      bordered={false}
      dataSource={courseList}
      className={styles.enrolled_course_list}
      renderItem={(item) => (
        <List.Item className={styles.enroll_course_item}>
          <div>{item.courseName}</div>
          <Space className={styles.completed_course} size={5}>
            <span>{item.completed}</span> <span>Completed</span>
          </Space>
        </List.Item>
      )}
    />
  );
};

const Dashboard: FC = () => {
  const { data: user } = useSession();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Enrolled Courses",
      icon: SvgIcons.courses,
      children: <EnrolledCourseList />,
    },
    {
      key: "2",
      label: "Certifications",
      children: "Content of Tab Pane 2",
      icon: SvgIcons.certification,
    },
    {
      key: "3",
      label: "Quiz",
      children: "Content of Tab Pane 3",
      icon: SvgIcons.quiz,
    },
  ];

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Dashboard</h3>

        <Tabs defaultActiveKey="1" className="content_tab" items={items} onChange={onChange} />
      </section>
    </Layout2>
  );
};

export default Dashboard;
