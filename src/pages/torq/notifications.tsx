import React, { FC, useState } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Avatar, Badge, List, Space, Tabs, TabsProps, message } from "antd";
import Layout2 from "@/components/Layout2/Layout2";
import { IResponse, getFetch } from "@/services/request";
import { useAppContext } from "@/components/ContextApi/AppContext";
import Link from "next/link";
import { truncateString } from "@/services/helper";
import moment from "moment";

const NotificationList: FC = () => {
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const { globalState, dispatch } = useAppContext();
  const { notifications } = globalState;

  const getNotification = async (userId: number) => {
    try {
      setLoading(true);
      const res = await getFetch(`/api/notification/get/${user?.id}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        dispatch({ type: "SET_NOTIFICATION", payload: result.notifications });
        setLoading(false);
      } else {
        message.error(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      message.error("Something went wrong. Please try again");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?.id) {
      getNotification(user.id);
    }
  }, [user]);
  return (
    <List
      size="small"
      loading={loading}
      header={false}
      footer={false}
      bordered={false}
      dataSource={notifications}
      className={styles.enrolled_course_list}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Badge color="blue" dot={!item.isView}>
                <Avatar src={item.fromUser.image} />
              </Badge>
            }
            title={
              <Link href="#">
                {item.fromUser.name}
                {" : "}
                {item.notificationType === "COMMENT" ? (
                  <span>
                    Reply on QA{" "}
                    <i style={{ color: "#666" }}>{truncateString(item?.tagComment?.comment as string, 20)}</i>
                  </span>
                ) : (
                  ""
                )}
              </Link>
            }
            description={item.comment.comment}
          />
          <span style={{ color: "#68696d" }}>{moment(new Date(item.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}</span>
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
