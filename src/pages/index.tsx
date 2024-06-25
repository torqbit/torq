import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { CourseCategory, ICourseCategory } from "@/components/CourseCategory/CourseCategory";
import About from "@/components/Marketing/LandingPage/About";
import Hero from "@/components/Marketing/LandingPage/Hero";
import { Theme, User } from "@prisma/client";

import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
interface IProps {
  user: User;
}

const LandingPage: FC<IProps> = ({ user }) => {
  const { dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });
  const courseCategoryFrontend: ICourseCategory = {
    name: "Frontend Development",
    image: "/img/categories/front-end-screen.png",
    description:
      "Learn to build a portfolio website using web technologies, that captivates users interest and drives more attention from all around the world",
    courses: [
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS", "Tailwind"],
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

        tools: ["Hooks", "State Management"],
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
        name: "Database & Object Relational Mapping",
        tools: ["MySQL", "ORM", "Postgres"],
      },
      {
        name: "Social Authentication with Next Auth",
        tools: ["Auth", "JWT", "Cryptography"],
      },
    ],
  };

  const courseCategoryDevops: ICourseCategory = {
    name: "DevOps & Infrastructure",
    image: "/img/categories/devops-screen.png",
    description:
      "Move the developed platform into a cloud, to transform into software as a Service using conatainers and leverage AWS cloud infrastructure to host the database, EKS, S3, Route53 and many more to run the service in production",
    courses: [
      {
        name: "Containerisation with Docker & Kubernetes",
        tools: ["CRI-O", "Helm", "Kubernetes"],
      },
      {
        name: "Cloud Development with Amazon web services",
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
    <MarketingLayout user={user} heroSection={<Hero />}>
      <CourseCategory direction="ltr" category={courseCategoryFrontend} isMobile={isMobile} />
      <CourseCategory direction="rtl" category={courseCategoryBackend} isMobile={isMobile} />
      <CourseCategory direction="ltr" category={courseCategoryDevops} isMobile={isMobile} />
      <About />
    </MarketingLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return { props: { user } };
};
export default LandingPage;
