import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, ConfigProvider, Layout, MenuProps } from "antd";
import SvgIcons from "../SvgIcons";
import Link from "next/link";
import { UserSession } from "@/lib/types/user";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import SpinLoader from "../SpinLoader/SpinLoader";
import NotificationService from "@/services/NotificationService";

const { Content } = Layout;

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const router = useRouter();

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

          key: "config",
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
      key: "quizzes",
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
      key: "notifications",
      icon: (
        <Badge
          color="blue"
          classNames={{ indicator: styles.badgeIndicator }}
          count={globalState.notifications && globalState.notifications > 0 ? globalState.notifications : 0}
          style={{ fontSize: 10, paddingTop: 1.5 }}
          size="small"
        >
          {SvgIcons.nottification}
        </Badge>
      ),
    },
  ];
  const onChangeSelectedBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      selectedMenu = router.pathname.split("/")[2];
    }
    dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: selectedMenu as ISiderMenu });
  };
  let interval: any = undefined;

  const onCheckLatestNotification = () => {
    interval = setInterval(() => {
      NotificationService.countLatestNotification(
        (result) => {
          if (result.countUnreadNotifications) {
            dispatch({ type: "SET_UNREAD_NOTIFICATION", payload: result.countUnreadNotifications });
          }
        },
        (error) => {}
      );
    }, 5000);
  };
  useEffect(() => {
    if (user) {
      onCheckLatestNotification();
      onChangeSelectedBar();
      const userSession = user.user as UserSession;

      dispatch({
        type: "SET_USER",
        payload: userSession,
      });

      dispatch({
        type: "SWITCH_THEME",
        payload: userSession.theme || "light",
      });
      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    } else {
      interval && clearInterval(interval);
    }
  }, [user]);

  return (
    <>
      {globalState.pageLoading ? (
        <SpinLoader />
      ) : (
        <ConfigProvider theme={globalState.session?.theme == "dark" ? darkThemConfig : antThemeConfig}>
          <Head>
            <title>Torq | Learn to lead</title>
            <meta name="description" content="Learn, build and solve the problems that matters the most" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Layout hasSider className="default-container">
            <Sidebar menu={user?.role == "AUTHOR" ? usersMenu.concat(authorSiderMenu) : usersMenu} />
            <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
              <Content className={`${styles.sider_content} ${styles.className}`}>{children}</Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      )}
    </>
  );
};

export default Layout2;
