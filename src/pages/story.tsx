import React from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme } from "@prisma/client";
import { NextPage } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";

const StoryPage: NextPage = () => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  return (
    <MarketingLayout
      heroSection={
        <HeroBlog
          title="Story"
          description="Our compelling stories unfold with depth and nuance, offering insights that resonate."
        />
      }
    >
      <div
        style={{
          height: 400,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: globalState.theme === "dark" ? "#283040" : "#fff",
          color: globalState.theme === "dark" ? "#fff" : "#000",
        }}
      >
        <p
          style={{
            maxWidth: isMobile ? 300 : 400,
            lineHeight: 1.5,
          }}
        >
          There are no stories currently. Visit here later again
        </p>
      </div>
    </MarketingLayout>
  );
};

export default StoryPage;
