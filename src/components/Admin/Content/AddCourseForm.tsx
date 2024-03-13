import React, { FC, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, Input, List, Space, Tabs, TabsProps, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const AddCourseForm: FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Setting",
      children: <Setting />,
    },
    {
      key: "2",
      label: "Curriculum",
      children: "Content of Tab Pane 2",
    },

    {
      key: "3",
      label: "Preview",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <Layout2>
      <section className={styles.add_course_page}>
        <div className={styles.add_course_header}>
          <div className={styles.left_icon}>
            <div className={styles.cancel_add_course}>
              <Link href="content">{SvgIcons.xMark}</Link>
            </div>
            <h3>ADD COURSE</h3>
          </div>
          <Button size="small">Publish Changes</Button>
        </div>
        <Tabs
          tabBarGutter={40}
          defaultActiveKey="1"
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default AddCourseForm;
