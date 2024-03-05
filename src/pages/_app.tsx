import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/globalStyles.scss";
import "antd/dist/reset.css";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { ConfigProvider } from "antd";
import NextNProgress from "nextjs-progressbar";
import antThemeConfig from "@/services/antThemeConfig";
import { AppProvider } from "@/components/ContextApi/AppContext";

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ConfigProvider theme={antThemeConfig}>
      <AppProvider>
        <SessionProvider session={pageProps.session}>
          <NextNProgress />
          <Component {...pageProps} />
        </SessionProvider>
      </AppProvider>
    </ConfigProvider>
  );
}
export default App;
