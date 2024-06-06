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

const ReplyDrawer: FC<{
  replyDrawer: IReplyDrawer;
  onCloseDrawer: () => void;
  resourceId: number;
  fetchAllDiscussion: () => void;
}> = ({ replyDrawer, onCloseDrawer, resourceId, fetchAllDiscussion }) => {
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [sltComment, setSltComment] = useState<IComments>();
  const [allReplyComments, setAllReplyComments] = useState<IComments[]>([]);
  const dummyReply = Array.from({ length: 8 }, (_, index) => index + 1);

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
    DiscussionsService.getAllReplyCount(
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
            fetchAllDiscussion={() => {
              fetchAllReplyComment();
              fetchAllDiscussion();
            }}
            loadingPage={false}
            onCloseDrawer={onCloseDrawer}
          />
        }
      >
        <div id="reply_cmt_list" ref={scrollRef}>
          <section className={styles.list_reply_cmt} id="list_reply_cmt">
            {listLoading ? (
              <Flex vertical gap={10} className={styles.comment_box}>
                {dummyReply.map((n) => {
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
                    fetchAllDiscussion={() => {
                      onScollReply();
                      fetchAllDiscussion();
                    }}
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
