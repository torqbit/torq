import { FC, useEffect } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { useSession } from "next-auth/react";
import Dashboard from "../Dashboard/dashboard";
import Users from "../Administration/Users";
import Courses from "../Coureses/course";
import { useAppContext } from "../ContextApi/AppContext";
import Content from "../Administration/Content";
import AddCourse from "../Administration/AddCourse";

const SiderContent: any = {
  dashboard: {
    component: <Dashboard />,
    title: "Dashboard",
    isHeader: true,
  },
  users: {
    component: <Users />,
    title: "Administrantion > Users",
    isHeader: true,
  },
  content: {
    component: <Content />,
    title: "Administrantion > Content",
    isHeader: true,
  },
  courses: {
    component: <Courses />,
    title: "Courses",
    isHeader: true,
  },
  addCourse: {
    component: <AddCourse />,
    title: "",
    isHeader: false,
  },
};

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();

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
        <section className={`${styles.sider_content} ${styles.className}`}>
          {SiderContent[`${globalState.selectedSiderMenu}`]?.isHeader && (
            <div className={styles.layout_header}>
              <h2>Hello {user?.user?.name}</h2>

              <h3>{SiderContent[`${globalState.selectedSiderMenu}`]?.title ?? "No Title"}</h3>
            </div>
          )}

          {SiderContent[`${globalState.selectedSiderMenu}`]?.component ?? <>No Page</>}
        </section>
      </div>
    </>
  );
};

export default Layout2;
