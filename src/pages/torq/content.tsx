import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { Button, Dropdown, MenuProps, Table, Tabs, TabsProps, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { ISiderMenu, useAppContext } from "../../components/ContextApi/AppContext";
import Layout2 from "@/components/Layout2/Layout2";
import { useSession } from "next-auth/react";
import Link from "next/link";

const EnrolledCourseList: FC = () => {
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "Hide",
    },
    {
      key: "3",
      label: "Delete",
    },
  ];

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
      title: "LEARNERS",
      align: "center",
      dataIndex: "learners",
      key: "learners",
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
          <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "key",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Foundation of web dev",
      author: "Vijay",
      state: "Published",
      learners: "120",
      contentDuration: "4h 30m",
    },
    {
      key: "2",
      name: "Introduction to Git",
      author: "Arjun",
      state: "Draft",
      learners: "NA",
      contentDuration: "1h 25m",
    },
    {
      key: "3",
      name: "Introduction to JS",
      author: "Aaron",
      state: "Published",
      learners: "4509",
      contentDuration: "12h 45m",
    },
  ];

  return (
    <div>
      <Table size="small" className="users_table" columns={columns} dataSource={data} />
    </div>
  );
};

const Content: FC = () => {
  const { data: user } = useSession();

  const { globalState, dispatch } = useAppContext();
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Courses",
      children: <EnrolledCourseList />,
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
            <Link href="addCourseForm">
              <Button
                size="small"
                type="primary"
                onClick={() => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "content" as ISiderMenu })}
                className={styles.add_user_btn}
              >
                <span>Add Course</span>
                {SvgIcons.arrowRight}
              </Button>
            </Link>
          }
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default Content;
