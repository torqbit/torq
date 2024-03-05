import { IChapter, ICourse, IProgram } from "@/lib/types/learn";
import { Chapter, Course } from "@prisma/client";
import { MenuProps, Breadcrumb, Skeleton } from "antd";
import { useRouter } from "next/router";
import { FC } from "react";
import style from "@/styles/LearnLecture.module.scss";

const CourseBreadcrumb: FC<{
  program: IProgram | undefined;
  sltCourse: string | undefined;
  sltChapter: string | undefined;
  onSelectChapter: (v: any) => void;
  loading: boolean;
  onslectCourse: (v: any) => void;
}> = ({ program, sltCourse, onslectCourse, sltChapter, loading, onSelectChapter }) => {
  const router = useRouter();

  const courseItem: MenuProps["items"] = program?.course
    ?.sort((a, b) => a.sequenceId - b.sequenceId)
    .map((c, i) => {
      return { title: c.name, key: c.name };
    });
  const chapterItem: MenuProps["items"] = program?.course
    ?.find((c, i) => c.name === sltCourse)
    ?.chapter.sort((a, b) => a.sequenceId - b.sequenceId)
    .map((c, i) => {
      return { title: c.name, key: c.name };
    });

  return (
    <>
      {/* {loading && sltChapter ? (
        <Skeleton.Button className={style.skeleton} />
      ) : ( */}
      <section className={style.course_breadcrumb}>
        <Breadcrumb
          items={[
            {
              onClick: () => {
                router.push(`/programs`);
              },
              title: <span style={{ color: "#7481b9", cursor: "pointer" }}>Programs</span>,
            },
            {
              onClick: () => {
                router.push(`/programs/overview/${program?.id}`);
              },
              title: <span style={{ color: "#7481b9", cursor: "pointer" }}>{program?.title}</span>,
            },
            {
              title: sltCourse || "Select Course",
              menu: {
                items: courseItem as MenuProps[],
                onClick: onslectCourse,
                selectedKeys: [sltCourse || ""],
              },
            },
            {
              title: sltChapter,
              menu: {
                items: chapterItem as MenuProps[],
                onClick: onSelectChapter,
                selectedKeys: [sltChapter || ""],
              },
            },
          ]}
        />
      </section>
      {/* )} */}
    </>
  );
};

export default CourseBreadcrumb;
