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
import AOS from "aos";
interface IProps {
  user: User;
}

const LandingPage: FC<IProps> = ({ user }) => {
  const { dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });
  const courseCategoryFrontend: ICourseCategory = {
    name: "Frontend Development",
    image: "https://torqbit-dev.b-cdn.net/website/img/front-end-development.png",
    description:
      "Learn to build a portfolio website using web technologies, that captivates users interest and drives more attention from all around the world",
    courses: [
      {
        name: "Foundations of Web Development",
        tools: ["HTML", "CSS", "Responsive"],
      },
      {
        name: "Version Control with Git & Github",
        tools: ["Github", "Git", "Rebase"],
      },
      {
        name: "Programming with Javascript",
        tools: ["DOM", "ES6+", "OOP"],
      },
      {
        name: "UI Development with ReactJS",

        tools: ["Hooks", "State", "Context"],
      },
    ],
  };

  const courseCategoryBackend: ICourseCategory = {
    name: "Backend Development",
    image: "https://torqbit-dev.b-cdn.net/website/img/backend-development.png",
    description:
      "Transform the personal website into a full blown portfolio website builder by integrating with database, adding social authentication, providing customisations and much more",
    courses: [
      {
        name: "Build CLI Apps with Node.JS",
        tools: ["HTTP", "Async", "File System"],
      },
      {
        name: "Build APIs with Next.JS",
        tools: ["Routes", "Cache", "SSR"],
      },
      {
        name: "Relational Database & ORM",
        tools: ["RDBMS", "MySQL", "ORM"],
      },
      {
        name: "Authentication with Next Auth",
        tools: ["OAuth", "JWT", "Security"],
      },
    ],
  };

  const courseCategoryDevops: ICourseCategory = {
    name: "DevOps & Infrastructure",
    image: "https://torqbit-dev.b-cdn.net/website/img/devops.png",
    description:
      "Move the developed platform into a cloud, to transform into software as a Service using conatainers and leverage AWS cloud infrastructure to host the database, EKS, S3, Route53 and many more to run the service in production",
    courses: [
      {
        name: "Container Management",
        tools: ["Docker", "Helm", "Kubernetes"],
      },
      {
        name: "Cloud Development with AWS",
        tools: ["S3", "Route53", "ALB", "EC2"],
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
    AOS.init();
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
