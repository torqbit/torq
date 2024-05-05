import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Avatar, Button, Dropdown, Layout, Menu, MenuProps, Modal, Space } from "antd";

import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

const { Sider } = Layout;

const Sidebar: FC<{ menu: MenuProps["items"] }> = ({ menu }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();

  const [modal, contextWrapper] = Modal.useModal();

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
          <Button onClick={() => dispatch({ type: "SWITCH_THEME", payload: {} })}>Toggle</Button>
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
