import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { Button, Dropdown, MenuProps, Table, Tabs, TabsProps, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{
                cursor: "pointer",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
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
    <section className={styles.dashboard_content}>
      <Tabs
        tabBarGutter={60}
        tabBarStyle={{
          borderColor: "gray",
        }}
        tabBarExtraContent={
          <Button
            size="small"
            type="primary"
            onClick={() => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "addCourse" as ISiderMenu })}
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
    </section>
  );
};

export default Content;
