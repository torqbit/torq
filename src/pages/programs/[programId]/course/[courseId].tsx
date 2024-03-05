import { getProgramById } from "@/actions/getCourseById";
import Header from "@/components/Header/Header";
import EditCourse from "@/components/programs/EditCourse";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { FC, useState } from "react";

const EditCoursePage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Header theme={false} onThemeChange={function (): void {}} />

      <EditCourse loading={loading} setLoading={setLoading} />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  const params = ctx?.params;
  const authorId = await getProgramById(Number(params?.programId));

  if (authorId !== session?.id || session?.role !== "AUTHOR") {
    return {
      redirect: {
        permanent: false,
        destination: "/programs",
      },
      props: {},
    };
  } else if (authorId === session?.id && session.role === "AUTHOR") {
    return {
      props: {},
    };
  }
};
export default EditCoursePage;
