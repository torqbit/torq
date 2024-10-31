import { Flex } from "antd";
import { FC } from "react";
import SvgIcons from "../SvgIcons";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { EventRegistation } from "@prisma/client";
import { IAttendessInfo } from "@/services/EventService";

const AttendeesCard: FC<{ attendees: IAttendessInfo }> = ({ attendees }) => {
  return (
    <div className={styles.attendees_card_wrapper}>
      <Flex align="center" justify="space-between">
        <div>
          <h4>{attendees.name}</h4>
          <p>{attendees?.email}</p>
        </div>
        {attendees.attended && <i>{SvgIcons.checkFilled}</i>}
      </Flex>
    </div>
  );
};

export default AttendeesCard;
