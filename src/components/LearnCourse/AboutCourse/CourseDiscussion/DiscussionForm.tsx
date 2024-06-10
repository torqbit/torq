import { Button, Flex, Skeleton } from "antd";
import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Input, Space, message } from "antd";
import SvgIcons from "@/components/SvgIcons";

const QAForm: FC<{
  loadingPage: boolean;
  style?: React.CSSProperties;
  placeholder?: string;

  onPost: (comment: string, setComment: (value: string) => void, setLoading: (value: boolean) => void) => void;
}> = ({
  loadingPage,
  placeholder = "Ask a Question",
  style,

  onPost,
}) => {
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
