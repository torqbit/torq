import { FC, useEffect } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useAppContext } from "../ContextApi/AppContext";
import { Layout } from "antd";

const { Content } = Layout;

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();

  const [theme, setTheme] = React.useState(false);
  const onThemeChange = () => {
    setTheme((prv) => {
      if (!prv) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      return !prv;
    });
  };
  useEffect(() => {
    const theme = document?.documentElement?.getAttribute("data-theme");
    theme === "dark" ? setTheme(true) : setTheme(false);
  }, []);
  return (
    <>
      <Head>
        <title>Torq | Learn to lead</title>
        <meta name="description" content="Learn, build and solve the problems that matters the most" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Sidebar />
        <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
          <Content className={`${styles.sider_content} ${styles.className}`}>{children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Layout2;
