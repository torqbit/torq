import { useAppContext } from "@/components/ContextApi/AppContext";
import { CourseCategory, ICourseCategory } from "@/components/CourseCategory/CourseCategory";
import Hero from "@/components/Marketing/LandingPage/Hero";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemConfig from "@/services/darkThemConfig";
import { Theme } from "@prisma/client";
import { ConfigProvider } from "antd";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const LandingPage: NextPage = () => {
  const { dispatch, globalState } = useAppContext();

  const courseCategory: ICourseCategory = {
    name: "Frontend Development",
    description:
      "Learn to build a portfolio website using web technologies, that captivates users interest and drives more attention from all around the world",
    courses: [
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS"],
      },
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS"],
      },
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS"],
      },
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS"],
      },
    ],
  };

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
    <>
      {globalState.pageLoading ? (
        <SpinLoader />
      ) : (
        <>
          <Hero />
          <CourseCategory direction="ltr" category={courseCategory} />
        </>
      )}
    </>
  );
};

export default LandingPage;
