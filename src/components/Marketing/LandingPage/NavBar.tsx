import { FC } from "react";
import styles from "@/styles/NavBar.module.scss";
import Image from "next/image";
import { Button, Divider, Dropdown, Flex, MenuProps, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
export const items: MenuProps["items"] = [
  {
    key: "1",
    type: "group",
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
    type: "group",
    label: "Back end Development",
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
        label: "Social Authentication with Next Auth",
      },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "Devops & Infrastructure",
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

const NavBar: FC<{}> = () => {
  const { dispatch } = useAppContext();

  const navLinks = [
    {
      title: "Courses",
      href: "/",
    },
    {
      title: "Updates",
      href: "/updates",
    },
    {
      title: "Blogs",
      href: "/blogs",
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
    <div className={styles.navBarContainer}>
      <nav>
        <Link href={"/landing-page"}>
          <Flex align="center" gap={5}>
            <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
            <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
          </Flex>
        </Link>
        <ul>
          {navLinks.map((link, i) => {
            return (
              <li key={i}>
                {link.title === "Courses" ? (
                  <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    overlayClassName="nav__overlay"
                    className="another__class"
                  >
                    <Link onClick={(e) => e.preventDefault()} href={link.href}>
                      <Flex align="center" gap={4} style={{ cursor: "pointer" }}>
                        {link.title}
                        <i style={{ marginTop: 8 }}> {SvgIcons.chevronDown}</i>
                      </Flex>
                    </Link>
                  </Dropdown>
                ) : (
                  <Link href={link.href}>{link.title}</Link>
                )}
              </li>
            );
          })}
        </ul>
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
        <Button type="primary">Get Started</Button>
      </nav>
    </div>
  );
};
export default NavBar;
