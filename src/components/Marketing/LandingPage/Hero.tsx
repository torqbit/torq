import { FC } from "react";

import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { Button, Space } from "antd";
import Image from "next/image";
import Link from "next/link";

const MarketingHero: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <>


      <div className={styles.heroContentContainer}>
        <div className={styles.preview__tag}>Currently available for preview</div>
        <h1

        >
          Become  <del>fullstack</del><br /> Product Developer
        </h1>
        <p

        >
          Transform into an independent freelancer
          or tech entrepreneur or the most demanded software developer by building a website builder
        </p>

        <Space size={'large'} style={{ marginBottom: 50 }}>
          <Link href={`/login`} className={styles.btn__signup}>
            Sign up for free
          </Link>
          <a className={styles.btn__contact} href="mailto:support@torqbit.com" aria-label="Contact us through mail" >Contact Us</a>
        </Space>

      </div>
    </>
  );
};

export default MarketingHero;
