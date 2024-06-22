import React, { FC, useState } from "react";

import styles from "@/styles/NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";

import { Button, Drawer, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";
import { items } from "./NavBar";

const SideNav: FC<{ isOpen: boolean; onAnchorClick: () => void }> = ({ isOpen, onAnchorClick }) => {
  const { dispatch } = useAppContext();
  const [showChildrenDrawer, setShowChildrenDrawer] = useState<boolean>(false);
  const menuItems = [
    {
      label: "Courses",
      href: "#",
    },
    {
      label: "Updates",
      href: "/updates",
    },
    {
      label: "Story",
      href: "#",
    },
    {
      label: "Blogs",
      href: "/blogs",
    },
  ];

  const onHandleChildrenDrawer = (value: boolean) => {
    setShowChildrenDrawer(value);
  };

  const onChangeTheme = () => {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
      localStorage.setItem("theme", "light");
      dispatch({
        type: "SWITCH_THEME",
        payload: "light",
      });
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "dark");
      dispatch({
        type: "SWITCH_THEME",
        payload: "dark",
      });
    }
  };

  return (
    <section className={styles.sideNaveContainer}>
      <Drawer
        classNames={{ header: styles.drawerHeader }}
        title={
          <div className={styles.drawerTitle}>
            <Link href={"/"}>
              <Flex align="center" gap={5}>
                <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
                <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
              </Flex>
            </Link>
            {isOpen && (
              <Tooltip title={""}>
                <Button
                  type="default"
                  className={styles.switchBtn}
                  shape="circle"
                  onClick={() => {
                    onChangeTheme();
                  }}
                  icon={localStorage.getItem("theme") == "dark" ? SvgIcons.sun : SvgIcons.moon}
                />
              </Tooltip>
            )}
          </div>
        }
        placement="left"
        width={300}
        closable={false}
        onClose={onAnchorClick}
        open={isOpen}
      >
        <div className={styles.menuDrawer}>
          {menuItems.map((item, i) => {
            return (
              <Link key={i} href={item.href} onClick={() => item.label === "Courses" && onHandleChildrenDrawer(true)}>
                {item.label === "Courses" ? (
                  <div className={styles.menuTitle}>
                    <div>{item.label}</div>
                    <i>{SvgIcons.chevronRight}</i>
                  </div>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}
        </div>
        <Drawer
          title={<h4 className={styles.childrenDrawerTitle}>Courses</h4>}
          classNames={{ header: styles.drawerHeader }}
          width={280}
          placement="left"
          size="default"
          closable={true}
          onClose={() => onHandleChildrenDrawer(false)}
          open={showChildrenDrawer}
        >
          {items?.map((courses: any, i) => {
            return (
              <div key={i} className={styles.coursesListWrapper}>
                <ul>
                  <li className={styles.coursesLabel}>{courses.label}</li>
                  <div>
                    <ul className={styles.childrenWrapper}>
                      {courses.children.map((child: any, i: number) => {
                        return <li key={i}>{child.label}</li>;
                      })}
                    </ul>
                  </div>
                </ul>
              </div>
            );
          })}
        </Drawer>
      </Drawer>
    </section>
  );
};

export default SideNav;
