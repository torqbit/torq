import React, { FC, useState } from "react";

import Layout2 from "@/components/Layout2/Layout2";
import Link from "next/link";

import styles from "@/styles/Config.module.scss";

import { Button, Flex, Form, FormInstance, Tabs, TabsProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import MediaStorage from "./MediaStorage";
import { useSession } from "next-auth/react";
import ProgramService from "@/services/ProgramService";

const Config: FC = () => {
  const { data: user } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");

  const onRefresh = () => {
    setRefresh(!refresh);
  };
  const [form] = Form.useForm();
  const onFinish = () => {
    setLoading(true);
    console.log(form.getFieldsValue());
    ProgramService.addCredentials(
      "bunny.net",
      form.getFieldsValue(),
      (result) => {
        console.log(result, "cred");
        message.success(result.message);
        form.resetFields();
        setLoading(false);
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  const onChange = (key: string) => {
    if (key === "3") {
      onRefresh();

      setActiveKey("3");
    }
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Media Storage",
      children: <MediaStorage form={form} onFinish={onFinish} loading={loading} />,
    },
    {
      key: "2",
      label: "Certificate templates",

      children: "content of tab 2",
    },
  ];

  return (
    <Layout2>
      <section className={styles.config_page}>
        <h1>
          Hello <span>{user?.user?.name}</span>
        </h1>
        <Flex align="center" gap={3} className={styles.header_link}>
          <a href="#">Adminstration</a>
          {SvgIcons.chevronRight}
          <a href="#">Configuration</a>
        </Flex>
        <Tabs
          tabBarGutter={40}
          activeKey={activeKey}
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default Config;
