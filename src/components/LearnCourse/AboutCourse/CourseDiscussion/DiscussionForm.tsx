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
  onPost: (comment: string) => void;

  onCloseDrawer?: () => void;
}> = ({
  parentCommentId,
  loadingPage,
  placeholder = "Ask a Question",
  style,
  resourceId,
  tagCommentId,
  onCloseDrawer,
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
              onPost(comment);
              setComment("");
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
            {loading ? (
              <LoadingOutlined rev={undefined} style={{ fontSize: 20, color: "#4096ff" }} spin />
            ) : (
              <Button
                type="primary"
                className={styles.comment_post_btn}
                style={{ marginTop: 10, marginBottom: 10 }}
                onClick={() => {
                  onPost(comment);
                  setComment("");
                }}
                title="Post"
              >
                <Flex align="center" gap={10}>
                  Post
                  {SvgIcons.send}
                </Flex>
              </Button>
            )}
          </Space>
        </Flex>
      )}
    </article>
  );
};

export default QAForm;
