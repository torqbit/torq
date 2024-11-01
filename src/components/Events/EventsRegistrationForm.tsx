import EventService from "@/services/EventService";
import { Button, Flex, Form, Input, InputNumber, message, Modal, Space, Tag } from "antd";
import { FC, useState } from "react";

const EventRegistrationForm: FC<{
  title: string;
  open: boolean;
  onCloseModal: () => void;
  eventId: number;
  setRegistered: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  loading: boolean;
}> = ({ title, open, onCloseModal, setRegistered, eventId, setLoading, loading }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextModalHolder] = Modal.useModal();

  const onRegister = () => {
    setLoading(true);
    EventService.eventRegistration(
      { ...form.getFieldsValue(), eventId },
      (result) => {
        setTimeout(() => {
          setRegistered(true);
          setLoading(false);
          form.resetFields();
          onCloseModal();

          modal[result.isRegistered ? "warning" : "success"]({
            title: <h4>{result.message}</h4>,

            content: (
              <Flex align="flex-start" vertical gap={10}>
                <Space align="center" direction="vertical" style={{ width: "100%" }} size={10}>
                  <p>Your registration number is</p>
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
        form.resetFields();
        onCloseModal();
      }
    );
  };
  return (
    <>
      {contextModalHolder}
      <Modal
        maskClosable={false}
        title={<div>{title}</div>}
        open={open}
        footer={null}
        onCancel={() => {
          onCloseModal();
          form.resetFields();
        }}
      >
        {contextHolder}
        <Form autoComplete="off" layout="vertical" form={form} onFinish={onRegister} requiredMark={false}>
          <Form.Item label="Enter your name" name="name" rules={[{ required: true, message: " Enter name" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Enter your email " name="email" rules={[{ required: true, message: "Enter email" }]}>
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Enter your phone number"
            name="phone"
            rules={[
              { required: true, message: "Enter phone" },
              { type: "number", min: 1000000000, max: 9999999999, message: "Invalid phone number" },
            ]}
          >
            <InputNumber type="number" style={{ width: "100%" }} addonBefore="+91" placeholder="9999000099" />
          </Form.Item>
          <Button loading={loading} htmlType="submit" type="primary">
            Register
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EventRegistrationForm;
