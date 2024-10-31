import { EventMode, EventType } from "@prisma/client";
import { FC } from "react";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Card, Flex, Space, Tag } from "antd";

const EventTitleCard: FC<{ title: string; organiser: string; eventType: EventType; eventMode: EventMode }> = ({
  title,
  organiser,
  eventType,
  eventMode,
}) => {
  return (
    <Card className={styles.event_title_card}>
      <Space direction="vertical" size={15}>
        <Flex align="center" gap={10}>
          <Tag bordered={false} color="processing">
            {eventType}
          </Tag>
          <Tag bordered={false} color="warning">
            {eventMode}
          </Tag>
        </Flex>

        <h2>{title}</h2>
        <p>by {organiser}</p>
      </Space>
    </Card>
  );
};
export default EventTitleCard;
