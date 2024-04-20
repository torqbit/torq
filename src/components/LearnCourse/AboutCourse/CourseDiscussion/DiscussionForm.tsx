import { Badge, Skeleton, UploadFile, UploadProps } from "antd";
import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Input, Modal, Space, Tooltip, message, Upload } from "antd";
import { LoadingOutlined, InboxOutlined } from "@ant-design/icons";
import Image from "next/image";
import { IResponse, postWithFile } from "@/services/request";
import { useSession } from "next-auth/react";
import { bytesToSize } from "@/services/helper";
import appConstant from "@/services/appConstant";
const { Dragger } = Upload;

const QAForm: FC<{
  loadingPage: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  onRefresh: () => void;
  resourceId: number;
  toUserId?: number;
  parentCommentId?: number;
  tagCommentId?: number;
}> = ({
  parentCommentId,
  loadingPage,
  placeholder = "Ask a Question",
  style,
  onRefresh,
  resourceId,
  tagCommentId,
  toUserId,
}) => {
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [attachModal, setAttachModal] = useState<{ isOpen: boolean; caption: string; fileList: UploadFile[] }>({
    isOpen: false,
    caption: "",
    fileList: [],
  });

  const onPostQA = async () => {
    try {
      if (!comment) return;
      setLoading(true);

      const formData = new FormData();
      attachModal.fileList.forEach(async (file: any) => {
        formData.append("files", file);
      });
      formData.append("comment", comment);
      formData.append("resourceId", resourceId.toString());
      formData.append("parentCommentId", `${parentCommentId}`);
      formData.append("tagCommentId", `${tagCommentId}`);
      formData.append("caption", attachModal.caption);
      formData.append("toUserId", `${toUserId}`);
      const postRes = await postWithFile(formData, `/api/qa-discussion/add/${session?.id}`);
      const result = (await postRes.json()) as IResponse;
      if (postRes.ok && result.success) {
        message.success("Comment Added");
        onRefresh();
        setComment("");
        onCloseModal();
      } else {
        message.error(result.error);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const onAttachfile = () => {
    setAttachModal({ ...attachModal, isOpen: true });
  };

  const onCloseModal = () => {
    setAttachModal({ ...attachModal, isOpen: false, fileList: [], caption: "" });
  };

  const props: UploadProps = {
    multiple: true,
    accept: ".png,.jpg,.jpeg",
    onRemove: (file) => {
      const index = attachModal.fileList.indexOf(file);
      const newFileList = attachModal.fileList.slice();
      newFileList.splice(index, 1);
      setAttachModal({ ...attachModal, fileList: newFileList });
    },
    onChange: (file) => {},
    beforeUpload: (file, fileList) => {
      // 5MB
      if (file.size > 5242880) {
        message.info(`File size should not more than ${bytesToSize(5242880)}`);
        return false;
      }
      setAttachModal({ ...attachModal, fileList: fileList });
      return false;
    },
    fileList: attachModal.fileList,
  };

  return (
    <article className={styles.qa_form} style={style}>
      {loadingPage ? (
        <Skeleton.Input style={{ height: 80, width: 890 }} />
      ) : (
        <Input.TextArea
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              onPostQA();
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
        <div className={styles.qa_form_footer}>
          <Space>
            <Tooltip title="Attach File">
              <Badge count={attachModal.fileList.length} size="small" color="green">
                <Image
                  src="/img/comment-icons/attachcircle.svg"
                  onClick={onAttachfile}
                  alt="Attach_file"
                  width={25}
                  height={25}
                />
              </Badge>
            </Tooltip>
            {loading ? (
              <LoadingOutlined rev={undefined} style={{ fontSize: 20, color: "#4096ff" }} spin />
            ) : (
              <Tooltip title="Post">
                <Image
                  src="/img/comment-icons/send2.svg"
                  alt="Send"
                  width={25}
                  height={25}
                  onClick={() => onPostQA()}
                />
              </Tooltip>
            )}
          </Space>
        </div>
      )}
      <Modal
        title="Attach File"
        open={attachModal.isOpen}
        okText="Attach"
        onOk={() => setAttachModal({ ...attachModal, isOpen: false })}
        onCancel={onCloseModal}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined rev={undefined} />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </Dragger>
        <Input
          placeholder="Caption"
          style={{ marginTop: 20 }}
          value={attachModal.caption}
          onChange={(e) => setAttachModal({ ...attachModal, caption: e.target.value })}
        />
      </Modal>
    </article>
  );
};

export default QAForm;
