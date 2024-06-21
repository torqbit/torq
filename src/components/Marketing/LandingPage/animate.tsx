import React, { FC, useEffect, useState } from "react";

import { animated, useSpring, useSpringRef, useTrail } from "@react-spring/web";
import styles from "@/styles/NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";

import { Button, Divider, Drawer, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";

const SideNav: FC<{ isOpen: boolean; onAnchorClick: () => void }> = ({ isOpen, onAnchorClick }) => {
  const { dispatch } = useAppContext();
  const [showChildrenDrawer, setShowChildrenDrawer] = useState<boolean>(false);

  const items = ["Courses", "Updates", "Story", "Blogs"];

  const onHandleChildrenDrawer = (value: boolean) => {
    setShowChildrenDrawer(value);
  };

  const courseItems = [
    {
      key: "1",

      label: "Front end Development",
      children: [
        {
          key: "1-1",
          label: "Foundations of Web Development",
        },
        {
          key: "1-2",
          label: "Code Collaboration with Git & Github",
        },
        {
          key: "1-3",
          label: "Programming with Javascript & Typescript",
        },
        {
          key: "1-4",
          label: "UI Component Development with ReactJS",
        },
      ],
    },
    {
      key: "2",
      label: "  Back end Development",
      children: [
        {
          key: "2-1",
          label: "Server Side Development with Node.JS",
        },
        {
          key: "2-2",
          label: "REST API Development with Next.JS",
        },
        {
          key: "2-3",
          label: "Databases & Object Relational Mapping",
        },
        {
          key: "2-4",
          label: "Social Authentcation with Next Auth",
        },
      ],
    },
    {
      key: "3",

      label: " Devops & Infrastructure",
      children: [
        {
          key: "3-1",
          label: "Containerisation with Docker & Kubernetes",
        },
        {
          key: "3-2",
          label: "Cloud Deployment with AWS",
        },
      ],
    },
  ];

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
          {items.map((item, i) => {
            return (
              <Link key={i} href={"#"} onClick={() => item === "Courses" && onHandleChildrenDrawer(true)}>
                {item === "Courses" ? (
                  <div className={styles.menuTitle}>
                    <div>{item}</div>
                    <i>{SvgIcons.chevronRight}</i>
                  </div>
                ) : (
                  item
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
          {courseItems.map((courses, i) => {
            return (
              <div key={i} className={styles.coursesListWrapper}>
                <ul>
                  <li className={styles.coursesLabel}>{courses.label}</li>
                  <div>
                    <ul className={styles.childrenWrapper}>
                      {courses.children.map((child, i) => {
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
