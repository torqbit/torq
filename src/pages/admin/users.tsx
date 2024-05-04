import Users from "@/components/Admin/Users/Users";
import appConstant from "@/services/appConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";

const UsersPage: NextPage = () => {
  return (
    <>
      <Users />
    </>
  );
};
export default UsersPage;
