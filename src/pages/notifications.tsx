import React, { FC, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Avatar, Badge, Button, Flex, List, Skeleton } from "antd";
import Layout2 from "@/components/Layouts/Layout2";
import Link from "next/link";
import { truncateString } from "@/services/helper";
import moment from "moment";
import NotificationService from "@/services/NotificationService";
import ReplyDrawer from "@/components/LearnCourse/AboutCourse/CourseDiscussion/ReplyDrawer";
import { IReplyDrawer } from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { INotification } from "@/lib/types/discussions";
import { DummydataList } from "@/lib/dummyData";

const NotificationList: FC = () => {
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDatatLoading] = useState<boolean>();
  const [allNotificationRender, setAllNotificationRender] = useState<boolean>();
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
    sltCommentId: 0,
  });

  const [notifications, setNotifications] = useState<INotification[]>();
  const [notificationsList, setNotificationsList] = useState<INotification[]>();

  const [selectedNotification, setSelectedNotification] = useState<INotification>();

  const showReplyDrawer = (item?: INotification) => {
    !replyDrawer.isOpen &&
      setReplyDrawer({
        isOpen: true,
        sltCommentId: Number(item?.tagCommentId),
      });
    setSelectedNotification(item);
    updateNotification();
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: 0 });
  };

  const getNotification = async () => {
    try {
      setLoading(true);

      NotificationService.getNotification(
        0,
        10,
        (result) => {
          setNotifications(result.notifications);
          setNotificationsList(result.notifications);
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
            getNotification();
          },
          (error) => {}
        );
    } catch (err) {}
  };

  const onLoadMore = () => {
    DummydataList && setNotificationsList(notificationsList?.concat(DummydataList) as INotification[]);

    NotificationService.getNotification(
      notificationsList?.length,
      5,
      (result) => {
        notificationsList?.filter((n) => n.loading === true);
        notifications && setNotificationsList(notificationsList?.concat(result.notifications));
      },
      (err) => {
        notificationsList?.filter((n) => n.loading === true);
        notifications && setNotificationsList(notificationsList);

        setAllNotificationRender(true);
      }
    );

    setDatatLoading(false);
  };

  React.useEffect(() => {
    if (user?.id) {
      getNotification();
    }
  }, [user?.id]);

  const loadMore =
    !dataLoading && !loading ? (
      <>
        {!allNotificationRender && (
          <Flex style={{ marginTop: 20 }} align="center" justify="center">
            <Button
              type="primary"
              onClick={() => {
                onLoadMore();
              }}
            >
              loading more
            </Button>
          </Flex>
        )}
      </>
    ) : null;

  return (
    <List
      size="small"
      loading={loading}
      header={false}
      footer={false}
      loadMore={loadMore}
      bordered={false}
      dataSource={notificationsList}
      className={styles.notifications_list}
      renderItem={(item, index) => (
        <List.Item
          onClick={() => {
            console.log(item, "itme");

            showReplyDrawer(item);
          }}
          className={styles.notification_bar}
        >
          {" "}
          <Skeleton avatar title={false} loading={item.loading} active>
            <Flex align="center" justify="space-between">
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
            </Flex>
          </Skeleton>
          <ReplyDrawer
            replyDrawer={replyDrawer}
            onCloseDrawer={onCloseDrawer}
            resourceId={Number(selectedNotification?.resourceId)}
            fetchAllDiscussion={() => {}}
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
