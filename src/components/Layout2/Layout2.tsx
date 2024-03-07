import { FC, useEffect } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";

const Layout2: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
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
        <title>Torqbit | Dedicated Software Development team for your next venture</title>
        <meta
          name="description"
          content="We are team of highly focused and passionate software engineers who transform businesses and 
        turn graduates into software professionals"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`layout2-wrapper ${styles.layout2_wrapper} `}>
        <Sidebar />
        <section className={`${styles.sider_content} ${styles.className}`}>{children}</section>
      </div>
    </>
  );
};

export default Layout2;
