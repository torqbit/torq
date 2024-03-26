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
            <Button className={styles.submit_btn} type="primary" htmlType="submit">
              <div> Save Config</div>
              {SvgIcons.arrowRight}
            </Button>
          </Space>
        </div>
        <p>Configure the service provider responsible for storing and serving the videos and images.</p>
        <div className={styles.form_wrapper}>
          <div className={styles.storage}>
            <h4>Configure Video Storage - Bunny.net</h4>
            <Form.Item name={"accessKey"} label={"API Access Key"} rules={[{ required: true, message: "Required!" }]}>
              <Input type="password" placeholder="Please enter  access key" />
            </Form.Item>
            <Form.Item name={"libraryId"} label={"Video Library Id"} rules={[{ required: true, message: "Required!" }]}>
              <Input type="password" placeholder="Please enter video library Id" />
            </Form.Item>
          </div>
          <div className={styles.storage}>
            <h4>Configure image Storage - Bunny.net</h4>
            <Form.Item
              name={"accessPassword"}
              label={"Storage Access Password"}
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input type="password" placeholder="Please enter storage access password" />
            </Form.Item>
            <Form.Item name={"storageZone"} label={"Storage Zone"} rules={[{ required: true, message: "Required!" }]}>
              <Input placeholder="Please enter storage zone" />
            </Form.Item>
            <Form.Item name={"mediaPath"} label={"Media Path"} rules={[{ required: true, message: "Required!" }]}>
              <Input placeholder="Please enter media path" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </section>
  );
};

export default MediaStorage;
