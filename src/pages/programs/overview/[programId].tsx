import Header from "@/components/Header/Header";
import ProgramOverview from "@/components/programs/ProgramOverview";
import { NextPage } from "next";
import { FC } from "react";

const ProgramOverviewPage: NextPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header theme={false} onThemeChange={function (): void {}} />
      <ProgramOverview />
    </div>
  );
};

export default ProgramOverviewPage;
