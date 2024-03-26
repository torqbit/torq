import { FC } from "react";
import styles from "@/styles/Config.module.scss";
import { Button, Flex, Form, FormInstance, Input, Space } from "antd";
import SvgIcons from "@/components/SvgIcons";

const MediaStorage: FC<{ form: FormInstance; onFinish: () => void; loading: boolean }> = ({
  form,
  onFinish,
  loading,
}) => {
  return (
    <section className={styles.media_storage}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className={styles.header}>
          <h4>Media Storage</h4>
          <Space>
            <Button>Discard</Button>
            <Button loading={loading} className={styles.submit_btn} type="primary" htmlType="submit">
              <div> Save Config</div>
              {SvgIcons.arrowRight}
            </Button>
          </Space>
        </div>
        <p>Configure the service provider responsible for storing and serving the videos and images.</p>
        <div className={styles.form_wrapper}>
          <div className={styles.storage}>
            <h4>Configure Video Storage - Bunny.net</h4>
            <Form.Item name={"access_key"} label={"API Access Key"} rules={[{ required: true, message: "Required!" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"library_id"}
              label={"Video Library Id"}
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className={styles.storage}>
            <h4>Configure image Storage - Bunny.net</h4>
            <Form.Item
              name={"access_password"}
              label={"Storage Access Password"}
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"storage_zone"} label={"Storage Zone"} rules={[{ required: true, message: "Required!" }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"media_path"} label={"Media Path"} rules={[{ required: true, message: "Required!" }]}>
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </section>
  );
};

export default MediaStorage;
