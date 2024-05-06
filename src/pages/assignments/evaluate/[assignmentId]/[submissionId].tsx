import { Button, Input, Space, Tabs, Tag, message } from "antd";
import styles from "@/styles/AssignmentEvaluation.module.scss";
import React from "react";
import EditorJS from "@editorjs/editorjs";
import { IAllAssignment } from "../..";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { useRouter } from "next/router";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import Link from "next/link";
import appConstant from "@/services/appConstant";
import PreviewCode from "@/components/PreviewCode/PreviewCode";
import CustomEditorJS from "@/components/Editorjs/CustomEditorJS";
import { useSession } from "next-auth/react";
import Layout2 from "@/components/Layout2/Layout2";

interface IState {
  comment: string;
  score: number | null;
}

const AssignmentEvaluate = () => {
  const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const { data: session } = useSession();
  const { assignmentId, submissionId } = router.query;
  const [state, setState] = React.useState<IState>({
    comment: "",
    score: null,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [assignmentInfo, setAssignmentInfo] = React.useState<IAllAssignment>();
  const [code, setCode] = React.useState<{ [type: string]: string }>({});

  const getAssignmentById = async (id: number) => {
    setLoading(true);
    try {
      const res = await getFetch(`/api/assignment/evaluate/${id}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        const assignInfo: IAllAssignment = result.assignmentInfo as IAllAssignment;
        setAssignmentInfo(assignInfo);
        setCode(assignInfo.submissionTask.content as any);

        if (assignInfo.submissionTask.isEvaluated) {
          setState({
            comment: assignInfo.submissionTask.evaluationComments as string,
            score: assignInfo.submissionTask.score,
          });
        }
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };
  React.useEffect(() => {
    if (assignmentId) {
      getAssignmentById(Number(assignmentId));
    }
  }, [assignmentId]);
  let langTabs = [];

  if (assignmentInfo) {
    langTabs?.push({
      key: "assignment",
      label: "Assignment",
      children: (
        <CustomEditorJS
          holder="assign_readOnly2"
          editorRef={ref}
          editorData={assignmentInfo?.resource.assignment}
          className="evaluate_assign_editor_view"
          readOnly={true}
          placeholder={""}
        />
      ),
    });
    assignmentInfo?.resource.assignmentLang.map((lang, i) => {
      langTabs.push({
        key: lang.toLowerCase(),
        label: lang.toUpperCase(),
        children: (
          <CodeBlock
            value={code[lang.toLowerCase()]}
            name={lang.toLowerCase()}
            height="300px"
            editable={false}
            onCodeChange={() => {}}
          />
        ),
      });
    });

    langTabs?.push({
      key: "preview",
      label: "Preview",
      children: <PreviewCode content={code} />,
    });
  }

  const onSubmitEvaluate = async () => {
    if (!state.score) return message.info("Please give some score");
    try {
      const res = await postFetch(
        {
          resourceId: assignmentInfo?.assignmentId,
          evaluatedByUserId: session?.id,
          assignmentUserId: assignmentInfo?.userId,
          assignmentId: Number(assignmentId),
          score: state.score,
          comment: state.comment,
          submissionId: Number(submissionId),
          isEvaluated: assignmentInfo?.submissionTask.isEvaluated,
          assignmentTitle: assignmentInfo?.resource.name,
        },
        `/api/assignment/evaluate/done`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        message.success(result.message);
        router.push("/assignments");
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };

  return (
    <Layout2 className={styles.assignment_evaluation_page}>
      <div className={styles.center_content}>
        <Space align="center" style={{ marginBottom: 30 }}>
          <h2>Evaluate Assignment</h2>{" "}
          {assignmentInfo?.submissionTask.isEvaluated && <Tag color="green">{assignmentInfo?.submissionStatus}</Tag>}
        </Space>
        <Space direction="vertical" style={{ width: "100%", marginTop: 40 }} size="large">
          <Space style={{ width: "100%" }} direction="vertical" size="middle">
            <Tabs
              type="card"
              size="small"
              className="assignment_code_tabs"
              tabBarStyle={{
                borderBottom: "1px solid #eee",
                marginBottom: 0,
                background: "#fff",
              }}
              items={langTabs}
            />
          </Space>
          <Space style={{ width: "100%" }} direction="vertical" size="middle">
            <strong>Comment</strong>
            <Input.TextArea
              placeholder="Comment"
              value={state.comment}
              onChange={(e) => setState({ ...state, comment: e.target.value })}
              rows={4}
            />
          </Space>
          <Space style={{ width: "100%" }} direction="vertical" size="middle">
            <strong>Score</strong>
            <Input
              type="number"
              min={0}
              value={state.score as number}
              max={appConstant.assignmentMaxScore}
              onChange={(e) => setState({ ...state, score: Number(e.target.value) })}
              placeholder="Score"
            />
          </Space>
          <Space>
            <Button type="primary" className={styles.submit_btn} onClick={onSubmitEvaluate}>
              {assignmentInfo?.submissionTask.isEvaluated ? "Re-submit" : "Submit"}
            </Button>
            <Link href="/assignments">
              <Button className={styles.submit_btn}>Back</Button>
            </Link>
          </Space>
        </Space>
      </div>
    </Layout2>
  );
};

export default AssignmentEvaluate;
