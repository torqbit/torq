import BlogForm from "@/components/Admin/Content/BlogForm";
import Layout2 from "@/components/Layouts/Layout2";
import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { FC } from "react";
import { StateType } from "@prisma/client";
interface IProps {
  htmlData: string;
  bannerImage: string;
  title: string;
  state: StateType;
  contentType: string;
}

const BlogFormPage: FC<IProps> = ({ htmlData, bannerImage, title, state, contentType }) => {
  return (
    <>
      <Layout2>
        <BlogForm contentType={contentType} htmlData={htmlData} bannerImage={bannerImage} title={title} state={state} />
      </Layout2>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;

  const contentData = await prisma.blog.findUnique({
    where: {
      id: String(params?.blogId),
    },
    select: {
      banner: true,
      state: true,
      content: true,
      title: true,
      contentType: true,
    },
  });
  if (contentData) {
    return {
      props: {
        htmlData: contentData?.content,
        bannerImage: contentData?.banner,
        title: contentData?.title,
        state: contentData.state,
        contentType: contentData.contentType,
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
