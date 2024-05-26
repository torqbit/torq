import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Avatar, Badge, List } from "antd";
import Layout2 from "@/components/Layouts/Layout2";
import { useAppContext } from "@/components/ContextApi/AppContext";
import Link from "next/link";
import { truncateString } from "@/services/helper";
import moment from "moment";
import NotificationService from "@/services/NotificationService";
import ReplyDrawer from "@/components/LearnCourse/AboutCourse/CourseDiscussion/ReplyDrawer";
import { IReplyDrawer } from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { INotification } from "@/lib/types/discussions";

const NotificationList: FC = () => {
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const { globalState, dispatch } = useAppContext();
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
    sltCommentId: 0,
  });
  const { notifications } = globalState;
  const [selectedNotification, setSelectedNotification] = useState<INotification>();

  const showReplyDrawer = () => {
    !replyDrawer.isOpen &&
      setReplyDrawer({
        isOpen: true,
        sltCommentId: Number(selectedNotification?.tagCommentId),
      });
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: 0 });
  };

  const getNotification = async () => {
    try {
      setLoading(true);

      NotificationService.getNotification(
        (result) => {
          dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.log(err);

      setLoading(false);
    }
  };

  const updateNotification = async () => {
    try {
      user?.id &&
        NotificationService.updateNotification(
          Number(selectedNotification?.id),
          (result) => {
            dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
          },
          (error) => {}
        );
    } catch (err) {}
  };

  React.useEffect(() => {
    if (user?.id) {
      getNotification();
    }
  }, [user?.id]);
  return (
    <List
      size="small"
      loading={loading}
      header={false}
      footer={false}
      bordered={false}
      dataSource={notifications}
      className={styles.notifications_list}
      renderItem={(item, index) => (
        <List.Item
          onClick={() => {
            setSelectedNotification(item);
            showReplyDrawer();
          }}
        >
          <List.Item.Meta
            avatar={
              <Badge color="blue" dot={!item.isView}>
                <Avatar src={item.fromUser.image} />
              </Badge>
            }
            title={
              <Link href="#">
                <span className={styles.title}> {item.fromUser.name}</span>
                {item.notificationType === "COMMENT" ? (
                  <span className={styles.reply_text}>
                    replied on Question {" : "}
                    <span>{truncateString(item?.tagComment?.comment as string, 20)}</span>
                  </span>
                ) : (
                  ""
                )}
              </Link>
            }
            description={<span className={styles.description_text}>{item.comment.comment} </span>}
          />
          <span>{moment(new Date(item.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}</span>
          <ReplyDrawer
            replyDrawer={replyDrawer}
            onCloseDrawer={onCloseDrawer}
            resourceId={Number(selectedNotification?.resourceId)}
            onReplyRefresh={() => {}}
            updateNotification={updateNotification}
          />
        </List.Item>
      )}
    />
  );
};

const Dashboard: FC = () => {
  const { data: user } = useSession();

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Notification</h3>

        <NotificationList />
      </section>
    </Layout2>
  );
};

export default Dashboard;
