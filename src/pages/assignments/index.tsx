import styles from "@/styles/AssignmentEvaluation.module.scss";
import Layout from "@/components/Layout";
import { Button, Table, Tag, message } from "antd";
import React, { FC } from "react";
import { IResponse, getFetch } from "@/services/request";
import { AssignmentAndTask, SubmissionTask } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import appConstant from "@/services/appConstant";

interface ISubmissionTask extends SubmissionTask {
  user: {
    name: string;
    email: string;
  };
}

export interface IAllAssignment extends AssignmentAndTask {
  resource: {
    name: string;
    assignment: Object;
    assignmentLang: string[];
  };
  submissionTask: ISubmissionTask;
}

const AssignmentTable: FC = () => {
  const [allAssignment, setAllAssignment] = React.useState<IAllAssignment[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  const getAllAssignment = async () => {
    setLoading(true);
    try {
      const res = await getFetch("/api/assignment/get/all");
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setAllAssignment(result.allAssignment);
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {}
  };
  React.useEffect(() => {
    getAllAssignment();
  }, []);

  const columns: any[] = [
    {
      title: "SubmittedAt",
      render: (a: IAllAssignment) => {
        return (
          <span>
            {moment(a.submissionTask.createdAt).format("MMM-DD-YY  hh:mm a")}
          </span>
        );
      },
      key: "createdAt",
    },

    {
      title: "Email",
      render: (a: IAllAssignment) => {
        return <span>{a.submissionTask?.user?.email}</span>;
      },
      key: "email",
    },
    {
      title: "Languages",
      render: (u: IAllAssignment) => {
        return u.resource.assignmentLang.map((l, i) => {
          return <Tag>{l}</Tag>;
        });
      },
      key: "language",
    },
    {
      title: "Evaluation On",
      render: (a: IAllAssignment) => {
        if (a.submissionTask.evaluatedOn) {
          return (
            <span>
              {moment(a.submissionTask.evaluatedOn).format(
                "MMM-DD-YY  hh:mm a"
              )}
            </span>
          );
        } else {
          return "--";
        }
      },
      key: "evaluationOn",
    },
    {
      title: "Status",
      render: (u: IAllAssignment) => {
        if (u.submissionTask.isEvaluated) {
          return <Tag color="green">{u.submissionStatus}</Tag>;
        } else {
          return <Tag color="blue">{u.submissionStatus}</Tag>;
        }
      },
      key: "status",
    },
    {
      title: "Score",
      render: (u: IAllAssignment) => {
        if (u.submissionTask.score) {
          return (
            <>
              {u.submissionTask.score}/{appConstant.assignmentMaxScore}
            </>
          );
        } else {
          return "--";
        }
      },
      key: "status",
    },

    {
      title: "Action",
      align: "center",
      render: (u: IAllAssignment) => {
        return (
          <Link href={`/assignments/evaluate/${u.id}/${u.submissionTask.id}`}>
            <Button
              size="small"
              type={u.submissionTask.isEvaluated ? "default" : "primary"}
              style={{ width: 90, fontSize: 13 }}
            >
              {u.submissionTask.isEvaluated ? "Re-evaluate" : "Evaluate"}
            </Button>
          </Link>
        );
      },
      key: "action",
    },
  ];
  return (
    <section className={styles.user_tab}>
      <Table
        dataSource={allAssignment}
        className={styles.assignment_tables}
        columns={columns}
        loading={loading}
      />
    </section>
  );
};

const SubmittedAssignment: NextPage = () => {
  return (
    <Layout className={styles.assignment_list_page}>
      <div className={styles.center_content}>
        <h2>Submitted Assignments</h2>
        <AssignmentTable />
      </div>
    </Layout>
  );
};

export default SubmittedAssignment;
