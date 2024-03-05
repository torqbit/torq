import React, { use, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { Button, Form, Input, Spin, message } from "antd";
import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { IResponse, postFetch } from "@/services/request";
import { Session } from "next-auth";
import { GetServerSidePropsContext } from "next";

interface IProps {
  session: Session;
}

const profile = (props: IProps) => {
  const { session } = props;

  const onUpdateProfile = async (info: { name: string; phone: string }) => {
    const res = await postFetch({ name: info.name, userId: session?.id, phone: info.phone }, "/api/user/update");
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      message.success(result.message);
      window.location.reload();
    } else {
      message.error(result.error);
    }
  };

  return (
    <Layout>
      {session ? (
        <section className={styles.user_profile_page}>
          <div className={styles.content_center}>
            <div className={styles.left_content}>
              <img
                className={styles.user_profile_pic}
                src={session?.user?.image ? session?.user?.image : "/img/profile/profile-circle-svgrepo-com.svg"}
                alt=""
              />
            </div>
            <div className={styles.right_content}>
              <h2 className={styles.page_title}>Profile</h2>

              <Form
                className={styles.user_profile_form}
                initialValues={{
                  name: session?.user?.name,
                  email: session?.user?.email,
                  phone: session?.phone,
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
      ) : (
        <Spin tip="profile loading" fullscreen />
      )}
    </Layout>
  );
};

export default profile;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getSession(ctx);
  return {
    props: {
      session: user,
    },
  };
};
