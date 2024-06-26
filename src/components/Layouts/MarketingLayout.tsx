import { FC, useState } from "react";
import React from "react";
import styles from "@/styles/MarketingHero.module.scss";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider, Flex } from "antd";
import Link from "next/link";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import SpinLoader from "../SpinLoader/SpinLoader";
import SideNav from "../Marketing/LandingPage/SideNavBar";
import NavBar from "../Marketing/LandingPage/NavBar";
import Image from "next/image";
import appConstant from "@/services/appConstant";
import Hamburger from "hamburger-react";
import Footer from "../Marketing/LandingPage/Footer";

import { User } from "@prisma/client";

const MarketingLayout: FC<{
  children?: React.ReactNode;
  className?: string;
  heroSection?: React.ReactNode;
  user?: User;
}> = ({ children, className, heroSection, user }) => {
  const { globalState } = useAppContext();

  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };
  return (
    <>
      {globalState.pageLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "100%",
            background: "#fff",
            zIndex: 10,
          }}
        >
          <SpinLoader />
        </div>
      )}
      <ConfigProvider theme={globalState.theme == "dark" ? darkThemConfig : antThemeConfig}>
        <Head>
          <title>Torq | Learn to lead</title>
          <meta name="description" content="Learn, build and solve the problems that matters the most" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <section className={styles.heroWrapper}>
          <NavBar user={user} />
          <SideNav isOpen={showSideNav} onAnchorClick={onAnchorClick} />
          <Link href={"/"} className={styles.platformNameLogo}>
            <Flex align="center" gap={5}>
              <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} loading="lazy" />
              <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
            </Flex>
          </Link>

          <div role="button" className={styles.hamburger} aria-label="Toggle menu">
            <Hamburger
              rounded
              direction="left"
              toggled={showSideNav}
              onToggle={(toggle: boolean | ((prevState: boolean) => boolean)) => {
                setSideNav(toggle);
              }}
            />
          </div>
          {heroSection}
        </section>
        {children}
        <Footer />
      </ConfigProvider>
    </>
  );
};

export default MarketingLayout;
