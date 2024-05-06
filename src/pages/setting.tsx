import React, { FC } from "react";
import styleLayout from "../styles/Dashboard.module.scss";
import styles from "@/styles/Profile.module.scss";
import { getSession, useSession } from "next-auth/react";
import Layout2 from "@/components/Layout2/Layout2";
import { Button, Form, Input, Tabs, TabsProps, message } from "antd";

import { postFetch, IResponse } from "@/services/request";
import { GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";

const ProfileSetting: FC<{ user: Session }> = ({ user }) => {
  const onUpdateProfile = async (info: { name: string; phone: string }) => {
    const res = await postFetch({ name: info.name, userId: user?.id, phone: info.phone }, "/api/user/update");
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      message.success(result.message);
      window.location.reload();
    } else {
      message.error(result.error);
    }
  };
  return (
    <section className={styles.user_profile_page}>
      <div className={styles.content_center}>
        <div className={styles.left_content}>
          <img
            className={styles.user_profile_pic}
            src={user?.user?.image ? user?.user?.image : "/img/profile/profile-circle-svgrepo-com.svg"}
            alt=""
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
              <Button type="primary" htmlType="submit" className={styles.update_profile_btn}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};

const Setting: NextPage = () => {
  const { data: user } = useSession();

  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile",
      children: user && <ProfileSetting user={user} />,
    },
  ];
  return (
    <Layout2>
      <section className={styleLayout.setting_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Setting</h3>

        <Tabs defaultActiveKey="1" className="content_tab" items={items} onChange={onChange} />
      </section>
    </Layout2>
  );
};

export default Setting;
