import Users from "@/components/Admin/Users/Users";
import { ISiderMenu, useAppContext } from "@/components/ContextApi/AppContext";
import { NextPage } from "next";
import { useEffect } from "react";

const UsersPage: NextPage = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "users" as ISiderMenu });
  }, []);
  return (
    <>
      <Users />
    </>
  );
};
export default UsersPage;
