import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "@/styles/MarketingHero.module.scss";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, ConfigProvider, Flex, Layout, MenuProps } from "antd";
import Link from "next/link";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import SpinLoader from "../SpinLoader/SpinLoader";
import SideNav from "../Marketing/LandingPage/SideNavBar";
import NavBar from "../Marketing/LandingPage/NavBar";
import Image from "next/image";
import appConstant from "@/services/appConstant";
import Hamburger from "hamburger-react";
import Footer from "../Marketing/LandingPage/Footer";

const MarketingLayout: FC<{ children?: React.ReactNode; className?: string; heroSection?: React.ReactNode }> = ({
  children,
  className,
  heroSection,
}) => {
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const router = useRouter();
  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };
  return (
    <>
      {globalState.pageLoading ? (
        <SpinLoader />
      ) : (
        <ConfigProvider theme={globalState.session?.theme == "dark" ? darkThemConfig : antThemeConfig}>
          <Head>
            <title>Torq | Learn to lead</title>
            <meta name="description" content="Learn, build and solve the problems that matters the most" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <section className={styles.heroWrapper}>
            <NavBar />
            <SideNav isOpen={showSideNav} onAnchorClick={onAnchorClick} />
            <Link href={"/"} className={styles.platformNameLogo}>
              <Flex align="center" gap={5}>
                <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
                <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
              </Flex>
            </Link>

            <div className={styles.hamburger}>
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
      )}
    </>
  );
};

export default MarketingLayout;
