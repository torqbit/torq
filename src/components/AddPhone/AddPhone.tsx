import { IResponse, postFetch } from "@/services/request";
import { Button, Form, FormInstance, InputNumber, message, Modal } from "antd";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { useAppContext } from "../ContextApi/AppContext";

const AddPhone: FC<{
  title: string;
  open: boolean;
  onCloseModal: () => void;
}> = ({ title, onCloseModal, open }) => {
  const { data: user, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const addPhone = async () => {
    const res = await postFetch({ phone: form.getFieldsValue().phone }, "/api/user/update");
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      update({
        phone: form.getFieldsValue().phone,
      });
      dispatch({ type: "SET_USER", payload: { ...globalState.session, phone: form.getFieldsValue().phone } });
      onCloseModal();
      messageApi.success(result.message);
    } else {
      console.log(result.error);
      messageApi.error(result.error);
    }
  };
  return (
    <Modal title={<div>{title}</div>} open={open} footer={null} onCancel={onCloseModal}>
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        onFinish={addPhone}
        initialValues={{
          phone: Number(user?.phone),
        }}
      >
        <Form.Item
          label="Enter your phone number"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone" },
            { type: "number", min: 1000000000, max: 9999999999, message: "Invalid phone number" },
          ]}
        >
          <InputNumber addonBefore="+91" placeholder="9999000099" />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
export default AddPhone;
