import { IResource } from "@/lib/types/learn";
import { getFetch, IResponse, postFetch } from "@/services/request";
import { message, Button, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import { FC, useState, useEffect } from "react";
import { CheckOutlined } from "@ant-design/icons";
import style from "@/styles/LearnLecture.module.scss";
import appConstant from "@/services/appConstant";

const ResourceTitleStatus: FC<{
  sltResource: IResource | undefined;
  programId: number;
  chpaterId: number;
  getProgressDetail: () => void;
  courseId: number;
  userId: number;
  refresh: boolean;
  resLocked: boolean;
  onRefresh: () => void;
  loading: boolean;

  currentResourceId: number;
  setResLocked: (value: boolean) => void;
}> = ({
  sltResource,
  programId,
  chpaterId,
  courseId,
  loading,
  refresh,
  onRefresh,
  userId,
  getProgressDetail,
  resLocked,
  currentResourceId,
  setResLocked,
}) => {
  const [isCompleted, setCompleted] = useState<boolean>(false);
  const [loadingBtn, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const checkIsCompleted = async () => {
    // setLoading(true);
    const res = await getFetch(`/api/progress/get/${sltResource?.resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      if (currentResourceId === sltResource?.resourceId || result.isCompleted) {
        setResLocked(false);
      }
      setCompleted(result.isCompleted);
    }
    // setLoading(false);
  };

  useEffect(() => {
    if (sltResource?.resourceId) {
      checkIsCompleted();
    }
  }, [refresh, sltResource]);

  const onMarkAsCompleted = async () => {
    try {
      if (isCompleted) return;
      // setLoading(true);
      const res = await postFetch(
        {
          programId: programId,
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
        getProgressDetail();

        onRefresh();
      } else {
        message.error(result.error);
      }
      // setLoading(false);
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };
  return (
    <article className={style.resource_status_footer}>
      {loading ? <Skeleton.Input /> : <h3 className={style.lecture_name}>{sltResource?.name}</h3>}

      {loading ? (
        <Skeleton.Button size="large" />
      ) : (
        <>
          {sltResource && !loadingBtn && sltResource.contentType === "Video" && (
            <>
              {!resLocked || currentResourceId === sltResource.resourceId ? (
                <Button
                  style={
                    isCompleted
                      ? { backgroundColor: "#fff", color: "#000" }
                      : { backgroundColor: "#000", color: "#fff" }
                  }
                  loading={loadingBtn}
                  onClick={onMarkAsCompleted}
                  className={isCompleted ? style.lecture_completed : style.lecture_status_btn}
                >
                  {isCompleted && !loadingBtn ? (
                    <>
                      <CheckOutlined rev={undefined} /> Completed
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    getProgressDetail();
                  }}
                >
                  Return to Current
                </Button>
              )}
            </>
          )}
        </>
      )}
    </article>
  );
};

export default ResourceTitleStatus;
