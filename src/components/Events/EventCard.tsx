import { IEventList } from "@/services/EventService";
import { FC } from "react";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Button, Card, Flex, Space, Tag } from "antd";
import { EventMode } from "@prisma/client";
import Link from "next/link";

const EventCard: FC<{
  eventDetail: IEventList;
  eventLink: string;
  registrationExpired: boolean;
  isRegister?: boolean;
}> = ({ eventDetail, eventLink, isRegister, registrationExpired }) => {
  return (
    <Card className={styles.event_card}>
      <div className={styles.event_card_wrapper}>
        <div className={styles.card_info}>
          <div>
            <img src={eventDetail.banner} alt="banner" />

            <Space direction="vertical" className={styles.content_wrapper} size={8}>
              <Flex align="center" gap={10}>
                <Tag bordered={false} color="processing" className={styles.tag}>
                  {eventDetail.eventType}
                </Tag>
                {registrationExpired && !isRegister && (
                  <Tag className={styles.tag} bordered={false} color="warning">
                    Registration closed
                  </Tag>
                )}
              </Flex>

              <h4>{eventDetail.title}</h4>
              <p>{eventDetail.startTime}</p>
              {eventDetail.eventMode === EventMode.ONLINE ? (
                <Tag bordered={false} color="warning" className={styles.tag}>
                  {eventDetail.eventMode}
                </Tag>
              ) : (
                <Flex align="center" gap={10}>
                  <span>{eventDetail.location}</span> <div className={styles.dot}></div>{" "}
                  <Tag bordered={false} color="warning">
                    {eventDetail.eventMode}
                  </Tag>
                </Flex>
              )}
            </Space>
          </div>
          <Link href={`/${eventLink}/${eventDetail.slug}`}>
            <Button type={"primary"}>View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
