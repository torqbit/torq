import React, { FC, useEffect } from "react";

import { animated, useSpring, useSpringRef, useTrail } from "@react-spring/web";
import styles from "@/styles/NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";

import { Button, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";

const SideNav: FC<{ isOpen: boolean; onAnchorClick: () => void }> = ({ isOpen, onAnchorClick }) => {
  const { dispatch } = useAppContext();

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { width: "0%" },
    config: { duration: 400 },
  });

  const items = ["Courses", "Updates", "Story", "Blogs"];

  const trail = useTrail(4, {
    config: { mass: 4, tension: 2000, friction: 200 },
    delay: isOpen ? 450 : 0,
    opacity: isOpen ? 1 : 0,
    x: isOpen ? 0 : 20,
    height: isOpen ? 110 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  useEffect(() => {
    console.log("calling start : " + isOpen + " width: " + springs.width.get());

    api.start({
      to: {
        width: isOpen ? "80%" : "0%",
      },
    });
  }, [isOpen]);
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
      <animated.div
        className={styles.animateContainer}
        style={{
          ...springs,
        }}
      >
        <div className={styles.platformLogo}>
          <Link href={"/"}>
            <Flex align="center" gap={5}>
              <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
              <h4>{appConstant.platformName.toUpperCase()}</h4>
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
        {trail.map(({ height, ...style }, index) => (
          <animated.div key={index} className={styles.links__text} style={style}>
            <animated.a
              onClick={onAnchorClick}
              href={`${index != 3 ? `/#${items[index]}` : "/batch-w2023"}`}
              style={{ height }}
            >
              {items[index]}
            </animated.a>
          </animated.div>
        ))}
      </animated.div>
    </section>
  );
};

export default SideNav;
