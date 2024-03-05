import { IResource } from "@/lib/types/learn";
import CourseOverview from "@/components/LearnCourse/AboutCourse/CourseOverview";
import CourseDiscussion from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { TabsProps, Tabs } from "antd";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";

const AboutCourse: FC<{ sltResource: IResource; userId: number; loading: boolean }> = ({
  sltResource,
  userId,
  loading,
}) => {
  const router = useRouter();
  const query = router.query as any;
  const [tabKey, setTabKey] = useState<string>(query?.tab ?? "overview");
  const items: TabsProps["items"] = [
    {
      key: "overview",
      label: `Overview`,
      children: <CourseOverview loading={loading} sltResource={sltResource} />,
    },
    {
      key: "qa",
      label: `Q&A`,
      children: <CourseDiscussion loading={loading} resourceId={sltResource.resourceId} userId={userId} />,
    },
  ];
  return (
    <section className={style.about_resource_container}>
      <Tabs
        onChange={(key) => setTabKey(key)}
        defaultActiveKey="overview"
        activeKey={tabKey}
        className="about_resource_overview"
        tabBarStyle={{ borderBottom: "1px solid #d9d9d9" }}
        items={items}
      />
    </section>
  );
};

export default AboutCourse;
