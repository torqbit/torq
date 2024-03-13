import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Avatar, Layout, Menu, MenuProps, Space } from "antd";
import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
const { Sider } = Layout;

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();

  const siderMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "LEARN",
      key: "group1",
    },
    {
      label: <Link href="dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: SvgIcons.dashboard,
    },
    {
      label: <Link href="courses">Courses</Link>,
      key: "courses",
      icon: SvgIcons.courses,
    },
    {
      label: "Certifications",
      key: "certifications",
      icon: SvgIcons.certification,
    },
    {
      label: "Guides",
      key: "guides",
      icon: SvgIcons.guides,
    },
    {
      label: "Quiz",
      key: "quiz",
      icon: SvgIcons.quiz,
    },
    {
      type: "group",
      label: "ACCOUNT",
      key: "quiz",
    },
    {
      label: "Setting",
      key: "setting",
      icon: SvgIcons.setting,
    },
    {
      label: "Notifications",
      key: "notification",
      icon: SvgIcons.nottification,
    },
    {
      type: "group",
      label: "ADMINISTRATION",
      key: "administration",
    },
    {
      label: <Link href="users">Users</Link>,
      key: "users",
      icon: SvgIcons.userGroup,
    },
    {
      label: <Link href="/admin/content/setting">Content</Link>,
      key: "content",
      icon: SvgIcons.content,
    },
    {
      label: "Configurations",
      key: "configuration",
      icon: SvgIcons.configuration,
    },
  ];

  return (
    <Sider
      width={260}
      theme="light"
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div>
        <div className={styles.logo}>
          <Link href="/programs">
            <Image src="/img/dark-logo.png" alt="torqbit" width={130} height={30} />
          </Link>
        </div>
        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%" }}
          items={siderMenu}
        />
      </div>
      <Space direction="horizontal" className={styles.user_profile}>
        <Space align={collapsed ? "center" : "start"}>
          <Avatar icon={<UserOutlined />} />
          {!collapsed && (
            <div>
              <h4>{user?.user?.name}</h4>
              <h5>{user?.user?.email}</h5>
            </div>
          )}
        </Space>
        {!collapsed && SvgIcons.threeDots}
      </Space>
    </Sider>
  );
};

export default Sidebar;
