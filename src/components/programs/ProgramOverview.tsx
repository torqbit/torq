import React, { FC, useEffect, useState } from "react";

import styles from "../../styles/ProgramOverview.module.scss";
import ProgramCoursesDetail from "./ProgramCourseDetail";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ICourseDetial } from "@/lib/types/program";
import { Role } from "@prisma/client";

const ProgramOverview: FC<{}> = () => {
  const { data: user } = useSession();

  const router = useRouter();
  const programId = router.query.programId;
  const [courseState, setCourseState] = useState<ICourseDetial[]>([]);
  const [programState, setProgramState] = useState<{
    authorId: number;
    aboutProgram: string;
    title: string;
    description: string;
    banner: string;
    programType: string;
  }>({
    authorId: 0,
    aboutProgram: "",
    title: "",
    description: "",
    banner: "",
    programType: "",
  });

  useEffect(() => {
    ProgramService.getProgram(
      Number(programId),
      (result) => {
        setCourseState(result.getProgram.course);
        setProgramState({
          aboutProgram: result.getProgram.aboutProgram,
          title: result.getProgram.title,
          description: result.getProgram.description,
          banner: result.getProgram.banner,
          authorId: result.getProgram.authorId,
          programType: result.getProgram.programType,
        });
      },
      (error) => {}
    );
  }, [programId]);

  return (
    <section className={styles.ProgramOverview}>
      <div className={styles.ProgramOverviewWrapper}>
        <h1>{programState.title}</h1>
        <p>{programState.description}</p>
        <div className={styles.bannerWrapper}>
          <img
            src={programState.banner ? programState.banner : "/img/program/newProgram/upload.jpeg"}
            alt=""
            height={400}
            width={600}
          />
        </div>
      </div>
      <div className={styles.courseWrapper}>
        {
          <ProgramCoursesDetail
            programType={programState.programType}
            courseDetail={courseState}
            authorId={programState.authorId}
            programDetail={programState.aboutProgram}
            userId={user?.id as number}
            role={user?.role as Role}
          />
        }
      </div>
    </section>
  );
};

export default ProgramOverview;
