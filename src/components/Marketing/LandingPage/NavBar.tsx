import { FC } from "react";
import styles from "@/styles/NavBar.module.scss";
import Image from "next/image";
import { Button, Dropdown, Flex, MenuProps, Space, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { DownOutlined } from "@ant-design/icons";
const NavBar: FC<{}> = () => {
  const { dispatch } = useAppContext();

  const navLinks = [
    {
      title: "Courses",
      href: "/",
    },
    {
      title: "Updates",
      href: "/",
    },
    {
      title: "Story",
      href: "/",
    },
    {
      title: "Blogs",
      href: "/",
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

  const items: MenuProps["items"] = [
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
          label: "Code Collaboration with Git & Github",
        },
        {
          key: "1-4",
          label: "Code Collaboration with Git & Github",
        },
      ],
    },
    {
      key: "1",
      type: "group",
      label: "Back end Development",
      children: [
        {
          key: "2-1",
          label: "Foundations of Web Development",
        },
        {
          key: "2-2",
          label: "Code Collaboration with Git & Github",
        },
        {
          key: "2-3",
          label: "Code Collaboration with Git & Github",
        },
        {
          key: "2-4",
          label: "Code Collaboration with Git & Github",
        },
      ],
    },
    {
      key: "4",
      danger: true,
      label: "a danger item",
    },
  ];
  return (
    <div className={styles.navBarContainer}>
      <nav>
        <Link href={"/"}>
          <Flex align="center" gap={5}>
            <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
            <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
          </Flex>
        </Link>
        <ul>
          {navLinks.map((link, i) => {
            return (
              <li key={i}>
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  overlayClassName="nav__overlay"
                  className="another__class"
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {link.title}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
                {/* <Link href={link.href}>{link.title}</Link> */}
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
