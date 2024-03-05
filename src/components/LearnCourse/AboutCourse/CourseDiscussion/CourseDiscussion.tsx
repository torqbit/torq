import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Button, Divider, Drawer, message, Upload } from "antd";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { Discussion } from "@prisma/client";
import QAForm from "./DiscussionForm";
import CommentBox, { IAttachedFiles } from "./CommentBox";
import ReplyDrawer from "./ReplyDrawer";
import { useRouter } from "next/router";
import { useAppContext } from "@/components/ContextApi/AppContext";

export interface IComments extends Discussion {
  comment: string;
  user: {
    id: number;
    name: string;
    image: string;
  };
}

export interface IReplyDrawer {
  isOpen: boolean;
  sltCommentId: number;
}

const QADiscssionTab: FC<{ resourceId: number; userId: number; loading: boolean }> = ({
  resourceId,
  userId,
  loading,
}) => {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const query = router.query;
  const [allComments, setAllComments] = useState<IComments[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(3);
  const [totalCmt, setTotalCmt] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
    sltCommentId: 0,
  });

  const showReplyDrawer = (comment: IComments) => {
    setReplyDrawer({
      isOpen: true,
      sltCommentId: comment.id,
    });
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: 0 });
  };

  const getAllDiscussioin = async (resId: number, pageSize: number) => {
    setListLoading(true);
    const res = await getFetch(`/api/qa-discussion/get-list/${userId}/${resId}?pageSize=${pageSize}`);
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      setAllComments(result.allComments);
      setTotalCmt(result.total);
    } else {
      message.error(result.error);
    }
    setListLoading(false);
  };

  React.useEffect(() => {
    if (resourceId) {
      setPageSize(3);
    }
  }, [resourceId]);

  React.useEffect(() => {
    if (resourceId) {
      getAllDiscussioin(resourceId, pageSize);
    }
  }, [refresh, resourceId]);

  const updateNotification = async () => {
    try {
      const res = await getFetch(`/api/notification/update/${query.notifi}?userId=${userId}`);
      const result = (await res.json()) as IResponse;
      dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
    } catch (err) {}
  };

  React.useEffect(() => {
    if (query.comment) {
      setReplyDrawer({
        sltCommentId: Number(query.comment),
        isOpen: true,
      });
      updateNotification();
    }
  }, [query.notifi, query.comment]);

  const oClickMore = () => {
    if (totalCmt > pageSize) {
      const newPageSize = pageSize + 5;
      setPageSize(newPageSize);
      getAllDiscussioin(resourceId, newPageSize);
    }
  };

  return (
    <section className={styles.qa_discussion_tab}>
      <QAForm
        loadingPage={loading}
        resourceId={resourceId}
        placeholder="Ask a Question"
        onRefresh={() => setRefresh(!refresh)}
      />
      <Divider style={{ margin: "20px 0" }} />
      {allComments.map((comment, i) => {
        return (
          <CommentBox
            resourceId={resourceId}
            showReplyDrawer={showReplyDrawer}
            replyRefresh={refresh}
            comment={comment}
            key={i}
            replyList={true}
            onRefresh={() => setRefresh(!refresh)}
          />
        );
      })}

      <ReplyDrawer
        replyDrawer={replyDrawer}
        resourceId={resourceId}
        onCloseDrawer={onCloseDrawer}
        onReplyRefresh={() => setRefresh(!refresh)}
      />
      {totalCmt !== allComments.length && (
        <Divider>
          <Button type="text" loading={listLoading} className={styles.load_more_comment} onClick={oClickMore}>
            Load More
          </Button>
        </Divider>
      )}
    </section>
  );
};

export default QADiscssionTab;
