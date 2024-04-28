import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Avatar, Button, Input, Popconfirm, Space, message } from "antd";
import { UserOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { useSession } from "next-auth/react";
import moment from "moment";
import { IComments } from "./CourseDiscussion";
import ImagePreview from "@/components/ImagePreview/ImagePreview";
import { customFromNow } from "@/services/momentConfig";
import DiscussionsService from "@/services/DiscussionsService";
import NotificationService from "@/services/NotificationService";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";
moment.locale("en", { ...customFromNow });

export interface IAttachedFiles {
  url: string;
  fileId: string;
  caption?: string;
}

const CommentBox: FC<{
  resourceId: number;
  parentCommentId?: number;
  comment: IComments;
  replyList: boolean;
  replyRefresh?: boolean;
  onRefresh: () => void;
  showReplyDrawer: (cmt: IComments) => void;
}> = ({ comment, onRefresh, replyList, resourceId, parentCommentId, showReplyDrawer, replyRefresh }) => {
  const { data: session } = useSession();
  const [isEdited, setEdited] = useState<boolean>(false);
  const { globalState, dispatch } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [isReply, setReply] = useState<{ open: boolean; id: number }>({ open: false, id: 0 });
  const [refresh, setRefresh] = useState<boolean>(false);
  const [allReplyCmtCount, setAllReplyCmtCount] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>("");
  const attachedFiles = comment.attachedFiles as any;

  const getTotalReplyCmt = async (id: number) => {
    DiscussionsService.getAllReplyCount(
      id,
      (result) => {
        setAllReplyCmtCount(result.allReplyComments.length);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  React.useEffect(() => {
    if (replyList) {
      getTotalReplyCmt(comment.id);
    }
  }, [comment.id, refresh, replyRefresh]);

  const onDeleteComment = async (cmtId: number) => {
    DiscussionsService.deleteComment(
      cmtId,
      (result) => {
        message.success(result.message);
        onRefresh();
        setRefresh(!refresh);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onUpdateMultipleNotificaton = () => {
    session?.id &&
      NotificationService.updateMultipleNotification(
        comment.id,
        session?.id,
        (result) => {
          dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
        },
        (error) => {}
      );
  };

  const onEditComment = async () => {
    if (!editComment || comment.comment.trim() == editComment.trim()) {
      setEdited(false);
      return;
    }
    setLoading(true);
    DiscussionsService.updateComment(
      comment.id,
      editComment,
      (result) => {
        onRefresh();
        message.success(result.message);
        setEditComment(result.comment.comment);
        setEdited(false);
      },
      (error) => {
        message.error(error);
      }
    );

    setLoading(false);
  };

  return (
    <>
      <div className={styles.comment_box} key={comment.id} id={`comment_${comment.id}`}>
        <Avatar size={40} src={comment.user.image} icon={<UserOutlined />} className={styles.user_icon} alt="Profile" />
        <div className={styles.comment} style={{ marginLeft: 20 }}>
          <Space className={styles.user_info}>
            <h4>{comment.user.name}</h4>
            <p className="dot">•</p>
            <h5 className={styles.comment_time}>
              {moment(new Date(comment.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}
            </h5>
          </Space>
          <div className={`${styles.comment_body} comment-card-body`}>
            <div className={styles.comment_body_header}>
              {session?.id === comment.user.id && (
                <Space className={styles.comment_action_btns}>
                  {isEdited ? (
                    <CloseOutlined onClick={() => setEdited(false)} />
                  ) : (
                    <div
                      onClick={() => {
                        setEdited(true);
                        setEditComment(comment.comment);
                      }}
                    >
                      {SvgIcons.edit}
                    </div>
                  )}

                  <Popconfirm
                    title="Delete the post"
                    description="Are you sure to delete this post?"
                    onConfirm={() => onDeleteComment(comment.id)}
                    okText="Yes"
                    cancelText="Continue"
                  >
                    {SvgIcons.delete}
                  </Popconfirm>
                </Space>
              )}
            </div>
            <div className={styles.comment_content}>
              {isEdited ? (
                <Input.TextArea
                  placeholder="Edit Post"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) {
                      onEditComment();
                    }
                  }}
                  className={styles.qa_edit_input}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
              ) : (
                <div className={styles.comment_text_wrapper}>{comment.comment}</div>
              )}
            </div>
          </div>
          <div className={styles.comment_footer}>
            <div className={styles.reply_btn}>
              {isEdited ? (
                <Space>
                  <Button type="primary" loading={loading} size="small" onClick={onEditComment}>
                    Save
                  </Button>
                  <Button size="small" onClick={() => setEdited(false)}>
                    Cancel
                  </Button>
                </Space>
              ) : (
                <Space align="center">
                  {replyList && (
                    <span
                      onClick={() => {
                        onUpdateMultipleNotificaton();
                        showReplyDrawer(comment);
                      }}
                    >
                      {allReplyCmtCount === 0 && "Reply"}
                      {isReply.open ? (
                        "Cancel"
                      ) : (
                        <span>
                          {allReplyCmtCount > 0 && replyList && (
                            <span>
                              {" "}
                              {allReplyCmtCount === 1 ? `${allReplyCmtCount} Reply` : `${allReplyCmtCount} Replies`}
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  )}

                  {attachedFiles?.length > 0 && (
                    <ImagePreview imgs={attachedFiles?.map((img: IAttachedFiles) => img.url)} />
                  )}
                </Space>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentBox;
