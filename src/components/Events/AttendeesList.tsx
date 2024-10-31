import { Button, Dropdown, Flex, Form, FormInstance, message, Modal, Radio, Select, Table } from "antd";
import { FC, useState } from "react";
import EventService, { IAccessInfo, IAttendessInfo, IEventCertificateInfo } from "@/services/EventService";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";
import { CaretDownOutlined } from "@ant-design/icons";
import TextEditor from "../Editor/Quilljs/Editor";
import { EventAccess } from "@prisma/client";
import { capsToPascalCase } from "@/lib/utils";
import styles from "@/styles/Marketing/Events/Event.module.scss";

const AttendeesList: FC<{
  attendeesList: IAttendessInfo[];
  loading: boolean;
  generateCertificate: (certificateInfo: IEventCertificateInfo) => void;
  onMarkAttended?: (eventId: number, email: string) => void;
  setOpen: (value: boolean) => void;
  openModal: boolean;
  accessLoading: boolean;
  handlePermission: (accessInfo: IAccessInfo) => void;
  form: FormInstance;
}> = ({
  attendeesList,
  loading,
  onMarkAttended,
  generateCertificate,
  setOpen,
  openModal,
  accessLoading,
  handlePermission,
  form,
}) => {
  const router = useRouter();
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [accessInfo, setAccessInfo] = useState<IAccessInfo>();

  const handleCertificate = (eventInfo: IAttendessInfo) => {
    generateCertificate({
      email: eventInfo.email,
      name: eventInfo.name,
      eventId: Number(router.query.eventId),
      registrationId: eventInfo.id,
    });
  };

  const columns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "EMAIL",
      dataIndex: "email",

      key: "email",
      align: "center",
    },
    {
      title: "REGISTRATION DATE",
      dataIndex: "registrationDate",
      key: "registrationDate",
      align: "center",
    },
    {
      title: "ISSUED CERTIFICATE",
      dataIndex: "certificate",
      key: "certificate",
      align: "center",
    },
    {
      title: "ACCESS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_: any, eventInfo: IAttendessInfo) => <>{capsToPascalCase(eventInfo.status)}</>,
    },

    {
      title: "ACTIONS",
      dataIndex: "actions",
      align: "center",

      render: (_: any, eventInfo: IAttendessInfo) => (
        <>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: eventInfo.certificate === "Yes" ? "Send" : "Generate certificate",
                  onClick: () => {
                    handleCertificate(eventInfo);
                  },
                },
                {
                  key: "2",
                  disabled: eventInfo.attended,
                  style: { display: eventInfo.attended ? "none" : "block" },
                  label: "Mark as attended",
                  onClick: () => {
                    onMarkAttended && onMarkAttended(Number(router.query.eventId), eventInfo.email);
                  },
                },
                {
                  key: "3",
                  label: "Grant access",
                  onClick: () => {
                    setAccessInfo({
                      name: eventInfo.name,
                      email: eventInfo.email,
                      eventId: Number(router.query.eventId),
                      status: eventInfo.status,
                      comment: eventInfo.comment,
                    });
                    setDefaultValue(eventInfo.comment);
                    setOpen(true);
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

  return (
    <>
      <Table size="small" columns={columns} dataSource={attendeesList} loading={loading} />
      <Modal
        confirmLoading={accessLoading}
        open={openModal}
        onCancel={() => {
          setOpen(false);

          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={() => {
            handlePermission({
              ...accessInfo,
              comment: defaultValue === "<p><br></p>" ? null : defaultValue,
            } as IAccessInfo);
          }}
          requiredMark={false}
          initialValues={{
            status: accessInfo?.status,
          }}
        >
          <Form.Item
            name="status"
            label={<h4>Grant Access</h4>}
            rules={[
              {
                required: true,
                message: "Required access",
              },
            ]}
          >
            <Flex align="center" gap={10}>
              <Radio
                checked={accessInfo?.status === EventAccess.ACCEPTED}
                onChange={(value) => {
                  setAccessInfo({ ...accessInfo, status: EventAccess.ACCEPTED } as IAccessInfo);
                }}
              >
                Accepted
              </Radio>
              <Radio
                checked={accessInfo?.status === EventAccess.REJECTED}
                onChange={(value) => {
                  setAccessInfo({ ...accessInfo, status: EventAccess.REJECTED } as IAccessInfo);
                }}
              >
                Rejected
              </Radio>
            </Flex>
          </Form.Item>
          <Form.Item label="Comment">
            <div className={styles.event_access_comment}>
              <TextEditor
                defaultValue={defaultValue as string}
                handleDefaultValue={setDefaultValue}
                readOnly={false}
                borderRadius={8}
                height={100}
                theme="bubble"
                placeholder={`Add comments`}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AttendeesList;
