import { FC } from "react";
import ProgramTitle from "./ProgramTitle";
import { Flex, Space } from "antd";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import Image from "next/image";

const AboutTrainer: FC<{}> = () => {
  return (
    <section className={styles.about_trainer}>
      <div className={styles.about_trainer_wrapper}>
        <div>
          <div>
            <h1>Our Chief Trainer</h1>
            <p>
              A software veteran with more than 14 years of experience in <br /> enterprises, fortune 500 company and startups.{" "}
            </p>
          </div>
          <Image src={"/img/offline-course/about_trainer.png"} height={100} width={100} alt='flower' />
        </div>

        <div>
          <img src='/img/offline-course/myself.png' alt='' />
          <Flex vertical justify='space-between' gap={40}>
            <div>
              <h2>Shad Amez</h2>
              <div className={styles.experience_wrapper}>
                <div className={styles.skills}>Full stack dev</div>
                <div className={styles.dot}></div>
                <div className={styles.skills}>Data Engineer</div>
                <div className={styles.dot}></div>
                <div className={styles.skills}>Open source contributor</div>
              </div>
            </div>
            <div>
              <h4>Worked At</h4>
              <div className={styles.experience_wrapper}>
                <div className={styles.skills}>2 IT giants</div>
                <div className={styles.dot}></div>
                <div className={styles.skills}>2 fortune 500 companies</div>
                <div className={styles.dot}></div>
                <div className={styles.skills}>2 US based Product companies</div>
              </div>
            </div>

            <div>
              <h4>Founded</h4>
              <p>
                <span>Torqbit, </span> the Learning Management Platform that powers online and offline training. He was the main architech
                behind this platform that is built for many creators and educators like him, all around the world.
              </p>
            </div>
          </Flex>
        </div>
      </div>
    </section>
  );
};

export default AboutTrainer;
