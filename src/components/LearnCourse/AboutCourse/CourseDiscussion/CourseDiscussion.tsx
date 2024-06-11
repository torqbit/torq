import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Button, Divider, Flex, message } from "antd";
import { Discussion } from "@prisma/client";
import QAForm from "./DiscussionForm";
import CommentBox from "./CommentBox";
import ReplyDrawer from "./ReplyDrawer";
import { useRouter } from "next/router";
import DiscussionsService from "@/services/DiscussionsService";
import appConstant from "@/services/appConstant";

export interface IComment extends Discussion {
  comment: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  id: number;
  updatedAt: Date;
  replyCount: number;
}

export interface IReplyDrawer {
  isOpen: boolean;
  sltCommentId?: number;
}

const QADiscssionTab: FC<{ resourceId: number; userId: string; loading: boolean }> = ({
  resourceId,
  userId,
  loading,
}) => {
  const router = useRouter();
  const query = router.query;
  const [comments, setComments] = useState<IComment[]>([]);
  const [pageSize, setPageSize] = useState<number>(appConstant.defaultPageSize);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
  });

  const showReplyDrawer = (comment: IComment) => {
    setReplyDrawer({
      isOpen: true,
      sltCommentId: comment.id,
    });
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: undefined });
  };
  const getDiscussion = () => {
    setListLoading(true);
    DiscussionsService.getComment(
      Number(router.query.queryId),
      (result) => {
        setComments([result.comment]);
        setCommentCount(1);
        setListLoading(false);
      },
      (error) => {
        message.error(error);
        setListLoading(false);
      }
    );
  };

  const getDiscussions = async (pageSize: number) => {
    setListLoading(true);

    DiscussionsService.getCommentsList(
      resourceId,
      pageSize,
      (result) => {
        setComments(result.comments);
        setCommentCount(result.total);
      },
      (error) => {
        message.error(error);
      }
    );

    setListLoading(false);
  };

  const fetchAllDiscussion = () => {
    if (resourceId) {
      if (router.query.queryId && router.query.tab) {
        getDiscussion();
      } else {
        getDiscussions(pageSize);
      }
    }
  };

  const onUpdateReplyCount = (id: number, method: string) => {
    const newReplyCount = comments.map((cm) => {
      if (cm.id === id) {
        return {
          ...cm,
          replyCount: method === "delete" ? cm.replyCount - 1 : cm.replyCount + 1,
        };
      } else {
        return cm;
      }
    });
    setComments(newReplyCount);
  };

  React.useEffect(() => {
    if (resourceId) {
      setPageSize(appConstant.defaultPageSize);
      fetchAllDiscussion();
    }
  }, [resourceId]);

  React.useEffect(() => {
    if (query.comment) {
      setReplyDrawer({
        sltCommentId: Number(query.comment),
        isOpen: true,
      });
    }
  }, [query.notifi, query.comment]);

  const onClickMore = () => {
    if (commentCount > pageSize) {
      const newPageSize = pageSize + appConstant.defaultPageSize;
      setPageSize(newPageSize);
      getDiscussions(newPageSize);
    }
  };
  const onQueryPost = async (
    comment: string,
    setCommentText: (value: string) => void,
    setLoading: (value: boolean) => void
  ) => {
    try {
      setLoading(true);
      DiscussionsService.postQuery(
        resourceId,
        Number(router.query.courseId),
        comment,
        (result) => {
          message.success(result.message);
          comments.unshift(result.comment);
          setCommentText("");
          setLoading(false);
        },
        (error) => {
          message.error(error);
          setLoading(false);
        }
      );
    } catch (error) {}
  };

  return (
    <section className={styles.qa_discussion_tab}>
      <QAForm loadingPage={loading} placeholder="Ask a Question" onPost={onQueryPost} />
      {comments.map((comment, i) => {
        return (
          <CommentBox
            resourceId={resourceId}
            showReplyDrawer={showReplyDrawer}
            comment={comment}
            key={i}
            replyList={false}
            comments={comments}
            setAllComment={setComments}
            onUpdateReplyCount={onUpdateReplyCount}
          />
        );
      })}

      {router.query.queryId && (
        <Flex align="center" justify="flex-end">
          <Button
            type="primary"
            onClick={() => {
              setPageSize(3);
              getDiscussions(pageSize);
              router.push(`/courses/${router.query.courseId}/lesson/${router.query.lessonId}`);
            }}
          >
            Load all
          </Button>
        </Flex>
      )}

      <ReplyDrawer
        replyDrawer={replyDrawer}
        resourceId={resourceId}
        onCloseDrawer={onCloseDrawer}
        comments={comments}
        onUpdateReplyCount={onUpdateReplyCount}
      />
      {commentCount !== comments.length && (
        <Divider>
          <Button type="text" loading={listLoading} className={styles.load_more_comment} onClick={onClickMore}>
            Load More
          </Button>
        </Divider>
      )}
    </section>
  );
};

export default QADiscssionTab;
