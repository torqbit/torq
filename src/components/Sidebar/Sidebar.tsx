import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Avatar, Button, Dropdown, Layout, Menu, MenuProps, Modal, Space, Tooltip } from "antd";

import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Theme } from "@prisma/client";
import { postFetch } from "@/services/request";

const { Sider } = Layout;

const Sidebar: FC<{ menu: MenuProps["items"] }> = ({ menu }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();

  const [modal, contextWrapper] = Modal.useModal();

  const updateTheme = async (theme: Theme) => {
    dispatch({
      type: "SET_USER",
      payload: { ...user?.user, theme: theme },
    });
    let mainHTML = document.getElementsByTagName("html").item(0);
    if (mainHTML != null) {
      mainHTML.setAttribute("data-theme", theme);
    }
    const response = await postFetch({ theme: theme }, "/api/v1/user/theme");
    if (response.ok) {
      update({ theme: theme });
    }
  };

  return (
    <Sider
      width={260}
      theme="light"
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div
        className={`${styles.collapsed_btn} ${collapsed ? styles.collapsed : styles.not_collapsed}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
      </div>
      {contextWrapper}
      <div>
        <div className={styles.logo}>
          <Link href="/programs">
            {collapsed ? (
              <Image src="/icon/torq.svg" alt="torq" width={40} height={40} />
            ) : (
              <Image src="/icon/torq-long.svg" alt="torq" width={100} height={40} />
            )}
          </Link>
          {!collapsed && (
            <Tooltip title={`Switch to ${globalState.session?.theme == "dark" ? "light" : "dark"} mode`}>
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  const newTheme: Theme = globalState.session?.theme == "dark" ? "light" : "dark";
                  updateTheme(newTheme);
                }}
                icon={globalState.session?.theme == "dark" ? SvgIcons.sun : SvgIcons.moon}
              />
            </Tooltip>
          )}
        </div>

        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={menu}
        />
      </div>
      <Space
        direction={collapsed ? "vertical" : "horizontal"}
        align={collapsed ? "center" : "start"}
        className={styles.user_profile}
      >
        <Space>
          <Avatar src={user?.user?.image} icon={<UserOutlined />} />
          {!collapsed && (
            <div>
              <h4>{user?.user?.name}</h4>
              <h5>{user?.user?.email}</h5>
            </div>
          )}
        </Space>
        {!collapsed && (
          <Dropdown
            menu={{
              items: [
                {
                  key: "0",
                  label: <Link href={`/setting`}>Setting</Link>,
                },
                {
                  key: "1",
                  label: "Logout",
                  onClick: () => {
                    signOut();
                  },
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        )}
      </Space>
    </Sider>
  );
};

export default Sidebar;
