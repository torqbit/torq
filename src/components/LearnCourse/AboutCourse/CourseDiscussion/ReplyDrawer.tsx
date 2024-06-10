import { Avatar, Drawer, Flex, Skeleton, Space, message } from "antd";
import styles from "@/styles/LearnLecture.module.scss";
import React, { FC, useState, useRef, useEffect } from "react";
import { IComments, IReplyDrawer } from "./CourseDiscussion";
import CommentBox from "./CommentBox";
import QAForm from "./DiscussionForm";
import { UserOutlined } from "@ant-design/icons";
import { useMediaPredicate } from "react-media-hook";
import { Element, animateScroll as scroll, scrollSpy, scroller } from "react-scroll";
import DiscussionsService from "@/services/DiscussionsService";
import { getDummyArray } from "@/lib/dummyData";
import { useRouter } from "next/router";

const ReplyDrawer: FC<{
  replyDrawer: IReplyDrawer;
  onCloseDrawer: () => void;
  resourceId: number;
}> = ({ replyDrawer, onCloseDrawer, resourceId }) => {
  const router = useRouter();
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [sltComment, setSltComment] = useState<IComments>();
  const [allReplyComments, setAllReplyComments] = useState<IComments[]>([]);

  const isMax415Width = useMediaPredicate("(max-width: 415px)");
  const scrollRef = useRef<any>(null);
  const onScollReply = () => {
    if (scrollRef.current) {
      scroller.scrollTo("reply_cmt_drawer", {
        smooth: true,
        containerId: "reply_cmt_list",
        offset: scrollRef.current.scrollHeight,
      });
    }
  };

  useEffect(() => {
    onScollReply();
  }, [listLoading]);

  const getCommentById = async (id: number) => {
    try {
      DiscussionsService.getComment(
        id,
        (result) => {
          setSltComment(result.comment);
        },
        (error) => {
          message.error(error);
        }
      );
    } catch (err) {}
  };

  const getAllReplyComment = async (cmtId: number) => {
    setListLoading(true);
    DiscussionsService.getAllReply(
      cmtId,
      (result) => {
        setAllReplyComments(result.allReplyComments);
        setListLoading(false);
      },
      (error) => {
        message.error(error);
        setListLoading(false);
      }
    );
  };
  const fetchAllReplyComment = () => {
    if (replyDrawer.sltCommentId) {
      getAllReplyComment(replyDrawer.sltCommentId);
      getCommentById(replyDrawer.sltCommentId);
    }
  };

  const onPostReply = async (
    comment: string,
    setComment: (value: string) => void,
    setLoading: (value: boolean) => void
  ) => {
    try {
      setLoading(true);
      DiscussionsService.postReply(
        resourceId,
        Number(router.query.courseId),
        comment,
        Number(sltComment?.id),
        (result) => {
          message.success(result.message);
          allReplyComments.unshift(result.comment);
          setComment("");
          setLoading(false);
          onScollReply();
        },
        (error) => {
          message.error(error);
          setLoading(false);
        }
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchAllReplyComment();
  }, [replyDrawer.sltCommentId]);
  return (
    <Element name="reply_cmt_drawer">
      <Drawer
        title={
          <Skeleton avatar title={false} loading={listLoading} active>
            <Space align="center">
              <Avatar
                size={40}
                src={sltComment?.user?.image}
                icon={<UserOutlined rev={undefined} />}
                className={styles.user_icon}
                alt="Profile"
              />
              <h3 style={{ marginBottom: 0 }}>{sltComment?.user?.name}</h3>
            </Space>
          </Skeleton>
        }
        width={isMax415Width ? "100%" : 500}
        className={styles.reply_drawer}
        classNames={{ header: styles.headerWrapper, body: styles.bodyWrapper, footer: styles.footerWrapper }}
        placement="right"
        onClose={onCloseDrawer}
        open={replyDrawer.isOpen}
        footer={
          <QAForm
            resourceId={resourceId}
            parentCommentId={replyDrawer.sltCommentId}
            placeholder="Reply"
            loadingPage={false}
            onPost={onPostReply}
          />
        }
      >
        <div id="reply_cmt_list" ref={scrollRef}>
          <section className={styles.list_reply_cmt} id="list_reply_cmt">
            {listLoading ? (
              <Flex vertical gap={10} className={styles.comment_box}>
                {getDummyArray(8).map((n) => {
                  return <Skeleton avatar title={false} loading={true} active></Skeleton>;
                })}
              </Flex>
            ) : (
              allReplyComments.map((comment, i) => {
                return (
                  <CommentBox
                    replyList={true}
                    showReplyDrawer={() => {}}
                    resourceId={resourceId}
                    comment={comment}
                    parentCommentId={replyDrawer.sltCommentId}
                    key={i}
                    allComment={allReplyComments}
                    setAllComment={setAllReplyComments}
                  />
                );
              })
            )}
          </section>
        </div>
      </Drawer>
    </Element>
  );
};

export default ReplyDrawer;
