import { FC, useEffect, useState } from "react";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Button, Card, Flex, message, Modal, Space, Tag } from "antd";
import { CourseType, EventAccess, EventMode } from "@prisma/client";
import SvgIcons from "../SvgIcons";
import { capsToPascalCase, convertMillisecondsToDay, convertToMilliseconds, generateDayAndYear } from "@/lib/utils";
import { useSession } from "next-auth/react";
import EventService from "@/services/EventService";
import { useRouter } from "next/router";
import EventRegistrationForm from "./EventsRegistrationForm";
import Link from "next/link";

const EventRegistrationCard: FC<{
  eventMode: EventMode;
  location: string;
  startTime: string;
  endTime: string;
  eventId: number;
  registrationExpired: boolean;
  registrationEndDate: string;
  eventLink: string;
  price: number;
}> = ({
  eventMode,
  location,
  startTime,
  endTime,
  eventId,
  registrationExpired,
  registrationEndDate,
  eventLink,
  price,
}) => {
  const [registrationModal, setRegistrationModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistered, setRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<EventAccess>();

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: user } = useSession();
  const [modal, contextModalHolder] = Modal.useModal();
  const getDuration = convertMillisecondsToDay(convertToMilliseconds(endTime) - convertToMilliseconds(startTime));

  const onRegister = () => {
    if (registrationExpired) {
      return;
    }
    setLoading(true);
    let data = {
      eventId,
    };
    EventService.eventRegistration(
      data,
      (result) => {
        setTimeout(() => {
          setRegistered(true);
          setStatus(result.status);
          setLoading(false);

          modal[result.isRegistered ? "warning" : "success"]({
            title: <h4>{result.message}</h4>,
            content: (
              <Flex align="flex-start" vertical gap={10}>
                <Space align="center" direction="vertical" style={{ width: "100%" }} size={10}>
                  {eventMode === EventMode.OFFLINE ? <p>Your request number is</p> : <p>Your registration number is</p>}
                  <Tag>
                    <h3 style={{ margin: 0, padding: 10 }}>{result.registrationId}</h3>
                  </Tag>
                </Space>
              </Flex>
            ),
          });
        }, 1000);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    EventService.registrationStatus(
      eventId,
      (result) => {
        setRegistered(result.eventRegistered);
        setStatus(result.status);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  }, [router.query.slug]);

  const getRegisterText = (eventMode: EventMode) => {
    switch (eventMode) {
      case EventMode.OFFLINE:
        return "Book your seat";

      case EventMode.ONLINE:
        return "Register now";
    }
  };

  const getAccessText = (access: EventAccess) => {
    switch (access) {
      case EventAccess.ACCEPTED:
        return "Registered";

      case EventAccess.REJECTED:
        return "Rejected";

      default:
        return "Requested";
    }
  };

  return (
    <Card className={styles.event_registration_card_wrapper}>
      {contextHolder}
      {contextModalHolder}
      <Space direction="vertical" className={styles.card_info} size={15}>
        <Flex vertical gap={5}>
          <Flex align="center" gap={5}>
            <i>{SvgIcons.calender}</i>
            <div>Date and Time</div>
          </Flex>
          <h4>{startTime}</h4>
        </Flex>
        <Flex vertical gap={5}>
          <Flex align="center" gap={5}>
            <i>{SvgIcons.clock}</i>
            <div>Duration</div>
          </Flex>
          <h4>{getDuration}</h4>
        </Flex>

        <Flex vertical gap={5}>
          <Flex align="center" gap={5}>
            <i>{SvgIcons.rupeeFileed}</i>
            <div> Price</div>
          </Flex>

          {<h4> {price && price > 0 ? `INR ${price}` : CourseType.FREE}</h4>}
        </Flex>
        <Flex vertical gap={5}>
          <Flex align="center" gap={5}>
            <i>{SvgIcons.location}</i>
            <div>Location</div>
          </Flex>
          {eventMode === EventMode.OFFLINE ? (
            <Link href={eventLink} target="_blank">
              {location}
            </Link>
          ) : (
            <Tag className={styles.event_mode_tag}>{capsToPascalCase(eventMode)}</Tag>
          )}
        </Flex>

        <Flex vertical gap={5}>
          <Flex align="center" gap={5}>
            <i>{SvgIcons.info}</i>
            <div>{registrationExpired ? "Registration closed on" : "Register by"}</div>
          </Flex>
          {<h4>{registrationEndDate}</h4>}
        </Flex>

        {registrationExpired && !isRegistered ? (
          <Button disabled> Registration closed</Button>
        ) : (
          <Button
            onClick={() => {
              user ? onRegister() : setRegistrationModal(true);
            }}
            disabled={isRegistered}
            loading={loading}
            type="primary"
          >
            {isRegistered ? getAccessText(status as EventAccess) : getRegisterText(eventMode)}
          </Button>
        )}
      </Space>
      <EventRegistrationForm
        title={"Event Registration"}
        open={registrationModal}
        onCloseModal={() => {
          setRegistrationModal(false);
        }}
        eventId={eventId}
        setRegistered={setRegistered}
        setLoading={setLoading}
        loading={loading}
      />
    </Card>
  );
};

export default EventRegistrationCard;
