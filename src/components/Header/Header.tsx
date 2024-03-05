import { Space, Dropdown, MenuProps, Avatar, Badge, message, Popover, List, Drawer, Spin, Skeleton } from "antd";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import styles from "@/styles/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { UserOutlined, BookOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Notification, Discussion } from "@prisma/client";
import { IResponse, getFetch } from "@/services/request";
import { truncateString } from "@/services/helper";
import moment from "moment";
import { useAppContext } from "../ContextApi/AppContext";
import { customFromNow } from "@/services/momentConfig";
import { useMediaPredicate } from "react-media-hook";

moment.locale("en", { ...customFromNow });

export interface INotification extends Notification {
  comment: Discussion;
  tagComment: any;
  resource: {
    resourceId: number;
    chapterId: number;
    chapter: {
      courseId: number;
    };
  };
}

const NotificationContentCard: FC<{ notifi: INotification }> = ({ notifi }) => {
  const router = useRouter();

  const onSelectNotifi = async (item: INotification) => {
    if (item.notificationType === "COMMENT") {
      router.push(
        `/learn/course/${item.tagComment.resource.chapter.courseId}/?tab=qa&comment=${item.tagCommentId}&notifi=${item.id}&chapter=${item.tagComment.resource.chapter.chapterId}&resource=${item.tagComment.resource.resourceId}`
      );
    } else if (item.notificationType === "EVALUATE_ASSIGNMENT") {
      router.push(
        `/learn/course/${item.resource.chapter.courseId}/?tab=submission&notifi=${item.id}&chapter=${item.resource.chapterId}&resource=${item.resource.resourceId}`
      );
    }
  };

  if (notifi.notificationType === "COMMENT") {
    return (
      <List.Item
        onClick={() => onSelectNotifi(notifi)}
        style={{ cursor: "pointer" }}
        className={styles.notification_item}
      >
        <List.Item.Meta
          title={
            <Space size={0} style={{ justifyContent: "space-between", width: "100%" }}>
              <span>Reply on QA : {truncateString(notifi?.tagComment?.comment as string, 20)}</span>
              <span style={{ color: "#68696d" }}>
                {moment(new Date(notifi.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}
              </span>
            </Space>
          }
          description={truncateString(notifi?.comment?.comment as string, 35)}
        />
      </List.Item>
    );
  } else if (notifi.notificationType === "EVALUATE_ASSIGNMENT") {
    return (
      <List.Item
        onClick={() => onSelectNotifi(notifi)}
        style={{ cursor: "pointer" }}
        className={styles.notification_item}
      >
        <List.Item.Meta
          title={
            <Space size={0} style={{ justifyContent: "space-between", width: "100%" }}>
              <span>{truncateString(notifi?.title as string, 25)}</span>
              <span style={{ color: "#68696d" }}>
                {moment(new Date(notifi.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}
              </span>
            </Space>
          }
          description={truncateString(notifi?.description as string, 35)}
        />
      </List.Item>
    );
  } else {
    return <></>;
  }
};

const Header: FC<{ theme: boolean; onThemeChange: () => void }> = ({ theme = false, onThemeChange }) => {
  const { globalState, dispatch } = useAppContext();
  const isMax415Width = useMediaPredicate("(max-width: 415px)");

  const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false);

  const { notifications } = globalState;
  const router = useRouter();
  const { data: user } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "5",
      label: "Admin",
      onClick: () => router.push("/admin"),
      style: { display: `${user?.role === "AUTHOR" ? "block" : "none"}` },
    },

    {
      key: "3",
      label: "Add Program",
      onClick: () => router.push("/programs/add-program"),
      style: { display: `${user?.role === "AUTHOR" ? "block" : "none"}` },
    },

    {
      key: "4",
      onClick: () => signOut({ callbackUrl: "/" }),
      label: "Logout",
    },
  ];

  const notificationContent = (
    <List
      style={{ width: 300 }}
      itemLayout="horizontal"
      dataSource={notifications?.length ? notifications : []}
      renderItem={(notifi, index) => <NotificationContentCard notifi={notifi} />}
    />
  );

  const getNotification = async (userId: number) => {
    try {
      const res = await getFetch(`/api/notification/get/${userId}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
      } else {
        message.error(result.error);
      }
    } catch (err: any) {}
  };

  React.useEffect(() => {
    if (user?.id) {
      getNotification(user.id);
    }
  }, [user]);

  const onCloseMenu = () => {
    setMenuOpen(false);
  };
  const openMobileMenu = () => {
    setMenuOpen(true);
  };

  const onClickDrawerLink = (link: string) => {
    router.push(link);
    onCloseMenu();
  };

  return (
    <div className={styles.main_header_wrapper}>
      <div className={styles.center_content}>
        <Space align="center" size={0}>
          <Link href="/programs">
            {theme ? (
              <Image src="/img/dark-logo.png" className={styles.app_icon} alt="torqbit" width={130} height={30} />
            ) : (
              <Image src="/img/dark-logo.png" className={styles.app_icon} alt="torqbit" width={130} height={30} />
            )}
          </Link>

          <Link href="/programs" className={styles.program_link}>
            Programs
          </Link>
        </Space>

        <Space align="center" className={styles.action_btns} size="middle">
          <Popover
            placement="bottom"
            className={styles.notifi_icon}
            title={<span style={{ color: "#4096ff" }}>Notification</span>}
            content={notificationContent}
            trigger="hover"
          >
            <Badge count={notifications?.length ?? 0}>
              <Image
                src="/img/courses/notification.svg"
                style={{ cursor: "pointer" }}
                width={30}
                height={30}
                alt="Notificaton Icon"
              />
            </Badge>
          </Popover>
          {!user ? (
            <Skeleton.Avatar size={30} />
          ) : (
            <Dropdown disabled={isMax415Width} menu={{ items }} trigger={["hover"]} placement="bottom" arrow>
              <Space className={styles.user_menu} onClick={() => isMax415Width && openMobileMenu()}>
                <h4 className={styles.user_name}>{user?.user?.name}</h4>
                <img
                  className={styles.userImage}
                  src={user?.user?.image ? user?.user.image : "/img/profile/profile-circle-svgrepo-com.svg"}
                  alt=""
                />
              </Space>
            </Dropdown>
          )}
        </Space>
      </div>

      <Drawer
        title={
          <Space>
            <Space className={styles.user_mobile_info}>
              <Space direction="vertical" size={0} className={styles.user_details}>
                <h5 className={styles.user_name}>{user?.user?.name}</h5>
                <h5 className={styles.user_email}>{user?.user?.email}</h5>
              </Space>

              <img
                className={styles.userImage}
                src={user?.user?.image ? user?.user.image : "/img/profile/profile-circle-svgrepo-com.svg"}
                alt=""
              />
            </Space>
          </Space>
        }
        width={240}
        className={styles.mobile_header_menu}
        placement="right"
        onClose={onCloseMenu}
        open={isMenuOpen}
      >
        <ul className={styles.menu_list}>
          <li className={styles.menu_item} onClick={() => onClickDrawerLink("/profile")}>
            <UserOutlined rev={undefined} /> Profile
          </li>
          <li className={styles.menu_item} onClick={() => onClickDrawerLink("/enroll-courses")}>
            <BookOutlined rev={undefined} /> Enrolled Courses
          </li>
          <li className={styles.menu_item} onClick={() => signOut()}>
            <LogoutOutlined rev={undefined} /> Logout
          </li>
        </ul>
      </Drawer>
    </div>
  );
};

export async function getStaticProps() {
  const theme = document?.documentElement?.getAttribute("data-theme");

  return {
    props: { theme },
  };
}

export default Header;
