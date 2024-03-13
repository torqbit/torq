import React, { FC, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";

import { Button, Form, Input, List, Space, Tabs, TabsProps, Upload, UploadProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Curriculum from "./Curriculum";
import { useRouter } from "next/router";
const AddCourseForm: FC = () => {
  const onChange = (key: string) => {
    router.replace(`/admin/content/${key}`);
  };
  const router = useRouter();

  const items: TabsProps["items"] = [
    {
      key: "settings",
      label: "Settings",
      children: <Setting />,
    },
    {
      key: "curriculum",
      label: "Curriculum",

      children: <Curriculum />,
    },

    {
      key: "preview",
      label: "Preview",
      children: "Content of Tab Pane 3",
    },
  ];
  console.log(router.query.feature, "rou");
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
          defaultActiveKey={router.query.feature as string}
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default AddCourseForm;
