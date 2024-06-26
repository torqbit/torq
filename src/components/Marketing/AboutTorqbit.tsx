import { Flex, Space } from "antd";
import styles from "@/styles/NavBar.module.scss";
import { FC, ReactNode } from "react";

interface IProps {
  content: { label?: string; title: string; description: string[] | ReactNode[] }[];
  isMobile: boolean;
  titleDescription?: ReactNode;
}

const AboutTorqbit: FC<IProps> = ({ content, titleDescription, isMobile }) => {
  return (
    <div className={titleDescription ? styles.privacyPolicyWrapper : styles.termAndCondionWrapper}>
      <div className={styles.termAndCondionContent}>
        {titleDescription && titleDescription}
        <div>
          {content.map((list, i) => {
            return (
              <Space key={i} direction="vertical">
                <Flex align={isMobile ? "flex-start" : "flex-start"} gap={5} className={styles.titleWrapper}>
                  {i + 1}.<h1>{list.title}</h1>
                </Flex>
                <div className={styles.descriptionWrapper}>
                  {list.label !== "" && <p>{list.label}</p>}
                  {list.description.length > 0 && (
                    <ul>
                      {list.description.map((descrip, i) => {
                        return <li key={i}>{descrip}</li>;
                      })}
                    </ul>
                  )}
                </div>
              </Space>
            );
          })}
        </div>

        {titleDescription ? (
          ""
        ) : (
          <h2>YOU HAVE READ THESE TERMS OF USE AND AGREE TO ALL OF THE PROVISIONS CONTAINED ABOVE.</h2>
        )}
      </div>
    </div>
  );
};
export default AboutTorqbit;
