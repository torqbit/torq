import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useAppContext } from "../ContextApi/AppContext";
import { Badge, Layout, MenuProps } from "antd";

import SvgIcons from "../SvgIcons";
import Link from "next/link";

const { Content } = Layout;

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();

  const [theme, setTheme] = React.useState(false);
  const onThemeChange = () => {
    setTheme((prv) => {
      if (!prv) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      return !prv;
    });
  };
  const authorSiderMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "ADMINISTRATION",
      key: "administration",

      children: [
        {
          label: <Link href="/admin/users">Users</Link>,
          key: "users",
          icon: SvgIcons.userGroup,
        },
        {
          label: <Link href="/admin/content">Content</Link>,
          key: "content",
          icon: SvgIcons.content,
        },
        {
          label: <Link href="/admin/config">Configurations</Link>,

          key: "configuration",
          icon: SvgIcons.configuration,
        },
      ],
    },
  ];
  const usersMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "LEARN",
      key: "group1",
    },
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: SvgIcons.dashboard,
    },
    {
      label: <Link href="/courses">Courses</Link>,
      key: "courses",
      icon: SvgIcons.courses,
    },
    {
      label: <Link href="/guides">Guides</Link>,
      key: "guides",
      icon: SvgIcons.guides,
    },
    {
      label: <Link href="/quizzes">Quizzes</Link>,
      key: "quiz",
      icon: SvgIcons.quiz,
    },
    {
      type: "group",
      label: "ACCOUNT",
      key: "group",
    },
    {
      label: <Link href="/setting">Setting</Link>,
      key: "setting",
      icon: SvgIcons.setting,
    },
    {
      label: <Link href="/notifications">Notifications</Link>,
      key: "notification",
      icon: (
        <Badge
          color="blue"
          count={globalState?.notifications?.length}
          style={{ fontSize: 10, paddingTop: 1.5 }}
          size="small"
        >
          {SvgIcons.nottification}
        </Badge>
      ),
    },
  ];
  useEffect(() => {
    const theme = document?.documentElement?.getAttribute("data-theme");
    theme === "dark" ? setTheme(true) : setTheme(false);
  }, []);

  return (
    <>
      <Head>
        <title>Torq | Learn to lead</title>
        <meta name="description" content="Learn, build and solve the problems that matters the most" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout hasSider>
        <Sidebar menu={user?.role == "AUTHOR" ? usersMenu.concat(authorSiderMenu) : usersMenu} />
        <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
          <Content className={`${styles.sider_content} ${styles.className}`}>{children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Layout2;
