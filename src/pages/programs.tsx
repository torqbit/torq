import Header from "@/components/Header/Header";
import ProgramSummary from "@/components/programs/ProgramSummary";
import ProgramService from "@/services/ProgramService";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { Button, Modal, Skeleton, Space, message } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styles from "../styles/AllPrograms.module.scss";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { NextPage } from "next";
import { Role } from "@prisma/client";
import { allProgram } from "@/lib/types/program";

const ProgramMainPage: NextPage = () => {
  const router = useRouter();
  const [allProgramState, setProgramState] = useState<{
    allPrograms: any[];
    prgLaoding: boolean;
  }>({ allPrograms: [], prgLaoding: false });

  const [reFresh, setRefresh] = useState<{
    loading: boolean;
  }>({ loading: false });

  const onSetProgramState = (value: boolean) => {
    setProgramState({
      ...allProgramState,
      prgLaoding: value,
    });
  };

  const { data: user } = useSession();

  useEffect(() => {
    setProgramState({
      ...allProgramState,
      prgLaoding: true,
    });

    ProgramService.fetchAllProgram(
      (result) => {
        setProgramState({
          allPrograms: result.allProgram,
          prgLaoding: true,
        });
      },
      (error) => {
        message.error(error);
      }
    );
  }, [reFresh.loading]);

  const onDeleteProgram = (id: number) => {
    setProgramState({
      ...allProgramState,
      prgLaoding: true,
    });

    ProgramService.deleteProgram(
      id,
      (result) => {
        message.success(result.message);
        setRefresh({ loading: !reFresh.loading });
      },
      (error) => {
        message.error(error);
        setRefresh({ loading: !reFresh.loading });
      }
    );
  };

  const onUpdateState = (id: number) => {
    setProgramState({
      ...allProgramState,
      prgLaoding: true,
    });

    ProgramService.updateState(
      Number(id),
      "ACTIVE",
      (result) => {
        message.success(result.message);
        router.push("/programs");
        setRefresh({ loading: !reFresh.loading });
      },
      (error) => {
        message.error(error);

        setRefresh({ loading: !reFresh.loading });
      }
    );
  };

  const onEnrollCourse = async (id: number, programType: string) => {
    try {
      const res = await postFetch(
        {
          userId: user?.id,
          programId: id,
          programType: programType,
        },
        "/api/course/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.already) {
          router.push(`learn/program/${id}`);
        } else {
          setProgramState({
            ...allProgramState,
            prgLaoding: true,
          });

          if (programType === "PAID") {
            Modal.info({
              title: "PAID Course not configured",
            });
          } else {
            Modal.info({
              title: result.message,
              onOk: () => {
                router.push(`learn/program/${id}`);
              },
            });
          }
        }
      } else {
        message.error(result.error);
        setProgramState({
          ...allProgramState,
          prgLaoding: false,
        });
      }
      setProgramState({
        ...allProgramState,
        prgLaoding: false,
      });
    } catch (err: any) {
      message.error("Error while enrolling course ", err?.message);
      setProgramState({
        ...allProgramState,
        prgLaoding: false,
      });
    }
  };

  return (
    <>
      <Header theme={false} onThemeChange={function (): void {}} />

      <section className={styles.allProgram}>
        <div className={styles.allProgram__Wrapper}>
          {allProgramState &&
            !allProgramState.prgLaoding &&
            allProgramState.allPrograms.find((p) => p.state === "ACTIVE") && <h1>All Programs</h1>}
          {allProgramState.allPrograms.length > 0 &&
            allProgramState.prgLaoding &&
            !allProgramState.allPrograms.find((p) => p.state === "ACTIVE") && (
              <Space className={styles.addProgramBtnWrapper} direction="vertical" align="center">
                <h1>No Program Available</h1>

                {user?.role === "AUTHOR" && (
                  <Button
                    onClick={() => {
                      router.replace(`/programs/add-program`);
                    }}
                    type="primary"
                  >
                    Add a Progam
                  </Button>
                )}
              </Space>
            )}

          {allProgramState.allPrograms.map((program: allProgram, i) => {
            return (
              <>
                {program.state === "DRAFT" && user?.role === "AUTHOR" && user?.id === program.authorId && (
                  <div key={i}>
                    <ProgramSummary
                      key={i}
                      program={program}
                      onUpdateState={onUpdateState}
                      onDeleteProgram={onDeleteProgram}
                      refresh={reFresh.loading}
                      onEnrollCourse={onEnrollCourse}
                      userId={user?.id}
                      keyId={i}
                      state={program.state}
                      role={user?.role as Role}
                      programLoading={allProgramState.prgLaoding}
                      onSetProgramState={onSetProgramState}
                    />
                  </div>
                )}
                {program.state === "ACTIVE" && (
                  <div key={i}>
                    <ProgramSummary
                      key={i}
                      program={program}
                      onUpdateState={onUpdateState}
                      onDeleteProgram={onDeleteProgram}
                      refresh={reFresh.loading}
                      onEnrollCourse={onEnrollCourse}
                      userId={user?.id}
                      keyId={i}
                      state={program.state}
                      role={user?.role as Role}
                      programLoading={allProgramState.prgLaoding}
                      onSetProgramState={onSetProgramState}
                    />
                  </div>
                )}
              </>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProgramMainPage;
