import Config from "@/components/Admin/Config/Config";
import appConstant from "@/services/appConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import { use } from "react";

const ConfigurationPage: NextPage = () => {
  return (
    <>
      <Config />
    </>
  );
};

export default ConfigurationPage;
