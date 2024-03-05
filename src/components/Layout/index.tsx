import { FC, useEffect } from "react";
import Header from "../Header/Header";
import React from "react";
import Head from "next/head";

const Layout: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
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
          name='description'
          content='We are team of highly focused and passionate software engineers who transform businesses and 
        turn graduates into software professionals'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={`layout-wrapper ${className}`}>
        <Header theme={theme} onThemeChange={onThemeChange} />
        {children}
      </div>
    </>
  );
};

export default Layout;
