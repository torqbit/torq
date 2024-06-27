import { Avatar, Flex, Input } from "antd";
import { FC, useState } from "react";
import styles from "@/styles/Layout2.module.scss";
import { UserOutlined } from "@ant-design/icons";
import SvgIcons from "../SvgIcons";

interface IConversation {
  name: string;
  image: string;
  comment: string;
  id: number;
  setComment: (comment: string) => void;
  editComment: string;
  onEdit: (conversationId: number, editComment: string) => void;
  commentUser: string;
  user: string;
}

const ConversationCard: FC<IConversation> = ({
  name,
  image,
  comment,
  id,
  setComment,
  editComment,
  onEdit,
  commentUser,
  user,
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editOption, setEditOption] = useState<boolean>(false);

  return (
    <div
      className={styles.cardWrapper}
      onMouseOver={() => setEditOption(true)}
      onMouseLeave={() => setEditOption(false)}
    >
      <Flex align="flex-start" gap={10} className={user === commentUser ? styles.otherUsersComment : ""}>
        <Avatar size={40} src={image} icon={<UserOutlined />} className={styles.user_icon} alt="Profile" />
        <div>
          <Flex align="center" justify={user !== commentUser ? "space-between" : "right"}>
            <h1>{name}</h1>
            {editOption && user === commentUser && (
              <Flex align="center" className={styles.editBtn} justify="right">
                <i onClick={() => setEdit(!edit)}>{edit ? SvgIcons.xMark : SvgIcons.edit}</i>
              </Flex>
            )}
          </Flex>
          <div className={styles.commentWrapper}>
            {edit ? (
              <Input.TextArea
                placeholder="Edit Post"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    onEdit(id, editComment);
                  }
                }}
                className={styles.qa_edit_input}
                // value={editComment}
                onChange={(e) => setComment(e.target.value)}
              />
            ) : (
              <p>{comment}</p>
            )}
          </div>
        </div>
      </Flex>
    </div>
  );
};
export default ConversationCard;
