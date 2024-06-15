import { FC } from "react";
import styles from "@/styles/NavBar.module.scss";
import Image from "next/image";
import { Button, Flex } from "antd";
import appConstant from "@/services/appConstant";
import Link from "next/link";
const NavBar: FC<{}> = () => {
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
        <Button type="primary">Get Started</Button>
      </nav>
    </div>
  );
};
export default NavBar;
