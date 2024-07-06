import BlogForm from "@/components/Admin/Content/BlogForm";
import Layout2 from "@/components/Layouts/Layout2";
import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/react";
import { FC } from "react";
import { StateType } from "@prisma/client";
interface IProps {
  htmlData: HTMLElement;
  bannerImage: string;
  title: string;
  state: StateType;
  type: string;
}

const BlogFormPage: FC<IProps> = ({ htmlData, bannerImage, title, state, type }) => {
  return (
    <>
      <Layout2>
        <BlogForm type={type} htmlData={htmlData} bannerImage={bannerImage} title={title} state={state} />
      </Layout2>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;

  const blogContentData = await prisma.blog.findUnique({
    where: {
      id: String(params?.blogId),
    },
    select: {
      banner: true,
      state: true,
      content: true,
      title: true,
      type: true,
    },
  });
  if (blogContentData) {
    const jsonValue = blogContentData?.content;
    const htmlData = blogContentData && blogContentData.content && generateHTML(jsonValue as JSONContent, [StarterKit]);

    return {
      props: {
        htmlData,
        bannerImage: blogContentData?.banner,
        title: blogContentData?.title,
        state: blogContentData.state,
        type: blogContentData.type,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/admin/content",
      },
    };
  }
};

export default BlogFormPage;
