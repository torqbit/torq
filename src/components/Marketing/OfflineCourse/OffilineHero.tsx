import { Button, Flex, Space } from "antd";
import Image from "next/image";
import { FC } from "react";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import appConstant from "@/services/appConstant";
import Link from "next/link";
import MarketingSvgIcons from "../MarketingSvgIcons";

const OfflineHero: FC<{}> = () => {
  return (
    <section className={styles.offline_hero}>
      <div className={styles.offline_hero_wrapper}>
        <Space size={25} direction='vertical' className={styles.content_wrapper}>
          <div className={styles.preview__tag}>NOW IN DHANBAD</div>
          <h1>
            Become a Fullstack Developer <br />
            that every Software company needs
          </h1>
          <h4>
            Learn to build high quality software products and start attracting recruiters and employers all around the country of India
          </h4>
          <Space>
            <Link href={"tel:7463811090"} className={`${styles.contact_link} ${styles.primary_link}`}>
              <img width={24} height={24} src='/img/offline-course/phone.png' alt='phone icon' />
              <span>Talk to Us</span>
            </Link>
            <Link href={"https://wa.me/917463811090"} target='_blank' className={`${styles.contact_link} ${styles.secondary_link}`}>
              <img width={24} height={24} src='/img/offline-course/whatsapp.png' alt='phone icon' />
              <span>Chat with Us</span>
            </Link>
          </Space>
        </Space>
      </div>
    </section>
  );
};

export default OfflineHero;
