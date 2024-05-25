import React from "react";
import styles from "@/styles/Dashboard.module.scss";
import Layout2 from "@/components/Layouts/Layout2";
import { useSession } from "next-auth/react";
import { Space, Tag } from "antd";

const GuidesPage = () => {
  const { data: user } = useSession();

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <div className={styles.guide_wrapper}>
          <h2>Hello {user?.user?.name}</h2>
          <Space style={{ marginTop: 30, marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Guides</h3>
            <Tag>Coming Soon</Tag>
          </Space>

          <p className={styles.guide_wrapper}>A collection of articles, guides and tutorials for the reading minds.</p>
          <img height={400} src="/img/guides/guide-illustration.svg" alt="" style={{ display: "block" }} />
        </div>
      </section>
    </Layout2>
  );
};

export default GuidesPage;
