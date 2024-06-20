import { FC } from "react";
import styles from "@/styles/NavBar.module.scss";
import Image from "next/image";
import { Button, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
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
  return (
    <div className={styles.navBarContainer}>
      <nav>
        <Link href={"/"}>
          <Flex align="center" gap={5}>
            <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
            <h4>{appConstant.platformName.toUpperCase()}</h4>
          </Flex>
        </Link>
        <ul>
          {navLinks.map((link, i) => {
            return (
              <li key={i}>
                <Link href={link.href}>{link.title}</Link>
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
