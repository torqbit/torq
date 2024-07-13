import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { IResponsiveNavMenu, ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, Button, ConfigProvider, Flex, Input, Layout, MenuProps, Popover, message } from "antd";
import SvgIcons from "../SvgIcons";
import Link from "next/link";
import { UserSession } from "@/lib/types/user";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import SpinLoader from "../SpinLoader/SpinLoader";
import NotificationService from "@/services/NotificationService";
import ConversationCard from "../Conversation/ConversationCard";
import ConversationService, { IConversationList } from "@/services/ConversationService";
import { IConversationData } from "@/pages/api/v1/conversation/list";
import { Scrollbars } from "react-custom-scrollbars";

const { Content } = Layout;

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const [chatWindow, setChatWindow] = useState<boolean>(false);
  const [conversationList, setConversationList] = useState<IConversationData[]>();
  const [comment, setComment] = useState<string>("");

  const [conversationLoading, setConversationLoading] = useState<{
    postLoading: boolean;
    replyLoading: boolean;
  }>({
    postLoading: false,
    replyLoading: false,
  });

  const router = useRouter();

  const responsiveNav = [
    {
      title: "Dashboard",
      icon: SvgIcons.dashboard,
      link: "dashboard",
    },
    {
      title: "Course",
      icon: SvgIcons.courses,
      link: "courses",
    },
    {
      title: "Guide",
      icon: SvgIcons.guides,
      link: "guide",
    },
    {
      title: "Settings",
      icon: SvgIcons.setting,
      link: "setting",
    },
    {
      title: "Notifications",
      icon: SvgIcons.nottification,
      link: "notifications",
    },
  ];

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
        // {
        //   label: <Link href="/admin/conversations">Conversations</Link>,

        //   key: "conversations",
        //   icon: SvgIcons.message,
        // },
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

  const onChangeSelectedNavBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      selectedMenu = router.pathname.split("/")[2];
    }
    dispatch({ type: "SET_NAVBAR_MENU", payload: selectedMenu as IResponsiveNavMenu });
  };
  let intervalId: NodeJS.Timer | undefined;

  const getLatestNotificationCount = () => {
    NotificationService.countLatestNotification(
      (result) => {
        if (result.countUnreadNotifications) {
          dispatch({ type: "SET_UNREAD_NOTIFICATION", payload: result.countUnreadNotifications });
        } else {
          dispatch({ type: "SET_UNREAD_NOTIFICATION", payload: 0 });
        }
      },
      (error) => {}
    );
  };

  const getAllConversation = () => {
    ConversationService.getAllConversation(
      (result) => {
        setConversationList(result.comments);
      },
      (error) => {}
    );
  };

  const onPost = () => {
    setConversationLoading({ postLoading: true, replyLoading: false });
    if (comment) {
      let id = conversationList && conversationList[0].id;
      ConversationService.addConversation(
        String(comment),
        id,
        (result) => {
          const updateList = conversationList?.map((list, i) => {
            if (i === conversationList.length - 1) {
              return {
                ...list,
                comments: [...list.comments, result.conversation.comment],
              };
            } else {
              return list;
            }
          });
          setConversationList(updateList as IConversationData[]);
          message.success(result.message);
          setComment("");
          setConversationLoading({ postLoading: false, replyLoading: false });
        },
        (error) => {
          message.error(error);
          setConversationLoading({ postLoading: false, replyLoading: false });
        }
      );
    } else {
      message.warning("Type a comment first");
      setConversationLoading({ postLoading: false, replyLoading: false });
    }
  };
  useEffect(() => {
    if (user) {
      if (typeof intervalId === "undefined") {
        intervalId = setInterval(() => {
          getLatestNotificationCount();
        }, 5000);
      }
    }
    return () => intervalId && clearInterval(Number(intervalId));
  });

  useEffect(() => {
    if (user) {
      getLatestNotificationCount();
      onChangeSelectedBar();
      onChangeSelectedNavBar();
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
            <Sidebar
              menu={user?.role == "AUTHOR" || user?.role == "ADMIN" ? usersMenu.concat(authorSiderMenu) : usersMenu}
            />
            <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
              <Content className={`${styles.sider_content} ${styles.className}`}>{children}</Content>
            </Layout>
            <div className={styles.responsiveNavContainer}>
              {responsiveNav.map((nav, i) => {
                return (
                  <Link
                    key={i}
                    href={`/${nav.link}`}
                    className={globalState.selectedResponsiveMenu === nav.link ? styles.selectedNavBar : styles.navBar}
                  >
                    <span></span>
                    <Flex vertical align="center" gap={5} justify="space-between">
                      <i>{nav.icon}</i>
                      <div className={styles.navTitle}>{nav.title}</div>
                    </Flex>
                  </Link>
                );
              })}
            </div>
          </Layout>
        </ConfigProvider>
      )}
    </>
  );
};

export default Layout2;
