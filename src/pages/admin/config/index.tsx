import Config from "@/components/Admin/Config/Config";
import { ISiderMenu, useAppContext } from "@/components/ContextApi/AppContext";

import { NextPage } from "next";
import { useEffect } from "react";

const ConfigurationPage: NextPage = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "configuration" as ISiderMenu });
  }, []);
  return (
    <>
      <Config />
    </>
  );
};

export default ConfigurationPage;
