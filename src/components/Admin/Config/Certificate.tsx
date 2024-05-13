import { certificateConfig } from "@/lib/certificatesConfig";
import styles from "@/styles/Certificate.module.scss";
import { Flex, Image, Space } from "antd";

const CertificateTemplates = () => {
  return (
    <section className={styles.Certificate_template_container}>
      <h1>Certificate templates</h1>
      <Flex align="center" gap={20}>
        {certificateConfig.map((certificate, i) => {
          return (
            <Space direction="vertical" key={i} className={styles.certificate_wrapper}>
              <Image
                height={150}
                width={220}
                className={styles.image_wrapper}
                src={certificate.previewPath}
                alt={certificate.id}
              />
              <div>{certificate.name}</div>
            </Space>
          );
        })}
      </Flex>
    </section>
  );
};
export default CertificateTemplates;
