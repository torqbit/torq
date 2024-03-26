import React, { FC, useEffect, useState } from "react";

import styles from "../../styles/AllPrograms.module.scss";
import { Button, Dropdown, MenuProps, Popconfirm, Skeleton, Space, Spin, Tag } from "antd";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";

import useRouter from "next/router";
import { IResponse, getFetch, postFetch } from "@/services/request";
import Link from "next/link";
import { Role } from "@prisma/client";
import { allProgram } from "@/lib/types/program";

const ProgramEditLink: FC<{ programId: number }> = ({ programId }) => (
  <Link href={`/programs/add-program?edit=true&programId=${programId}`}>Edit</Link>
);

const ProgramSummary: FC<{
  role: Role;
  program: allProgram;
  onUpdateState: (id: number) => void;
  onEnrollCourse: (id: number, programType: string) => void;
  onDeleteProgram: (id: number) => void;
  refresh: boolean;
  userId: number | undefined;
  keyId: number;
  state: string;
  programLoading: boolean;
  onSetProgramState: (value: boolean) => void;
}> = ({
  program,
  onUpdateState,
  programLoading,
  onDeleteProgram,
  onSetProgramState,
  role,
  refresh,
  onEnrollCourse,
  keyId,
  userId,
  state,
}) => {
  const router = useRouter;
  const [enrolled, setEnrolled] = useState<string>();
  const [loading, setLoading] = useState<string>("active");

  let activeCourses = program.course.filter((c: any) => c.state === "ACTIVE");
  let draftCourses = program.course.filter((c: any) => c.state === "DRAFT");

  useEffect(() => {
    getEnrolledStatus(program.id);
  }, [refresh]);

  const getEnrolledStatus = async (id: number) => {
    setLoading("active");
    onSetProgramState(true);
    const res = await getFetch(`/api/course/get-enrolled/${id}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      if (result.isEnrolled === true) {
        setEnrolled("yes");
      } else if (result.isEnrolled === false) {
        setEnrolled("no");
      }
      setLoading("inActive");
      onSetProgramState(false);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: <ProgramEditLink programId={program.id} />,
      key: "0",
    },
    {
      label: (
        <Popconfirm
          title="Delete the resource"
          description="Are you sure to delete this resource?"
          onConfirm={() => {
            onDeleteProgram(program.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
      key: "1",
    },
  ];

  return (
    <>
      {loading === "active" && (
        <>
          <div className={styles.allProgram}>
            <div>
              <Skeleton avatar={{ shape: "square", size: 150 }} className={styles.allProgram__Wrapper}>
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
              </Skeleton>
            </div>
            <div style={{ marginTop: 20 }}>
              <Skeleton avatar={{ shape: "square", size: 150 }} className={styles.allProgram__Wrapper}>
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
              </Skeleton>
            </div>
            <div style={{ marginTop: 20 }}>
              <Skeleton avatar={{ shape: "square", size: 150 }} className={styles.allProgram__Wrapper}>
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
              </Skeleton>
            </div>
          </div>
        </>
      )}

      {loading === "inActive" && (
        <div key={keyId}>
          <div className={styles.programContainer}>
            <div className={styles.imgWrapper}>
              <img src={program.thumbnail} alt="" />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.contentWrapper}>
                <h2>{program.title}</h2>

                <Space size={[0, "middle"]} wrap>
                  <Tag bordered={false}>{program.durationInMonths} Months </Tag>

                  <Tag bordered={false}>{activeCourses?.length} Courses</Tag>
                  {draftCourses.length >= 1 && userId === program.authorId && (
                    <Tag className={styles.tags}>{draftCourses?.length} Draft Courses</Tag>
                  )}
                  {state === "DRAFT" && (
                    <Tag color="warning" bordered={false}>
                      Draft
                    </Tag>
                  )}
                </Space>
                <p>{program.description}</p>
                <div className={styles.actionBtn}>
                  {state === "ACTIVE" && program.id ? (
                    <Button
                      type="primary"
                      className={styles.enrollBtn}
                      onClick={() => {
                        onEnrollCourse(program.id, program.programType);
                      }}
                    >
                      {enrolled === "yes" && <>Resume </>}
                      {enrolled === "no" && <>Enroll to Learn</>}
                      <img src="/img/program/arrow-right.png" alt="" />
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        onUpdateState(program.id);
                      }}
                      className={styles.enrollBtn}
                    >
                      Publish
                    </Button>
                  )}

                  <Button
                    onClick={() => router.push(`/programs/overview/${program.id}`)}
                    className={styles.overviewBtn}
                  >
                    Overview
                  </Button>
                </div>
              </div>
              <div>
                {userId === program.authorId && role === "AUTHOR" && (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <EllipsisOutlined style={{ fontSize: "20px" }} rev={undefined} />
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgramSummary;
