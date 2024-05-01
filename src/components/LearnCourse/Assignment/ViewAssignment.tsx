import CustomEditorJS from "@/components/Editorjs/CustomEditorJS";
import React, { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import EditorJS from "@editorjs/editorjs";
import { TabsProps, Tabs, Button, Popconfirm, message, Tag, Flex } from "antd";
import { IResponse, getFetch, postFetch } from "@/services/request";
import moment from "moment";
import { daysRemaining } from "@/services/helper";
import appConstant from "@/services/appConstant";
import { useSession } from "next-auth/react";
import { IResource } from "@/lib/types/learn";
import { SubmissionStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Document, Page, pdfjs } from "react-pdf";
import CountDown from "@/components/programs/CountDown";
import { LeftCircleOutlined } from "@ant-design/icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type TAssignmenTab = "view_assignment" | "submission";
export interface IAssignmentInfo {
  isStarted: boolean;
  startedAt: string;
  deadLine: string;
  id: number;
  submissionStatus: SubmissionStatus;
}

const AssignmentTandC: FC<{
  getProgressDetail: () => void;
  onStartAssignment: () => void;
  resLocked: boolean;
  loading: boolean;
}> = ({ onStartAssignment, resLocked, getProgressDetail, loading }) => {
  return (
    <>
      {!resLocked && (
        <article className={style.assign_t_and_c}>
          <h3>Terms and Conditions for Completing Assignments in the Course</h3>
          <h4>
            Please carefully read and understand the following Terms and Conditions (T&C) that outline the expectations
            and requirements for completing assignments in this course:
          </h4>
          <ol>
            <li>
              Submission Deadline: All assignments must be submitted by the specified deadline. Late submissions may be
              subject to penalties, rejection or block you course unless prior arrangements have been made with the
              course instructor.
            </li>
            <li>
              Plagiarism and Academic Integrity: All work submitted must be your own, unless otherwise stated.
              Plagiarism,
            </li>
            <li>
              Originality of Work: Assignments should reflect your understanding of the course material and your own
              thoughts and ideas.
            </li>
          </ol>
          {!resLocked && (
            <Popconfirm
              title="Start Assignment?"
              description="Are you sure want to start this assignment?"
              onConfirm={() => {
                onStartAssignment();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" className={style.start_assign_btn}>
                Start Assignment
              </Button>
            </Popconfirm>
          )}
        </article>
      )}
    </>
  );
};

const ViewAssignment: FC<{
  getProgressDetail: () => void;
  sltResource: IResource;
  courseId: number;
  resLocked: boolean;
  onRefresh: () => void;
  loadingPage: boolean;
  setCompleted: (value: boolean) => void;
}> = ({ sltResource, courseId, loadingPage, resLocked, getProgressDetail, onRefresh, setCompleted }) => {
  const ref = React.useRef<EditorJS>();
  const { dispatch } = useAppContext();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isDaysLeft, setIsDaysLeft] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<TAssignmenTab>("view_assignment");
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [assignmentInfo, setAssignmentInfo] = useState<IAssignmentInfo>({
    isStarted: false,
    startedAt: "",
    deadLine: "",
    submissionStatus: "PENDING",
    id: 0,
  });

  const items: TabsProps["items"] = [
    {
      key: "view_assignment",
      label: `Assignment`,
      children: (
        <div>
          {!resLocked && (
            <Document
              renderMode="svg"
              className={style.pdf_container}
              file={`/api/assignment/read/${sltResource.resourceId}/${router.query.programId}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page renderTextLayer={false} height={400} width={800} pageNumber={pageNumber} />
            </Document>
          )}
        </div>
      ),
    },
  ];

  const getAssignmentInfo = async (resId: number, userId: string) => {
    setLoading(true);
    try {
      const res = await getFetch(`/api/assignment/get/${resId}/?userId=${userId}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result?.assignmentInfo) {
          setAssignmentInfo(result.assignmentInfo);
          setIsDaysLeft(moment(new Date(result?.assignmentInfo?.deadLine)).isAfter());
        } else {
          setAssignmentInfo({
            isStarted: false,
            startedAt: "",
            deadLine: "",
            id: 0,
            submissionStatus: "PENDING",
          });
        }
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const updateNotification = async (id: string, userId: string) => {
    try {
      const res = await getFetch(`/api/notification/update/${id}/?userId=${userId}`);
      const result = (await res.json()) as IResponse;
      dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
    } catch (err) {}
  };

  React.useEffect(() => {
    if (sltResource.resourceId && session?.id) {
      getAssignmentInfo(sltResource.resourceId, session.id);
    }

    if (router.query?.tab) {
      setTabKey(router.query.tab as TAssignmenTab);
    }
    if (router.query?.notifi && session?.id) {
      updateNotification(router.query.notifi as string, session?.id);
    }
  }, [sltResource.resourceId, refresh, session]);

  const onStartAssignment = async () => {
    try {
      const res = await postFetch(
        { daysToSubmit: sltResource.daysToSubmit, userId: session?.id },
        `/api/assignment/start/${sltResource.resourceId}`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        message.success(result.message);
        setRefresh(!refresh);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const onMarkAsCompleted = async () => {
    try {
      setLoading(true);
      const res = await postFetch(
        {
          programId: Number(router.query.programId),
          userId: session?.id,
          sequenceId: sltResource?.sequenceId,
          //chapterId, need  to be check
          resourceId: sltResource?.resourceId,
        },
        `/api/progress/create`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        message.success(result.message);
        // getProgressDetail();
        setCompleted(true);

        // onRefresh();
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };
  return (
    <section className={style.view_submit_assignment}>
      {assignmentInfo.isStarted && !loading && (
        <Tabs
          tabBarExtraContent={
            !loading && assignmentInfo.submissionStatus === "PENDING" ? (
              <Flex align="center">
                <h4 className={style.submit_date}>Remaining hourse to submit :</h4>

                <span
                  style={{
                    color: isDaysLeft ? "#4ece91" : "#ff0000",
                  }}
                >
                  <CountDown id={sltResource.resourceId} onMarkAsCompleted={onMarkAsCompleted} />
                </span>
              </Flex>
            ) : (
              <Tag color={assignmentInfo.submissionStatus === "SUBMITTED" ? "#87d068" : "#2db7f5"}>
                {assignmentInfo.submissionStatus}
              </Tag>
            )
          }
          onChange={(key) => setTabKey(key as TAssignmenTab)}
          defaultActiveKey="view_assignment"
          activeKey={tabKey}
          className="view_submit_assignment"
          tabBarStyle={{
            borderBottom: "1px solid #eee",
            marginBottom: 0,
            background: "#fff",
            padding: "0 10px",
          }}
          items={items}
        />
      )}

      {!assignmentInfo.isStarted && !loading && (
        <AssignmentTandC
          getProgressDetail={getProgressDetail}
          resLocked={resLocked}
          onStartAssignment={onStartAssignment}
          loading={loadingPage}
        />
      )}
    </section>
  );
};

export default ViewAssignment;
