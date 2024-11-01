import { Flex } from "antd";
import { FC } from "react";
import Image from "next/image";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";

const ProgramTitle: FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => {
  return (
    <div className={styles.program_title}>
      <div className={styles.program_title_wrapper}>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Image src={icon} height={100} width={100} alt="flower" />
      </div>
    </div>
  );
};

export default ProgramTitle;
