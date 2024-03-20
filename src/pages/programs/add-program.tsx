import { useState } from "react";
import { Form, Modal, message } from "antd";
import { useRouter } from "next/router";
import NewProgram from "@/components/programs/NewProgram";
import { IResponse, postFetch, postWithFile } from "@/services/request";
import appConstant from "@/services/appConstant";
import Header from "@/components/Header/Header";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getProgramById } from "@/actions/getCourseById";

const AddNewProgram: NextPage = () => {
  const [programState, setProgramState] = useState<{
    programId: number | undefined;
    edit: string;
    title: string;
    duration: string;
    panelActive: number;
    aboutProgram: string;
    description: string;
    imgUrl: string;
  }>({
    programId: undefined,
    panelActive: 9999,
    edit: "",
    title: "",
    duration: "",
    description: ` `,
    aboutProgram: "",
    imgUrl: "",
  });

  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [model, contextWrapper] = Modal.useModal();
  const onFinish = async (
    title: string,
    description: string,
    duration: number,
    thumbnailImg: string,
    edit: string,
    imgPath: string,
    state: string,
    action: string
  ) => {
    state === "ACTIVE" && setLoading(true);
    const courseInfo = {
      title,
      description,
      duration,
      thumbnailImg,
      edit,
      programId: String(router.query.programId),
      state,
    };

    try {
      const postRes = await postFetch(courseInfo, `/api/program/addProgram`);
      const result = (await postRes.json()) as IResponse;
      if (postRes.ok && result.success) {
        message.success(result.message);
        if (action === "continue") {
          state === "ACTIVE" && edit === "false" && router.push(`/programs/${result?.program?.id}/add-overview`);

          state === "DRAFT" && edit === "false" && router.push(`/programs/${result?.program?.id}/add-overview`);
          edit !== "false" && router.push(`/programs/${result?.program?.id}/add-overview?edit=true`);
        } else if (router.query.edit === "true" && state === "DRAFT" && action !== "continue") {
          router.push(`/programs`);
        } else {
          router.push(`/programs`);
        }
      } else {
        message.error(result.error);
        setLoading(false);
        setProgramState({
          programId: undefined,
          panelActive: 9999,
          edit: "",
          title: "",
          duration: "",
          description: ` `,
          aboutProgram: "",
          imgUrl: "",
        });
      }
    } catch (err) {
      setLoading(false);
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const onUpdateEditState = (value: string) => {
    setProgramState({
      ...programState,
      edit: value,
    });
  };

  const onUpdateProgramState = (key: string, value: string) => {
    if (key === "title") {
      setProgramState({
        ...programState,
        title: value,
      });
    }
    if (key === "imgUrl") {
      setProgramState({
        ...programState,
        imgUrl: value,
      });
    }
    if (key === "duration") {
      setProgramState({
        ...programState,
        duration: value,
      });
    }
    if (key === "description") {
      setProgramState({
        ...programState,
        description: value,
      });
    }
    if (key === "aboutProgram") {
      setProgramState({
        ...programState,
        aboutProgram: value,
      });
    }

    if (key === "panel") {
      setProgramState({
        ...programState,
        panelActive: Number(value),
      });
    }
  };

  return (
    <section>
      {contextWrapper}
      <Header theme={false} onThemeChange={function (): void {}} />
      <NewProgram
        programState={programState}
        onFinish={onFinish}
        onUpdateEditState={onUpdateEditState}
        onUpdateProgramState={onUpdateProgramState}
        loading={loading}
      />
    </section>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  const params = ctx?.query;

  if (params.programId) {
    const authorId = await getProgramById(Number(params?.programId));

    if (authorId !== session?.id) {
      return {
        redirect: {
          permanent: false,
          destination: "/programs",
        },
        props: {},
      };
    } else if (authorId === session?.id) {
      return {
        props: {},
      };
    }
  } else {
    return {
      props: {},
    };
  }
};

export default AddNewProgram;
