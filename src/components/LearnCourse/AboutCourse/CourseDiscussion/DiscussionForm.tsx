import { Badge, Button, Flex, Skeleton, UploadFile, UploadProps } from "antd";
import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Input, Modal, Space, Tooltip, message, Upload } from "antd";
import { LoadingOutlined, InboxOutlined } from "@ant-design/icons";
import Image from "next/image";
import { IResponse, postWithFile } from "@/services/request";
import { useSession } from "next-auth/react";
import { bytesToSize } from "@/services/helper";
import appConstant from "@/services/appConstant";
import DiscussionsService from "@/services/DiscussionsService";
import { error } from "console";
import SvgIcons from "@/components/SvgIcons";
import { IReplyDrawer } from "./CourseDiscussion";
import { useRouter } from "next/router";
const { Dragger } = Upload;

const QAForm: FC<{
  loadingPage: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  resourceId: number;

  parentCommentId?: number;
  tagCommentId?: number;
  onPost: (comment: string, setComment: (value: string) => void, setLoading: (value: boolean) => void) => void;
}> = ({
  parentCommentId,
  loadingPage,
  placeholder = "Ask a Question",
  style,
  resourceId,
  tagCommentId,

  onPost,
}) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <article className={styles.qa_form} style={style}>
      {loadingPage ? (
        <Skeleton.Input style={{ height: 80, width: 890 }} />
      ) : (
        <Input.TextArea
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              onPost(comment, setComment, setLoading);
            }
          }}
          rows={3}
          className={styles.qa_form_input}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}
      {loadingPage ? (
        <Skeleton.Input style={{ width: 890 }} />
      ) : (
        <Flex align="center" justify="right" className={styles.qa_form_footer}>
          <Space>
            <Button
              type="primary"
              loading={loading}
              className={styles.comment_post_btn}
              style={{ marginTop: 10, marginBottom: 10 }}
              onClick={() => {
                comment === "" ? message.warning("add a comment first") : onPost(comment, setComment, setLoading);
              }}
              title="Post"
            >
              <Flex align="center" gap={10}>
                Post
                {!loading && SvgIcons.send}
              </Flex>
            </Button>
          </Space>
        </Flex>
      )}
    </article>
  );
};

export default QAForm;
