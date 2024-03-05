import { useEffect, useState } from "react";
import { Form, Modal } from "antd";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import AddOverview from "@/components/programs/AddOverview";
import Header from "@/components/Header/Header";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { getProgramById, getProgramDetailById } from "@/actions/getCourseById";
import { ICourseDetial } from "@/lib/types/program";

const AddOverviewPage = (props: { courseLength: number; userId: number }) => {
  const [programState, setProgramState] = useState<{
    programId: number | undefined;
    banner: string;
  }>({
    programId: undefined,
    banner: "",
  });
  const [form] = Form.useForm();
  const router = useRouter();
  const [model, contextWrapper] = Modal.useModal();
  const [coursesAvailble, setCourseAvailable] = useState<ICourseDetial[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const onRefresh = () => {
    setRefresh(!refresh);
  };

  const onUpdateProgramState = (key: string, value: string) => {
    if (key === "banner") {
      setProgramState({
        ...programState,
        banner: value,
      });
    }
  };

  const getCourseDetail = async (state: string) => {
    // setLoading(true);

    ProgramService.getAllCourse(
      Number(router.query.programId),
      state,
      (result) => {
        setCourseAvailable(result.allCourse);
      },
      (error) => {}
    );

    // setLoading(false);
  };

  //main

  useEffect(() => {
    getCourseDetail("ACTIVE");
  }, [refresh]);

  return (
    <section>
      {contextWrapper}
      <Header theme={false} onThemeChange={function (): void {}} />
      <AddOverview
        programState={programState}
        onUpdateProgramState={onUpdateProgramState}
        courseDetail={coursesAvailble}
        onRefresh={onRefresh}
      />
    </section>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  const params = ctx?.params;
  const authorId = await getProgramById(Number(params?.programId));

  const programDetail = await getProgramDetailById(Number(params?.programId));

  if (authorId !== session?.id || session?.role !== "AUTHOR") {
    return {
      redirect: {
        permanent: false,
        destination: "/programs",
      },
      props: {},
    };
  } else if (authorId === session?.id && session?.role === "AUTHOR") {
    return {
      props: {
        courseLength: JSON.parse(JSON.stringify(programDetail?.course.length)),
        userId: session?.id,
      },
    };
  }
};
export default AddOverviewPage;
