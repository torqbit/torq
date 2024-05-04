import AddCourseForm from "@/components/Admin/Content/AddCourseForm";
import appConstant from "@/services/appConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";

const SettingPage: NextPage = () => {
  return (
    <>
      <AddCourseForm />
    </>
  );
};

export default SettingPage;
