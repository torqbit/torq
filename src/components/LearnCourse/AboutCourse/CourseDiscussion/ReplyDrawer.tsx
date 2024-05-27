import { Avatar, Drawer, Skeleton, Space, message } from "antd";
import styles from "@/styles/LearnLecture.module.scss";
import React, { FC, useState, useRef, useEffect } from "react";
import { getFetch, IResponse } from "@/services/request";
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
  onReplyRefresh: () => void;
}> = ({ replyDrawer, onCloseDrawer, resourceId, onReplyRefresh }) => {
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

  const getCommetById = async (id: number) => {
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
      },
      (error) => {
        message.error(error);
      }
    );

    setListLoading(false);
  };
  const onRefresh = () => {
    if (replyDrawer.sltCommentId) {
      getAllReplyComment(replyDrawer.sltCommentId);
      getCommetById(replyDrawer.sltCommentId);
    }
  };

  React.useEffect(() => {
    onRefresh();
  }, [replyDrawer.sltCommentId]);
  return (
    <Element name="reply_cmt_drawer">
      <Drawer
        title={
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
            onRefresh={() => {
              onRefresh();
              onReplyRefresh();
            }}
            loadingPage={false}
            onCloseDrawer={onCloseDrawer}
          />
        }
      >
        <div id="reply_cmt_list" ref={scrollRef}>
          <section className={styles.list_reply_cmt} id="list_reply_cmt">
            {listLoading ? (
              <Skeleton
                className={styles.comment_box}
                avatar
                title={{ width: "100%" }}
                paragraph={{ rows: 2, width: "100%" }}
              />
            ) : (
              allReplyComments.map((comment, i) => {
                return (
                  <CommentBox
                    replyList={false}
                    showReplyDrawer={() => {}}
                    resourceId={resourceId}
                    comment={comment}
                    parentCommentId={replyDrawer.sltCommentId}
                    key={i}
                    onRefresh={() => {
                      onScollReply();
                      onReplyRefresh();
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
