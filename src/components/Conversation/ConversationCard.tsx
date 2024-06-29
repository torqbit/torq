import { Avatar, Button, Flex, Input, Space } from "antd";
import { FC, useState } from "react";
import styles from "@/styles/Layout2.module.scss";
import { UserOutlined } from "@ant-design/icons";

interface IConversation {
  name: string;
  image: string;
  comment: string[];

  commentUser: string;
  user: string;

  contentWidth: String;
}

const ConversationCard: FC<IConversation> = ({
  name,
  image,
  comment,

  commentUser,
  user,

  contentWidth,
}) => {
  const baseWidth = 40; // Base width per character (adjust as needed)

  return (
    <div className={styles.cardWrapper}>
      <Flex align="flex-start" gap={10} className={user === commentUser ? styles.otherUsersComment : ""}>
        <Avatar size={40} src={image} icon={<UserOutlined />} className={styles.user_icon} alt="Profile" />
        <Flex vertical justify={commentUser === user ? "right" : ""}>
          <Flex align="center" justify={user !== commentUser ? "space-between" : "right"}>
            <div className={styles.name}>{name}</div>
          </Flex>
          <Flex
            vertical
            gap={10}
            align={commentUser === user ? "flex-end" : "flex-start"}
            style={{ maxWidth: `${contentWidth}` }}
          >
            {comment?.map((c, i) => {
              const calculatedWidth = baseWidth * c.length;
              return (
                <div key={i} className={styles.commentWrapper} style={{ maxWidth: `${calculatedWidth}px` }}>
                  <p>{c}</p>
                </div>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
export default ConversationCard;
