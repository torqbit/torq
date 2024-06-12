import React, { FC, useEffect, useState } from "react";
import styleLayout from "../styles/Dashboard.module.scss";
import styles from "@/styles/Profile.module.scss";
import { useSession } from "next-auth/react";
import Layout2 from "@/components/Layouts/Layout2";
import { Button, Form, Input, Tabs, Spin, TabsProps, message, Avatar } from "antd";
import { postFetch, IResponse } from "@/services/request";
import { NextPage } from "next";
import { Session } from "next-auth";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { useAppContext } from "@/components/ContextApi/AppContext";
import appConstant from "@/services/appConstant";
import { UserOutlined } from "@ant-design/icons";

const ProfileSetting: FC<{ user: Session; onUpdateProfile: (info: { name: string; phone: string }) => void }> = ({
  user,
  onUpdateProfile,
}) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  useEffect(() => {
    setPageLoading(true);
    if (user) {
      setPageLoading(false);
    }
  }, []);

  return (
    <>
      {pageLoading ? (
        <>
          <SpinLoader />
        </>
      ) : (
        <section className={styles.user_profile_page}>
          <div className={styles.content_center}>
            <div className={styles.left_content}>
              <Avatar
                className={styles.user_profile_pic}
                src={user.user?.image}
                icon={<UserOutlined style={{ fontSize: 100, marginTop: 35 }} size={400} />}
              />
            </div>
            <div className={styles.right_content}>
              <Form
                className={styles.user_profile_form}
                initialValues={{
                  name: user?.user?.name,
                  email: user?.user?.email,
                  phone: user?.phone,
                }}
                onFinish={onUpdateProfile}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required Name" }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input placeholder="Email" disabled={true} />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input placeholder="Phone" min={0} maxLength={12} />
                </Form.Item>
                <Form.Item noStyle>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

const Setting: NextPage = () => {
  const { data: user, update } = useSession();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const { dispatch, globalState } = useAppContext();

  const onChange = (key: string) => {};
  const onUpdateProfile = async (info: { name: string; phone: string }) => {
    const res = await postFetch({ name: info.name, userId: user?.id, phone: info.phone }, "/api/user/update");
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      update(info);

      dispatch({ type: "SET_USER", payload: { name: info.name, phone: info.phone, theme: globalState.theme } });
      messageApi.success(result.message);
    } else {
      messageApi.error(result.error);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile",
      children: user && <ProfileSetting user={user} onUpdateProfile={onUpdateProfile} />,
    },
  ];

  return (
    <Layout2>
      {contextMessageHolder}

      <section className={styleLayout.setting_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Setting</h3>

        <Tabs defaultActiveKey="1" className="content_tab" items={items} onChange={onChange} />
      </section>
    </Layout2>
  );
};

export default Setting;
