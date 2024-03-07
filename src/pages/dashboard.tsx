import React, { FC } from "react";
import styles from "../styles/Dashboard.module.scss";
import Layout2 from "@/components/Layout2/Layout2";
import { useSession } from "next-auth/react";
import { List, Space, Tabs, TabsProps } from "antd";
import { MessageOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

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
      icon: (
        <svg
          fill="gray"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 31.771 31.771"
          xmlSpace="preserve"
          width={18}
          stroke="gray"
          style={{ marginBottom: -3 }}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <g>
                <path d="M31.771,20.319c0-0.474-0.279-0.87-0.676-1.066V11.9c0.09-0.034,0.146-0.119,0.145-0.214c0-0.095-0.062-0.179-0.149-0.21 L15.92,6.125c-0.194-0.069-0.406-0.069-0.601,0L0.15,11.477c-0.089,0.031-0.149,0.115-0.15,0.21s0.056,0.18,0.144,0.214 l15.148,5.896c0.211,0.081,0.444,0.081,0.655,0l14.102-5.492v6.947c-0.396,0.195-0.675,0.594-0.675,1.065 c0,0.492,0.3,0.919,0.729,1.102c-0.429,0.847-0.729,2.585-0.729,3.081c0,0.661,0.537,1.197,1.198,1.197 c0.66,0,1.197-0.536,1.197-1.197c0-0.496-0.301-2.234-0.729-3.081C31.47,21.238,31.771,20.811,31.771,20.319z"></path>{" "}
                <path d="M4.888,14.87c0.001,1.696,0.002,3.692,0.002,4.009c0,3.158,4.753,5.729,10.73,5.89c5.976-0.161,10.729-2.729,10.729-5.89 c0-0.315,0-2.312,0.002-4.009l-10.406,4.051c-0.211,0.082-0.444,0.082-0.655,0L4.888,14.87z"></path>{" "}
              </g>
            </g>
          </g>
        </svg>
      ),
      children: <EnrolledCourseList />,
    },
    {
      key: "2",
      label: "Certifications",
      children: "Content of Tab Pane 2",
      icon: <SafetyCertificateOutlined />,
    },
    {
      key: "3",
      label: "Quiz",
      children: "Content of Tab Pane 3",
      icon: <MessageOutlined />,
    },
  ];

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>

        <h4>Dashboard</h4>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </section>
    </Layout2>
  );
};

export default Dashboard;
