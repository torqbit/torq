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
  const [currentTheme, setCurrentTheme] = useState(false);

  return (
    <>
      <Button onClick={() => setCurrentTheme(!currentTheme)}>Toggle</Button>
      <ConfigProvider theme={currentTheme ? antThemeConfig : darkThemConfig}>
        <AppProvider themeSwitcher={() => setCurrentTheme(!currentTheme)}>
          <SessionProvider session={pageProps.session}>
            <NextNProgress />
            <Component {...pageProps} />
          </SessionProvider>
        </AppProvider>
      </ConfigProvider>
    </>
  );
}
export default App;
