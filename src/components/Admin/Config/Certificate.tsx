import styles from "@/styles/Certificate.module.scss";
import { Flex, Image, Space } from "antd";

const Certificate = () => {
  const imgPaths = [
    {
      path: "/certificates/preview/golden-standard.png",
      name: "Golden Standard",
    },
    {
      path: "/certificates/preview/golden-luxury.png",
      name: "Golden Luxury",
    },
  ];
  return (
    <section className={styles.Certificate_template_container}>
      <h1>Certificate templates</h1>
      <Flex align="center" gap={20}>
        {imgPaths.map((certificate, i) => {
          return (
            <Space direction="vertical" key={i} className={styles.certificate_wrapper}>
              <Image height={150} width={220} className={styles.image_wrapper} src={certificate.path} />
              <div>{certificate.name}</div>
            </Space>
          );
        })}
      </Flex>
    </section>
  );
};
export default Certificate;
