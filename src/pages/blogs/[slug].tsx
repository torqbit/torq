import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { getCookieName } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { Theme, User } from "@prisma/client";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import { FC, useEffect } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useMediaQuery } from "react-responsive";
import styles from "@/styles/Blog.module.scss";
import { Flex, Space } from "antd";
import Image from "next/image";
import Tiptap from "@/components/TipTapEditor/TipTapEditor";
import { UserOutlined } from "@ant-design/icons";
import Head from "next/head";
import appConstant from "@/services/appConstant";
import { truncateString } from "@/services/helper";

interface IProps {
  user: User;
  htmlData: HTMLElement;
  description: string;
  currentUrl: string;
  hostName: string;
  blogData: {
    title: string;
    id: string;
    banner: string;
    authorName: string;
    authorImage: string;
    slug: string;
  };
}

const BlogPage: FC<IProps> = ({ user, htmlData, blogData, description, currentUrl, hostName }) => {
  const { dispatch } = useAppContext();
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
      user={user}
      heroSection={
        <section className={styles.blogPageWrapper}>
          <Flex vertical gap={20}>
            <h1>{blogData.title.toUpperCase()}</h1>
            <Image
              src={blogData.banner}
              height={isMobile ? 175 : 400}
              width={isMobile ? 350 : 800}
              alt={"blog-banner"}
            />
            <Flex align="center" gap={10} className={styles.authorInfo}>
              {blogData.authorImage ? (
                <Image
                  src={blogData.authorImage}
                  alt=""
                  height={isMobile ? 40 : 50}
                  width={isMobile ? 40 : 50}
                  loading="lazy"
                />
              ) : (
                <div className={styles.userOutlineContainer}>
                  <UserOutlined height={isMobile ? 40 : 50} width={isMobile ? 40 : 50} />
                </div>
              )}
              <Space direction="vertical" size={"small"}>
                <span>A Blog by</span>
                <div>{blogData.authorName}</div>
              </Space>
            </Flex>
            <Tiptap
              contentData={htmlData}
              currentContentData={{} as JSONContent}
              setContent={() => {}}
              isEditable={false}
            />
          </Flex>
        </section>
      }
    >
      <Head>
        <title>
          {appConstant.platformName} | {blogData.title}
        </title>
        <meta name="description" content={truncateString(description)} />
        <link rel="icon" href="/favicon.ico" />

        {<meta property="og:url" content={currentUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={blogData.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={blogData.banner} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={hostName} />
        <meta property="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={blogData.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={blogData.banner} />
      </Head>
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();

  const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect protocol
  const host = req.headers["x-forwarded-host"] || req.headers.host; // Detect host
  const currentUrl = `${protocol}://${host}${req.url}`; // Construct full URL
  const blog = (await prisma.blog.findUnique({
    where: {
      slug: String(params?.slug),
      state: "ACTIVE",
    },
    select: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
      content: true,
      title: true,
      id: true,
      banner: true,
      slug: true,
    },
  })) as any;

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (blog) {
    const jsonValue = blog?.content;
    const htmlData = blog && blog.content && generateHTML(jsonValue as JSONContent, [StarterKit]);

    return {
      props: {
        user,
        htmlData: htmlData,
        description: blog.content.content[0].content[0].text,
        currentUrl,
        hostName: `${host}`,
        blogData: {
          title: blog?.title,
          id: blog?.id,
          banner: blog?.banner,
          authorName: blog?.user.name,
          authorImage: blog?.user.image,
          slug: blog.slug,
        },
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/blogs",
      },
    };
  }
};
export default BlogPage;
