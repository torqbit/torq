import React, { useState } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/globalStyles.scss";
import "antd/dist/reset.css";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Button, ConfigProvider } from "antd";
import NextNProgress from "nextjs-progressbar";
import antThemeConfig from "@/services/antThemeConfig";
import { AppProvider } from "@/components/ContextApi/AppContext";
import darkThemConfig from "@/services/darkThemConfig";

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [enabledDarkTheme, setCurrentTheme] = useState(false);

  return (
    <>
      <AppProvider
        themeSwitcher={() => {
          // console.log(pageProps.session);
          // let mainHTML = document.getElementsByTagName("html").item(0);
          // if (mainHTML != null) {
          //   mainHTML.setAttribute("data-theme", enabledDarkTheme ? "light" : "dark");
          // }
          // setCurrentTheme(!enabledDarkTheme);
        }}
      >
        <SessionProvider session={pageProps.session}>
          <NextNProgress />
          <Component {...pageProps} />
        </SessionProvider>
      </AppProvider>
    </>
  );
}
export default App;
