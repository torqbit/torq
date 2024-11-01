import { Dropdown, message, Modal, Table } from "antd";
import { useEffect, useState } from "react";

import { StateType } from "@prisma/client";
import EventService, { IEventListTable } from "@/services/EventService";
import { useRouter } from "next/router";
import SvgIcons from "../SvgIcons";
import Link from "next/link";

const EventList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<IEventListTable[]>([]);
  const router = useRouter();
  const [modal, modelContextHolder] = Modal.useModal();

  const updateEventState = async (state: StateType, id: number) => {
    EventService.updateEvent(
      { state, id },
      (result) => {
        messageApi.success(result.message);
        getEventList();
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const deleteEvent = async (id: number) => {
    EventService.deleteEvent(
      id,
      (result) => {
        messageApi.success(result.message);
        getEventList();
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const columns: any = [
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",

      render: (_: any, detail: IEventListTable) => {
        return <Link href={`/admin/content/events/${detail.id}/details`}>{detail.title}</Link>;
      },
    },

    {
      title: "START TIME",
      dataIndex: "startTime",

      key: "startTime",
      align: "center",
    },
    {
      title: "END TIME",
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
    },
    {
      title: "MODE",
      dataIndex: "mode",
      key: "mode",
      align: "center",
    },
    {
      title: "EVENT TYPE",
      dataIndex: "eventType",
      key: "eventType",
      align: "center",
    },
    {
      title: "STATE",
      dataIndex: "state",
      key: "state",
      align: "center",
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      align: "center",

      render: (_: any, eventInfo: IEventListTable) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    router.push(`/admin/content/events/edit/${eventInfo.id}`);
                  },
                },
                {
                  key: "2",
                  label: eventInfo.state == StateType.DRAFT ? "Publish" : "Move to Draft",
                  onClick: () => {
                    updateEventState(
                      eventInfo.state == StateType.DRAFT ? StateType.ACTIVE : StateType.DRAFT,
                      eventInfo.id
                    );
                  },
                },

                {
                  key: "3",
                  label: "Delete",
                  onClick: () => {
                    modal.confirm({
                      title: "Are you sure you want to delete the Event?",
                      okText: "Yes",
                      cancelText: "No",
                      onOk: () => {
                        deleteEvent(eventInfo.id);
                      },
                    });
                  },
                },
              ],
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "key",
    },
  ];

  const getEventList = () => {
    setLoading(true);
    try {
      EventService.listEvents(
        (result) => {
          setData(result.totalEvents);
          setLoading(false);
        },
        (error) => {
          messageApi.error({
            content: error,
          });
          setLoading(false);
        }
      );
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventList();
  }, []);

  return (
    <div>
      {contextHolder}
      {modelContextHolder}
      <Table size="small" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default EventList;
