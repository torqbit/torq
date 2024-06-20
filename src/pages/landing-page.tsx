import React from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { CourseCategory, ICourseCategory } from "@/components/CourseCategory/CourseCategory";
import About from "@/components/Marketing/LandingPage/About";
import Footer from "@/components/Marketing/LandingPage/Footer";
import Hero from "@/components/Marketing/LandingPage/Hero";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { Theme } from "@prisma/client";
import { NextPage } from "next";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
const LandingPage: NextPage = () => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });
  const courseCategoryFrontend: ICourseCategory = {
    name: "Frontend Development",
    image: "/img/categories/front-end-screen.png",
    description:
      "Learn to build a portfolio website using web technologies, that captivates users interest and drives more attention from all around the world",
    courses: [
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS"],
      },
      {
        name: "Code Collaboration with Git & Github",
        tools: ["Github", "Git"],
      },
      {
        name: "Programming with Javascript & Typescript",
        tools: ["Javascript", "ES6 & ES7"],
      },
      {
        name: "UI Component Development with ReactJS",
        tools: ["Hooks", "State management"],
      },
    ],
  };

  const courseCategoryBackend: ICourseCategory = {
    name: "Backend Development",
    image: "/img/categories/backend-screen.png",
    description:
      "Transform the personal website into a full blown portfolio website builder by integrating with database, adding social authentication, providing customisations and much more",
    courses: [
      {
        name: "Server Side Development with Node.JS",
        tools: ["Node", "http", "Networks"],
      },
      {
        name: "REST API Development with Next.JS",
        tools: ["Routes", "page caching"],
      },
      {
        name: "Databasse & Object Relational Mapping",
        tools: ["MySQL", "ORM", "Postgres"],
      },
      {
        name: "Social Authentication with Next Auth",
        tools: ["Auth", "JWT", "Cryptography"],
      },
    ],
  };

  const courseCategoryDevops: ICourseCategory = {
    name: "Cloud Infrastructure",
    image: "/img/categories/devops-screen.png",
    description:
      "Move the developed platform into a cloud, to transform into software as a Service using conatainers and leverage AWS cloud infrastructure to host the database, EKS, S3, Route53 and many more to run the service in production",
    courses: [
      {
        name: "Containerisation with Docker & Kubernetes",
        tools: ["CRI-O", "Helm", "Kubernetes"],
      },
      {
        name: "Cloud Development with Amazone Web Services",
        tools: ["Node", "http", "Networks"],
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
          <CourseCategory direction="ltr" category={courseCategoryFrontend} isMobile={isMobile} />
          <CourseCategory direction="rtl" category={courseCategoryBackend} isMobile={isMobile} />
          <CourseCategory direction="ltr" category={courseCategoryDevops} isMobile={isMobile} />

          <About />
          <Footer />
        </>
      )}
    </>
  );
};

export default LandingPage;
